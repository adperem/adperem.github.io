---
layout: page
title: "GraphQL Security Guide: IDOR, Introspection and Broken Auth"
description: "Practical guide to finding authorization bugs, IDOR, introspection leaks and batching attacks in real-world GraphQL APIs, with a Shopify case study."
permalink: /guides/graphql-security/
---

GraphQL hides an entire data model behind a single `/graphql` endpoint. That
simplifies clients — and concentrates risk. One missing authorization check in
a resolver and the whole domain is readable or writable to any caller that
knows the right global ID.

This guide walks through the attack surface I consistently find in production
GraphQL APIs, the tooling I reach for, and the writeup where I exploited these
patterns in a live Shopify deployment.

## Why GraphQL is different from REST

- **Single endpoint.** All queries and mutations flow through one URL.
  WAF rules, rate limits and access logs that were designed per-resource
  collapse into one bucket.
- **Resolver-level authorization.** Each field is resolved independently.
  Authorization has to be enforced inside every resolver — one omission is
  enough to expose a whole type.
- **Introspection.** The server can expose its own schema. Great for
  developers; great for attackers if not disabled in production.
- **Global IDs.** Object identifiers are often opaque strings (`gid://...`).
  If a server treats "knowing the ID" as authorization, it's an IDOR waiting
  to happen.

## The attack surface

### 1. Introspection leaks

A single `__schema` query returns every type, field and argument the API
exposes. That is the attacker's map of the data model. Check first; the payoff
is huge if it's left on.

```graphql
{ __schema { types { name fields { name type { name } } } } }
```

**Mitigation:** disable introspection in production, or gate it behind
authentication.

### 2. Broken object-level authorization (IDOR)

The resolver accepts an object ID and returns the object without checking
ownership. If two sessions can create objects of the same type, swapping the
ID in the query reads the other session's object.

This is the bug class behind my Shopify writeup below. Cart resolvers trusted
the `gid` as if it were a secret. It wasn't.

**Mitigation:** always cross-check the session's principal against the
resource's owner. Never rely on the ID being unpredictable.

### 3. Field-level authorization bypasses

A type might have private and public fields. If the resolver checks access at
the top level but not per-field, attackers can request sensitive fields
directly.

```graphql
query { user(id: 1) { email passwordHash } }
```

**Mitigation:** annotate sensitive fields and enforce authorization in the
field resolver, not only the parent.

### 4. Batching and alias abuse

GraphQL lets you send many aliased queries in one request. Rate limiters
that count HTTP requests miss this entirely — a single request can
bruteforce 1000 candidates.

```graphql
query {
  a0: login(user: "admin", pass: "a") { token }
  a1: login(user: "admin", pass: "b") { token }
  ...
}
```

**Mitigation:** enforce query complexity and depth limits, and count
resolver invocations, not HTTP requests.

## Tooling I reach for

- **[GraphQL Voyager](https://graphql-kit.com/graphql-voyager/)** — visualize
  the schema after an introspection dump.
- **[InQL](https://github.com/doyensec/inql)** — Burp extension that turns
  an introspection result into editable queries.
- **[Nuclei](https://github.com/projectdiscovery/nuclei)** — ships a
  `graphql-detect` template and several authorization checks.
- **`curl` + jq** — still the fastest way to script PoC mutations, as shown
  in the Shopify writeup.

## Deep dives on this blog

<ul>
{% assign guide_tags = "graphql,idor,web-security" | split: "," %}
{% for post in site.posts %}
  {% assign match = false %}
  {% for t in guide_tags %}{% if post.tags contains t %}{% assign match = true %}{% endif %}{% endfor %}
  {% if match %}
  <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a><br>
  <small>{{ post.description | default: post.excerpt | strip_html | truncate: 160 }}</small></li>
  {% endif %}
{% endfor %}
</ul>

## Further reading

- [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
- [PortSwigger Web Security Academy — GraphQL](https://portswigger.net/web-security/graphql)
- [Shopify API Authentication docs](https://shopify.dev/docs/api)

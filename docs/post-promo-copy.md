# Pre-written promo copy — existing posts

Copy-paste ready. One block per post: X thread, Mastodon toot, LinkedIn,
HN/Reddit candidacy. Update the URL once published.

---

## GraphQL IDOR (Shopify cart takeover)

Path: `/posts/critical-idor-in-graphql-from-nuclei-scan-to-full-cart-takeover/`

**X thread:**

```
1/ Found a GraphQL IDOR that let me read and modify any customer's cart on a
live Shopify store.

The whole exploit: knowing the cart ID. No auth. No session. No tricks.

🧵👇
```

```
2/ The bug class: every GraphQL resolver gets called independently. If the
authorization check is missing in one of them, the whole data domain leaks.

Cart resolvers trusted the global ID (gid://...) as if it were a secret.
It was not.
```

```
3/ The exploit pipeline:

- cartCreate → get a cart ID for "session B"
- From "session A": cart(id: <B's ID>) → full read
- cartLinesAdd(cartId: <B's ID>, ...) → write into someone else's cart
```

```
4/ Defenses:

- Always cross-check session principal vs resource owner
- Sign global IDs (HMAC) if you must rely on them
- Audit every resolver, not just the obvious ones

Full writeup, PoC, and Nuclei output: [POST_URL]

#bugbounty #graphql #appsec
```

**Mastodon:**

```
GraphQL IDOR on a live Shopify store: knowing the cart ID was enough to
read or modify any customer's cart.

Why? Resolvers trusted the global ID as a secret. The fix is one line per
resolver: check session vs owner.

Writeup, PoC, defenses: [POST_URL]

#infosec #BugBounty #GraphQL
```

**LinkedIn:**

```
A single missing authorization check in a GraphQL resolver let me read and
modify any cart on a live e-commerce platform.

What I found:

→ Anonymous cart creation worked
→ The cart resolver did not verify ownership
→ Session A could mutate Session B's cart with knowledge of the global ID

The pattern is general: GraphQL concentrates authorization at the resolver
layer. One omission and an entire object type opens up.

Full writeup with PoC and remediation:
[POST_URL]

#cybersecurity #bugbounty #graphql
```

**Reddit /r/netsec:** ✅ Original research, candidate.
Title: `IDOR in GraphQL cart resolvers led to full read+write on a live Shopify store`

**Hacker News:** ✅ Strong candidate. Title: `Critical IDOR in GraphQL: from Nuclei scan to full cart takeover`

---

## Skimmer Hunter v2.0 (ESP32)

Path: `/posts/skimmer-hunter-v20-building-an-advanced-card-skimmer-detector-with-esp32/`

**X thread:**

```
1/ Built a pocket-sized card skimmer detector with an ESP32.

8 detection layers — Bluetooth Classic, BLE, MAC analysis, RSSI proximity,
WiFi anomalies, active handshakes.

Hardware + code: [POST_URL]

🧵👇
```

```
2/ Why 8 layers?

Skimmers in 2026 are thinner than a credit card and chat over Bluetooth.
A single signal lookup misses most of them. Cross-checking signals turns
the false-positive rate down hard.
```

```
3/ Stack:

- ESP32-S3 (Wi-Fi + BT classic + BLE)
- 0.96" OLED for live readings
- LiPo + charge IC for pocket-format
- ~$15 BOM

Full schematic + 3D-printable case: [POST_URL]
```

**Mastodon:**

```
Pocket ESP32 skimmer detector: 8 layers of detection (BT Classic, BLE,
MAC, RSSI, Wi-Fi, handshake), $15 BOM, schematic + case included.

[POST_URL]

#hardware #ESP32 #infosec
```

**LinkedIn:**

```
Card skimmers steal over $1B/year in the US alone. They're getting smaller
and most of them now leak Bluetooth.

I built Skimmer Hunter v2.0 — a pocket-format ESP32 detector with eight
overlapping detection layers, designed for non-technical users.

Hardware list, firmware, and case files (3D-printable):
[POST_URL]

#hardware #cybersecurity #iot
```

**HN:** ✅ Candidate. Title: `Skimmer Hunter v2.0 — building an advanced card skimmer detector with ESP32`

---

## Oniux (VPN alternative via Tor isolation)

Path: `/posts/why-oniux-beats-vpns-the-ultimate-linux-privacy-tool-from-tor/`

**X thread:**

```
1/ Oniux isolates any Linux app and routes its traffic through Tor.

No leaks. No "trust the VPN". No log retention questions.

A walkthrough: [POST_URL]
```

```
2/ Why this matters: most VPNs sit in your DNS path and many of them log.
Oniux uses Linux network namespaces to put each app on its own stack
that only sees Tor.

If the app misbehaves, the leak goes to Tor — never to the clearnet.
```

**Mastodon:**

```
Oniux: per-app Tor isolation on Linux via network namespaces. No DNS leaks,
no "trust the VPN" model.

Walkthrough + setup: [POST_URL]

#privacy #tor #linux
```

**LinkedIn:** Privacy angle — adapt for professional audience.

---

## Fuzzstorm (own tool release)

Path: `/posts/introducing-fuzzstorm-the-ultimate-fuzzing-tool-with-soft-404-detection-and-stunning-html-reports/`

**X thread:**

```
1/ Released Fuzzstorm: a fuzzer with native soft-404 detection and HTML
reports designed for actual reading.

ffuf and wfuzz are great. They also pile up false positives. Fuzzstorm
is the alternative that filters them automatically.

[POST_URL]
```

```
2/ Soft 404 detection: the server returns 200 OK for missing paths.
Fuzzstorm samples a known-bad path, computes a similarity score, and
discards everything that matches.

Result: the report is signal, not noise.
```

**Dev.to:** ✅ Candidate cross-post. Tags: `bugbounty, opensource, security, tutorial`.

---

## p0wny-shell (third-party tool deep dive)

Path: `/posts/p0wny-shell/`

**X thread:**

```
1/ p0wny-shell turns a one-line PHP upload into an interactive web shell
with cd, clear and tab completion.

Why post-exploitation people love it. And how blue teams catch it.

[POST_URL]
```

**Mastodon:**

```
Why p0wny-shell stays in the post-exploitation toolkit: one PHP file, no
deps, interactive prompt with cd + clear + tab completion.

Detection patterns + mitigations: [POST_URL]

#redteam #blueteam #infosec
```

---

## Recon Subdomains (own tool)

Path: `/posts/subdomain-recon-script-combining-chaos-subfinder-amass-and-more/`

**X thread:**

```
1/ Open-sourced my subdomain enumeration script.

Chains chaos + subfinder + amass + crt.sh + assetfinder, deduplicates,
and ranks the output.

[POST_URL]
```

**Dev.to:** ✅ Candidate cross-post.

---

## Claude 4 Opus & cybersecurity

Path: `/posts/claude-4-opus-ultimate-cybersecurity-guardian-or-silent-enemy/`

**X thread (counter-take angle):**

```
1/ Anthropic's Claude 4 Opus has agentic features that make it a useful
defender — and a useful attacker.

Both sides of the same coin. My take: [POST_URL]
```

**LinkedIn:** ✅ Strong candidate. Long-form take on AI in security ops.

---

## LockBit operations analysis

Path: `/posts/how-the-lockbit-group-operates-with-its-victims-an-analysis-of-their-conversations/`

**X thread:**

```
1/ Analysed the leaked LockBit conversations to map how the group
negotiates with victims.

Patterns: opening posture, deadline pressure, cooperation rewards.

[POST_URL]
```

**Reddit /r/netsec:** Conditional — only if your analysis adds beyond
existing reporting.

---

## TryHackMe Billing writeup

Path: `/posts/tryhackme-billing-writeup/`

**Reddit /r/tryhackme:**

```
Title: Billing writeup — MagnusBilling exploitation + fail2ban privesc
Body:
Wrote up the Billing machine. Covers:
- MagnusBilling RCE via [vector]
- Stable shell upgrade
- fail2ban privesc to root

[POST_URL]
```

---

## TryHackMe Smol writeup

Path: `/posts/tryhackme-smol-writeup/`

**Reddit /r/tryhackme:**

```
Title: Smol writeup — vulnerable WordPress plugin + multi-user pivot
Body:
Wrote up the Smol machine. Covers:
- Vulnerable WP plugin RCE
- Multi-user lateral movement
- Final root step

[POST_URL]
```

---

## loxs user manual

Path: `/posts/user-manual-for-loxs-adperem-fork/`

**Dev.to:** ✅ Candidate cross-post — "How I forked X to add Tor isolation".

**LinkedIn:** Tooling-focused take.

---

## Posting rules summary

| Post                        | X    | Masto | LinkedIn | Dev.to | HN | /r/netsec | /r/CTF |
|-----------------------------|------|-------|----------|--------|----|-----------|--------|
| GraphQL IDOR                | ✅   | ✅    | ✅       | maybe  | ✅ | ✅        | —      |
| Skimmer Hunter v2.0         | ✅   | ✅    | ✅       | ✅     | ✅ | ✅        | —      |
| Oniux                       | ✅   | ✅    | ✅       | maybe  | maybe | maybe  | —      |
| Fuzzstorm                   | ✅   | ✅    | ✅       | ✅     | maybe | maybe  | —      |
| p0wny-shell                 | ✅   | ✅    | —        | ✅     | —  | —         | —      |
| Recon Subdomains            | ✅   | ✅    | ✅       | ✅     | —  | maybe     | —      |
| Claude 4 Opus               | ✅   | ✅    | ✅       | maybe  | maybe | —      | —      |
| LockBit analysis            | ✅   | ✅    | ✅       | —      | —  | maybe     | —      |
| Billing writeup             | ✅   | —     | —        | —      | —  | —         | ✅     |
| Smol writeup                | ✅   | —     | —        | —      | —  | —         | ✅     |
| loxs manual                 | ✅   | ✅    | ✅       | ✅     | —  | —         | —      |

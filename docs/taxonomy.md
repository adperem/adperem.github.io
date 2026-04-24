# Taxonomy

Canonical category & tag rules. Apply to every new post; keep existing posts
aligned via periodic audits.

> Excluded from Jekyll build (not linked from the site).

## Categories — Title Case, max 2 per post

| Category       | When to use                                                |
|----------------|------------------------------------------------------------|
| Cybersecurity  | Broad umbrella for offensive/defensive research            |
| CTF            | TryHackMe, HackTheBox, PicoCTF, etc. machine writeups      |
| Bug Bounty     | Real-world vuln research, disclosures, bounty findings     |
| Tools          | Release/tutorial posts for tools (own or 3rd-party)        |
| Privacy        | Tor, anonymity, OPSEC, VPN alternatives                    |
| AI             | AI/LLM content (Claude, Anthropic, model security)         |
| Hardware       | ESP32, Arduino, RFID, physical security hardware           |

Rules:
- **1–2 categories max.** More dilutes topical authority.
- First category is the primary. It appears in breadcrumbs and post meta.
- Never invent new categories without updating this file.

## Tags — lowercase-with-hyphens, 3–6 per post

Rules:
- Always lowercase.
- Multi-word → hyphens (`bug-bounty`, not `bug bounty` or `bugbounty`).
- No plurals when singular conveys the topic (`vulnerability`, not `vulnerabilities`).
- Avoid redundancy with the category (don't tag `cybersecurity` if category already is Cybersecurity).
- Prefer established community keywords for search traffic (`rce`, `idor`, `xss`, `sqli`).

### Canonical tag aliases (merge duplicates)

| Use this       | Not these                                          |
|----------------|----------------------------------------------------|
| bug-bounty     | bugbounty, bug bounty, bounty                      |
| post-exploitation | postexploitation, post exploitation             |
| web-security   | websec, web security                               |
| ai-security    | aisec, ai sec                                      |
| vpn-alternative| vpn alternatives                                   |
| privacy-tools  | privacy tools                                      |
| penetration-testing | pentest, pentesting                           |
| data-breach    | data breach                                        |

## Frontmatter template

```yaml
---
layout: post
title: "Keyword-first title, under 60 chars"
date: YYYY-MM-DD HH:MM
categories: [Primary, Secondary]
tags: [kebab-case, tag-two, tag-three]
description: "140–160 char description with keyword + user benefit."
image:
  path: /assets/img/<slug>/<hero>.png
  alt: "Descriptive alt that doubles as caption"
---
```

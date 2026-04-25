# Keyword research

Target keyword list for the next 8 weeks of content. Built around three topic
clusters that match existing pillars (`/guides/graphql-security/`,
`/guides/ctf-methodology/`, `/guides/recon/`) plus one opportunistic AI
cluster aligned with the Claude post.

> Volume / KD numbers below are rough estimates based on typical
> infosec keyword behaviour (Ahrefs Free, Google Suggest, Search Console).
> Re-validate before each publish using GSC and your preferred tool.

## Cluster A — GraphQL security

Anchor: `/guides/graphql-security/` + `/posts/graphql-idor/`

| Keyword                                   | Vol  | KD   | Intent       | Map to                                    |
|-------------------------------------------|------|------|--------------|-------------------------------------------|
| graphql introspection exploit             | 400  | low  | informational| New post: introspection detection + PoC   |
| graphql idor example                      | 200  | low  | informational| Existing IDOR post (refresh)              |
| graphql security best practices           | 1.6k | med  | mixed        | New post: server-side defenses checklist  |
| shopify graphql vulnerability             | 150  | low  | informational| Existing IDOR post (internal link)        |
| graphql batching attack                   | 100  | low  | informational| New post: alias / batching abuse          |
| graphql vs rest security                  | 600  | med  | informational| New post: comparison + threat model       |

## Cluster B — CTF methodology

Anchor: `/guides/ctf-methodology/` + Billing/Smol writeups

| Keyword                                   | Vol  | KD   | Intent       | Map to                                    |
|-------------------------------------------|------|------|--------------|-------------------------------------------|
| tryhackme [machine] walkthrough           | varies | low | navigational | One per machine you complete              |
| hackthebox [machine] writeup              | varies | low | navigational | One per machine you complete              |
| linux privilege escalation cheat sheet    | 2.4k | high | informational| New post: 2026-edition cheat sheet        |
| linpeas vs linux smart enumeration        | 200  | low  | informational| New post: tool comparison                 |
| pty upgrade reverse shell                 | 800  | low  | how-to       | New post: shell upgrade tricks            |
| sudo gtfobins privesc                     | 300  | low  | how-to       | New post: sudo abuse via GTFOBins         |

## Cluster C — Reconnaissance

Anchor: `/guides/recon/` + `/posts/recon-subdomains/`

| Keyword                                   | Vol  | KD   | Intent       | Map to                                    |
|-------------------------------------------|------|------|--------------|-------------------------------------------|
| subfinder vs amass                        | 400  | low  | informational| New post: tool comparison + when to pick  |
| passive subdomain enumeration             | 700  | med  | informational| New post: passive-only workflow           |
| subdomain takeover detection              | 1.2k | med  | informational| New post: takeover detection automation   |
| nuclei templates bug bounty               | 800  | med  | informational| New post: best Nuclei templates 2026      |
| chaos projectdiscovery api                | 250  | low  | how-to       | New post: chaos API quickstart            |
| crt.sh subdomain                          | 600  | low  | how-to       | New post: crt.sh as a recon source        |

## Cluster D — AI security (opportunistic)

Anchor: `/posts/claude-4-opus/`

| Keyword                                   | Vol  | KD   | Intent       | Map to                                    |
|-------------------------------------------|------|------|--------------|-------------------------------------------|
| prompt injection examples                 | 2.1k | high | informational| New post: prompt injection in 2026        |
| llm jailbreak techniques                  | 1.8k | high | informational| Defer — high competition                  |
| claude vs gpt cybersecurity               | 200  | low  | informational| Comparison post                           |

## Long-tail opportunities (low effort, low competition)

These are individual quick wins, often <500 vol but <10 KD:

- "fail2ban privilege escalation" — covered tangentially in Billing writeup
- "magnusbilling exploit cve" — covered in Billing writeup
- "tor isolation linux" — covered in Oniux post
- "esp32 bluetooth scanner skimmer" — covered in Skimmer Hunter post

Action: run a Search Console audit in 4–6 weeks to find pages already
ranking on page 2 for these queries. A 200–400 word refresh on each existing
post is usually enough to push them to page 1.

## Tools to validate keywords before publish

1. Google Search Console → Performance → Query → filter by `impressions > 50`
   on existing pages. Pick a related underserved query.
2. Google Suggest → type the seed, harvest the autocomplete list.
3. `ahrefs.com/keyword-difficulty` (free) or `keysearch.co` for KD score.
4. `reddit.com/r/netsec` + `news.ycombinator.com` search for the seed
   keyword to check community appetite.

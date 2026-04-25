# Backlink opportunities

Concrete, named targets where a high-quality backlink is plausible.
Order by effort: low first.

## Tier 0 — already aligned (do this week)

These are projects you already mention on the site or in tools. Each PR
costs minutes and the link is editorial, not promotional.

### Upstream tools

- **`flozz/p0wny-shell`** ([GitHub](https://github.com/flozz/p0wny-shell)) — open
  an issue or PR adding a "Further reading" line in the README pointing to
  your post. *Angle:* a deeper analysis with detection signatures.
  Post: `/posts/p0wny-shell/`
- **`projectdiscovery/chaos-client`**, **`subfinder`**, **`amass`** — link
  back from your `recon_subdomains` repo README and from each new recon
  post. The reverse — getting *them* to link you — works only after the
  Subfinder vs Amass benchmark post (Week 1) is published with hard data.

### Forks you maintain

- **`adperem/loxs`** — README should already have the post link; verify and
  add if missing. Same for `fuzzstorm`, `recon_subdomains`.
- Add a short "Read the writeup" badge near the top of each repo:
  `[![Writeup](https://img.shields.io/badge/writeup-adperem.github.io-blue)](https://adperem.github.io/posts/...)`

## Tier 1 — knowledge bases (best ROI / hour)

Editing a wiki adds your link to a page that people land on directly from
Google. These are dofollow.

### HackTricks

URL: [book.hacktricks.xyz](https://book.hacktricks.xyz/)
Repo: [HackTricks-wiki/hacktricks](https://github.com/HackTricks-wiki/hacktricks)

Targeted sections per post:

| Post                        | HackTricks section                                |
|-----------------------------|---------------------------------------------------|
| GraphQL IDOR                | Pentesting Web → GraphQL                          |
| p0wny-shell                 | Pentesting Web → File Inclusion / Webshells       |
| Recon Subdomains            | Pentesting Methodology → Recon → Subdomains       |
| Linux PrivEsc cheat sheet   | Linux Hardening → Privilege Escalation            |
| Oniux                       | Network Services → Anonymous Browsing             |

PR template lives in `outreach-templates.md`.

### PayloadsAllTheThings

URL: [github.com/swisskyrepo/PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings)

For GraphQL post — open a PR adding a reference under
`GraphQL Injection/README.md`. They accept reference-only contributions.

### OWASP cheat sheet series

URL: [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org/)

Long shot but high-trust domain. Only viable for original research backed
by reproducible PoC.

## Tier 2 — community pages with curated lists

### Awesome lists

- [awesome-pentest](https://github.com/enaqx/awesome-pentest) — Fuzzstorm
  fits "Fuzzers" section. Already a fork, ready for PR.
- [awesome-bugbounty-tools](https://github.com/m4ll0k/Awesome-Bug-Bounty-Tools) —
  recon_subdomains fits "Subdomain Enumeration" subsection.
- [awesome-graphql](https://github.com/chentsulin/awesome-graphql) — has a
  Security subsection where the IDOR writeup belongs.
- [awesome-tor](https://github.com/Polycademy/awesome-tor) — Oniux post
  fits if it is the canonical writeup of the tool.

### Bug bounty writeup aggregators

- [pentester.land/list-of-bug-bounty-writeups.html](https://pentester.land/list-of-bug-bounty-writeups.html)
  — submit GraphQL IDOR via [their form](https://pentester.land/submit/).
  Editorial, dofollow.
- [hackerone.com/hacktivity](https://hackerone.com/hacktivity) — only
  applicable if you disclosed via H1.
- [intigriti.com/researchers/blog](https://www.intigriti.com/researchers/blog) —
  if disclosed via Intigriti.

## Tier 3 — communities to seed (slower, organic)

The goal here is to be a useful contributor first. Backlinks come from
people referencing your work in their own answers.

- **InfoSec Stack Exchange** — answer GraphQL/recon questions, link your
  writeup as supporting material when relevant.
- **Mastodon `infosec.exchange`** — boost others' content, post your own
  research, tag relevant accounts (no `@mention` spam).
- **Discord — TryHackMe, HackTheBox official servers** — links to your
  writeups as study material when someone asks about a retired box.
- **Discord — Bug Bounty World, BBR, NahamSec's** — share novel findings
  in `#research`-style channels where appropriate.

## Tier 4 — guest posting & syndication (highest effort)

Write *for* a publication that already ranks. The goal is the byline + link
back to your site.

| Outlet                              | Topic fit                              | Pitch via                          |
|-------------------------------------|----------------------------------------|------------------------------------|
| InfoSec Write-ups (Medium pub)      | CTF writeups, IDOR research            | submit form on infosecwriteups.com |
| PortSwigger Research                | Original web security research         | research@portswigger.net pitch     |
| The Hacker News                     | High-impact disclosures only           | submit form, hard to land          |
| Vickie Li's blog                    | Bug bounty methodology guests          | DM on X                            |
| 0xPatrik's blog                     | Recon-focused guest posts              | DM on X                            |
| Brutelogic blog                     | XSS + web security research            | DM on X                            |

## Tier 5 — domain-level backlinks

Slow. Years.

- Your university's computer science / security student group page.
- Local OWASP chapter blog (Madrid has one).
- Conference talks (Navaja Negra, RootedCON, BSides Madrid, BSides Lisbon).
  A talk slide deck on SpeakerDeck or a recording on YouTube counts.

## Anti-patterns

- "Submit your URL" link directories. Spam.
- Comment-link spam on tutorial blogs. Search engines discount them.
- Buying backlinks from Fiverr or "PBN" providers. Penalty risk.
- Reciprocal-link networks. "Link to my blog and I'll link to yours."
  Detected and penalised since 2012.

## Tracking

Add each successful backlink to `docs/backlink-tracker.csv`. Re-check
referring traffic in GA4 every two weeks. Drop dead ones from the list.

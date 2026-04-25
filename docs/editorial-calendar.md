# Editorial calendar

8 weeks. 1 post per week. Each entry pre-mapped to a target keyword from
`docs/keyword-research.md`, a topic cluster, and the internal links the post
must include.

> Dates are placeholders — adjust to your real publish day. Recommended: ship
> Tuesday or Wednesday morning Europe/Madrid for max US + EU overlap.

---

## Week 1 — `subfinder-vs-amass.md`

- **Cluster:** Recon
- **Target keyword:** `subfinder vs amass` (400 / KD low)
- **Working title:** "Subfinder vs Amass in 2026: which subdomain tool wins?"
- **Description:** "A side-by-side comparison of Subfinder and Amass on real
  bug bounty targets — speed, sources, accuracy, and when to use each."
- **Outline:**
  1. Why subdomain coverage matters
  2. Subfinder: passive-only design, source list, speed test
  3. Amass: active + passive, deeper graph, slower runtime
  4. Benchmark: same wildcard target, count + uniqueness
  5. When to pick which (rules of thumb)
  6. How I chain both in `recon_subdomains`
- **Internal links to include:**
  - `/guides/recon/`
  - `/posts/recon_subdomains/`
- **External authority links:** ProjectDiscovery docs, OWASP Amass docs.
- **Stub:** `_drafts/subfinder-vs-amass.md`

## Week 2 — `passive-recon-cheat-sheet.md`

- **Cluster:** Recon
- **Target keyword:** `passive subdomain enumeration` (700 / KD med)
- **Working title:** "Passive Recon Cheat Sheet: zero packets, full attack
  surface"
- **Description:** "Build a complete picture of a target without sending a
  single packet — Wayback, crt.sh, GitHub dorks, Shodan, and the open data
  sources I rely on."
- **Outline:**
  1. The case for passive-first
  2. Certificate transparency: crt.sh quickies + chaos API
  3. Wayback Machine for historical endpoints (`gau`, `waybackurls`)
  4. Public DNS history (SecurityTrails, ViewDNS)
  5. GitHub dorks for leaked subdomains, secrets
  6. Shodan / Censys queries that work in 2026
  7. Combining the outputs into a single ranked list
- **Internal links:** `/guides/recon/`, week 1 post
- **Stub:** `_drafts/passive-recon-cheat-sheet.md`

## Week 3 — `graphql-introspection-exploit.md`

- **Cluster:** GraphQL Security
- **Target keyword:** `graphql introspection exploit` (400 / KD low)
- **Working title:** "GraphQL Introspection: from `__schema` query to full
  attack surface"
- **Description:** "How GraphQL introspection leaks the entire data model,
  how to detect it, and how to turn the dump into a working exploit
  pipeline."
- **Outline:**
  1. What introspection is and why servers leave it on
  2. Detection: the one-line curl, Nuclei template, response patterns
  3. Reading the schema: types, queries, mutations
  4. Tooling: GraphQL Voyager, InQL, graphql-cop
  5. From schema to PoC: spotting authorization gaps
  6. Server-side defenses
- **Internal links:** `/guides/graphql-security/`, `/posts/graphql-idor/`
- **Stub:** `_drafts/graphql-introspection-exploit.md`

## Week 4 — `linux-privesc-cheat-sheet-2026.md`

- **Cluster:** CTF Methodology
- **Target keyword:** `linux privilege escalation cheat sheet` (2.4k / KD high)
- **Working title:** "Linux Privilege Escalation Cheat Sheet (2026 edition)"
- **Description:** "The privilege-escalation playbook I keep open during
  every CTF — sudo, SUID, capabilities, cron, kernel, and the manual checks
  that beat scanners."
- **Outline:**
  1. The "what does linpeas miss?" mindset
  2. Sudo: NOPASSWD, GTFOBins, env preservation, wildcards
  3. SUID and SGID: what to look for, common abuses
  4. Capabilities: the often-missed `getcap` win
  5. Cron and writable scripts
  6. PATH hijacking
  7. Kernel exploits — last resort
  8. A 30-second triage script
- **Internal links:** `/guides/ctf-methodology/`, Billing & Smol writeups
- **Stub:** `_drafts/linux-privesc-cheat-sheet-2026.md`

## Week 5 — `subdomain-takeover-detection.md`

- **Cluster:** Recon
- **Target keyword:** `subdomain takeover detection` (1.2k / KD med)
- **Working title:** "Subdomain Takeover in 2026: detection, exploitation,
  and reporting"
- **Description:** "How dangling DNS records become full subdomain
  takeovers, the fingerprints to look for, and the tooling that finds
  them at scale."
- **Outline:**
  1. What a takeover actually is
  2. The cloud providers most often involved
  3. Detection automation: subjack, subzy, nuclei templates
  4. Distinguishing real vs. false positive
  5. Responsible disclosure template
  6. Hardening side: DNS hygiene
- **Internal links:** Week 1 + 2 posts, `/guides/recon/`
- **Stub:** to be created in next batch

## Week 6 — TryHackMe / HackTheBox writeup

- **Cluster:** CTF
- **Target keyword:** `<machine> walkthrough` — choose a freshly retired box
- **Working title:** "<Machine> Writeup — TryHackMe / HackTheBox"
- Pick a box completed in the past month. Use the template at
  `docs/post-template.md`. Hit the methodology phases from
  `/guides/ctf-methodology/`.
- **Internal links:** `/guides/ctf-methodology/`, prior writeups
- **Stub:** create the day you retire the box

## Week 7 — `nuclei-templates-bug-bounty-2026.md`

- **Cluster:** Recon
- **Target keyword:** `nuclei templates bug bounty` (800 / KD med)
- **Working title:** "The 12 Nuclei Templates That Pay in 2026"
- **Description:** "Curated list of Nuclei templates that consistently
  surface real findings on bug bounty programs, with sample workflows."
- **Internal links:** all recon-cluster posts so far, `/guides/recon/`
- **Stub:** to be created in next batch

## Week 8 — `prompt-injection-examples-2026.md`

- **Cluster:** AI Security (opportunistic)
- **Target keyword:** `prompt injection examples` (2.1k / KD high)
- **Working title:** "Prompt Injection Examples in 2026: agents, tools,
  and indirect attacks"
- **Description:** "Concrete prompt injection cases against modern LLM
  agents — system prompt leakage, tool abuse, indirect injection via
  fetched content."
- **Internal links:** `/posts/claude-4-opus/`
- **Stub:** to be created in next batch

---

## After week 8 — recurring rhythm

- **2 posts/month minimum.** Drop below this for two consecutive months
  and rankings start to slip.
- **1 update/month.** Refresh an existing post that has impressions but
  poor CTR or rank. GSC tells you which one.
- **1 cross-post/month** to Dev.to or Medium with `rel=canonical` back
  to this site.

## Pre-publish checklist (apply to every post above)

Use the existing `SEO-PLAN.md § 3` checklist. Highlights:

- [ ] Title ≤ 60 chars, keyword at the start
- [ ] Description 140–160 chars
- [ ] Hero image 1200×630 with descriptive alt
- [ ] ≥ 3 internal links + 2 external authority links
- [ ] Listed in the relevant `/guides/<cluster>/` page (auto if tagged
      correctly per `docs/taxonomy.md`)
- [ ] Posted to /r/netsec only if it's original research
- [ ] Cross-post on Dev.to with canonical 24h after publish

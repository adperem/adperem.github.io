---
layout: post
title: "Subfinder vs Amass in 2026: which subdomain tool wins?"
date: 2026-01-01 09:00
categories: [Tools, Bug Bounty]
tags: [subfinder, amass, subdomain-enumeration, recon, bug-bounty]
description: "Side-by-side comparison of Subfinder and Amass on real bug bounty targets — speed, sources, accuracy, and when to pick each tool."
image:
  path: /assets/img/subfinder-vs-amass/hero.png
  alt: "Subfinder vs Amass terminal comparison"
---

<!-- TODO: replace placeholders, run benchmarks, fill in numbers. -->

> Two tools, two philosophies. Picking the right one for the right target
> saves hours and finds more assets.

## What you'll learn

- How Subfinder and Amass differ in design and runtime
- A repeatable benchmark against a real wildcard target
- When to use one, the other, or both
- How both fit into the workflow at [/posts/recon_subdomains/]({% post_url 2025-07-09-recon_subdomains %})

## Subfinder: passive-only, fast

<!-- TODO: describe Subfinder design, sources list, configuration. -->

```bash
subfinder -d example.com -all -silent
```

## Amass: active + passive, deeper graph

<!-- TODO: describe Amass passive vs active modes, graph features, runtime. -->

```bash
amass enum -passive -d example.com
```

## Benchmark: same target, different outcomes

<!-- TODO: pick a wildcard target you have permission for. Run both, capture
     unique vs overlap counts, runtime, false positive rate. Add a small
     table with columns: Tool, Total, Unique, Time. -->

| Tool      | Total | Unique | Time |
|-----------|-------|--------|------|
| Subfinder |       |        |      |
| Amass     |       |        |      |

## When to pick which

- **Subfinder** for the first sweep. Quiet, fast, no rate limit pain.
- **Amass** when coverage matters more than speed.
- **Both** in tandem — that's exactly what
  [recon_subdomains]({% post_url 2025-07-09-recon_subdomains %}) does.

## Further reading

- [/guides/recon/]({{ '/guides/recon/' | relative_url }})
- [Subfinder docs](https://github.com/projectdiscovery/subfinder)
- [OWASP Amass docs](https://github.com/owasp-amass/amass)

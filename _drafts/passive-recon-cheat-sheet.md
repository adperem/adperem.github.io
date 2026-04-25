---
layout: post
title: "Passive Recon Cheat Sheet: zero packets, full attack surface"
date: 2026-01-08 09:00
categories: [Bug Bounty, Tools]
tags: [passive-recon, osint, subdomain-enumeration, bug-bounty, recon]
description: "Build a complete picture of a target without sending a single packet. Wayback, crt.sh, GitHub dorks, Shodan and the open data sources I rely on."
image:
  path: /assets/img/passive-recon/hero.png
  alt: "Passive recon data sources"
---

<!-- TODO: fill in concrete commands and screenshots. -->

> Passive recon hands you the attack surface before the target ever sees a
> packet. It's the cheapest, quietest part of the workflow — and often the
> most productive.

## What you'll learn

- Why passive-first beats nmap-first
- Six data sources that work in 2026
- How to deduplicate and rank the output

## Certificate transparency

<!-- TODO: crt.sh queries, chaos API quickstart. -->

## Wayback / historical URLs

<!-- TODO: gau, waybackurls usage. -->

## Public DNS history

<!-- TODO: SecurityTrails, ViewDNS examples. -->

## GitHub dorks

<!-- TODO: leaked subdomains, secrets dorks. -->

## Shodan / Censys

<!-- TODO: 2026-relevant queries. -->

## Combining outputs

<!-- TODO: a small bash one-liner that merges + sorts + uniques. -->

## Further reading

- [/guides/recon/]({{ '/guides/recon/' | relative_url }})
- [Subfinder vs Amass]({% post_url 2025-07-09-recon_subdomains %})
- [The Bug Hunter's Methodology by Jason Haddix](https://github.com/jhaddix/tbhm)

---
layout: page
title: "Reconnaissance Guide: subdomains, ports, and passive recon"
description: "A practical reconnaissance workflow for bug bounty and CTFs: passive vs. active recon, subdomain enumeration, tooling, and how to chain tools together."
permalink: /guides/recon/
---

Recon is where the depth of a test gets decided. The best exploit chain still
loses to the attacker who mapped the attack surface more thoroughly. This
guide is the workflow I use for bug bounty targets and the tool stack that
makes it fast.

## Passive vs. active

- **Passive** — never touches the target. Uses third-party datasets: Google
  dorking, crt.sh, Wayback Machine, GitHub search, Shodan, Censys.
  Safe, quiet, and frequently the only thing allowed in the early phase of
  a program.
- **Active** — sends traffic to the target: port scans, subdomain brute
  force, content discovery. Faster signal, louder trace.

Start passive. Only move to active on in-scope assets and within the program
rules.

## Subdomain enumeration

This is the first step on any web program. Coverage matters; a missing asset
is a missing finding.

- [`chaos`](https://github.com/projectdiscovery/chaos-client) — ProjectDiscovery's
  curated dataset.
- [`subfinder`](https://github.com/projectdiscovery/subfinder) — aggregates
  dozens of passive sources.
- [`amass`](https://github.com/owasp-amass/amass) — deeper passive + active
  modes.
- [`assetfinder`](https://github.com/tomnomnom/assetfinder) — quick tomnomnom
  classic.
- `crt.sh` — certificate transparency logs via the web UI or the API.

I wrote a wrapper that chains them and de-duplicates. Linked below.

## Probing alive hosts

Once you have a candidate list, figure out what actually answers.

- [`httpx`](https://github.com/projectdiscovery/httpx) — fast HTTP probe,
  supports status/title/tech detection.
- [`nuclei`](https://github.com/projectdiscovery/nuclei) — run the default
  templates on the alive set for quick wins.

## Content and parameter discovery

On each alive web target:

- `ffuf` / `feroxbuster` for directories and files.
- [`paramspider`](https://github.com/devanshbatham/paramspider) for
  parameter harvesting from the Wayback.
- `gau` / `waybackurls` for historical URLs that might reveal old
  endpoints.

## Post-recon: prioritisation

You cannot audit everything. Rank the surface:

1. **Newest subdomains** — often unfinished, pre-production, weakly
   authenticated.
2. **Non-standard ports / apps** — admin UIs, Kibana, monitoring.
3. **Anything with `api`, `internal`, `dev`, `stage`, `backup` in the name.**
4. **Known vulnerable stacks** — pipe the tech fingerprints into
   Nuclei templates by product.

## Writeups & tools on this blog

<ul>
{% assign recon_tags = "recon,subdomain-enumeration,bug-bounty,bash" | split: "," %}
{% for post in site.posts %}
  {% assign match = false %}
  {% for t in recon_tags %}{% if post.tags contains t %}{% assign match = true %}{% endif %}{% endfor %}
  {% if match %}
  <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a><br>
  <small>{{ post.description | default: post.excerpt | strip_html | truncate: 160 }}</small></li>
  {% endif %}
{% endfor %}
</ul>

## Further reading

- [The Bug Hunter's Methodology](https://github.com/jhaddix/tbhm) by Jason Haddix
- [Pentester Land — Bug bounty writeups list](https://pentester.land/list-of-bug-bounty-writeups.html)
- [ProjectDiscovery blog](https://blog.projectdiscovery.io/)

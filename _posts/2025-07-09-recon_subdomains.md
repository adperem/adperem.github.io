---
layout: post
title: "Subdomain Recon Script: combining chaos, subfinder, amass and more"
date: 2025-07-16
categories: [recon, automation, bugbounty]
tags: [subdomains, recon, bash, automation, bugbounty]
image:
  path: /assets/img/recon_subdomains/recon_subdomains-logo.png
  alt: "recon_subdomains logo"
summary: "Understand each tool used in our Bash script for subdomain enumeration and learn how to automate recon with ease. Full script and explanation included."
---

## 🔍 Introduction

Subdomain enumeration is a critical phase in reconnaissance. Automating it helps reduce time, avoid missing assets, and maintain consistency.  
In this post, we break down each tool and API used in our subdomain recon script. You can find the full script [here](https://github.com/adperem/recon_subdomains).

---

## ⚙️ Tools & APIs used

### `chaos`
Chaos is a fast subdomain enumeration tool using ProjectDiscovery's Chaos dataset. Useful for quickly fetching known subdomains.

```bash
chaos -d example.com -silent
```

### `subfinder`
Subfinder gathers passive subdomains using public sources like VirusTotal, crt.sh, etc.

```bash
subfinder -d example.com --all --recursive -silent
```

### `httpx`
A fast HTTP toolkit used to check live hosts.

```bash
httpx -l domains.txt -silent -status-code
```

### `alterx`
Enhances wordlist-based recon by generating permutations and probing.

```bash
alterx -pp word=subdomains.txt -silent | httpx -silent
```

### `assetfinder`
Fetches subdomains from public sources like domains indexed by search engines.

```bash
assetfinder --subs-only example.com
```

### `amass`
Used in both passive and active modes for extensive subdomain enumeration.

```bash
amass enum -passive -d example.com
amass enum -active -d example.com
```

### `github-subdomains`
Finds subdomains exposed in GitHub repositories. Requires a GitHub token.

```bash
github-subdomains -d example.com -t $GITHUB_TOKEN
```

### `crt.sh`
Uses the Certificate Transparency logs to fetch subdomains.

```bash
curl -s "https://crt.sh?q=example.com&output=json" | jq -r '.[].name_value'
```

### `Wayback Machine`
Gets historical URLs indexed by the Internet Archive.

```bash
curl -s "http://web.archive.org/cdx/search/cdx?url=*.example.com/*"
```

### `VirusTotal`
Fetches subdomains and related IPs using the VirusTotal API.

```bash
curl -s "https://www.virustotal.com/vtapi/v2/domain/report?apikey=$VT_APIKEY&domain=example.com"
```

### `AlienVault OTX`
Queries the OTX API for IP addresses associated with the domain.

```bash
curl -s "https://otx.alienvault.com/api/v1/indicators/hostname/$domain/url_list?limit=500&page=1" | jq -r '.url_list[]?.result?.urlworker?.ip // empty' | grep -Eo '([0-9]{1,3}\.){3}[0-9]{1,3}'
```

### `urlscan.io`
Looks for IPs tied to the domain using the urlscan.io public API.

```bash
curl -s "https://urlscan.io/api/v1/search/?q=domain:$domain&size=10000" | jq -r '.results[].page?.ip // empty' | grep -Eo '([0-9]{1,3}\.){3}[0-9]{1,3}'
```
---

## 🧪 The final script

Combining all the above tools, the script:

1. Updates the tools
2. Gathers subdomains from multiple sources
3. Uses enrichment tools like alterx
4. Resolves and checks for live hosts
5. Stores all data in `output_<domain>/`

```bash
bash recon_subdomains.sh example.com
```

![Example usage of recon_subdomains.sh](/assets/img/recon_subdomains/recon_subdomains-ejemplo.png)

All data ends up in `subdomains_alive.txt` and `final.txt` for further analysis.

---

## 📁 Output structure

```
output_example.com/
├── subfinder.txt
├── assetfinder.txt
├── amass_passive.txt
├── amass_active.txt
├── github.txt
├── crtsh.txt
├── wayback.txt
├── virustotal.txt
├── alterx.txt
├── ips.txt
├── final.txt
└── subdomains_alive.txt
```

---

## 🧠 Conclusion

This script saves time and maximizes subdomain discovery by combining passive, active, and API-based methods.  
Perfect for bug bounty hunters, red teamers, or anyone automating recon.

---

Want more tools like this? Follow me on [LinkedIn](https://www.linkedin.com/in/adrian-perez-moreno/)
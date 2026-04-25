---
layout: post
title: "Linux Privilege Escalation Cheat Sheet (2026 edition)"
date: 2026-01-22 09:00
categories: [CTF, Cybersecurity]
tags: [linux, privilege-escalation, ctf, cheat-sheet, post-exploitation]
description: "The Linux privilege escalation playbook I keep open during every CTF — sudo, SUID, capabilities, cron, kernel and the manual checks that beat scanners."
image:
  path: /assets/img/linux-privesc/hero.png
  alt: "Linux privilege escalation checklist"
---

<!-- TODO: fill each section with concrete commands and short examples. -->

> linpeas is great. It is also tuned for the average box. The wins live in
> the manual checks it scores low.

## What you'll learn

- A 30-second triage script
- The seven privilege-escalation vectors that produce 90% of finds
- The manual checks that scanners deprioritize

## Triage in 30 seconds

```bash
id; sudo -l 2>/dev/null; getcap -r / 2>/dev/null
find / -perm -4000 -type f 2>/dev/null
crontab -l; cat /etc/crontab
ls -la /var/spool/cron/crontabs/ 2>/dev/null
```

## 1. Sudo

- `sudo -l` first. Always.
- `NOPASSWD` entries against [GTFOBins](https://gtfobins.github.io/).
- Wildcards in sudoers (`/usr/bin/find /var/log/* -delete`) — exploitable.
- `env_keep+=LD_PRELOAD` and friends.

## 2. SUID / SGID

- `find / -perm -4000 -type f 2>/dev/null`
- Cross-reference with GTFOBins.
- Custom binaries: try `strings`, look for `system()`/`exec()`.

## 3. Capabilities

- `getcap -r / 2>/dev/null` — often forgotten.
- `cap_setuid` on Python, Perl, ruby = instant root.

## 4. Cron jobs

- World-writable scripts in cron paths.
- PATH manipulation if cron PATH is short.

## 5. PATH hijacking

<!-- TODO: example. -->

## 6. Kernel exploits

- Last resort. `uname -a`, then `linux-exploit-suggester`.
- High risk of crashing the box — note before trying.

## 7. Interesting services as root

<!-- TODO: docker socket, fail2ban (referenced in Billing writeup), backups. -->

## Worked examples on this blog

- [TryHackMe Billing — fail2ban privesc]({% post_url 2025-04-20-billing-writeup %})
- [TryHackMe Smol — multi-user pivot]({% post_url 2025-04-23-smol-writeup %})

## Further reading

- [/guides/ctf-methodology/]({{ '/guides/ctf-methodology/' | relative_url }})
- [GTFOBins](https://gtfobins.github.io/)
- [HackTricks — Linux Privilege Escalation](https://book.hacktricks.xyz/linux-hardening/privilege-escalation)

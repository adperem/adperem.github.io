---
layout: page
title: "CTF Methodology: a repeatable approach for boot-to-root machines"
description: "The enumeration, exploitation and privilege-escalation workflow I use on every TryHackMe and HackTheBox box, with tooling and notes templates."
permalink: /guides/ctf-methodology/
---

Every boot-to-root machine has the same skeleton. The details change — the
phases do not. This is the workflow I run on every box, the tooling at each
step, and the note-taking template I use to keep the whole thing sane.

## The phases

### 1. Recon

Identify what's exposed. Cheap, fast, wide.

- `nmap -sC -sV -T4 -p- <ip>` for a full TCP sweep, then targeted UDP.
- `whatweb` / `nikto` for quick web fingerprinting.
- `ffuf` or `dirb` for content discovery.

Never skip this step because a service looks boring. The whole box often
hinges on a side service you almost didn't scan.

### 2. Enumeration

Go deep on each service.

- Web: look for exposed admin panels, default creds, CVEs on the detected
  product and version, parameters, file uploads.
- SSH: check for usernames in banners, reusable credentials.
- SMB/NFS: `smbclient -L`, `enum4linux-ng`, anonymous shares.
- DB: check for default creds, exposed admin tools (`phpmyadmin`).

Write down every username, version and path you see. You will need them
later.

### 3. Foothold

Turn a vulnerability into a shell. Most often this is a web RCE, a default
login, or a known CVE on the detected version. Favorite references:

- [GTFOBins](https://gtfobins.github.io/) — what a binary can do for you.
- [HackTricks](https://book.hacktricks.xyz/) — cheat sheets by vector.
- [Exploit-DB](https://www.exploit-db.com/) — quick search by product/version.

Upgrade the shell early: `python3 -c 'import pty;pty.spawn("/bin/bash")'`,
then `stty raw -echo; fg`, then `export TERM=xterm-256color`.

### 4. Lateral movement

You're rarely root on first landing. Hunt for reusable creds, SSH keys,
config files with passwords, `.bash_history`, `su` targets. `linpeas`
automates most of this but read its output, don't trust the scores blindly.

### 5. Privilege escalation

Same toolkit, different questions.

- **Kernel exploits** — use only when nothing else works.
- **Misconfigurations** — sudo rules, SUID binaries, writable
  `PATH` entries, cron jobs.
- **Capabilities** — `getcap -r / 2>/dev/null`.
- **Interesting services running as root** — Docker, fail2ban, backup
  scripts.

### 6. Notes and recovery

The writeup *is* the point. Keep a markdown file per box with every command,
screenshot, and failed attempt. I replay my own notes more than any blog.

## My template

```markdown
# <box-name>

## TL;DR
## Recon
## Enumeration
## Foothold
## Lateral / PrivEsc
## Root
## What I got stuck on
```

"What I got stuck on" is the most valuable section. It's where tomorrow's
methodology improvements live.

## Writeups on this blog

<ul>
{% for post in site.posts %}
  {% if post.categories contains "CTF" %}
  <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a><br>
  <small>{{ post.description | default: post.excerpt | strip_html | truncate: 160 }}</small></li>
  {% endif %}
{% endfor %}
</ul>

## Further reading

- [HackTricks](https://book.hacktricks.xyz/)
- [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings)
- [IppSec videos](https://www.youtube.com/@ippsec)

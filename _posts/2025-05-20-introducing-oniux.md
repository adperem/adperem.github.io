---
title: "Take Control of Your Privacy: Oniux Forces All Linux Traffic Through Tor"
date: 2025-05-20 17:02:00
categories: [Ciberseguridad, Privacidad, Herramientas]
tags: [tor, oniux, ciberseguridad, privacidad, linux, anonimato]
description: "Introducing Oniux: a new tool from the Tor Project that isolates Linux apps and guarantees secure, leak-proof routing through the Tor network."
layout: post
image:
  path: /assets/img/oniux/oniux-logo.png
  alt: "oniux logo"
---

# Oniux: The Tor Project's New Tool to Route Traffic Through Tor

The Tor Project has recently launched **Oniux**, an innovative command-line utility designed to enhance the privacy and security of Linux users. Oniux allows any Linux application to be isolated and have its traffic routed exclusively through the Tor network, eliminating the risk of data leaks. Although still experimental, this tool marks a significant advancement for those requiring online anonymity, such as activists, journalists, and researchers.

## What is Oniux?

Oniux is an open-source tool that uses **Linux namespaces** to create an isolated environment for applications, ensuring that all network traffic is routed through the Tor network. Unlike traditional solutions like Torsocks, which rely on SOCKS proxies, Oniux operates at the kernel level, providing stronger isolation and eliminating the risk of leaks—even for misconfigured or malicious applications.

### Key Features

* **Complete Isolation**: Creates a dedicated network space for each application, with no access to system network interfaces.
* **Tor Routing**: All traffic is automatically redirected through the Tor network, compatible with IPv6 and onion services.
* **Versatility**: Works with any Linux application, from command-line tools like `curl` to graphical applications like HexChat.
* **Ease of Use**: Requires no complex configuration—ideal for both technical and non-technical users.

## How Does Oniux Work?

Oniux leverages the capabilities of **Linux namespaces**, a kernel feature introduced around the year 2000, to isolate applications. The process works as follows:

1. **Creating an Isolated Process**: Oniux uses `clone(2)` to generate a child process with isolated namespaces for network, mount, PID, and user.
2. **Custom Mounts**: Sets up a specific `/proc` and `/etc/resolv.conf` to ensure DNS resolution is compatible with Tor.
3. **Virtual Interface**: Uses **onionmasq** to create a TUN interface (`onion0`) that routes all traffic through Tor, configured via `rtnetlink(7)` operations.
4. **Secure Execution**: Transfers the TUN interface file descriptor to the main process via a Unix domain socket and executes the application in this isolated environment.

This approach ensures that applications cannot access external network interfaces, guaranteeing that all traffic is routed through Tor.

## Comparison with Torsocks

Oniux is presented as an advanced alternative to **Torsocks**, another Tor Project tool. Here is a detailed comparison:

| **Feature**              | **Oniux**        | **Torsocks**                            |
| ------------------------ | ---------------- | --------------------------------------- |
| **Isolation Method**     | Linux namespaces | Library call interception (LD\_PRELOAD) |
| **Applicability**        | All applications | Only applications using libc            |
| **Leak Risk**            | No risk of leaks | Possible risk via direct syscalls       |
| **Platform**             | Linux only       | Cross-platform                          |
| **Maturity**             | Experimental     | Mature (15+ years)                      |
| **Underlying Engine**    | Arti (Rust)      | CTor (C)                                |
| **Tor Dependency**       | Independent      | Requires Tor daemon                     |
| **Programming Language** | Rust             | C                                       |

Oniux offers a more secure and user-friendly solution, but its experimental status means it still requires extensive testing to reach the maturity of Torsocks.

## Installation and Usage

To install Oniux, you need a Linux system with the **Rust** development environment installed. The installation command is:

```bash
cargo install --git https://gitlab.torproject.org/tpo/core/oniux oniux@0.4.0
```

Once installed, you can use Oniux to route applications through Tor. Examples include:

* **Test connectivity**: `oniux curl https://icanhazip.com`
* **Access an onion service**: `oniux curl http://2gzyxa5ihm7nsggfxnu52rck2vv4rvmdlkiu3zzui5du4xyclen53wid.onion/index.html`
* **Isolate a shell session**: `oniux bash`
* **Run a graphical app**: `oniux hexchat`

For debugging, enable detailed logs with:

```bash
RUST_LOG=debug oniux curl https://icanhazip.com
```

## Experimental Status and Call to the Community

The Tor Project emphasizes that Oniux is still experimental and has not been extensively tested in all scenarios. It is not recommended for critical operations until it matures. Users are encouraged to try Oniux, report issues, and contribute to its development through the [GitLab repository](https://gitlab.torproject.org/tpo/core/oniux).

## Conclusion

Oniux is a step forward in online privacy protection, offering a robust solution to route Linux application traffic through Tor without leakage risks. Its use of Linux namespaces and integration with Arti and onionmasq make it a promising tool for environments where privacy is essential. If you're looking to maximize your anonymity, Oniux is a tool worth exploring.

For more information, visit the [Tor Project's official blog](https://blog.torproject.org/introducing-oniux-tor-isolation-using-linux-namespaces/) or the [Oniux repository](https://gitlab.torproject.org/tpo/core/oniux). Join the community and help strengthen this tool!

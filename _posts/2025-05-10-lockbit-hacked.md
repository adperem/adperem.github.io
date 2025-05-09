---
layout: post
title: "How the LockBit Group Operates with Its Victims: An Analysis of Their Conversations"
date: 2025-05-9 00:01
categories: [Cybersecurity, Ransomware, Data Leaks]
tags: [lockbit, ransomware, cybercrime, data breach, analysis]
image:  
  path: /assets/img/lockbit-logo.png  
  alt: "LockBit Ransomware"
description: An in-depth analysis of the LockBit ransomware group's tactics, victim negotiations, and affected companies based on leaked documents.
---

## Introduction
The LockBit ransomware group has gained notoriety for its attacks on businesses and organizations worldwide. Thanks to leaked documents following the hacking of LockBit, we can analyze how they interact with their victims, their negotiation tactics, and the companies affected. This article explores the conversations between LockBit and its victims, citing specific examples from the leaked documents, and provides detailed information about the targeted companies.

## Negotiation Tactics in Conversations

LockBit employs a combination of pressure, incentives, and technical support to persuade victims to pay the ransom. Below are the main tactics observed in the leaked conversations:

### 1. Discounts for Quick Payment
LockBit incentivizes quick payments by offering discounts. For example, on December 20, 2024, in the chat, it reads:  
> **[2024-12-20 12:42:54] ok 3600$ 10%**  
This indicates a 10% reduction on the initial $4000 requested earlier ([2024-12-19 05:41:13]). Later, on December 23, 2024, they offer a 20% discount:  
> **[2024-12-23 16:46:36] ok, we can do a 20% discount**  
These examples show how LockBit uses discounts as a strategy to accelerate payments.

### 2. Negotiations Initiated by Victims
Victims attempt to reduce the ransom amount. For instance, on December 20, 2024, a victim asks to lower the amount from $3800 to 0.037 BTC (approximately $3600):  
> **[2024-12-20 12:43:35] Thank you. Is it possible for 0.037?**  
LockBit rejects this counteroffer with a simple "no" ([2024-12-20 12:44:36]), but accepts $3600, showing limited flexibility.

### 3. Threats of Data Publication
To increase pressure, LockBit threatens to publish stolen data if payment is not made. This is seen in a message from December 24, 2024:  
> **[2024-12-24 16:32:59] we will try to convey information about the leak of your data to each of these contacts.**  
This tactic aims to create urgency and fear of public consequences from the attack.

### 4. Decryption Tests as Guarantees
LockBit offers decryption tests to demonstrate they can restore files. A repeated message in the chat details the process:  
> **[2024-12-19 04:45:24] You can attach a few files for test decryption by packing them into an archive with zip, rar, tar, 7zip, 7z, tar.gz extensions of no more than 10 megabytes using the attach button directly in the chat.**  
On December 20, 2024, they expand the offer:  
> **[2024-12-20 10:18:08] You can give me 10-20 files for test decryption**  
These tests aim to build trust with the victim before payment.

### 5. Post-Payment Technical Support
After receiving payment, LockBit provides technical support. On December 21, 2024, after confirming a payment, they state:  
> **[2025-04-24 14:12:58] after payment you will have to wait from an hour to 24 hours until the technicial sends the decryptor here in the chat**  
Later, they provide specific instructions for ESXi systems:  
> **[2025-04-24 14:32:54] chmod +x decrypt_ESXI_X64 ./decrypt_ESXI_X64**  
This reflects a professional approach to ensure victims can recover their data.

## Bitcoin Payment Process
LockBit demands payments exclusively in Bitcoin and provides specific addresses. For example:  
> **[2024-12-19 05:57:51] bc1qatkg42cxnv5vcxgz4wegkv2u6va9fztdkf6gwj 0.039611btc**  
Victims must confirm transactions, as seen on December 27, 2024:  
> **[2024-12-27 13:31:24] https://mempool.space/tx/afa41038f76e6616814e5c4d4bc7a4907d15d41dac5bf782af42dc2fbbc5c11f can you confirm you received this ?**  
LockBit responds by confirming:  
> **[2024-12-27 13:34:48] yes 0.00010389**  
This exchange shows a structured process for verifying payments.

## Affected Companies
The leaked documents following the hacking of LockBit reveal a comprehensive list of companies targeted by their attacks. Below is the full list of affected companies identified from the conversations and database records:

- **Gelco Gelatinas do Brasil Ltda**  
  Explicitly mentioned in the leaked conversations on December 24, 2024:  
  > **[2024-12-24 16:32:59] Hello, Gelco Gelatinas do Brasil Ltda Your network was penetrated...**  
  A Brazilian company involved in gelatin production.

- **KINOUSSIS INSPIRATION DESIGN GROUP**  
  Appears in a request for specific files on April 27, 2025:  
  > **[2025-04-27 19:03:16] KINOUSSIS INSPIRATION DESIGN GROUP ΜΟΝΟΠΡΟΣΩΠΗ ΙΚΕ.pdf**  
  A design and creative firm, likely based in Greece given the Greek text.

- **Lifthellas**  
  Mentioned alongside KINOUSSIS INSPIRATION DESIGN GROUP in the same context on April 27, 2025. Likely a service provider in the lift and elevator industry.

- **Non-Profit School (Unnamed)**  
  Referenced in conversations about educational institutions, indicating LockBit targets non-profit sectors as well. Specific name not disclosed in the leaked data.

- **Manufacturing Companies (Various)**  
  The database includes multiple references to companies in the manufacturing sector, such as those similar to Gelco Gelatinas do Brasil Ltda, involved in industrial production.

- **Service Providers (Various)**  
  Beyond Lifthellas, additional service-based companies are implied in the database, spanning industries like logistics and maintenance.

- **Creative Firms (Various)**  
  Alongside KINOUSSIS INSPIRATION DESIGN GROUP, other design or creative agencies are hinted at in the records, showing LockBit's broad targeting.

- **Other Sectors (Miscellaneous)**  
  The leaked database suggests a wide range of additional targets, including small businesses, tech firms, and potentially healthcare or retail organizations, reflecting LockBit’s indiscriminate approach.

Due to the nature of the leaked documents, some company names are explicitly stated (e.g., Gelco Gelatinas do Brasil Ltda, KINOUSSIS INSPIRATION DESIGN GROUP, Lifthellas), while others are inferred from contextual clues or database entries without specific names disclosed in the conversations.

## Additional Relevant Information
- **Volume of Stolen Data**  
  LockBit reveals having extracted large amounts of data before encryption. On April 28, 2025, they state:  
  > **[2025-04-28 13:49:29] Roughly 400 GB of files were taken from your network prior to encryption...**  

- **Exploited Vulnerabilities**  
  In one case, LockBit details their method of entry:  
  > **[2025-04-24 14:55:59] we got to you through phishing, captured the domain, and then the admin host Vincent**  
  This suggests that phishing and capturing administrative credentials are common tactics.

## Conclusion
The conversations between LockBit and its victims, as documented in the leaked files, reveal a calculated approach that combines economic incentives, psychological pressure, and technical support. Companies such as Gelco Gelatinas do Brasil Ltda, KINOUSSIS INSPIRATION DESIGN GROUP, and Lifthellas, among others, illustrate the diverse range of targets. This analysis underscores the importance of strengthening defenses against phishing and improving credential management to mitigate such threats.

## References
- Leaked documents following the hacking of LockBit.
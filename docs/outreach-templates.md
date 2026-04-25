# Outreach templates

Copy-pasteable templates per platform. Replace `[POST_TITLE]`, `[POST_URL]`,
`[ONE_LINER]`, etc. before posting.

## Twitter / X

### Thread template (technical post)

```
1/ [ONE_LINE_HOOK — what you found / built / broke]

[POST_URL]

🧵👇
```

```
2/ Why it matters: [ONE_SENTENCE_IMPACT]
```

```
3/ The interesting part:

[CODE_SNIPPET or 2 short bullets — what nobody else explained well]
```

```
4/ Defenses (because we're the good guys):

- [defense 1]
- [defense 2]
- [defense 3]
```

```
5/ Full writeup with more PoCs and screenshots:

[POST_URL]

#infosec #bugbounty #appsec
```

Rules of thumb:
- Hook tweet < 200 chars; second line is the URL.
- Numbered tweets feel native — don't fake-thread.
- Hashtags only on the last tweet to avoid throttling.

### Single-tweet template (writeup / tool release)

```
[CONCRETE_RESULT in 1 line — "Ran X against Y, found Z."]

Writeup: [POST_URL]
```

## Mastodon (infosec.exchange)

Longer than X. Code blocks render. No algorithm — boosts matter more than
hashtags.

```
[OPENING_HOOK 1–2 lines.]

[2–4 lines of technical content: the finding, the why, the defense.]

[POST_URL]

#infosec #BugBounty #AppSec
```

Tip: post during EU morning (08:00–10:00 Madrid) for max reach across
EU + early US Pacific.

## LinkedIn

Professional, longer, no jargon-only. Story arc helps engagement.

```
[Hook line — usually a surprising observation or a number.]

I spent the last [N] [days/weeks] [doing X]. Here's what I found:

→ [bullet 1]
→ [bullet 2]
→ [bullet 3]

The full writeup, with PoCs and screenshots, is on the blog:
[POST_URL]

#cybersecurity #infosec #bugbounty
```

Tip: avoid emojis at the start of the post — LinkedIn's algorithm seems to
de-rank them in 2026.

## Bluesky

Same structure as X but 300-char limit, no algorithm hostility, technical
audience. Cross-post directly from X with [Bluesky Bridge](https://bsky.app)
or paste manually.

## Hacker News

```
Title: [POST_TITLE — no site name, no clickbait, no emojis]
URL:   [POST_URL]
```

- Submit Tuesday-Thursday, 14:00–16:00 Madrid.
- Don't comment on your own submission first. Wait for someone else to
  comment, then engage technically.
- Never beg for upvotes. HN detects vote rings.
- If it dies on /newest within 30 minutes, it's gone — don't resubmit
  the same URL within 7 days.

## Reddit — /r/netsec

Strict rules. **Original research only.** Read [submission guidelines](https://www.reddit.com/r/netsec/wiki/submissions)
before posting.

```
Title: [POST_TITLE — descriptive, technical, no clickbait]
URL:   [POST_URL]
```

- Self-promotion ratio: max 1 in 10 submissions should be your own.
- Tutorials and walkthroughs are removed. CTF writeups go to
  `/r/hackthebox` or `/r/tryhackme`.
- A retired-only rule applies: never submit a writeup of an active machine.

### Reddit — /r/hackthebox & /r/tryhackme

```
Title: [Machine] [Difficulty] Writeup — [Short hook]
Body:
Just published a writeup for [Machine] ([retired on DATE]).
Covers [recon | initial foothold | privesc] with [interesting technique].

Full post: [POST_URL]

Happy to answer questions or compare notes.
```

## Dev.to

Frontmatter supports canonical out of the box.

```yaml
---
title: <same as on the blog>
published: true
canonical_url: <full URL on adperem.github.io>
description: <copy the meta description>
tags: <max 4: cybersecurity, opensource, tutorial, bugbounty>
cover_image: <hosted hero image URL>
---

[Full body, can be the same Markdown as on the blog.]

---
*Originally published on [adperem.github.io](<POST_URL>).*
```

## Hashnode

Has a "Canonical URL" field — fill it in. Hashnode rewards series, so put
guides in a series ("Recon Series", "GraphQL Security Series").

## Medium / InfoSec Write-ups publication

Medium doesn't fully support canonical for SEO — you set the canonical via
Story Settings → Advanced → "Originally published". This *can* still cause
some traffic cannibalization. Use Medium only when:

- The post is original research with high virality potential, AND
- You'd rather build Medium reach than rank on Google for the term.

Application to *InfoSec Write-ups*: send a draft to the publication editors
via [their submission form](https://infosecwriteups.com/submit-your-post).
Lead with: "Original research, originally published on [URL]".

## Guest post pitch — short email

For PortSwigger Research, HackTricks PRs, vendor blogs.

```
Subject: Original research — [TOPIC] — pitch for [PUBLICATION]

Hi [name or team],

I'm Adperem, [one-line bio]. I recently found [HIGH-LEVEL FINDING], and I
think it would fit [PUBLICATION] readers.

The angle is: [ONE-PARAGRAPH UNIQUE INSIGHT — what does my piece add that
isn't already covered].

Draft / writeup: [POST_URL]

Happy to adapt the format and depth to your editorial style. The piece is
unpublished elsewhere except my personal blog (with canonical pointing to
yours, if accepted).

Best,
Adperem
[POST_URL] · github.com/adperem
```

## HackTricks PR

For: [book.hacktricks.xyz](https://book.hacktricks.xyz/).

The repo is on [GitHub](https://github.com/HackTricks-wiki/hacktricks).
Find the section that matches your post (e.g. *Pentesting Web → GraphQL*),
add a short paragraph, link your post as the source.

PR description template:

```
Adds [N] new [techniques | references] for [SECTION], based on
research published at [POST_URL].

- [bullet of what's added]
- [bullet of what's added]
```

## Comments on related posts

Only comment on a third-party post if you genuinely add value:

- Correct a factual error (with sources).
- Add a missing edge case or defense.
- Share a complementary technique.

Rule: the comment must stand on its own without the link. Then drop the
link as supporting material.

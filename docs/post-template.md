# Post template

Copy `_drafts/_template.md` to a new file under `_posts/` with the format
`YYYY-MM-DD-slug.md`. Fill in the frontmatter, write the body, then move it
to `_posts/` (or use `jekyll serve --drafts` while writing).

The full pre-publish checklist lives in `SEO-PLAN.md § 3`. This file is the
quick skeleton.

```yaml
---
layout: post
title: "Keyword-first title under 60 chars"
date: YYYY-MM-DD HH:MM
categories: [Primary, Secondary]   # max 2, see docs/taxonomy.md
tags: [kebab-case, three-to-six]   # lowercase only
description: "140–160 characters. Lead with the keyword, follow with the user benefit."
image:
  path: /assets/img/<slug>/hero.png  # 1200×630 minimum, WebP preferred
  alt: "Descriptive alt that doubles as caption"
# Optional:
# redirect_from: [/posts/old-slug/]
---
```

## Body skeleton

```markdown
> One-sentence hook. Why should the reader care in five seconds?

## What you'll learn
- Bullet 1
- Bullet 2
- Bullet 3

## Section H2 with semantic keyword

Body. Keep paragraphs ≤ 4 lines. Code in fenced blocks with language hints.

```bash
# command example
```

## Section H2

Use H3 only when nesting is needed.

## Defenses / Mitigations / Takeaways

A practical wrap-up beats a generic conclusion. Include:

- 2–3 bullet defenses or actions
- 1 link to the relevant `/guides/<cluster>/`
- 2 external authority links (PortSwigger, OWASP, vendor docs)

## Further reading

- Internal post 1
- Internal post 2
- External authority link
```

## Quality bar

| Check                        | Pass criteria                                |
|------------------------------|----------------------------------------------|
| Word count                   | 1200+ for guides, 600+ for writeups          |
| Internal links               | ≥ 3                                          |
| External authority links     | ≥ 2                                          |
| H1                           | Exactly one (the title)                      |
| H2 with keyword              | At least one variant of the target keyword   |
| Image alt                    | All images have descriptive alts             |
| Code blocks                  | Language-tagged for syntax highlighting      |
| Reading time                 | Shows on the post (auto from word count)     |

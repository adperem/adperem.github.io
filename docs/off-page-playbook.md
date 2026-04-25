# Off-page playbook

Everything to do *outside* the website to grow organic reach. Run this on the
day each new post ships and on a recurring weekly cadence for legacy posts.

## One-time setup

- [ ] Submit `https://adperem.github.io/sitemap.xml` to
      [Google Search Console](https://search.google.com/search-console).
- [ ] Submit the same sitemap to
      [Bing Webmaster Tools](https://www.bing.com/webmasters). Bing also
      powers DuckDuckGo and Yahoo.
- [ ] Verify ownership in
      [IndexNow](https://www.indexnow.org/) (Bing-style instant indexing).
      Generate a key and drop the file at the site root.
- [ ] Create accounts (use the same handle `adperem` everywhere):
  - [ ] Dev.to — for tooling/tutorial cross-posts
  - [ ] Medium + apply to *InfoSec Write-ups* publication
  - [ ] Hashnode — for long-form guides
  - [ ] Mastodon `infosec.exchange` (tech-savvy, no algorithm punishment)
  - [ ] Bluesky — growing infosec audience
- [ ] Confirm Twitter/X and LinkedIn are wired into the site footer (already
      done in `_includes/footer.html` via `_data/contact.yml` if needed).
- [ ] Pin a "Start here" tweet/toot linking the three pillar guides:
  - `/guides/graphql-security/`
  - `/guides/ctf-methodology/`
  - `/guides/recon/`

## Launch-day checklist (per post)

Within 24 hours of pushing the post:

- [ ] **GSC:** open the post URL in Search Console → "Request indexing"
- [ ] **IndexNow ping:** `curl https://api.indexnow.org/indexnow?url=<URL>&key=<KEY>`
- [ ] **Twitter/X:** post the prepared thread (see `outreach-templates.md`)
- [ ] **Mastodon:** post the prepared toot
- [ ] **LinkedIn:** post the prepared text
- [ ] **Bluesky:** mirror the X thread (cross-poster or manual)

24–72 hours after publish:

- [ ] **Cross-post on Dev.to** (with `canonical_url` to the original)
- [ ] **Cross-post on Hashnode** (mark "Canonical URL" field)
- [ ] **InfoSec Write-ups (Medium):** only for original CTF/research, with
      "originally published" line at the bottom

72 hours – 7 days after publish:

- [ ] **/r/netsec** — *only* original research, never tutorials. Read the
      [submission guide](https://www.reddit.com/r/netsec/wiki/submissions).
- [ ] **/r/hackthebox** or **/r/tryhackme** — only for officially retired
      machines. Mention machine name in the title.
- [ ] **Hacker News** — submit with the post title (no site suffix). Best
      window: 14:00–16:00 Madrid (08:00–10:00 ET).
- [ ] If post mentions an upstream project, open a PR or issue offering to
      link the post from their docs/README. See
      `docs/backlink-opportunities.md`.

## Weekly cadence (existing posts)

Every Monday morning, 30 minutes:

1. **GSC Performance** → filter pages with > 50 impressions, < 5% CTR.
   Pick one. Rewrite the title + description, ship the change.
2. **GSC Coverage** → look for warnings or excluded pages, fix any.
3. Check the **Backlinks tab** in Bing Webmaster Tools (Google's
   `linkfromdomain:` is unreliable in 2026).
4. Browse the latest 10 issues in repos you've forked or contributed to.
   Drop a useful comment that links the relevant post (only if relevant).

## Monthly cadence

- **Refresh** one old post that has impressions but slipped in rank. Add
  200–400 words and update the publish date — but keep `last_modified_at`
  honest (the lastmod hook handles that automatically from git).
- **Cross-post one post** to a publication you haven't used recently.
- **Audit** outbound `target="_blank"` links — make sure all have
  `rel="noopener noreferrer"`.

## Tracking

Use `docs/backlink-tracker.csv`. Each row = one backlink or social share.
Columns:

| post_slug | platform | url | published | clicks_30d | notes |
|-----------|----------|-----|-----------|------------|-------|

Update weekly during the GSC review.

## What NOT to do

- Buy backlinks. They get penalised.
- Mass-comment on Medium / Dev.to with self-links. That's spam and gets
  the account flagged.
- Submit the same post to 5 subreddits in one day. Pick the *one* most
  relevant.
- Use URL shorteners on social — they look like spam and dilute referral
  data. Post the canonical URL.
- Edit posts in production without bumping content meaningfully. Search
  engines notice churn without value.

## Reference

- Templates per platform: `docs/outreach-templates.md`
- Pre-written copy for existing posts: same file, "Per-post social copy".
- Backlink prospect list: `docs/backlink-opportunities.md`
- Tracker: `docs/backlink-tracker.csv`

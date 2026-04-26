# Measurement & KPIs

What's instrumented, where to look, and how to know if SEO work is paying off.

## What ships in `assets/js/main.js`

The script is `defer`-loaded at the end of `default.html`. All events go
through a single `track(name, params)` helper that no-ops when `gtag` isn't
on the page (dev environment, ad-blocker, offline) — the site never throws.

### Custom events catalog

| Event name             | Trigger                                        | Useful params                                     |
|------------------------|------------------------------------------------|---------------------------------------------------|
| `click_external_link`  | Click on any `<a>` whose host ≠ `adperem.github.io` | `link_url`, `link_domain`, `link_text`, `page_path` |
| `click_internal_link`  | Click on `.related__item`, `.post-row`, `/posts/*`, `/guides/*` | `link_url`, `page_path`, `component`              |
| `scroll_depth`         | First time the user passes 50% or 90% of the page | `percent`, `page_path`                            |
| `copy_code_block`      | Click on the "Copy" button injected on `div.highlight` | `page_path`, `code_length`, `language`            |
| `read_complete`        | Post pages: ≥ 30s on page **and** ≥ 90% scroll | `page_path`, `time_on_page_s`                     |
| `web_vital`            | Real-user LCP / CLS / INP / FCP / TTFB at page hide | `metric_name`, `metric_value`, `metric_rating`, `page_path` |

### Why these specific events

- **`click_external_link`** — outbound clicks are the strongest unmonetised
  signal a writeup is providing real value.
- **`click_internal_link` (component)** — the `component` param lets you
  separate "related posts work" vs "blog index works" without two events.
- **`scroll_depth`** — 50% catches drive-by readers, 90% catches finishers.
  Combine with time-on-page in Explorations.
- **`copy_code_block`** — copies almost always mean someone is *using* the
  post. Tag the language to see which stacks land.
- **`read_complete`** — anti-bounce signal. Beats time-on-page alone (which
  is unreliable for single-page sessions in GA4).
- **`web_vital`** — RUM data. Lighthouse CI is lab data; this is what your
  actual visitors experience. Use it to prioritise CWV work.

## One-time GA4 setup

GA4 already configured (`G-XHSHZJQBW2`). For each new event below, do this
once in **Admin → Data display → Custom definitions**:

### Mark events as conversions (≈ "key events")

In **Admin → Events**, toggle "Mark as key event" on:

- `click_external_link`
- `read_complete`
- `copy_code_block`

These become countable conversions you can pivot on in Explorations.

### Register custom dimensions

In **Admin → Custom definitions → Custom dimensions → Create**:

| Dimension name      | Scope | Event parameter |
|---------------------|-------|-----------------|
| Page Path           | Event | `page_path`     |
| Link Domain         | Event | `link_domain`   |
| Link Component      | Event | `component`     |
| Code Language       | Event | `language`      |
| Web Vital Name      | Event | `metric_name`   |
| Web Vital Rating    | Event | `metric_rating` |
| Scroll Percent      | Event | `percent`       |

### Register custom metrics (numeric)

| Metric name         | Scope | Event parameter    | Unit          |
|---------------------|-------|--------------------|---------------|
| Time on Page (s)    | Event | `time_on_page_s`   | Standard      |
| Web Vital Value     | Event | `metric_value`     | Standard      |
| Code Length         | Event | `code_length`      | Standard      |

> Custom dimensions/metrics cap at 50 per property — well within budget.

## Reports to build in GA4 Explorations

### A. "Top external destinations" (writeup → who do readers go to next?)

- **Technique:** Free form
- **Rows:** `Link Domain`
- **Columns:** *(none)*
- **Values:** Event count of `click_external_link`
- **Filter:** `Event name = click_external_link`

Tells you which third parties your audience trusts. Good guidance for who
to pitch a guest post / collaboration to.

### B. "Most-read posts" (real reads, not bounces)

- **Rows:** `Page Path` (custom dim) — falls back on `Page path + query`
- **Values:** `read_complete` event count, `Time on Page (s)` average
- **Sort:** `read_complete` descending

The single best post-quality leaderboard.

### C. "Code copy heatmap"

- **Rows:** `Page Path`, `Code Language`
- **Values:** `copy_code_block` event count

Posts where readers copy a lot of code = candidates to expand into
tutorials. Posts with zero copies but high reads = audit code blocks
(maybe a bash command nobody trusts, or a snippet that's not actually
runnable).

### D. "Web Vitals dashboard"

- **Rows:** `Page Path`
- **Columns:** `Web Vital Name`
- **Values:** `Web Vital Value` (P75)
- **Filter:** `Event name = web_vital`

Switch the value aggregation to P75 in **Custom metrics → Metric
configuration** (matches what Google ranks against). Anything with LCP
P75 > 2500 ms gets queued in `docs/cwv-followups.md`.

### E. "Search to scroll" funnel

- **Steps:**
  1. Session source/medium = `google / organic`
  2. `scroll_depth` with `percent = 50`
  3. `scroll_depth` with `percent = 90`
  4. `read_complete`

The drop between steps 2 and 3 tells you exactly where readers bail. Map
each post's drop-off rate; that's your editing roadmap.

## Looker Studio dashboard (recommended)

GA4 Explorations are great for ad-hoc, bad for sharing and history. Build
a single Looker Studio report once, refresh it for every weekly review.

Suggested pages:

1. **Overview** — Sessions, organic traffic, top 10 landing pages last 28d.
2. **Engagement** — Read complete count, avg time on page, code copies by post.
3. **Outbound** — top external destinations + top external links by post.
4. **Web Vitals** — P75 LCP / CLS / INP per page, last 28d, with budget lines.
5. **GSC** (after connecting) — impressions, clicks, top queries, top pages.

Connect data sources:
- **GA4 connector** — ID `G-XHSHZJQBW2`.
- **Search Console connector** — `adperem.github.io` property.

## Google Search Console — weekly review (10 minutes)

Every Monday morning. The aim is to catch the top opportunities, not
audit everything.

1. **Performance → Search results**, last 28 days vs. previous 28 days.
   - Top 5 queries by *delta impressions* — opportunity?
   - Top 5 queries by *delta clicks* — already winning, double down.
   - Filter `position` between 8 and 20: posts on the cusp of page 1.
     Refresh the title + description, ship.
2. **Performance → Pages**, sorted by impressions, low CTR.
   - Anything ≥ 500 impressions with < 2% CTR → rewrite the SERP snippet
     (`title` + `description`).
3. **Indexing → Pages → Why pages aren't indexed**.
   - "Crawled, currently not indexed" → check if it's a real post
     (sometimes a `/categories/#anchor` URL leaks). Add to
     `robots.txt` or `noindex` it.
   - "Discovered, currently not indexed" → request indexing.
4. **Experience → Core Web Vitals** — flag any URL that flipped
   "Good" → "Needs Improvement" / "Poor".
5. **Links → Top linking sites** — celebrate new ones, log to
   `docs/backlink-tracker.csv`.

## 90-day KPIs

Baseline today; review at day 30, 60, 90.

| KPI                          | Source        | Baseline | T+90 target |
|------------------------------|---------------|----------|-------------|
| Organic impressions / 28d    | GSC           | _____    | +200%       |
| Organic clicks / 28d         | GSC           | _____    | +150%       |
| Posts ranking top-10 (any q) | GSC Position ≤ 10, avg | _____ | ≥ 5      |
| Distinct referring domains   | Bing Webmaster | _____   | +10         |
| `read_complete` / 28d        | GA4           | 0        | ≥ 200       |
| LCP P75 (home + blog)        | RUM (web_vital)| _____   | ≤ 2.5 s     |
| CLS P75 (home + blog)        | RUM (web_vital)| _____   | ≤ 0.1       |
| Newsletter / RSS subs        | RSS host      | _____    | +100        |

Fill in the baseline column on the day Phase 7 deploys; review monthly.

## What "good" looks like at T+90

- Two of the three pillar guides (`/guides/recon/`, `/guides/graphql-security/`)
  ranking on page 1 for at least one transactional query each.
- The IDOR writeup gathering 10+ referring domains (HackTricks,
  PortSwigger Research mentions, awesome-* lists).
- ≥ 50% of post sessions trigger `scroll_depth = 50`; ≥ 25% trigger 90;
  ≥ 10% trigger `read_complete`.
- LCP P75 across all pages ≤ 2.5 s. If not, the optimizer in
  `tools/optimize-images.sh` and `docs/cwv-followups.md` step (3) are next.

## Privacy notes

- All custom events run client-side; no server logs, no fingerprinting.
- Web Vitals data is anonymous performance metrics. No user content
  ever leaves the browser through these events.
- Set GA4 → Admin → Data Settings → Data Retention to **14 months**
  (the longest available); good for year-over-year analysis without
  PII concerns.

## What this does NOT do

- No goal/conversion value (no monetary side to instrument).
- No user-ID / cross-device tracking (no login).
- No A/B testing — out of scope for a content site.
- No newsletter or signup capture — add when you have an email list.

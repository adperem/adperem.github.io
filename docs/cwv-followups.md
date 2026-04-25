# Core Web Vitals — follow-ups

Phase 6 shipped the lower-risk wins. The work below is higher effort or
needs human input; this doc lays out the playbook for each.

## What already shipped (Phase 6)

- **Lighthouse CI** on every PR — `.github/workflows/lighthouse.yml`
  builds the Jekyll site, serves `_site/` locally and runs Lighthouse
  against Home, Blog, About, Guides and the GraphQL IDOR post. Budgets
  in `.github/lighthouserc.json`. CLS hard-fails the build at > 0.1; SEO
  hard-fails below 0.95.
- **`prefers-reduced-motion`** — `_sass/_base.scss` already had a partial
  rule. It now also kills `.fade-up`, the hero drift, related-card lifts
  and clamps every animation/transition globally.
- **Image optimization tool** — `tools/optimize-images.sh` generates
  WebP siblings (and AVIF with `--avif`) next to every PNG/JPG. Idempotent.
- **`<picture>` include** — `_includes/responsive-image.html` emits AVIF
  + WebP `<source>` tags only when sibling files exist. Post hero already
  uses it.

## Pending work

### 1. Run the image optimizer

```bash
sudo apt-get install -y webp libavif-bin
bash tools/optimize-images.sh --avif
git add assets/img && git commit -m "perf: webp + avif siblings"
```

The post hero `<picture>` automatically picks them up. No template change
needed afterwards.

Expected effect on the heaviest assets:

| File                                   | PNG    | WebP est. | AVIF est. |
|----------------------------------------|--------|-----------|-----------|
| `billing/MagnusBilling.png` (1.2 MB)   | 1.2 MB | ~150 KB   | ~80 KB    |
| `skimmer-hunter/skimmer-hunter-banner` | 600 KB | ~80 KB    | ~45 KB    |
| Most logos < 100 KB                    | small  | ~30%      | ~50%      |

### 2. Fix CLS by adding intrinsic dimensions

`<img>` without `width`/`height` attributes causes layout shift. The
`responsive-image.html` include already accepts `width=` and `height=`.

Two options:

**a) Per-post frontmatter** (preferred — author knows the image):

```yaml
image:
  path: /assets/img/foo/hero.png
  alt: "..."
  width: 1600
  height: 900
```

Then update `_layouts/post.html` to pass them:

```liquid
{% include responsive-image.html
   src=page.image.path
   alt=hero_alt
   width=page.image.width
   height=page.image.height
   eager=true
   sizes="(min-width: 720px) 720px, 100vw" %}
```

**b) Auto-extract** with a Jekyll generator that opens each image at build
time and reads its real dimensions. The `mini_magick` gem makes this a
~30-line plugin; track it as `_plugins/image-dimensions.rb` if option (a)
gets tedious.

### 3. Self-host fonts (optional, ~150ms FCP)

Currently three external font CDNs (Fontshare ×2, Google Fonts). Each
adds a TLS handshake before paint. Self-hosting plus `font-display: swap`
typically wins 100–200 ms FCP.

Steps:

1. Download the woff2 files for the weights actually used:
   - General Sans 400/500/600/650/700/750
   - Satoshi 400/500/700
   - JetBrains Mono 400/500
2. Put them under `assets/fonts/`.
3. Replace the `<link>` tags in `_includes/head.html` with a single
   `<link rel="stylesheet" href="/assets/fonts/fonts.css">` and write
   `@font-face` declarations there.
4. Remove the three external `preconnect`s.

Audit licensing: General Sans and Satoshi from Fontshare allow self-hosting
under their free license; verify before shipping.

### 4. Critical CSS inline (optional, ~80–150ms FCP on slow 3G)

Inline the rules needed to render above-the-fold and async-load the rest.
The home hero (`<section class="hero">` + nav) is the relevant slice.

Easiest path:

1. `npm i -g critical` (Penthouse-based).
2. Run on the built site: `critical _site/index.html --base _site --inline`.
3. Capture the inlined `<style>` block, paste into a new
   `_includes/critical-home.html`.
4. In `default.html` (or a new home-only layout), include the file inside
   `<head>` and load `main.css` with `media="print" onload="this.media='all'"`
   to make it non-blocking.

Risks:
- Critical CSS goes stale every time the design changes. Re-run on every
  visual PR.
- The inline payload bumps HTML size; Lighthouse may complain on the
  budget. Keep critical CSS under 14 KB.

### 5. Add resource hints for likely next pages

For visitors on the home page, the next click is almost always /blog/ or
the latest post. A `<link rel="prefetch">` on viewport-visible `.post-row`
elements warms the cache. The simplest implementation is in
`assets/js/main.js`:

```js
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const a = e.target;
    if (a.tagName === 'A' && !a.dataset.prefetched) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = a.href;
      document.head.appendChild(link);
      a.dataset.prefetched = '1';
    }
  });
}, { rootMargin: '200px' });
document.querySelectorAll('.post-row, .related__item').forEach(el => io.observe(el));
```

### 6. Defer non-critical JS

`assets/js/main.js` already has `defer`. Confirm Google Analytics is the
only other script and that it's `async`. Audit on the next big content
change.

### 7. Audit third-party origins

Run:

```bash
curl -sL https://adperem.github.io | grep -E '(<link|<script)' | sort -u
```

Confirm only allowed third-parties remain: `googletagmanager.com`,
`api.fontshare.com`, `fonts.googleapis.com`, `fonts.gstatic.com`. Any
new ones appearing through plugins should be evaluated.

## How to verify a change

1. Open `_site/` after `bundle exec jekyll b`.
2. `npx --yes http-server _site -p 8080`.
3. Run Lighthouse in Chrome DevTools (mobile preset, throttling on).
4. Compare against the budgets in `.github/lighthouserc.json`.

A regression in CI is flagged on the PR; locally, `npx lhci autorun` runs
the same suite.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A hybrid GitHub Pages site combining:
- **Jekyll blog** (Chirpy theme) focused on cybersecurity content (CTF writeups, vulnerabilities)
- **Minijuego** (`/minijuego/`): Spanish-language interactive health education mini-games for children, built with vanilla JS + Three.js

## Commands

```bash
# Start dev server (localhost:4000, live reload)
bash tools/run.sh

# Bind to all network interfaces
bash tools/run.sh -H 0.0.0.0

# Production build + html-proofer link validation
bash tools/test.sh

# Direct Jekyll commands
bundle exec jekyll s -l   # serve with live reload
bundle exec jekyll b      # build to _site/
```

CI/CD via GitHub Actions (`.github/workflows/pages-deploy.yml`) — deploys automatically on push to main.

## Architecture

### Jekyll Blog
- `_posts/` — Markdown articles with YAML frontmatter (categories, tags, image, date)
- `_tabs/` — Static pages (About, Archives, Categories, Tags)
- `_data/contact.yml` — Social links config
- `_plugins/posts-lastmod-hook.rb` — Auto-sets post `last_modified_at` from git history (requires full fetch depth in CI)
- `_config.yml` — Site-wide config: timezone `Europe/Madrid`, dark theme, Google Analytics `G-XHSHZJQBW2`

### Minijuego (`/minijuego/`)
3D interactive menu using Three.js (GLTF human body model). Clicking body parts opens activity sub-pages.

```
minijuego/
├── index.html        # 3D scene entry point
├── src/
│   ├── menu.js       # Three.js scene, animation loop, raycasting for hotspots
│   ├── storage.js    # localStorage abstraction for progress tracking
│   └── parts.js      # Body part constants and hotspot definitions
└── activities/
    ├── ojos/         # Eye health activities
    ├── cerebro/      # Brain/literacy activities
    ├── estomago/     # Stomach/nutrition activities
    ├── pulmones/     # Lung health activities
    └── corazon/      # Heart anatomy activities
```

**Progress system:** `storage.js` persists completed activities in localStorage as `{ completed: ["part1", ...] }`, with backward-compatible key migration.

**Activity pattern:** Each activity is a self-contained `index.html` with inline `<style>` and a `<script type="module">` that imports from `../../src/storage.js` and calls `markCompleted()` on success.

**UI style:** Glassmorphism (backdrop-filter blur, semi-transparent panels, rounded corners). All content in Spanish (`lang="es"`). Touch-friendly sizing.

**No bundler** — vanilla ES6 modules served directly; no npm/build step for the minijuego.

## Key Conventions

- **Indentation:** 2 spaces, LF line endings (`.editorconfig`)
- **Images:** Prefer WebP; blog post images go in `assets/img/posts/`
- **Blog posts:** Filename format `YYYY-MM-DD-title.md`; frontmatter requires `title`, `date`, `categories`, `tags`
- **Minijuego activities:** Keep logic self-contained per activity; share only `storage.js`, no shared game state

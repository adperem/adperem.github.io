# adperem.github.io

Personal site of Adrian Perez — a hybrid GitHub Pages project combining a cybersecurity blog and an interactive health education mini-game for children.

## Structure

```
.
├── _posts/           # Blog articles (CTF writeups, vulnerability research)
├── _tabs/            # Static pages (About, Archives, Categories, Tags)
├── _sass/            # Custom SCSS — variables, base, layout, components, post, syntax
├── assets/
│   ├── css/          # main.scss (imports from _sass/)
│   └── img/posts/    # Post images (prefer WebP)
├── _data/contact.yml # Social links config
├── _config.yml       # Site config (timezone: Europe/Madrid, dark theme, GA)
└── minijuego/        # Spanish-language interactive health mini-game (Three.js)
    ├── index.html    # 3D scene entry point
    ├── src/          # menu.js, storage.js, parts.js
    └── activities/   # ojos, cerebro, estomago, pulmones, corazon
```

## Blog

Jekyll site using a custom theme built from the [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) base. Posts cover:

- CTF writeups
- Vulnerability research and analysis
- Cybersecurity tooling

Post filename format: `YYYY-MM-DD-title.md`. Required frontmatter: `title`, `date`, `categories`, `tags`.

## Minijuego

3D interactive menu using Three.js with a GLTF human body model. Clicking body parts opens activity sub-pages covering different health topics (eyes, brain, stomach, lungs, heart). All content is in Spanish.

- No bundler — vanilla ES6 modules served directly
- Progress tracked via localStorage (`storage.js`)
- UI style: glassmorphism (backdrop-filter blur, semi-transparent panels)

## Development

```bash
# Serve locally with live reload (localhost:4000)
bash tools/run.sh

# Bind to all interfaces
bash tools/run.sh -H 0.0.0.0

# Production build + link validation
bash tools/test.sh
```

CI/CD via GitHub Actions (`.github/workflows/pages-deploy.yml`) — deploys automatically on push to `main`.

## License

[MIT](LICENSE)

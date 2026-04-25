# Plan de mejora SEO — adperem.github.io

Diagnóstico actual y hoja de ruta priorizada para aumentar tráfico orgánico y alcance.

## Progreso

| Fase | Estado | Commit / Notas |
|------|--------|---------------|
| 1. Quick wins técnicos | Hecho | Frontmatter, renames, redirects, head, hero LCP |
| 2. Indexación + metadatos | Hecho | JSON-LD, /categories/, /tags/, /archive/, taxonomía |
| 3. Arquitectura de contenido | Hecho | /guides/ + 3 pillars, related posts, minijuego SEO |
| 4. Calendario editorial | Entregables listos | `docs/keyword-research.md`, `docs/editorial-calendar.md`, 4 stubs en `_drafts/` |
| 5. Off-page | Entregables listos | `docs/off-page-playbook.md`, `docs/outreach-templates.md`, `docs/post-promo-copy.md`, `docs/backlink-opportunities.md`, `docs/backlink-tracker.csv` |
| 6. Core Web Vitals | Hecho (parcial) | Lighthouse CI, prefers-reduced-motion, optimize-images.sh, `<picture>` include. Follow-ups en `docs/cwv-followups.md` |
| 7. Medición | Pendiente | Eventos GA4, KPIs 90d |

---

## 1. Estado actual (auditoría)

### Lo que ya funciona
- `jekyll-seo-tag`, `jekyll-sitemap` y `jekyll-feed` activos en `_config.yml`.
- `robots.txt` correcto con referencia al sitemap.
- Verificación de Google Search Console y Google Analytics (GA4) configurados.
- URLs limpias (`/posts/:title/`) y enlaces internos con `relative_url`.
- HTTPS forzado por GitHub Pages.
- Imágenes con `loading="lazy"` y atributos `alt` en la mayoría.

### Problemas detectados
| # | Problema | Impacto |
|---|---|---|
| P1 | Posts con `summary:` en vez de `description:` (p0wny-shell, recon_subdomains) → jekyll-seo-tag no los usa | Alto |
| P2 | Filename `2025-07-09-p0wny@shell.md` → el `@` rompe URLs y sitemaps | Alto |
| P3 | Filename `23-04-20-smol-writeup.md` (año truncado YY) y fecha `2025-05-9` en lockbit | Alto |
| P4 | Sin datos estructurados JSON-LD específicos (Article, BreadcrumbList, Person, WebSite con SearchAction) | Alto |
| P5 | Hero images con `loading="lazy"` → penaliza LCP / Core Web Vitals | Alto |
| P6 | Sin OG image por defecto (posts sin `image:` comparten mal en redes) | Medio |
| P7 | Sin breadcrumbs visibles ni marcados | Medio |
| P8 | Tabs `Categories`, `Tags`, `Archives` mencionados en CLAUDE.md pero inexistentes en `_tabs/` → pérdida de páginas indexables | Medio |
| P9 | Sin `hreflang`: minijuego está en `es`, el blog en `en`, misma raíz | Medio |
| P10 | 3 fuentes externas (Fontshare x2 + Google Fonts) sin `preconnect` ni `font-display: swap` explícito | Medio |
| P11 | Sin `manifest.webmanifest`, sin favicons completos (Apple touch, maskable) | Bajo |
| P12 | 404 mínimo: no sugiere contenido ni retiene usuarios | Bajo |
| P13 | Enlaces externos sin `rel="noopener noreferrer"` homogéneo | Bajo |
| P14 | Sin enlaces internos entre posts relacionados (solo prev/next cronológico) | Medio |
| P15 | Sin búsqueda on-site (los usuarios abandonan si no encuentran el tema) | Bajo |
| P16 | Categorías muy granulares y duplicadas (`hacking` vs `Cybersecurity`, `bugbounty` vs `Bug Bounty`) → dilución de autoridad por tag | Medio |
| P17 | Sin estructura de contenido pilar (pillar pages / topic clusters) sobre GraphQL, CTF, IDOR, recon | Alto (estratégico) |
| P18 | Sin promoción en canales externos (Reddit /r/netsec, Hacker News, Medium cross-post, Dev.to) | Alto (estratégico) |

---

## 2. Hoja de ruta (orden recomendado)

### Fase 1 — Quick wins técnicos (1–2 horas)
1. **Normalizar frontmatter**
   - Reemplazar `summary:` por `description:` en todos los posts.
   - Corregir fechas: `2025-05-9` → `2025-05-09`, `23-04-20-smol-writeup.md` → `2023-04-20-smol-writeup.md`.
   - Renombrar `2025-07-09-p0wny@shell.md` → `2025-07-09-p0wny-shell.md` y añadir redirect `/posts/p0wny@shell/` → `/posts/p0wny-shell/` con `jekyll-redirect-from`.
2. **Optimizar `_includes/head.html`**
   - Añadir `<link rel="preconnect" href="https://www.googletagmanager.com">` y `<link rel="dns-prefetch" href="https://www.google-analytics.com">`.
   - Self-hostear las fuentes críticas (General Sans, Satoshi) o al menos añadir `&display=swap` y un solo `preconnect` con `crossorigin`.
   - Añadir `<meta name="theme-color" content="#0a0a0a">` y favicons completos.
3. **Hero images LCP**
   - Cambiar `loading="lazy"` a `loading="eager"` + `fetchpriority="high"` solo en la primera imagen visible del `index.html` y del layout `post.html` (`page.image`).
4. **OG image por defecto**
   - Crear `/assets/img/og-default.png` (1200×630) y referenciarla en `_config.yml` como `social_preview_image:` (jekyll-seo-tag la usa como fallback).

### Fase 2 — Indexación y metadatos (2–3 horas)
5. **Añadir plugin `jekyll-redirect-from`** para gestionar alias sin romper SEO histórico.
6. **JSON-LD estructurado** en un nuevo `_includes/structured-data.html`, incluido desde `head.html`:
   - `WebSite` con `potentialAction` (SearchAction) en home.
   - `Person` con `sameAs` apuntando a GitHub, LinkedIn, HTB, THM en la home/about.
   - `BlogPosting` / `TechArticle` en cada post (title, datePublished, dateModified, author, image, keywords).
   - `BreadcrumbList` en posts y páginas.
7. **Crear tabs faltantes** en `_tabs/`:
   - `categories.html` — lista categorías con conteo de posts.
   - `tags.html` — nube de tags.
   - `archives.html` — posts por año.
   Cada uno con `permalink` y enlazado en `nav.html`.
8. **Unificar taxonomía** (documento `docs/taxonomy.md`):
   - Categorías canónicas: `Cybersecurity`, `CTF`, `Tools`, `Privacy`, `Hardware`, `AI`.
   - Tags en minúscula, con guiones (`bug-bounty`, no `Bug Bounty`).
   - Reescribir frontmatter de los 10 posts actuales.

### Fase 3 — Arquitectura de contenido (semana 1)
9. **Pillar pages + topic clusters**
   - `/guides/graphql-security/` — página pilar enlazando al IDOR writeup y a 2–3 posts nuevos (introspection, batching attacks, auth bypass).
   - `/guides/ctf-methodology/` — enlazando Billing, Smol, futuros writeups.
   - `/guides/recon/` — enlazando recon_subdomains y nuevos.
10. **Related posts** en `post.html` por categoría/tags compartidos (3 enlaces al final, antes del prev/next).
11. **Sitemap enriquecido**: añadir `lastmod` por post usando el hook existente (`_plugins/posts-lastmod-hook.rb` ya calcula la fecha desde git).
12. **`hreflang`** en `head.html`: `<link rel="alternate" hreflang="es" href="/minijuego/">` cuando la URL empiece por `/minijuego/`, y `x-default` al home.

### Fase 4 — Contenido nuevo (calendario editorial 4–8 semanas)
Objetivo: duplicar el ritmo de publicación y posicionar keywords long-tail de bajo CPC alto volumen.
13. **Keyword research** con Google Search Console + Ahrefs Free + `site:reddit.com/r/netsec keyword`. Ejes:
    - "graphql idor example", "graphql introspection exploit", "shopify graphql security".
    - "tryhackme [machine] walkthrough", "hackthebox [machine] writeup".
    - "oniux vs vpn", "tor isolation linux", "anonymous linux apps".
    - "esp32 skimmer detector", "diy bluetooth skimmer finder".
14. **Publicar 1 post/semana** siguiendo la plantilla:
    - Title ≤ 60 chars con keyword principal al inicio.
    - Description 140–160 chars, incluye keyword + beneficio.
    - H1 único = title; H2/H3 con variantes semánticas.
    - 1200+ palabras para guías técnicas.
    - ≥ 3 enlaces internos + 2 externos de autoridad.
15. **Serie "desde cero"**: 4 posts sobre reconocimiento que enlacen entre sí y al pillar `/guides/recon/`.

### Fase 5 — Off-page (continuo)
16. **Submit manual** del sitemap a Google Search Console y Bing Webmaster Tools.
17. **Cross-posting** (con `rel="canonical"` a adperem.github.io):
    - Dev.to — para tooling (`loxs`, `fuzzstorm`, `recon_subdomains`, `skimmer-hunter`).
    - Medium (publicación "InfoSec Write-ups") — para writeups de CTF y el IDOR.
    - Hashnode — para guías largas.
18. **Compartir en comunidades**:
    - /r/netsec (research original, no tutoriales).
    - /r/hackthebox, /r/tryhackme (writeups, solo tras retirada oficial de la máquina).
    - Hacker News (research técnico original con hook fuerte — IDOR y Skimmer Hunter son candidatos).
    - Twitter/X + Mastodon infosec.exchange.
19. **Backlinks naturales**: PRs a repos mencionados (fuzzstorm, loxs, oniux) añadiendo al README un enlace al post explicativo. Comentarios útiles en issues relacionados enlazando al writeup (sin spam).
20. **Guest posting** en PortSwigger Research, HackTricks (pull request a la sección relevante), InfoSec Write-ups Medium pub.

### Fase 6 — UX y Core Web Vitals
21. **Lighthouse CI** en GitHub Actions: fallar el build si Performance < 90 o SEO < 100.
22. **Convertir PNG → WebP** en `assets/img/` (script `cwebp -q 82`); muchos logos son PNG pesados.
23. **Critical CSS inline** en `head.html` para el above-the-fold del home.
24. **`prefers-reduced-motion`** honrado en las animaciones `fade-up` (CWV y accesibilidad → ranking).
25. **`<picture>` con srcset** para hero y thumbs (responsive + AVIF fallback).

### Fase 7 — Medición
26. **Google Search Console**: revisar semanalmente Cobertura, Consultas, CTR por página.
27. **Eventos GA4**: `click_external_link`, `scroll_50`, `scroll_90`, `copy_code_block` — útiles para dwell-time y engagement signals.
28. **KPIs a 90 días**:
    - Impresiones GSC: +200%
    - Clicks orgánicos: +150%
    - Posts en top-10 Google: ≥ 5
    - Dominios referentes únicos: +10

---

## 3. Checklist por-post (plantilla)

Antes de publicar cualquier post nuevo:

- [ ] `title` ≤ 60 caracteres, keyword al inicio
- [ ] `description` entre 140–160 caracteres, accionable
- [ ] `categories` de la taxonomía canónica (1–2 máx)
- [ ] `tags` en minúscula-con-guiones (3–6)
- [ ] `image.path` existe, 1200×630 o superior, WebP, con `alt` descriptivo único
- [ ] H1 implícito por `title`, sólo H2/H3 en el body
- [ ] ≥ 3 enlaces internos a posts/pillar pages relacionados
- [ ] ≥ 2 enlaces externos a fuentes de autoridad
- [ ] Código en bloques ```` ```lang ```` con resaltado funcional
- [ ] Imagen `og:` validada en [opengraph.xyz](https://www.opengraph.xyz/)
- [ ] Probado en móvil (DevTools responsive)

---

## 4. Archivos a tocar (resumen)

| Fichero | Cambio |
|---|---|
| `_config.yml` | Añadir `jekyll-redirect-from`, `social_preview_image`, `webmaster_verifications` |
| `_includes/head.html` | preconnect, theme-color, favicons, JSON-LD include, hreflang |
| `_includes/structured-data.html` | **Nuevo** — JSON-LD condicional por page type |
| `_includes/nav.html` | Enlaces a Categories/Tags/Archives |
| `_layouts/post.html` | Hero image eager, related posts, breadcrumbs |
| `_layouts/home.html` | Hero image eager + `fetchpriority="high"` |
| `_tabs/categories.html` | **Nuevo** |
| `_tabs/tags.html` | **Nuevo** |
| `_tabs/archives.html` | **Nuevo** |
| `_posts/*.md` | Normalizar frontmatter + renombrar 2 ficheros |
| `assets/img/og-default.png` | **Nuevo** — 1200×630 |
| `assets/manifest.webmanifest` | **Nuevo** |
| `.github/workflows/lighthouse.yml` | **Nuevo** — Lighthouse CI |
| `404.html` | Añadir últimos 3 posts + search |

---

## 5. Prioridades sugeridas para próxima sesión

Orden recomendado si quieres que implemente por fases:

1. **Fase 1 completa** (quick wins) — mayor ROI, ~1 commit.
2. **Fase 2 #6 (JSON-LD) + #7 (tabs faltantes)** — impacto directo en rich results.
3. **Fase 3 #9 (pillar pages) + #10 (related posts)** — aumenta pageviews/sesión.
4. Resto en cadencia continua.

Avísame con qué fase empezamos y lo ejecuto.

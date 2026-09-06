# website

Konstantin Unruh's personal site: notes on physics, Linux and more.
Built with [Quarto](https://quarto.org/) and published to GitHub Pages.


## Layout

```
.
├── _quarto.yml          # Site config: nav, footer, formats, theme layering
├── _brand.yml           # Colours (light + dark) and fonts, applied everywhere
├── styles/site.scss     # Custom styling on top of Bootstrap + brand
├── index.qmd            # Homepage (custom layout, hero, latest articles)
├── _templates/          # EJS template for the homepage article list
├── assets/              # Starfield script, favicon
├── _includes/           # analytics.html (Umami snippet)
├── docs/
│   ├── physics/         # index.qmd is an auto-generated listing
│   └── linux/
└── .github/workflows/   # Render + deploy on push to `source`
```

## Writing an article

Create `docs/<section>/<slug>.qmd` and put images in `docs/<section>/<slug>-img/`:

```yaml
---
title: "Article title"
date: 2026-09-06
description: "One sentence shown in listings and link previews."
categories: ["Physics"]          # section tag shown on the homepage
image: my-article-img/feature.jpg  # optional, shown on the section page
format:
  html: default
  pdf: default                    # adds an "Other Formats: PDF" link
---
```

Section pages and the homepage pick the article up automatically.
Python code cells run at render time and are cached under `_freeze/`.

## Local preview

```bash
nix develop          # or install quarto + uv yourself
uv sync
quarto preview
```

`quarto render --to html` skips the PDF builds if you have no LaTeX installed.

Note: the `quarto` package in nixpkgs currently ships a pandoc that is too old
for Quarto 1.10 ("Unknown option syntax-highlighting"). If `nix develop`
fails that way, use the official tarball from the Quarto releases page instead.

## Deployment

Pushing to `source` runs `.github/workflows/gh-pages.yml`, which installs
Quarto with TinyTeX, renders the site, and publishes `_site/` to the
`gh-pages` branch.

The custom domain is not stored in this repository. It lives in the
`SITE_DOMAIN` Actions variable (repo Settings, Secrets and variables, Actions).
CI patches `site-url` and writes the `CNAME` file from it at build time.

## Analytics

The site is prepared for [Umami Cloud](https://cloud.umami.is) (open source,
cookie-free). Create a website there, copy its ID into
`_includes/analytics.html`, and uncomment the script tag. Until then nothing
is loaded.

## License

See [LICENSE](LICENSE).

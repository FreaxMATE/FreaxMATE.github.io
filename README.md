# website

Konstantin Unruh's notes on physics, Linux and more. Plain HTML built with
pandoc and a Makefile; every article is also available as a PDF.

## How it works

```
.
├── Makefile               # the build: articles → HTML + PDF, then index + feed
├── style.css              # the whole design, ~70 lines, no JavaScript
├── index.md               # homepage intro; the article list is generated
├── templates/
│   ├── page.html          # HTML skeleton (header, nav, footer)
│   ├── preamble.tex       # extra LaTeX preamble for the PDFs (callout boxes)
│   └── analytics.html     # Umami snippet; domain injected by CI
├── scripts/
│   ├── index.py           # homepage list + feed.xml from front matter
│   ├── katex-prerender.js # pandoc filter: equations → HTML at build time
│   └── callouts.lua       # pandoc filter: callout divs → LaTeX boxes
├── katex/                 # KaTeX CSS + fonts, self-hosted
├── physics/<slug>/index.md, img/
├── linux/<slug>/index.md, img/
└── .github/workflows/pages.yml
```

Visitors' browsers load only this site's own files plus the Umami script.
Equations are rendered by KaTeX during the build, so no math library ships.

## Writing an article

Create `<section>/<slug>/index.md` (any top-level folder works; the homepage
lists everything by date) and put images in `<section>/<slug>/img/`:

```markdown
---
title: "Article title"
date: 2026-09-07
description: "One sentence shown on the homepage and in the feed."
---

Text with $inline$ and $$display$$ math, images as ![Caption](img/figure.png),
and callouts as fenced divs:

::: {.callout-note title="Heads up"}
Rendered as a box in HTML and in the PDF.
:::
```

Add `draft: true` to keep an article out of the homepage and feed.

A LaTeX source is also possible: pandoc reads `.tex` (`pandoc -f latex`),
so a `<slug>/index.tex` can be wired in with a second Makefile rule.

## Building locally

```bash
nix develop          # pandoc, make, node, python3, TeX Live
make html            # HTML only, fast
make                 # HTML + PDFs
make serve           # http://localhost:8000
```

## Deployment

Pushing to `source` runs `.github/workflows/pages.yml`: installs pandoc and
TeX Live, runs `make`, publishes `_site/` to the `gh-pages` branch as a single
commit. The custom domain is not stored in this repository; it lives in the
`SITE_DOMAIN` Actions variable and is injected into the feed URLs, the
analytics snippet and the `CNAME` file at build time.

## License

See [LICENSE](LICENSE).

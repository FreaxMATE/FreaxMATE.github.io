# FreaxMATE.github.io

A modern technical documentation and blog site built with [Quarto](https://quarto.org/).

## Features

- 📝 **Technical Documentation**: Write articles on Linux, Physics, and technical topics
- 🧮 **Scientific Computing**: Embedded Jupyter notebooks and executable Python code
- 📊 **Interactive Visualizations**: Create dynamic dashboards and plots
- 🎨 **Beautiful Styling**: Professional HTML output with customizable themes
- 🚀 **Easy Deployment**: Automated GitHub Pages deployment with Actions

## Getting Started

### Prerequisites

- [Quarto](https://quarto.org/docs/getting-started/installation.html)
- Python 3.9+ (for executing code cells)
- Git

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/FreaxMATE/FreaxMATE.github.io.git
cd FreaxMATE.github.io
```

2. Install dependencies (optional, for Nix users):
```bash
nix flake update
nix develop  # Activates the development environment
```

3. Preview the site locally:
```bash
quarto preview
```

This will render the site and open it in your browser. Changes are automatically reloaded.

4. Render the full site:
```bash
quarto render
```

The output will be in the `_site/` directory.

## Project Structure

```
.
├── _quarto.yml           # Quarto project configuration
├── index.qmd            # Home page
├── docs/
│   ├── linux/           # Linux articles
│   ├── physics/         # Physics articles
│   └── quarto-features/ # Quarto feature demonstrations
├── .github/workflows/   # GitHub Actions workflows
└── _site/              # Build output (generated)
```

## Writing Content

### Creating a New Article

Create a `.qmd` file in the appropriate directory:

```
---
title: "Article Title"
date: 2024-02-11
description: "Brief description"
tags: ["tag1", "tag2"]
---

Your content here with **markdown**, code blocks, and equations.
```

### Including Code Execution

Code blocks can be executed during rendering:

```{python}
import numpy as np
print("Hello from Quarto!")
```

### Mathematical Equations

Use LaTeX for inline ($x^2 + y^2 = z^2$) or display math:

$$\int_0^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$

## Deployment

This site is automatically deployed to GitHub Pages when you push to the `source` branch:

1. Changes are pushed to the `source` branch
2. GitHub Actions runs the workflow in `.github/workflows/gh-pages.yml`
3. Quarto renders the content to `_site/`
4. The output is deployed to the `gh-pages` branch (served at the domain)

View the live site at: [https://freaxmate.github.io](https://freaxmate.github.io)

## Learn More

- [Quarto Official Documentation](https://quarto.org/docs)
- [Quarto Guides](https://quarto.org/docs/guide/)
- [Quarto Community](https://quarto.org/docs/community/)

## License

See LICENSE file for details.

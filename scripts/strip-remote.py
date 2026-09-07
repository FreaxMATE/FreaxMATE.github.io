#!/usr/bin/env python3
"""Quarto post-render step: remove the CDN polyfill script that Quarto adds
next to MathJax, so rendered pages make no third-party requests."""
import os, re, sys
from pathlib import Path

site = Path(os.environ.get("QUARTO_PROJECT_OUTPUT_DIR", "_site"))
pat = re.compile(r'\s*<script src="https://cdnjs\.cloudflare\.com/polyfill/[^"]*"></script>')
n = 0
for html in site.rglob("*.html"):
    text = html.read_text(encoding="utf-8")
    new = pat.sub("", text)
    if new != text:
        html.write_text(new, encoding="utf-8"); n += 1
print(f"strip-remote: cleaned {n} files", file=sys.stderr)

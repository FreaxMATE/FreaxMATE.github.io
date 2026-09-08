#!/usr/bin/env python3
"""Build the homepage (index.md + list of all articles, newest first, grouped
by year) and the RSS feed from the articles' front matter."""
import os, re, subprocess, sys
from datetime import datetime, timezone
from email.utils import format_datetime
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "_site"
SITE_URL = os.environ.get("SITE_URL", "http://localhost:8000").rstrip("/")
PANDOC = os.environ.get("PANDOC", "pandoc")
AUTHOR = "Konstantin Unruh"


def front_matter(path):
    """Tiny YAML-subset reader: `key: value` lines between the --- fences."""
    text = path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    meta = {}
    if m:
        for line in m.group(1).splitlines():
            k, sep, v = line.partition(":")
            if sep and not line.startswith(" "):
                meta[k.strip()] = v.strip().strip('"').strip("'")
    return meta


def articles():
    items = []
    for md in sorted(ROOT.glob("*/*/index.md")):
        meta = front_matter(md)
        if "title" not in meta or "date" not in meta:
            print(f"index.py: skipping {md} (needs title and date)", file=sys.stderr)
            continue
        if meta.get("draft", "").lower() in ("true", "yes"):
            continue
        rel = md.parent.relative_to(ROOT).as_posix() + "/"
        items.append({
            "title": meta["title"],
            "date": datetime.strptime(meta["date"][:10], "%Y-%m-%d").replace(tzinfo=timezone.utc),
            "description": meta.get("description", ""),
            "url": rel,
        })
    return sorted(items, key=lambda a: a["date"], reverse=True)


def homepage(items):
    intro = (ROOT / "index.md").read_text(encoding="utf-8")
    parts = [intro.rstrip(), ""]
    year = None
    for a in items:
        if a["date"].year != year:
            if year is not None:
                parts.append("</ul>\n")
            year = a["date"].year
            parts.append(f'<p class="year">{year}</p>\n<ul class="posts">')
        desc = f"<small>{escape(a['description'])}</small>" if a["description"] else ""
        parts.append(f'<li><time datetime="{a["date"]:%Y-%m-%d}">{a["date"]:%Y-%m-%d}</time>'
                     f'<span><a href="/{a["url"]}">{escape(a["title"])}</a>{desc}</span></li>')
    if year is not None:
        parts.append("</ul>")
    md = "\n".join(parts) + "\n"
    OUT.mkdir(exist_ok=True)
    subprocess.run([PANDOC, "-f", "markdown", "-t", "html5", "--standalone",
                    "--template", str(ROOT / "templates/page.html"),
                    "-M", "lang=en", "-M", f"pagetitle={AUTHOR}",
                    "-M", "description=Notes on physics, Linux and more.",
                    "-H", str(ROOT / "templates/analytics.html"),
                    "-o", str(OUT / "index.html")],
                   input=md, text=True, check=True)


def feed(items):
    now = format_datetime(datetime.now(timezone.utc))
    entries = []
    for a in items:
        link = f"{SITE_URL}/{a['url']}"
        entries.append(
            f"  <item>\n    <title>{escape(a['title'])}</title>\n    <link>{link}</link>\n"
            f"    <guid>{link}</guid>\n    <pubDate>{format_datetime(a['date'])}</pubDate>\n"
            f"    <description>{escape(a['description'])}</description>\n  </item>")
    xml = (f'<?xml version="1.0" encoding="UTF-8"?>\n'
           f'<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n'
           f'  <title>{AUTHOR}</title>\n  <link>{SITE_URL}/</link>\n'
           f'  <description>Notes on physics, Linux and more.</description>\n'
           f'  <language>en</language>\n  <lastBuildDate>{now}</lastBuildDate>\n'
           f'  <atom:link href="{SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>\n'
           + "\n".join(entries) + "\n</channel>\n</rss>\n")
    (OUT / "feed.xml").write_text(xml, encoding="utf-8")


if __name__ == "__main__":
    items = articles()
    homepage(items)
    feed(items)
    print(f"index.py: {len(items)} articles → index.html, feed.xml", file=sys.stderr)

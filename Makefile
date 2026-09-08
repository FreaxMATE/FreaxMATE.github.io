# Build the whole site: every */*/index.md becomes HTML and PDF, then the
# homepage and the RSS feed are generated. Needs pandoc, node (for KaTeX),
# lualatex (for PDFs) and python3.

SITE_URL ?= http://localhost:8000
PANDOC   ?= pandoc
OUT      := _site

ARTICLES := $(wildcard */*/index.md)
HTML     := $(patsubst %/index.md,$(OUT)/%/index.html,$(ARTICLES))
PDF      := $(patsubst %/index.md,$(OUT)/%/index.pdf,$(ARTICLES))

HTML_OPTS := -f markdown -t html5 --standalone --template templates/page.html \
             -M lang=en -H templates/analytics.html \
             --lua-filter scripts/callouts.lua --filter scripts/katex-prerender.js
PDF_OPTS  := -f markdown --pdf-engine=lualatex -H templates/preamble.tex \
             --lua-filter scripts/callouts.lua --lua-filter scripts/images.lua \
             -V geometry:margin=2.6cm \
             -V colorlinks=true -V linkcolor=black -V urlcolor=blue!60!black \
             -M author="Konstantin Unruh"

.PHONY: all html pdf serve clean

all: html pdf
html: $(HTML) $(OUT)/index.html $(OUT)/feed.xml $(OUT)/style.css $(OUT)/favicon.svg $(OUT)/katex/katex.min.css
pdf: $(PDF)

# Article → HTML (+ its img/ folder)
$(OUT)/%/index.html: %/index.md templates/page.html templates/analytics.html scripts/callouts.lua scripts/katex-prerender.js
	@mkdir -p $(dir $@)
	$(PANDOC) $< $(HTML_OPTS) -M pdf=index.pdf --resource-path $(dir $<) -o $@
	@if [ -d $(dir $<)img ]; then rm -rf $(dir $@)img && cp -r $(dir $<)img $(dir $@)img; fi

# Article → PDF
$(OUT)/%/index.pdf: %/index.md templates/preamble.tex scripts/callouts.lua scripts/images.lua
	@mkdir -p $(dir $@)
	timeout 600 $(PANDOC) $< $(PDF_OPTS) --resource-path $(dir $<) -o $@

# Homepage and feed from the articles' front matter
$(OUT)/index.html $(OUT)/feed.xml &: scripts/index.py index.md templates/page.html $(ARTICLES)
	@mkdir -p $(OUT)
	SITE_URL=$(SITE_URL) PANDOC=$(PANDOC) python3 scripts/index.py

$(OUT)/style.css: style.css
	@mkdir -p $(OUT) && cp $< $@

$(OUT)/favicon.svg: favicon.svg
	@mkdir -p $(OUT) && cp $< $@

$(OUT)/katex/katex.min.css: katex/katex.min.css $(wildcard katex/fonts/*.woff2)
	@mkdir -p $(OUT)/katex && cp -r katex/. $(OUT)/katex/

serve: html
	python3 -m http.server -d $(OUT) 8000

clean:
	rm -rf $(OUT)

#!/usr/bin/env node
// pandoc JSON filter: render every equation with KaTeX at build time, so the
// browser receives plain HTML (plus hidden MathML for screen readers) and no script.
// Used as:  pandoc ... --filter scripts/katex-prerender.js
const path = require("path");
const katex = require(path.join(__dirname, "..", "katex", "katex.min.js"));

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", chunk => (input += chunk));
process.stdin.on("end", () => {
  const doc = JSON.parse(input);
  const walk = node => {
    if (Array.isArray(node)) return node.map(walk);
    if (node && typeof node === "object") {
      if (node.t === "Math") {
        const display = node.c[0].t === "DisplayMath";
        const html = katex.renderToString(node.c[1], {
          displayMode: display,
          output: "htmlAndMathml",
          throwOnError: false,
          strict: "ignore",
        });
        return { t: "RawInline", c: ["html", html] };
      }
      for (const key of Object.keys(node)) node[key] = walk(node[key]);
    }
    return node;
  };
  doc.blocks = walk(doc.blocks);
  process.stdout.write(JSON.stringify(doc));
});

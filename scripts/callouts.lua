-- Callout boxes. In Markdown they are fenced divs:
--   ::: {.callout-note title="Heads up"}
--   ...
--   :::
-- HTML keeps the div (styled in style.css). LaTeX wraps the content in the
-- `callout` environment defined in templates/preamble.tex.
function Div(el)
  local cls = el.classes[1]
  if not cls or not cls:match("^callout") then return nil end
  if not FORMAT:match("latex") then return nil end
  local title = el.attributes["title"] or ""
  title = title:gsub("([%%&#_{}$])", "\\%1")
  local out = pandoc.List({ pandoc.RawBlock("latex", "\\begin{callout}{" .. title .. "}") })
  out:extend(el.content)
  out:insert(pandoc.RawBlock("latex", "\\end{callout}"))
  return out
end

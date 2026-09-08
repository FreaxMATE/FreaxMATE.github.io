-- LaTeX cannot embed animated GIFs. For PDF output, use the still .png frame
-- that sits next to every .gif (generated once, committed alongside).
function Image(el)
  if FORMAT:match("latex") and el.src:match("%.gif$") then
    el.src = el.src:gsub("%.gif$", ".png")
  end
  return el
end

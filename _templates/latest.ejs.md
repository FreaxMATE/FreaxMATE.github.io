```{=html}
<ul class="fm-articles">
<% for (const item of items) { %>
  <li <%= metadataAttrs(item) %>>
    <a href="<%- item.path %>">
      <time class="fm-date"><%= item.date %></time>
      <span class="fm-title"><%= item.title %><% if (item.description) { %><small><%= item.description %></small><% } %></span>
      <span class="fm-tag"><%= (item.categories && item.categories.length) ? item.categories[0] : '' %></span>
    </a>
  </li>
<% } %>
</ul>
```

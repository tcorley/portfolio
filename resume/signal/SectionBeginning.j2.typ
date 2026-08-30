#block(above: 14pt, below: 7pt, breakable: false)[
  #grid(
    columns: (7pt, auto, 1fr),
    column-gutter: 8pt,
    align: horizon,
    [#box(width: 7pt, height: 7pt, fill: rgb("#D64E37"), radius: 1.5pt)],
    [#text(font: "Open Sauce Sans", size: 10.5pt, weight: "bold", fill: rgb("#172A3A"), tracking: 0.7pt)[#upper[{{ section_title }}]]],
    [#line(length: 100%, stroke: 0.65pt + rgb("#C9D1D2"))],
  )
]
{% if entry_type in ["ReversedNumberedEntry"] %}

#reversed-numbered-entries(
  [
{% endif %}

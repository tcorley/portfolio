{% set entry_text = entry.main_column %}
{% if entry_text.startswith("#strong[") and "]" in entry_text %}
{% set label_end = entry_text.find("]") %}
{% set label = entry_text[8:label_end] %}
{% set details = entry_text[label_end + 1:]|strip %}
#block(
  below: 1pt,
  inset: (top: 2.5pt, bottom: 2.5pt),
  stroke: (bottom: 0.45pt + rgb("#D7DEDD")),
)[
  #grid(
    columns: (1.9in, 1fr),
    column-gutter: 10pt,
    [#text(font: "Open Sauce Sans", size: 8.5pt, weight: "semibold", fill: rgb("#172A3A"))[{{ label }}]],
    [
      #show "Test-Driven Development": it => box(it)
      {{ details }}
    ],
  )
]
{% else %}
#block(below: 3pt)[{{ entry.main_column }}]
{% endif %}

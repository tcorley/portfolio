{% if cv.name %}
{% set name_parts = cv.name.split(" ") %}
#block(below: 12pt)[
  #grid(
    columns: (5pt, 1fr),
    column-gutter: 12pt,
    align: horizon,
    [#box(width: 5pt, height: 38pt, fill: rgb("#D64E37"), radius: 2pt)],
    [
      #text(font: "EB Garamond", size: 38pt, weight: "bold", fill: rgb("#172A3A"))[
        {{ name_parts[:-1]|join(" ") }} #text(fill: rgb("#D64E37"))[{{ name_parts[-1] }}]
      ]
    ],
  )

  #v(9pt)
  #block(fill: rgb("#172A3A"), radius: 3pt, inset: (x: 10pt, y: 6pt))[
    #text(font: "Open Sauce Sans", size: 8.6pt, fill: white)[
      #grid(
        columns: (1fr, 1fr, 1fr),
        column-gutter: 10pt,
{% for connection in cv._connections %}
        [#align({% if loop.index == 1 %}left{% elif loop.last %}right{% else %}center{% endif %})[{{ connection }}]],
{% endfor %}
      )
    ]
  ]
]
{% endif %}

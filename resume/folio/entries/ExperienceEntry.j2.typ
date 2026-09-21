{% if not design.entries.short_second_row %}
{% set first_row_lines = entry.date_and_location_column.splitlines()|length %}
{% if first_row_lines == 0 %} {% set first_row_lines = 1 %} {% endif %}
{% else %}
{% set first_row_lines = entry.main_column.splitlines()|length %}
{% endif %}
{% set date_text = entry.date_and_location_column|strip %}
{% set main_lines = entry.main_column.splitlines() %}
{% set first_row_lines_content = main_lines[:first_row_lines] %}
#regular-entry(
  [
{% for line in first_row_lines_content %}
{% if line.startswith("#summary[") %}
{% set summary_content = line[9:-1] %}
    #block(
      breakable: false,
      fill: rgb("#F4E7E2"),
      radius: 2pt,
      inset: (x: 7pt, y: 3.5pt),
    )[
      #text(font: "Open Sauce Sans", size: 8.4pt, weight: "semibold", fill: rgb("#A94432"), tracking: 0.2pt)[{{ summary_content }}]
    ]
{% else %}
    #text(font: "Open Sauce Sans", size: 9.7pt, weight: "semibold", fill: rgb("#172A3A"))[{{ line|indent(4) }}]
{% endif %}

{% endfor %}
  ],
  [
{% if date_text %}
    #box(fill: rgb("#E7EDEC"), radius: 2pt, inset: (x: 4.5pt, y: 2.4pt))[
      #text(font: "Open Sauce Sans", size: 8pt, weight: "semibold", fill: rgb("#405B63"))[{{ date_text }}]
    ]
{% endif %}
  ],
{% if not design.entries.short_second_row %}
  main-column-second-row: [
{% set detail_lines = main_lines[first_row_lines:] %}
{% if detail_lines and detail_lines[0].startswith("#summary[") %}
{% set summary_content = detail_lines[0][9:-1] %}
    #block(
      breakable: false,
      below: 4pt,
      fill: rgb("#F4E7E2"),
      radius: 2pt,
      inset: (x: 7pt, y: 3.5pt),
    )[
      #text(font: "Open Sauce Sans", size: 8.4pt, weight: "semibold", fill: rgb("#A94432"), tracking: 0.2pt)[{{ summary_content }}]
    ]
{% set detail_lines = detail_lines[1:] %}
{% endif %}
{% if detail_lines %}
    #block(
      breakable: true,
      inset: (left: 8pt),
      stroke: (left: 0.8pt + rgb("#D99B8F")),
    )[
      #show "three generations": set text(weight: "semibold")
      #show "CLS ~96% good and INP ~98% good": set text(weight: "semibold")
      #show "~16%": set text(weight: "semibold")
      #show "~44%": set text(weight: "semibold")
      #show "top-K=50": set text(weight: "semibold")
      #show "~60%": set text(weight: "semibold")
      #show "multi-million annual savings": set text(weight: "semibold")
{% for line in detail_lines %}
      {{ line|indent(6) }}

{% endfor %}
    ]
{% endif %}
  ],
{% endif %}
)

{% if not design.entries.short_second_row %}
{% set first_row_lines = entry.date_and_location_column.splitlines()|length %}
{% if first_row_lines == 0 %} {% set first_row_lines = 1 %} {% endif %}
{% else %}
{% set first_row_lines = entry.main_column.splitlines()|length %}
{% endif %}
{% set date_text = entry.date_and_location_column|strip %}
#education-entry(
  [
{% for line in entry.main_column.splitlines()[:first_row_lines] %}
    #text(font: "Open Sauce Sans", size: 9.6pt, weight: "semibold", fill: rgb("#172A3A"))[{{ line|indent(4) }}]

{% endfor %}
  ],
  [
{% if date_text %}
    #box(fill: rgb("#E7EDEC"), radius: 2pt, inset: (x: 4pt, y: 2pt))[
      #text(font: "Open Sauce Sans", size: 7.3pt, weight: "bold", fill: rgb("#405B63"))[{{ date_text }}]
    ]
{% endif %}
  ],
{% if not design.entries.short_second_row %}
  main-column-second-row: [
{% for line in entry.main_column.splitlines()[first_row_lines:] %}
    #text(fill: rgb("#4E5D61"))[{{ line|indent(4) }}]

{% endfor %}
  ],
{% endif %}
)

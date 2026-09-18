---
name: resume-tailor
description: Tailor this resume to a specific job description while preserving factual accuracy and the public master resume. Use for targeted resume versions and application-specific summaries.
---

# Resume tailoring

Use `resume/resume.yaml` as the canonical, public source. Active bullets are
the single-page site default; commented bullets are reusable material for
tailoring. Create tailored versions only under `resume/local-applications/`
or a separate private repository (copy the YAML, uncomment/swap bullets as
needed); do not add employer-specific material to the public master without
the user's explicit request, and do not commit a VARIANT tagging system.

## Accuracy

- Select, reorder, condense, and clarify existing evidence.
- Do not invent titles, dates, metrics, tools, responsibilities, outcomes, or
  credentials. Ask when a useful claim cannot be supported by the source.
- Preserve the user's voice. Match job-language only when it truthfully
  describes their demonstrated work.

## Workflow

1. Read the canonical resume and the supplied job description.
2. Identify the target role's concrete priorities and map them to evidence in
   the canonical source.
3. Create a targeted copy, adjust only the summary, ordering, and relevant
   wording, then render it.
4. Report the substantive changes and flag missing evidence rather than
   silently filling gaps.

## Visual review

Render the tailored source with RenderCV. Inspect its generated page-preview
PNGs and ensure the result remains readable, well-spaced, and ideally one
page unless the user's background genuinely requires more.

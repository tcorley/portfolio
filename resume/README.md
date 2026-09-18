# Resume source

This directory holds the public, canonical resume source. The portfolio site
links to the rendered **default** PDF at `/resume.pdf`
(https://rolan.dev/resume.pdf). That file is produced during the Cloudflare
deploy workflow by running `make -C resume render` (variant `default`) and
copying `resume/build/resume.pdf` into `public/resume.pdf` before the app
build. The separate `resume-preview` workflow still uploads PDF/PNG artifacts
for PR review (and can build a chosen variant via `workflow_dispatch`).

## Variants

Highlights in `resume.yaml` can be tagged:

```yaml
highlights:
  - text: "Shipped a cognitive Job Title filter..."
    variants: [frontend, platform]
  - text: "Led three generations of a workflow authoring UI..."
    variants: [default, frontend, leadership]
```

| Variant | Intent |
| --- | --- |
| `default` | Site / public PDF (single page) |
| `frontend` | UI, performance, web-platform emphasis |
| `platform` | Infra, reliability, platformization |
| `leadership` | Specs, enablement, org impact |
| `full` | Every bullet (may exceed one page) |

Plain string highlights (no `variants` field) are included in every named
variant. `full` includes everything.

## Render locally

From the repository root:

```sh
make -C resume install
make -C resume render                 # default (site) variant
make -C resume render VARIANT=frontend
```

The Makefile filters `resume.yaml` → `resume.selected.yaml` (gitignored), then
runs RenderCV. PDF and page-preview PNGs land in `resume/build/`.

Watch mode:

```sh
make -C resume preview VARIANT=default
```

## First import / editing

Keep every claim defensible. Prefer retagging `variants` over deleting bullets
so alternate single-page builds stay available. After edits, confirm the
default build is still one page (`resume/build/*_CV_1.png` only).

## Tailored applications stay private

The public canonical file is a baseline, not a record of every application.
For a role-specific version, copy it to an ignored local directory such as
`resume/local-applications/company-role/`, adjust tags or copy, then render
with a chosen `VARIANT`. Keep job descriptions, contacts, submission dates,
notes, and submitted PDFs there or in a private repository.

The portable guardrails for that workflow are in
[`../skills/resume-tailor/SKILL.md`](../skills/resume-tailor/SKILL.md).

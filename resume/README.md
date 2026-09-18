# Resume source

This directory holds the public, canonical resume source. The portfolio site
links to the rendered PDF at `/resume.pdf` (https://rolan.dev/resume.pdf).
That file is produced during the Cloudflare deploy workflow by running
`make -C resume render` and copying `resume/build/resume.pdf` into
`public/resume.pdf` before the app build. The separate
`resume-preview` workflow still uploads PDF/PNG artifacts for PR review only.

## Render locally

From the repository root:

```sh
make -C resume install
make -C resume render
```

The resulting PDF and page-preview PNGs are written to `resume/build/`, which
is intentionally ignored by Git. To rebuild automatically while editing, run:

```sh
make -C resume preview
```

The Makefile creates an isolated `resume/.venv/` and uses the pinned RenderCV
version from `requirements.txt`.

## First import

`resume.yaml` deliberately contains only placeholders. Replace them with the
facts from the current resume, preserving the existing structure only where it
fits. Do not add a statement that cannot be supported by the source material.

## Tailored applications stay private

The public canonical file is a baseline, not a record of every application.
For a role-specific version, copy it to an ignored local directory such as
`resume/local-applications/company-role/`. Keep job descriptions, contacts,
submission dates, notes, and submitted PDFs there or in a private repository.

The portable guardrails for that workflow are in
[`../skills/resume-tailor/SKILL.md`](../skills/resume-tailor/SKILL.md). Copy or
link that directory into a Codex skills directory when you want those rules to
be applied automatically.

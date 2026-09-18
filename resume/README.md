# Resume source

This directory holds the public, canonical resume source. The portfolio site
links to the rendered PDF at `/resume.pdf` (https://rolan.dev/resume.pdf).
That file is produced during the Cloudflare deploy workflow by running
`make -C resume render` and copying `resume/build/resume.pdf` into
`public/resume.pdf` before the app build. The separate `resume-preview`
workflow still uploads PDF/PNG artifacts for PR review only.

The committed YAML is the single-page **site default**. Extra bullets are
kept nearby as YAML comments so humans or agents can uncomment or copy them
when building a private, job-specific resume. Do not commit application-
specific variants or reintroduce a VARIANT build matrix.

## Render locally

From the repository root:

```sh
make -C resume install
make -C resume render
```

PDF and page-preview PNGs land in `resume/build/` (gitignored). Watch mode:

```sh
make -C resume preview
```

After edits, confirm the default build is still one page
(`resume/build/*_CV_1.png` only).

## Tailored applications stay private

For a role-specific version, copy `resume.yaml` to an ignored directory such
as `resume/local-applications/company-role/`, uncomment or swap bullets from
the commented pool, then render that copy. Keep job descriptions, contacts,
submission dates, notes, and submitted PDFs there or in a private repository.

The portable guardrails for that workflow are in
[`../skills/resume-tailor/SKILL.md`](../skills/resume-tailor/SKILL.md).

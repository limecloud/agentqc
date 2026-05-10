# Release Notes

## v0.1.0

Agent QC v0.1.0 is the first Lime-focused draft standard for evidence-driven testing plans, quality gates, qcloop batches, verdicts, and release-ready reports.

### Highlights

- Defines the core Agent QC objects: `qc_plan`, `qc_case`, `qc_gate`, `qc_run`, `qc_verdict`, `qc_evidence`, and `qc_report`.
- Establishes Lime's evidence-driven testing stance: a pass verdict requires inspectable evidence, not agent self-reporting.
- Adds the Lime gate matrix for `verify:local`, `test:contracts`, `verify:gui-smoke`, Playwright product flows, qcloop batches, and manual or LLM judge review.
- Documents qcloop integration, including JSON item shape, worker prompt requirements, verifier prompt requirements, and status mapping for `success`, `failed`, and `exhausted`.
- Adds bilingual English and Simplified Chinese documentation with VitePress navigation, version pages, and LLM-friendly entrypoints.
- Adds public JSON schemas and examples for QC plans, QC cases, QC verdicts, and qcloop job requests.
- Adds GitHub Pages deployment through GitHub Actions.

### Public docs

After the Pages workflow completes, the documentation site is expected at:

- https://limecloud.github.io/agentqc/
- https://limecloud.github.io/agentqc/llms.txt
- https://limecloud.github.io/agentqc/llms-full.txt

### Validation

Local validation performed before release:

- `npm run check:schemas`
- `npm run build`
- `npm audit --omit=dev`
- `npm audit --audit-level=high`

`npm audit --audit-level=high` passes with no high or critical vulnerabilities. npm still reports a dev-only moderate advisory in the VitePress/Vite/esbuild chain with no current fix available.

### Scope

This release is intentionally scoped to Lime. It does not claim to be a generic industry testing standard yet. qcloop remains the execution loop; Agent QC defines the testing standard, evidence requirements, and reporting contract.

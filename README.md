# Agent QC

Agent QC is a Lime-focused draft standard for evidence-driven testing plans, quality gates, qcloop batches, verdicts, and review reports.

Lime is a GUI desktop product. For Lime, "tests passed" is not enough unless the result proves the relevant product path: local checks, command contracts, bridge readiness, GUI smoke, Playwright interaction, qcloop batch results, and human or LLM judge evidence all need a shared language.

Agent QC defines that language.

## Core boundary

| System | Owns | Agent QC owns |
| --- | --- | --- |
| Lime source repo | Product code, scripts, runtime commands, GUI, docs, and mocks. | Which Lime gates are required for a change type. |
| qcloop | Batch execution, worker/verifier/repair loop, SQLite state, attempts, and qc rounds. | How tests are planned, itemized, judged, and reported. |
| Agent Evidence | Durable traces, provenance, review, replay, and export facts. | Evidence references required by QC verdicts. |
| Agent UI | How testing tasks and evidence are projected to users. | Behavior-level acceptance scenarios and honest pass/fail semantics. |
| Human reviewers | Final product judgment when needed. | How manual review decisions become explicit verdict evidence. |

## What v0.1.0 defines

- `qc_plan`: a Lime test plan with change type, risk, required gates, cases, and evidence policy.
- `qc_case`: one testable item that can map to a qcloop item.
- `qc_gate`: a required validation boundary such as `verify:local`, `test:contracts`, or `verify:gui-smoke`.
- `qc_run`: one execution record with command, executor, environment, and output references.
- `qc_verdict`: pass/fail judgment backed by evidence refs, not agent prose.
- `qc_evidence`: references to command logs, GUI smoke output, Playwright traces, qcloop attempts, screenshots, reports, or review notes.
- `qc_report`: final aggregate result with remaining risk and next-action guidance.

## Lime testing stance

Agent QC uses evidence-driven gates:

1. Pick the Lime change type first.
2. Select the minimum required gates from the Lime gate matrix.
3. Write behavior-level `qc_case` items.
4. Execute small deterministic gates directly and batch repetitive cases through qcloop.
5. Let an independent verifier judge evidence using strict JSON.
6. Report pass/fail/exhausted with evidence refs and remaining risk.

A qcloop batch finishing is not automatically a product pass. A Lime change is deliverable only when the required gates for its risk class have evidence-backed verdicts.

## Documentation

- [Specification](docs/en/specification.md)
- [Lime gate matrix](docs/en/authoring/lime-gate-matrix.md)
- [qcloop integration](docs/en/authoring/qcloop-integration.md)
- [Evidence-driven verdicts](docs/en/authoring/evidence-driven-verdicts.md)
- [Acceptance scenarios](docs/en/authoring/acceptance-scenarios.md)
- [中文规范](docs/zh/specification.md)

## LLM entrypoints

- [`llms.txt`](llms.txt): concise navigation index for AI clients.
- [`llms-full.txt`](llms-full.txt): concatenated current English documentation for model context.
- [`llm.txt`](llm.txt) and [`llm-full.txt`](llm-full.txt): compatibility aliases.

## Local development

```bash
npm install
npm run dev
```

## Build and validation

```bash
npm run check:schemas
npm run build
```

The static site is generated at `docs/.vitepress/dist`.

## Related local sources

- Lime engineering rules: `/Users/coso/Documents/dev/ai/aiclientproxy/lime/docs/aiprompts/quality-workflow.md`
- Lime GUI E2E rules: `/Users/coso/Documents/dev/ai/aiclientproxy/lime/docs/aiprompts/playwright-e2e.md`
- qcloop reference: `/Users/coso/Documents/dev/ai/limecloud/qcloop/llms-full.txt`

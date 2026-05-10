---
title: Specification
description: Agent QC v0.1.0 draft specification for Lime.
---

# Specification

Agent QC v0.1.0 is a Lime-focused draft standard for evidence-driven testing plans, gates, qcloop batches, verdicts, and reports.

It standardizes the quality-control facts an agent should create when testing Lime. It does not own Lime code, qcloop execution, evidence storage, UI projection, or human review policy.

## Scope

Agent QC standardizes:

1. A test plan format for Lime changes.
2. Behavior-level test cases that can run directly or through qcloop.
3. A gate matrix for Lime change types.
4. Evidence-backed verdicts.
5. Final reports that separate passed, failed, exhausted, skipped, and blocked states.

Agent QC does not standardize model prompts, CLI execution internals, browser automation APIs, storage engines, or visual presentation.

## Core objects

| Object | Purpose |
| --- | --- |
| `qc_plan` | A test plan for one Lime change, route, or release risk. |
| `qc_case` | One behavior-level item with steps, expected result, risk, and required evidence. |
| `qc_gate` | A validation boundary such as `verify:local`, `test:contracts`, `verify:gui-smoke`, Playwright, qcloop, or manual review. |
| `qc_run` | One execution attempt, including executor, command, environment, result, and output refs. |
| `qc_verdict` | A pass/fail/blocked/exhausted judgment backed by evidence refs. |
| `qc_evidence` | A durable or inspectable reference to logs, screenshots, traces, qcloop attempts, qc rounds, reports, or review notes. |
| `qc_report` | The aggregate result for a plan, including remaining risk and next action. |

## Change types

Standard Lime `change_type` values:

- `frontend`
- `user-visible-ui`
- `gui-shell-workspace`
- `tauri-command-bridge-mock`
- `rust-module`
- `config-version-dependency`
- `documentation-only`
- `large-regression-batch`
- `release-readiness`

A plan may use `custom:<name>` for local extensions, but custom values must still map to gates.

## Gate ids

Standard `qc_gate.id` values:

| Gate | Evidence expectation |
| --- | --- |
| `lime.verify-local` | Command output from `npm run verify:local`. |
| `lime.verify-local-full` | Command output from `npm run verify:local:full`. |
| `lime.test-contracts` | Command output from `npm run test:contracts`. |
| `lime.verify-gui-smoke` | GUI smoke output proving shell, DevBridge, and workspace readiness. |
| `lime.verify-app-version` | Version consistency output from `npm run verify:app-version`. |
| `lime.rust-targeted-test` | Cargo test output for affected crate or module. |
| `lime.playwright-product-flow` | Browser interaction evidence, screenshots, traces, or transcript. |
| `qcloop.batch` | qcloop job id plus item, attempt, qc round, and status refs. |
| `review.manual` | Human review notes with reviewer, scope, decision, and evidence refs. |
| `review.llm-judge` | LLM judge verdict with rubric and input/output refs. |

## Status values

`qc_case.status`, `qc_gate.status`, and `qc_report.status` use:

- `planned`: not executed yet.
- `running`: execution started.
- `passed`: evidence proves the expected behavior.
- `failed`: evidence disproves the expected behavior.
- `blocked`: a missing dependency or environment issue prevents judgment.
- `exhausted`: retries or token budget were consumed without passing.
- `skipped`: explicitly out of scope with reason.
- `needs-review`: evidence exists but needs human or stronger judge review.

## Evidence rules

A `passed` verdict MUST include at least one `evidence_ref`. For GUI, bridge, or qcloop gates, a self-reported assistant message is not enough.

Evidence refs SHOULD be stable enough for a reviewer to inspect:

```json
{
  "kind": "qcloop_qc_round",
  "ref": "qcloop://jobs/job-123/items/item-9/qc/2",
  "summary": "Verifier passed after repair and linked GUI smoke output."
}
```

For sensitive logs, evidence may be redacted, but the verdict must state what was redacted and why.

## qcloop mapping

A `qc_case` can become one qcloop `item_value`. For complex cases, serialize the case as JSON:

```json
{
  "name": "workspace-default-ready",
  "target": "Lime default workspace",
  "steps": ["Run GUI smoke", "Inspect DevBridge readiness"],
  "expected": ["DevBridge is ready", "Default workspace is available"],
  "required_evidence": ["command_log", "gui_smoke_summary"]
}
```

qcloop `attempt` records map to `qc_run`. qcloop `qc_round` records map to `qc_verdict`. qcloop `exhausted` maps to Agent QC `exhausted`, not `failed`, because it means the loop could not prove a pass within limits.

## Report rule

A plan report can say "deliverable" only when every required gate is `passed` or explicitly `skipped` with an accepted reason. Optional failures must still be listed as remaining risk.

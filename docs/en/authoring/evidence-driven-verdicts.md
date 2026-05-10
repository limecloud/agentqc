---
title: Evidence-driven verdicts
description: How Agent QC decides pass, fail, blocked, and exhausted.
---

# Evidence-driven verdicts

Agent QC treats a verdict as a claim about observed evidence. An agent sentence like "I checked it" is not a verdict.

## Required fields

A `qc_verdict` includes:

- `pass`: boolean for qcloop compatibility;
- `status`: `passed`, `failed`, `blocked`, `exhausted`, or `needs-review`;
- `severity`: `none`, `low`, `medium`, `high`, or `critical`;
- `feedback`: specific explanation;
- `evidence_refs`: inspectable refs;
- `remaining_risk`: what is still not proven.

## Pass rule

A pass requires:

1. every expected behavior is covered;
2. evidence refs are present;
3. no required gate is still running, blocked, or exhausted;
4. failure logs are either absent or explained.

## Fail rule

A fail should identify the smallest actionable issue. Examples:

- a command exited non-zero;
- GUI smoke did not reach DevBridge readiness;
- verifier saw no evidence for an expected behavior;
- Playwright observed the wrong user-visible state.

## Blocked vs exhausted

Use `blocked` when the environment prevents judgment, such as qcloop not running or credentials missing.

Use `exhausted` when the loop ran but did not reach a pass within rounds or token budget.

## Evidence examples

```json
[
  {
    "kind": "command_log",
    "ref": "runs/2026-05-10/verify-local.log",
    "summary": "npm run verify:local exited 0."
  },
  {
    "kind": "qcloop_qc_round",
    "ref": "qcloop://jobs/abc/items/workspace-ready/qc/1",
    "summary": "Verifier passed; evidence included GUI smoke output."
  },
  {
    "kind": "playwright_screenshot",
    "ref": "runs/2026-05-10/workspace-ready.png",
    "summary": "Default workspace rendered with ready state."
  }
]
```

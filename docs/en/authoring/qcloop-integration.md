---
title: qcloop integration
description: Map Agent QC plans into qcloop jobs and verifier prompts.
---

# qcloop integration

qcloop is a batch execution loop for repeated independent QC cases. Agent QC defines how to prepare items and how verifier output maps to evidence-backed verdicts.

## When to use qcloop

Use qcloop when:

- many cases share one worker/verifier template;
- each item can be judged independently;
- missed items are a real risk;
- repair/retry should be bounded;
- attempts, verifier rounds, and feedback need to be auditable.

Do not use qcloop for one open-ended investigation, for hidden shared-state tests, or to bypass a required CI/project gate.

## Generic item shape

```json
{
  "id": "tool-permission-deny-write-outside-workspace",
  "project_profile": "agent-runtime-cli",
  "target": "sandbox permission boundary",
  "steps": ["Run the deny-write fixture", "Capture tool result and exit status"],
  "expected": ["Write is blocked", "Error is surfaced without leaking secrets"],
  "required_evidence": ["command_log", "tool_transcript"],
  "risk": "permission bypass"
}
```

## Verifier output

Verifier output SHOULD be strict JSON:

```json
{
  "pass": false,
  "status": "failed",
  "severity": "high",
  "feedback": "The transcript shows the write succeeded outside the workspace.",
  "evidence_refs": ["qcloop://jobs/job-123/items/deny-write/attempts/1"],
  "remaining_risk": "Sandbox policy may not be enforced for this path."
}
```

## Mapping qcloop states

| qcloop state | Agent QC meaning |
| --- | --- |
| `success` | Item has a passing verifier verdict. |
| `failed` | Worker or repair execution failed. |
| `exhausted` | Budget or `max_qc_rounds` reached without proof. |
| `pending` / `running` | Plan is incomplete. |

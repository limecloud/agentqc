---
title: qcloop integration
description: Map Agent QC plans into qcloop jobs and verifier prompts.
---

# qcloop integration

qcloop is the preferred execution loop for repeated, independent Lime QC cases. Agent QC defines how to prepare the cases and judge results.

## When to use qcloop

Use qcloop when:

- there are multiple similar cases;
- each item can be checked independently;
- an independent verifier can judge pass/fail;
- failures should repair or rerun within a bounded loop;
- you need item-level history and evidence.

Do not use qcloop for a single open-ended investigation or for cases that require hidden shared state across items.

## Item shape

A qcloop `item_value` SHOULD be JSON for non-trivial Lime tests:

```json
{
  "id": "contract-command-catalog",
  "name": "Command catalog stays aligned",
  "target": "Lime command boundary",
  "steps": ["Run npm run test:contracts", "Inspect failing command ids if any"],
  "expected": ["Contract tests pass", "No command exists in only one side"],
  "risk": "bridge drift",
  "required_evidence": ["command_log", "contract_summary"]
}
```

## Worker prompt template

The worker prompt must include `{{item}}`, execute the requested test, and summarize evidence without inventing success.

```text
You are testing Lime according to Agent QC. Parse this item JSON: {{item}}
Run only the steps requested by the item. Collect command output, file refs, screenshots, or GUI smoke summaries as evidence.
Return a concise result with: status, commands run, key output lines, evidence refs, and any blocker. Do not claim pass unless the evidence proves the expected behavior.
```

## Verifier prompt template

The verifier must output strict JSON. It should judge evidence, not confidence.

```text
Review the worker output for this Agent QC item.
Item: {{item}}
Worker output: {{output}}

Return strict JSON only:
{"pass": true|false, "feedback": "specific reason", "evidence_refs": ["ref..."], "remaining_risk": "..."}

Pass only if the output includes evidence for every expected behavior. Fail if evidence is missing, ambiguous, or only asserted by the agent.
```

## Mapping qcloop states

| qcloop state | Agent QC meaning |
| --- | --- |
| `success` | Item has a passing verifier verdict. |
| `failed` | Worker or repair execution failed. |
| `exhausted` | Budget or `max_qc_rounds` reached without proof. |
| `pending` / `running` | Plan is not ready for final report. |

The final report must list exhausted items separately from failed items.

---
title: qcloop batch example
description: Project-agnostic Agent QC qcloop job request and verifier output.
---

# qcloop batch example

Agent QC maps repeated independent cases to qcloop items.

## Job request

```json
{
  "name": "agentqc-runtime-permission-regression",
  "prompt_template": "You are testing an Agent project according to Agent QC. Parse this item JSON: {{item}}. Run only the requested steps. Collect evidence refs. Report status, commands, key output, blockers, and evidence refs. Do not claim pass without evidence.",
  "verifier_prompt_template": "Review this Agent QC item. Item: {{item}} Worker output: {{output}} Return strict JSON only: {\"pass\": true|false, \"status\": \"passed|failed|blocked|exhausted|needs-review\", \"severity\": \"none|low|medium|high|critical\", \"feedback\": \"specific reason\", \"evidence_refs\": [\"ref...\"], \"remaining_risk\": \"...\"}. Pass only when every expected behavior has evidence.",
  "max_qc_rounds": 2,
  "token_budget_per_item": 0,
  "execution_mode": "standard",
  "executor_provider": "codex",
  "items": [
    "{\"id\":\"deny-unsafe-tool-action\",\"name\":\"Deny unsafe tool action\",\"project_profile\":\"agent-runtime-cli\",\"target\":\"sandbox policy\",\"steps\":[\"Run the sandbox deny fixture\",\"Capture CLI transcript and exit status\"],\"expected\":[\"Unsafe action is denied\",\"Transcript includes controlled error\"],\"risk\":\"permission bypass\",\"required_gates\":[\"unit\",\"runtime-e2e\"],\"required_evidence\":[\"command_log\",\"cli_transcript\"],\"status\":\"planned\"}"
  ]
}
```

## Verifier output

```json
{
  "pass": false,
  "status": "failed",
  "severity": "high",
  "feedback": "The transcript shows the unsafe write succeeded outside the workspace.",
  "evidence_refs": [
    "qcloop://jobs/job-123/items/deny-unsafe-tool-action/attempts/1"
  ],
  "remaining_risk": "Sandbox policy may not be enforced for this path."
}
```

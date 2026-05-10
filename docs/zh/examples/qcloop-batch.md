---
title: qcloop 批次示例
description: Agent QC qcloop job request 与 verifier 输出。
---

# qcloop 批次示例

Agent QC 把重复测试项映射为 qcloop items。

## Job request

```json
{
  "name": "lime-agentqc-gui-regression",
  "prompt_template": "You are testing Lime according to Agent QC. Parse this item JSON: {{item}}. Run the requested steps, collect evidence refs, and report status, commands, key output, blockers, and evidence refs. Do not claim pass without evidence.",
  "verifier_prompt_template": "Review this Agent QC item. Item: {{item}} Worker output: {{output}} Return strict JSON only: {"pass": true|false, "feedback": "specific reason", "evidence_refs": ["ref..."], "remaining_risk": "..."}. Pass only when every expected behavior has evidence.",
  "max_qc_rounds": 2,
  "token_budget_per_item": 0,
  "execution_mode": "standard",
  "executor_provider": "codex",
  "items": [
    "{"id":"gui-smoke-default-workspace","name":"Default workspace reaches ready state","target":"Lime desktop GUI","steps":["Run npm run verify:gui-smoke"],"expected":["DevBridge health check passes","Default workspace is prepared"],"required_evidence":["command_log","gui_smoke_summary"]}"
  ]
}
```

## Verifier output

```json
{
  "pass": true,
  "feedback": "GUI smoke evidence shows DevBridge ready and default workspace prepared.",
  "evidence_refs": ["qcloop://jobs/job-123/items/gui-smoke-default-workspace/attempts/1"],
  "remaining_risk": "No full manual exploratory GUI review was performed."
}
```

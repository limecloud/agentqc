---
title: qcloop 集成
description: 把 Agent QC 测试计划映射为 qcloop job 与 verifier prompt。
---

# qcloop 集成

qcloop 是重复、独立 Lime QC 测试项的首选执行循环。Agent QC 定义如何准备测试项以及如何判定结果。

## 什么时候使用 qcloop

适合使用 qcloop：

- 有多个相似测试项；
- 每个 item 可以独立判断；
- 可以用独立 verifier 给出 pass/fail；
- 失败需要在有限轮次内 repair 或重跑；
- 需要 item 级历史和证据。

不适合用 qcloop：单一开放探索目标，或测试项之间强依赖隐藏共享状态。

## Item 形态

非平凡 Lime 测试项的 qcloop `item_value` 应使用 JSON：

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

## Worker prompt 模板

Worker prompt 必须包含 `{{item}}`，执行测试，并总结证据，不能伪造成功。

```text
You are testing Lime according to Agent QC. Parse this item JSON: {{item}}
Run only the steps requested by the item. Collect command output, file refs, screenshots, or GUI smoke summaries as evidence.
Return a concise result with: status, commands run, key output lines, evidence refs, and any blocker. Do not claim pass unless the evidence proves the expected behavior.
```

## Verifier prompt 模板

Verifier 必须输出严格 JSON，判定证据而不是判定信心。

```text
Review the worker output for this Agent QC item.
Item: {{item}}
Worker output: {{output}}

Return strict JSON only:
{"pass": true|false, "feedback": "specific reason", "evidence_refs": ["ref..."], "remaining_risk": "..."}

Pass only if the output includes evidence for every expected behavior. Fail if evidence is missing, ambiguous, or only asserted by the agent.
```

## qcloop 状态映射

| qcloop state | Agent QC 含义 |
| --- | --- |
| `success` | item 有 verifier 支撑的通过判定。 |
| `failed` | worker 或 repair 执行失败。 |
| `exhausted` | 预算或 `max_qc_rounds` 耗尽。 |
| `pending` / `running` | 计划尚不能产出最终报告。 |

最终报告必须分开列出 exhausted 和 failed。

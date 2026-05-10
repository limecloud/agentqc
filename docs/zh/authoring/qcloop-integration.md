---
title: qcloop 集成
description: 将 Agent QC 计划映射到 qcloop job 和 verifier prompt。
---

# qcloop 集成

qcloop 是用于重复、独立 QC case 的批量执行循环。Agent QC 定义如何准备 item，以及 verifier output 如何映射成证据驱动的 verdict。

## 何时使用 qcloop

适合使用 qcloop 的情况：

- 多个 case 共享同一组 worker/verifier template；
- 每个 item 可以独立判定；
- 漏测 item 是真实风险；
- repair/retry 必须有边界；
- attempts、verifier rounds 和 feedback 需要可审计。

不要用 qcloop 替代开放式调查、隐藏共享状态测试或必需的 CI/project gate。

## 通用 item 形状

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

## Verifier 输出

verifier output 应该是严格 JSON：

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

## qcloop 状态映射

| qcloop 状态 | Agent QC 含义 |
| --- | --- |
| `success` | item 有通过 verifier 的 verdict。 |
| `failed` | worker 或 repair 执行失败。 |
| `exhausted` | 预算或 `max_qc_rounds` 耗尽，仍没有证明。 |
| `pending` / `running` | plan 尚未完成。 |

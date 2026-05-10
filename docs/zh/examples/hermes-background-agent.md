---
title: Hermes background agent 示例
description: Hermes 风格 background agent 的 Agent QC profile 映射。
---

# Hermes background agent 示例

Profiles:

- `background-agent-scheduler`
- `multi-channel-agent-gateway`
- `agent-ui-tui-desktop`
- `agent-distribution-release`

典型门禁：

- 通过 canonical runner 运行 Python unit test，并统一环境。
- 使用 pytest marker 默认排除 integration。
- 对 lease、queue、checkpoint、subprocess 做 stress-concurrency test。
- 使用 TUI Vitest test 验证终端行为。
- 使用 Docker smoke 与 install test 验证 release path。

```json
{
  "schema_version": "0.2.0",
  "id": "hermes-cron-recovery-qc",
  "target_project": "hermes-agent",
  "project_profiles": [
    "background-agent-scheduler",
    "multi-channel-agent-gateway",
    "agent-ui-tui-desktop",
    "agent-distribution-release"
  ],
  "risk_level": "high",
  "risk_domains": [
    "cron",
    "checkpoint",
    "credential-isolation"
  ],
  "required_gates": [
    "unit",
    "stress-concurrency",
    "fake-integration"
  ],
  "cases": [
    {
      "id": "cron-restart-does-not-duplicate-work",
      "name": "Cron restart does not duplicate work",
      "project_profile": "background-agent-scheduler",
      "target": "cron scheduler recovery",
      "steps": [
        "Run scheduler restart test",
        "Inspect checkpoint and evidence store"
      ],
      "expected": [
        "No duplicate work item",
        "Recovered run owns final state"
      ],
      "risk": "duplicate or lost background work",
      "required_gates": [
        "unit",
        "stress-concurrency"
      ],
      "required_evidence": [
        "pytest_report",
        "checkpoint_log"
      ],
      "status": "planned"
    }
  ],
  "evidence_policy": "Credential env vars must be blanked or scoped in test evidence."
}
```

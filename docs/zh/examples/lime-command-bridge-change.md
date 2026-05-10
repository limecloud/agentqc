---
title: Lime 命令桥接改动示例
description: Tauri 命令、Bridge、catalog、mock 漂移的 Agent QC 测试计划。
---

# Lime 命令桥接改动示例

当改动触碰 `safeInvoke`、Rust command registration、治理目录册、DevBridge dispatcher 或浏览器 mock 时，使用这种形态。

```json
{
  "schema_version": "0.1.0",
  "id": "lime-command-boundary-check",
  "target_project": "lime",
  "change_type": "tauri-command-bridge-mock",
  "risk_level": "high",
  "required_gates": ["lime.verify-local", "lime.test-contracts"],
  "cases": [
    {
      "id": "contracts-command-surface",
      "name": "Command surfaces remain synchronized",
      "target": "Tauri command boundary",
      "steps": ["Run npm run test:contracts", "Inspect any command ids reported only on one side"],
      "expected": ["Contract tests pass", "No current command is missing frontend, Rust, catalog, or mock coverage"],
      "risk": "Bridge drift creates runtime-only failures",
      "required_evidence": ["command_log", "contract_summary"]
    }
  ],
  "evidence_policy": "Contract pass needs command output, not prose."
}
```

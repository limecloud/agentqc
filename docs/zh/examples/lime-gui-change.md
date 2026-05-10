---
title: Lime GUI 改动示例
description: GUI 壳或 Workspace 改动的 Agent QC 测试计划。
---

# Lime GUI 改动示例

当改动触碰 GUI 壳、DevBridge、Workspace 或产品主路径时，使用这种形态。

```json
{
  "schema_version": "0.1.0",
  "id": "lime-gui-workspace-readiness",
  "target_project": "lime",
  "change_type": "gui-shell-workspace",
  "risk_level": "high",
  "required_gates": ["lime.verify-local", "lime.verify-gui-smoke"],
  "cases": [
    {
      "id": "gui-smoke-default-workspace",
      "name": "Default workspace reaches ready state",
      "target": "Lime desktop GUI",
      "steps": ["Run npm run verify:gui-smoke"],
      "expected": ["DevBridge health check passes", "Default workspace is prepared"],
      "risk": "GUI shell can compile but product path cannot open",
      "required_evidence": ["command_log", "gui_smoke_summary"]
    }
  ],
  "evidence_policy": "Every passed gate requires command or GUI smoke evidence."
}
```

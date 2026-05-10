---
title: Lime GUI change example
description: Agent QC plan for a Lime GUI shell or Workspace change.
---

# Lime GUI change example

Use this shape when a change touches GUI shell, DevBridge, Workspace, or the main product path.

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

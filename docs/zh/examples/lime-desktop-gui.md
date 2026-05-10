---
title: Lime desktop GUI 示例
description: Lime 风格 desktop GUI agent 的 Agent QC profile 映射。
---

# Lime desktop GUI 示例

Lime 是一个案例 profile，不是标准边界。

Profiles:

- `agent-ui-tui-desktop`
- `agent-runtime-cli`
- `agent-tool-mcp-gateway`
- `agent-skills-plugins`

典型门禁：

- local validation 覆盖 static/type/unit；
- command contract 覆盖 frontend/Rust/mock/catalog surface；
- GUI smoke 覆盖 shell、bridge 和 workspace readiness；
- Playwright 覆盖用户可见 product flow。

```json
{
  "schema_version": "0.2.0",
  "id": "lime-gui-workspace-readiness",
  "target_project": "lime",
  "project_profiles": [
    "agent-ui-tui-desktop",
    "agent-tool-mcp-gateway",
    "agent-runtime-cli",
    "agent-skills-plugins"
  ],
  "risk_level": "high",
  "risk_domains": [
    "desktop-shell",
    "bridge",
    "workspace"
  ],
  "required_gates": [
    "static",
    "contract-protocol",
    "ui-interaction"
  ],
  "cases": [
    {
      "id": "workspace-ready",
      "name": "Workspace becomes ready in desktop GUI",
      "project_profile": "agent-ui-tui-desktop",
      "target": "Lime desktop GUI",
      "steps": [
        "Run GUI smoke",
        "Inspect bridge readiness and workspace state"
      ],
      "expected": [
        "Bridge is ready",
        "Default workspace is prepared"
      ],
      "risk": "UI reports readiness without runtime support",
      "required_gates": [
        "contract-protocol",
        "ui-interaction"
      ],
      "required_evidence": [
        "command_log",
        "gui_smoke_summary"
      ],
      "status": "planned"
    }
  ],
  "evidence_policy": "GUI pass requires smoke or interaction evidence, not only static checks."
}
```

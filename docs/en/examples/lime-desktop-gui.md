---
title: Lime desktop GUI example
description: Agent QC profile mapping for a Lime-style desktop GUI agent.
---

# Lime desktop GUI example

Lime is an example profile, not the standard boundary.

Profiles:

- `agent-ui-tui-desktop`
- `agent-runtime-cli`
- `agent-tool-mcp-gateway`
- `agent-skills-plugins`

Typical gates:

- local validation for static/type/unit coverage;
- command contracts for frontend/Rust/mock/catalog surfaces;
- GUI smoke for shell, bridge, and workspace readiness;
- Playwright for user-visible product flows.

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

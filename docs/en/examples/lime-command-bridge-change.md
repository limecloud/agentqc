---
title: Lime command bridge change example
description: Agent QC plan for Tauri command, bridge, catalog, and mock drift.
---

# Lime command bridge change example

Use this shape when a change touches `safeInvoke`, Rust command registration, governance command catalog, DevBridge dispatcher, or browser mocks.

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

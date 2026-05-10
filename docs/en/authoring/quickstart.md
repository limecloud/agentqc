---
title: Quickstart
description: Create a Lime Agent QC plan.
---

# Quickstart

Use this flow when an agent needs to test a Lime change.

## 1. Classify the change

Pick the closest `change_type`:

- Ordinary frontend code: `frontend`
- User-visible UI: `user-visible-ui`
- GUI shell, Workspace, DevBridge, or main path: `gui-shell-workspace`
- Tauri command, bridge, catalog, or mock: `tauri-command-bridge-mock`
- Rust module: `rust-module`
- Config, version, or dependency: `config-version-dependency`

If several apply, use the highest-risk gate combination.

## 2. Select required gates

Use the [Lime gate matrix](./lime-gate-matrix). Do not invent parallel gates when Lime already has a repository script.

## 3. Write behavior-level cases

A good `qc_case` states:

- target behavior
- exact steps or command
- expected result
- required evidence
- failure classification

Avoid cases like "check the UI" or "make sure it works".

## 4. Decide direct vs qcloop execution

Run small deterministic gates directly. Use qcloop when cases are repetitive, independent, and benefit from worker/verifier/repair tracking.

## 5. Produce a verdict

Every `passed` verdict needs evidence refs. Every `failed`, `blocked`, or `exhausted` verdict needs a concrete next action.

## Minimal plan

```json
{
  "schema_version": "0.1.0",
  "id": "lime-gui-smoke-plan",
  "target_project": "lime",
  "change_type": "gui-shell-workspace",
  "risk_level": "high",
  "required_gates": ["lime.verify-local", "lime.verify-gui-smoke"],
  "cases": [
    {
      "id": "workspace-ready",
      "name": "Default workspace is ready",
      "target": "Lime GUI shell",
      "steps": ["Run npm run verify:gui-smoke"],
      "expected": ["DevBridge reports ready", "Default workspace can be prepared"],
      "required_evidence": ["command_log", "gui_smoke_summary"]
    }
  ],
  "evidence_policy": "passed verdicts require inspectable evidence refs"
}
```

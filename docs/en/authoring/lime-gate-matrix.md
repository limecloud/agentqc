---
title: Lime gate matrix
description: Minimum gates for Lime change types.
---

# Lime gate matrix

This matrix is the default Agent QC mapping for Lime. It follows Lime's repository quality workflow and keeps GUI product readiness separate from code-only checks.

| Change type | Required gates | Notes |
| --- | --- | --- |
| `frontend` | `lime.verify-local` | Ordinary TypeScript or React changes without GUI shell risk. |
| `user-visible-ui` | `lime.verify-local`, UI regression assertion | Prefer existing `*.test.tsx` or stable snapshot-style checks. |
| `gui-shell-workspace` | `lime.verify-local`, `lime.verify-gui-smoke` | Required for GUI shell, DevBridge, Workspace, and main path changes. |
| `tauri-command-bridge-mock` | `lime.verify-local`, `lime.test-contracts` | Frontend calls, Rust registration, governance catalog, and mocks must stay aligned. |
| `rust-module` | targeted Cargo test, then optional broader Cargo test | Start with the affected crate or module. |
| `config-version-dependency` | `lime.verify-local`, plus `lime.verify-app-version` when version files changed | Update schema, consumers, docs, and lock files together. |
| `documentation-only` | docs build or link check when available | No product pass claim unless docs are the deliverable. |
| `large-regression-batch` | matching gates plus `qcloop.batch` | Use qcloop for independent, repeated test cases. |
| `release-readiness` | `lime.verify-local-full`, `lime.verify-gui-smoke`, focused contracts and review | Expand only to prove release risk, not to run tests endlessly. |

## GUI rule

For GUI shell or Workspace risk, code checks alone are insufficient. A deliverable verdict needs evidence that the application shell and bridge path are actually usable.

## Command boundary rule

For command, bridge, or mock changes, Agent QC expects evidence that these surfaces are synchronized:

- frontend `safeInvoke(...)` or `invoke(...)`
- Rust `tauri::generate_handler!`
- governance command catalog
- `mockPriorityCommands` and `defaultMocks`

## qcloop rule

Use qcloop to reduce skipped or forgotten cases, not to bypass required gates. A qcloop pass is one evidence source inside the gate matrix.

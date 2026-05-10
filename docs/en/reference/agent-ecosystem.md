---
title: Agent standards ecosystem
description: Agent QC boundary with adjacent Agent standards.
---

# Agent standards ecosystem

Agent QC owns the quality-control contract for Agent projects. It links to adjacent standards through refs instead of owning their facts.

| Standard | Role | Relationship to Agent QC |
| --- | --- | --- |
| Agent Knowledge | Source-grounded knowledge packs. | Supplies trusted requirements, docs, and domain facts for tests. |
| Agent UI | User-visible interaction surfaces. | Supplies UI/TUI/desktop acceptance expectations. |
| Agent Runtime | Execution facts, controls, tasks, tools, and recovery. | Supplies run/task/session state for runtime gates. |
| Agent Evidence | Evidence, verification, review, replay, and export. | Owns durable evidence records referenced by QC verdicts. |
| Agent Policy | Permissions, approvals, risk, retention, waivers. | Defines whether high-risk test actions may run or be waived. |
| Agent Artifact | Durable deliverables and handoff packages. | Stores reports, screenshots, traces, logs, and package manifests. |
| Agent Tool | Tool declarations, calls, progress, results, permissions. | Supplies tool invocation facts for tool and MCP gates. |
| Agent Context | Context selection, budgets, injection, missing facts. | Explains what context worker/verifier/judge agents received. |
| Agent QC | Plans, profiles, gates, evidence, verdicts, and reports. | Owns whether testing evidence proves a project quality claim. |

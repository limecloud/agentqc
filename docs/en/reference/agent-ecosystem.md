---
title: Agent standards ecosystem
description: Agent QC boundary with adjacent Agent standards.
---

# Agent standards ecosystem

Agent QC is currently a Lime-focused candidate standard. It links testing plans and verdicts to adjacent agent standards without owning their responsibilities.

| Standard | Role | Relationship to Agent QC |
| --- | --- | --- |
| Agent Knowledge | Source-grounded knowledge packs. | Supplies trusted test context and requirements. |
| Agent UI | User-visible interaction surfaces. | Supplies behavior-level GUI acceptance expectations. |
| Agent Runtime | Execution facts, controls, tasks, and recovery. | Supplies run/task state for long testing work. |
| Agent Evidence | Evidence, verification, review, replay, and export. | Owns durable evidence records that QC verdicts reference. |
| Agent Policy | Permissions, approvals, risk, retention, and waivers. | Defines whether risky test actions may run. |
| Agent Artifact | Durable deliverables and handoff packages. | Stores generated reports, screenshots, logs, or exported evidence bundles. |
| Agent Tool | Tool declarations, calls, progress, and results. | Supplies tool invocation facts for test execution. |
| Agent Context | Context selection, budgets, injection, and missing facts. | Explains what context was available to worker or verifier agents. |
| Agent QC | Lime testing plans, gates, cases, verdicts, and reports. | Owns the pass/fail quality-control contract for Lime testing. |

No standard should become the whole stack. Agent QC verdicts should preserve refs to runtime, evidence, artifact, tool, policy, and qcloop records.

---
title: Agent standards ecosystem
description: Agent QC boundary with adjacent Agent standards.
---

# Agent standards ecosystem

Agent QC owns the quality-control contract for Agent projects. It links to adjacent standards through refs instead of owning their facts.

Agent QC should answer: **does evidence prove this Agent project quality claim?** It should not become the runtime, UI, policy, artifact, tool, or knowledge standard itself.

## Boundary map

| Standard | Role | Relationship to Agent QC |
| --- | --- | --- |
| Agent Knowledge | Source-grounded knowledge packs. | Supplies trusted requirements, docs, domain facts, source maps, and grounding expectations for tests. |
| Agent UI | User-visible interaction surfaces. | Supplies UI/TUI/desktop/WebUI acceptance expectations and runtime-backed projection rules. |
| Agent Runtime | Execution facts, controls, tasks, tools, streams, and recovery. | Supplies run/task/session state for runtime gates. |
| Agent Evidence | Evidence, verification, review, replay, and export. | Owns durable evidence records referenced by QC verdicts. |
| Agent Policy | Permissions, approvals, risk, retention, waivers. | Defines whether high-risk test actions may run or be waived. |
| Agent Artifact | Durable deliverables and handoff packages. | Stores reports, screenshots, traces, logs, package manifests, and generated outputs. |
| Agent Tool | Tool declarations, calls, progress, results, permissions, and audit refs. | Supplies tool invocation facts for tool, MCP, ACP, and connector gates. |
| Agent Context | Context selection, budgets, injection, missing facts, compaction. | Explains what context worker/verifier/judge agents received during QC. |
| Agent QC | Plans, profiles, gates, evidence, verdicts, waivers, and reports. | Owns whether testing evidence proves a project quality claim. |

## Interop principles

1. **QC references facts; it does not own them.** A GUI pass references Agent UI projection and runtime events; it does not define the UI protocol.
2. **Evidence refs are durable.** The QC report should link to Agent Evidence or artifact refs rather than paste secret-bearing logs.
3. **Policy controls live outside QC.** QC may require approval, but Agent Policy owns whether a dangerous action is allowed or waived.
4. **Knowledge is input, not proof.** Requirements from Agent Knowledge guide tests; passing evidence still comes from execution, traces, or review.
5. **Artifacts are outputs, not verdicts.** A package, screenshot, or report is evidence only when connected to an expectation.
6. **Context is part of reviewability.** qcloop/verifier/model-judge results need context/budget/source refs when context affects the outcome.

## Example: UI/TUI/Desktop case

```text
Agent Runtime emits run/tool/action facts
  -> Agent UI projects them into composer/status/tool/HITL surfaces
  -> Agent Evidence stores trace/screenshot/transcript refs
  -> Agent QC links refs to gate verdicts
  -> Agent Policy records waiver or approval when needed
```

QC failure example: a screenshot shows "done" but no runtime event confirms completion. Agent UI projection may be visually correct for a mock state, but Agent QC must mark the runtime-backed claim `blocked` or `needs-review`.

## Example: Knowledge-driven eval case

```text
Agent Knowledge supplies source-grounded requirements
  -> Agent Context selects test context and budgets
  -> qcloop or eval runner executes cases
  -> Agent Evidence stores attempts, verifier feedback, judge output
  -> Agent QC emits verdicts and remaining risk
```

QC failure example: the model answer cites a source but the source map is missing. The semantic output may look plausible, but the grounded-quality claim is incomplete.

## What Agent QC deliberately does not standardize

- visual theme, component library, typography, or animation;
- a single test framework or CI provider;
- a single runtime event protocol;
- model provider choice;
- storage backend for evidence;
- product-specific release policy;
- exact qcloop implementation.

Agent QC standardizes the evidence shape and verdict semantics that let these systems interoperate.

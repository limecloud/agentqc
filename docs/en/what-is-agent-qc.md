---
title: What is Agent QC?
description: Conceptual entry point for Lime evidence-driven quality control.
---

# What is Agent QC?

Agent QC is a Lime-focused standard for turning agent testing into evidence-driven quality control.

It exists because Lime is not a library-only project. Lime is a GUI desktop product with Tauri commands, bridge boundaries, workspace state, browser-mode mocks, runtime metadata, and user-visible flows. A result that only says "lint passed" or "the agent checked it" is not enough.

Agent QC answers four questions:

1. What kind of Lime change is being tested?
2. Which gates must run for that risk?
3. What behavior-level cases prove the product path?
4. Which evidence makes a pass/fail verdict trustworthy?

## Relationship to qcloop

qcloop executes batches. Agent QC defines what should be batched, how each item should be judged, and when the aggregate result is enough for Lime.

```text
Agent QC plan -> qcloop job/items -> worker attempts -> verifier rounds -> evidence-backed report
```

qcloop is the execution loop. Agent QC is the testing standard.

## Relationship to Lime quality workflow

Agent QC preserves Lime's existing gate rules:

- `npm run verify:local` for ordinary local validation.
- `npm run test:contracts` for command, bridge, mock, and manifest boundaries.
- `npm run verify:gui-smoke` for GUI shell, DevBridge, Workspace, and main product path risk.
- Playwright or manual product checks when behavior must be observed.

Agent QC does not replace those commands. It records when each command is required and what evidence is needed.

## Non-goals

Agent QC does not define a generic testing framework, a visual UI, a model protocol, or a qcloop replacement. v0.1.0 is intentionally scoped to Lime.

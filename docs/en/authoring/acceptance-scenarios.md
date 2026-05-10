---
title: Acceptance scenarios
description: Behavior-level validation scenarios for Lime Agent QC.
---

# Acceptance scenarios

Agent QC scenarios validate behavior and evidence, not file presence.

## 1. Ordinary frontend change

1. Classify change as `frontend`.
2. Run `npm run verify:local`.
3. Record command output evidence.
4. Report pass only if the command passes and no higher-risk boundary was touched.

Passing condition: local validation evidence supports the change and no GUI or bridge gate is required.

## 2. User-visible UI change

1. Classify change as `user-visible-ui`.
2. Run `npm run verify:local`.
3. Add or run a stable UI assertion when an existing test surface exists.
4. Record evidence for user-visible expected state.

Passing condition: UI behavior is asserted, not just typechecked.

## 3. GUI shell or Workspace change

1. Classify change as `gui-shell-workspace`.
2. Run `npm run verify:local`.
3. Run `npm run verify:gui-smoke`.
4. Record DevBridge and workspace readiness evidence.

Passing condition: GUI main path is proven usable.

## 4. Tauri command / Bridge / mock change

1. Classify change as `tauri-command-bridge-mock`.
2. Check command surfaces as a group.
3. Run `npm run test:contracts` and `npm run verify:local`.
4. Record failing command ids when contracts fail.

Passing condition: frontend calls, Rust registration, catalog, and mocks stay synchronized.

## 5. qcloop batch regression

1. Convert each behavior into one independent `qc_case`.
2. Create a qcloop job with strict verifier JSON.
3. Start the job and poll until no item is pending or running.
4. Summarize `success`, `failed`, and `exhausted` separately.

Passing condition: every required item has verifier-backed evidence.

## 6. Manual or LLM judge review

1. Define a rubric before review.
2. Provide the reviewer with outputs and evidence refs.
3. Record verdict, reviewer identity or judge configuration, and remaining risk.

Passing condition: review decision is explicit and traceable.

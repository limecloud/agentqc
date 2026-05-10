---
title: Quickstart
description: Create an Agent QC plan for any Agent project.
---

# Quickstart

Use this flow when an agent, maintainer, CI job, or qcloop run needs to test an Agent project. The flow is portable: Lime is only one possible case study.

## 1. Define the QC scope

Write one sentence that names what is being judged.

Examples:

- "Release v1.4.0 of a Codex-like runtime CLI."
- "A Claude Code-like TUI remote-permission change."
- "An OpenClaw-like channel gateway auth/media change."
- "A Hermes-like scheduler restart fix."
- "A Lime-like desktop GUI bridge change."

The scope decides which claims the report may make. Do not let a broad report imply untested surfaces.

## 2. Classify the project profile

Pick one or more profiles:

- `agent-runtime-cli`
- `agent-sdk-api`
- `agent-tool-mcp-gateway`
- `multi-channel-agent-gateway`
- `agent-ui-tui-desktop`
- `agent-skills-plugins`
- `background-agent-scheduler`
- `agent-distribution-release`
- `agent-evals-quality`

Classify by owned risk, not language. A Python project can own browser automation; a Rust project can own a TUI; a docs site can own a distribution/release surface.

## 3. Identify touched surfaces

Name where a user or operator observes the behavior:

- `cli-stream`
- `tui`
- `webui`
- `desktop-gui`
- `browser-automation`
- `channel-ui`
- `eval-ui`

If behavior is visible, include `qc_case.surface`. A UI pass without surface evidence is incomplete.

## 4. Assign fact owners

For each case, decide which system owns the fact:

| Fact | Owner example | Evidence |
| --- | --- | --- |
| runtime accepted work | agent runtime | stream or session transcript |
| tool call succeeded/failed | tool runtime or protocol adapter | tool id, progress, result/error |
| approval was resolved | policy/runtime action API | request id and response transcript |
| UI rendered a state | UI projection | screenshot, trace, terminal snapshot |
| artifact was created | artifact/release service | manifest, file, version, export ref |
| verdict passed | Agent QC report | linked evidence refs |

This prevents the common Agent UI failure where visible text is treated as runtime truth.

## 5. Select gate lanes

Use the [gate matrix](./gate-matrix). At minimum, separate these lanes:

1. deterministic local gates: `static`, `unit`, `contract-protocol`, `fake-integration`;
2. runtime gates: `runtime-e2e`, `stress-concurrency` when needed;
3. surface gates: `ui-interaction` with a named surface;
4. live gates: `live-provider` only with explicit opt-in;
5. release gates: `distribution-release` when anything is shipped;
6. semantic gates: `semantic-eval` and `review` when quality judgment matters.

## 6. Write behavior-first cases

Each `qc_case` should state:

- behavior to prove;
- profile and surface;
- exact steps or commands;
- expected result;
- required gates;
- required evidence;
- status mapping for fail, blocked, exhausted, waived, and needs-review.

Avoid cases like "component exists". Prefer cases like "user denies a tool call; runtime records denial; TUI removes pending approval; no side effect occurs".

## 7. Define evidence policy

Before running, decide what counts as proof.

| Claim | Evidence |
| --- | --- |
| CLI stream works | command, exit status, stdout/stderr transcript, structured event sample |
| TUI works | viewport, key sequence, terminal snapshot, runtime transcript |
| WebUI works | Playwright/browser trace, screenshot, console/network log, route assertion |
| Desktop GUI works | shell start, bridge health, workspace readiness, screenshot, OS note |
| Browser automation works | DOM/a11y snapshot, screenshot, console/network, cleanup proof |
| Channel works | webhook replay, media fixture, auth proof, redacted channel transcript |
| Scheduler works | deterministic time/env, checkpoint, lease/reclaim, duplicate-work proof |
| Release works | package manifest, clean install, Docker/OS matrix, version output |
| Eval works | rubric, judge output, baseline delta, reviewer note |

See [Evidence contract](../contracts/evidence-contract).

## 8. Use qcloop for repeatable independent checks

Use qcloop for many similar cases: files, channels, providers, commands, prompts, packages, or regression examples.

Do not use qcloop to hide missing project gates. A qcloop batch may produce verdicts, but bridge health, GUI smoke, package install smoke, and live-provider opt-in still need their own evidence.

## 9. Run gates from cheap to risky

A practical order is:

1. `static` and schema checks;
2. targeted unit or contract tests;
3. fake integration and runtime e2e;
4. surface smoke or Playwright/TUI evidence;
5. stress/concurrency where relevant;
6. live provider or channel tests only with opt-in;
7. release/install/Docker checks;
8. semantic eval and review.

Stop early only when the failure makes downstream evidence meaningless. Otherwise record partial evidence and mark remaining gates accurately.

## 10. Report verdicts and limits

A complete report includes:

- scope;
- profiles and surfaces;
- gates required and gates executed;
- evidence refs;
- verdicts by case;
- blockers, exhausted attempts, waivers, and needs-review items;
- remaining risk;
- next action.

A report is not complete when it says only "tests passed" or "the agent checked it".

## Minimal plan skeleton

```json
{
  "schema_version": "0.4.0",
  "project": "example-agent",
  "project_profiles": ["agent-runtime-cli", "agent-ui-tui-desktop"],
  "required_gates": ["static", "contract-protocol", "runtime-e2e", "ui-interaction"],
  "cases": [
    {
      "id": "permission-denial-tui",
      "project_profile": "agent-ui-tui-desktop",
      "surface": "tui",
      "target": "remote permission prompt",
      "required_gates": ["contract-protocol", "runtime-e2e", "ui-interaction"],
      "steps": ["start fake runtime", "trigger high-risk tool", "deny approval"],
      "expected": ["runtime records denial", "TUI removes pending prompt", "no side effect occurs"],
      "required_evidence": ["protocol transcript", "terminal snapshot", "runtime transcript"]
    }
  ]
}
```

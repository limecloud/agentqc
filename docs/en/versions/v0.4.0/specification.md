---
title: v0.4.0 specification
description: Agent QC v0.4.0 portable draft specification.
---

# v0.4.0 specification

Agent QC v0.4.0 is a portable draft standard for evidence-driven quality control of Agent projects.

An Agent project can be a runtime CLI, SDK, tool server, MCP/ACP gateway, multi-channel bot, GUI/TUI/desktop client, skills or plugin ecosystem, background scheduler, distribution package, or evaluation suite. Agent QC does not assume one product shape. It starts by classifying the project profile and then selects gates that match its risk.

## Scope

Agent QC standardizes:

1. Project profiles for Agent systems.
2. Test plan, case, gate, run, evidence, verdict, and report objects.
3. Gate taxonomy from static checks to live provider and release smoke.
4. Evidence-backed pass/fail semantics.
5. qcloop-compatible batch QC for repeated independent cases.
6. Case-study mapping for projects such as Codex, Claude Code local snapshot, OpenClaw, Hermes Agent, and Lime.

Agent QC does not standardize any single programming language, CI vendor, test framework, browser driver, model protocol, storage backend, or UI skin.


## Document set

The latest standard is split by use:

| Page | Purpose |
| --- | --- |
| [Quickstart](../../authoring/quickstart) | fastest path to a QC plan |
| [Best practices](../../authoring/best-practices) | authoring rules and anti-patterns |
| [Project classification](../../authoring/project-classification) | profile taxonomy and mixed-profile rules |
| [Gate matrix](../../authoring/gate-matrix) | profile/surface/risk to gate mapping |
| [Interaction surface testing](../../authoring/interaction-surface-testing) | CLI/TUI/WebUI/desktop/browser/channel/eval UI evidence |
| [Evidence contract](../../contracts/evidence-contract) | portable evidence, verdict, waiver fields |
| [Performance and reliability metrics](../../contracts/performance-and-reliability-metrics) | timing, flake, cleanup, scheduler, release metrics |
| [Flow and taxonomy](../../reference/flow-and-taxonomy) | complete lifecycle and taxonomy reference |
| [Star project testing systems](../../reference/star-project-testing-systems) | Codex, Claude Code, OpenClaw, Hermes, and Lime case studies |

## Project profiles

A `qc_plan.project_profiles` array declares which project shapes apply.

| Profile | Typical risks | Example gates |
| --- | --- | --- |
| `agent-runtime-cli` | tool execution, sandboxing, permission, streams, resume, subprocess cleanup | unit, protocol, fake model server, CLI e2e, sandbox tests |
| `agent-sdk-api` | public API compatibility, generated contracts, fake server behavior, async cancellation | signature tests, generated contract diff, fake server integration |
| `agent-tool-mcp-gateway` | tool declaration drift, stdio/http transport, recovery, resource access, audit refs | protocol conformance, mock server, transport recovery, contract tests |
| `multi-channel-agent-gateway` | channel adapters, auth, secrets, webhook verification, provider drift, media routing | channel contract tests, secret isolation, live opt-in, docker smoke |
| `agent-ui-tui-desktop` | rendering, terminal/browser state, user controls, screenshots, accessibility, bridge readiness | UI unit, snapshot, Playwright, terminal fixtures, GUI smoke |
| `agent-skills-plugins` | manifest shape, loader, package boundary, trust, marketplace or registry drift | schema, discovery, package export, fixture install, security scan |
| `background-agent-scheduler` | cron, queues, leases, retries, concurrency, idempotency, stuck-loop recovery | deterministic scheduler tests, race tests, stress tests, checkpoint/reclaim |
| `agent-distribution-release` | install, package contents, Docker, cross-platform, lockfiles, supply-chain | install smoke, package dry run, Docker smoke, OS matrix, lock checks |
| `agent-evals-quality` | model behavior regressions, prompt drift, rubric quality, answer grounding | eval suite, baseline comparison, LLM/human judge, qcloop batch |

A project MAY combine profiles. For example OpenClaw combines channel gateway, tool gateway, distribution, live provider, and plugin profiles.

## Interaction surfaces

A project profile says what the project owns. An interaction surface says where users or operators observe the Agent. `qc_case.surface` is optional in the JSON schema but SHOULD be present for user-visible gates.

| Surface | Applies to | Extra evidence required |
| --- | --- | --- |
| `cli-stream` | command output, JSONL/NDJSON, stdout/stderr | exit status, stdout/stderr transcript, structured event sample |
| `tui` | terminal UI, Ink, ratatui, curses | terminal snapshot, viewport size, key sequence, runtime transcript |
| `webui` | browser dashboard, extension UI, admin/QA console | screenshot/trace, console log, route state, browser-only assertion |
| `desktop-gui` | Tauri, Electron, native shell | shell start evidence, bridge health, workspace/session readiness, OS note |
| `browser-automation` | CDP, Playwright, browser-use, remote browser providers | screenshot, DOM/a11y snapshot, console/network log, cleanup evidence |
| `channel-ui` | mobile, QR, chat apps, webhook surfaces | channel transcript, media fixture, auth/webhook replay, device/emulator log |
| `eval-ui` | QA dashboards and semantic evaluation reports | rubric, judge output, baseline delta, reviewer note |

A `ui-interaction` gate SHOULD name one of these surfaces. A pass without surface-specific evidence is incomplete. Surface proof SHOULD connect entrypoint, user action, visible frame, runtime backing, and cleanup evidence.

## Core objects

| Object | Purpose |
| --- | --- |
| `qc_plan` | A test plan for one change, release, investigation, or regression sweep. |
| `qc_case` | One behavior-level item with steps, expected result, required gates, and evidence. |
| `qc_gate` | A validation boundary such as static, unit, contract, integration, e2e, live, stress, release, or review. |
| `qc_run` | One execution attempt with command, executor, environment, output refs, duration, and result. |
| `qc_evidence` | A reference to logs, reports, traces, screenshots, fixtures, qcloop attempts, CI runs, or review notes. |
| `qc_verdict` | A judgment over evidence: passed, failed, blocked, exhausted, waived, or needs-review. |
| `qc_report` | The aggregate result, remaining risk, waivers, and next action. |

## Gate families

| Family | Purpose | Evidence examples |
| --- | --- | --- |
| `static` | format, lint, type, dependency and policy hygiene | command logs, SARIF, lockfile check output |
| `unit` | deterministic local behavior | test report, coverage, fixture output |
| `property-fuzz` | invariants and generated input | seed, corpus, failing case artifact |
| `contract-protocol` | schemas, APIs, generated clients, command/tool surfaces | contract report, schema diff, mock transcript |
| `fake-integration` | integration against fake servers or local adapters | fake server log, request/response transcript |
| `runtime-e2e` | real CLI/runtime/task flow without external provider risk | CLI transcript, process cleanup evidence, state snapshot |
| `ui-interaction` | GUI/TUI/browser/terminal behavior | screenshot, trace, video, accessibility report |
| `live-provider` | opt-in real provider or network path | redacted transcript, credentials-scope note, cost/budget |
| `stress-concurrency` | races, leases, retries, long-running loops | stress report, worker timeline, seed, benchmark |
| `distribution-release` | install, package, Docker, cross-platform release readiness | tarball manifest, Docker smoke, OS matrix, release check |
| `semantic-eval` | model output quality, grounding, policy, user intent | eval result, rubric, judge output, baseline delta |
| `review` | human or LLM review | reviewer decision, rubric, evidence refs |

## Status values

`qc_case.status`, `qc_gate.status`, and `qc_report.status` use:

- `planned`
- `running`
- `passed`
- `failed`
- `blocked`
- `exhausted`
- `waived`
- `skipped`
- `needs-review`

A waived gate MUST include `waiver.reason`, `waiver.approver`, and `waiver.expires` when the project has a waiver process.

## Evidence rules

A `passed` verdict MUST include evidence. A `failed` verdict MUST include the smallest actionable failure. A `blocked` verdict MUST identify the missing environment fact. An `exhausted` verdict MUST preserve attempts and verifier feedback.

Self-report is not evidence. The sentence "the agent checked it" is only valid when it links to command output, test report, transcript, trace, screenshot, or review record.

## qcloop mapping

A `qc_case` can become a qcloop `item_value`. qcloop `attempt` maps to `qc_run`; qcloop `qc_round` maps to `qc_verdict`; qcloop `exhausted` maps to Agent QC `exhausted`, not generic failure.

Use qcloop when cases are repeated, independent, and verifier-friendly. Do not use qcloop to replace required project gates or to hide live-provider risk.


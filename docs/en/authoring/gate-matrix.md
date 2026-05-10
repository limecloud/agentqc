---
title: Gate matrix
description: Generic Agent QC gate matrix.
---

# Gate matrix

The gate matrix maps Agent project profiles, surfaces, and risk changes to validation gates. It defines the minimum evidence needed before a report can claim a pass.

Gate names are families, not framework commands. A project maps each family to local scripts, CI jobs, qcloop items, or review workflows.

## Profile defaults

| Profile | Minimum gate families | Optional escalation gates |
| --- | --- | --- |
| `agent-runtime-cli` | `static`, `unit`, `contract-protocol`, `runtime-e2e` | `property-fuzz`, `stress-concurrency`, `live-provider`, `distribution-release` |
| `agent-sdk-api` | `static`, `unit`, `contract-protocol`, `fake-integration` | `distribution-release`, `live-provider`, `semantic-eval` |
| `agent-tool-mcp-gateway` | `contract-protocol`, `fake-integration`, `runtime-e2e` | `stress-concurrency`, `live-provider`, `review`, `property-fuzz` |
| `multi-channel-agent-gateway` | `static`, `unit`, `contract-protocol`, `fake-integration` | `live-provider`, `distribution-release`, `semantic-eval`, `stress-concurrency` |
| `agent-ui-tui-desktop` | `static`, `unit`, `ui-interaction` | `runtime-e2e`, `contract-protocol`, `live-provider`, `review`, `stress-concurrency` |
| `agent-skills-plugins` | `static`, `contract-protocol`, `fake-integration` | `distribution-release`, `review`, `semantic-eval`, `live-provider` |
| `background-agent-scheduler` | `unit`, `fake-integration`, `stress-concurrency` | `runtime-e2e`, `live-provider`, `review`, `distribution-release` |
| `agent-distribution-release` | `static`, `distribution-release` | `runtime-e2e`, `live-provider`, `review`, `stress-concurrency` |
| `agent-evals-quality` | `semantic-eval`, `review` | `live-provider`, `stress-concurrency`, `distribution-release` |

## Surface add-ons

If a case names a surface, add surface evidence on top of the profile default.

| Surface | Minimum add-on | Stronger proof |
| --- | --- | --- |
| `cli-stream` | command log, exit status, stdout/stderr transcript | structured event assertion, malformed stream fixture, cleanup proof |
| `tui` | terminal snapshot, viewport, key sequence | multi-viewport, ANSI/Unicode, interrupt, approval, runtime transcript |
| `webui` | screenshot or browser trace, console log | Playwright trace, a11y/DOM snapshot, reload/resume, network log |
| `desktop-gui` | shell start, bridge health, screenshot | workspace readiness, native command contract, OS matrix, trace |
| `browser-automation` | screenshot and DOM/a11y snapshot | console/network, SSRF/navigation safety, orphan cleanup, trace/video |
| `channel-ui` | webhook/channel transcript, auth proof | media fixture, replay, device/emulator log, live opt-in lane |
| `eval-ui` | rubric, judge output, report export | baseline delta, reviewer annotation, failing examples, dashboard screenshot |

## Change-risk escalation

Escalate gates when the change touches:

| Risk touched | Add gates |
| --- | --- |
| permission, sandbox, credential, or secret handling | `contract-protocol`, `runtime-e2e`, `review`; add `property-fuzz` for path/parser boundaries |
| protocol, schema, generated client, command, or manifest shape | `contract-protocol`, `fake-integration`, generated artifact drift check |
| persistent state, migration, queue, or scheduler | `unit`, `runtime-e2e`, `stress-concurrency`, recovery evidence |
| user-visible GUI/TUI/WebUI/desktop behavior | `ui-interaction`, surface evidence, stable regression |
| browser automation or remote browser provider | `browser-automation` surface proof, cleanup, console/network, safety fixtures |
| webhook, chat channel, mobile, QR, or media flow | `channel-ui`, auth/media replay, redaction, optional `live-provider` |
| package/install/release metadata | `distribution-release`, clean install, manifest, version/lock consistency |
| live provider, external network API, or model backend | explicit `live-provider`, credential scope, budget, redaction |
| model prompt, rubric, eval, or judge behavior | `semantic-eval`, `review`, baseline delta, examples |
| multi-agent, subagent, background, or remote teammate work | `runtime-e2e`, `stress-concurrency`, surface/task evidence |

## Minimal and strong gates

| Claim | Minimal gate | Stronger gate |
| --- | --- | --- |
| "Runtime command works" | command log and exit status | fake provider transcript, structured events, cleanup proof |
| "Tool/MCP bridge works" | schema/contract check | fake server recovery, permission denial, stdio/http disconnect |
| "TUI approval works" | terminal snapshot | key sequence, runtime action request/response transcript, cancel/reconnect variants |
| "WebUI flow works" | component assertion | browser trace, console/network, a11y, reload/resume |
| "Desktop app works" | shell start | bridge health, workspace readiness, native command contract, screenshot |
| "Browser automation works" | screenshot | DOM/a11y, console/network, cleanup, safety fixtures |
| "Channel adapter works" | contract fixture | webhook replay, media, redaction, live opt-in |
| "Scheduler works" | deterministic unit | restart/reclaim, duplicate-work proof, race/stress |
| "Package is releasable" | build output | clean install, package manifest, Docker/OS matrix, supply-chain |
| "Model quality improved" | one rubric pass | baseline delta, judge output, human review, failing examples |

## Evidence minimums

- `static` gates need command logs, CI URLs, or SARIF-style reports.
- `contract-protocol` gates need schema/contract reports, transcript refs, or failing ids.
- `runtime-e2e` gates need CLI/runtime transcripts, state snapshots, or process-cleanup proof.
- `ui-interaction` gates need stable assertions plus screenshots, traces, videos, terminal snapshots, or accessibility output.
- `live-provider` gates need redacted request/response refs, credential scope, and budget/cost notes.
- `distribution-release` gates need package manifests, install output, Docker smoke, or OS matrix proof.
- `semantic-eval` gates need rubric, model/judge outputs, baseline delta, and waiver threshold.

## Framework mapping examples

| Ecosystem | Gate mapping |
| --- | --- |
| Rust/Codex-like | `cargo nextest`, targeted crate tests, Bazel test/build, schema fixture writers, fake model server, ratatui snapshots |
| JS/OpenClaw-like | Vitest projects, changed-test router, contract configs, live configs, Docker smoke, QA Lab report lanes |
| Python/Hermes-like | pytest markers, xdist, integration exclusion by default, credential blanking, e2e directory, ruff/ty |
| Desktop GUI / native bridge | local verify, command contracts, bridge health, GUI smoke, Playwright continuation, native backend tests |

## Anti-patterns

| Anti-pattern | Why it fails |
| --- | --- |
| One `npm test` checkbox for all profiles | hides surface/live/release risk |
| Screenshot-only UI pass | no runtime backing |
| Contract-only tool pass | no runtime recovery proof |
| Live provider in default unit lane | flaky and unsafe by default |
| Release build without install smoke | package may be unusable |
| Waiver with no owner/expiry | unbounded risk |

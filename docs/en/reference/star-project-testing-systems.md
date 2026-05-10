---
title: Star project testing systems
description: Detailed testing-system case studies for representative Agent projects.
---

# Star project testing systems

This reference explains how several strong Agent projects organize testing. Agent QC does not copy their commands as a universal recipe. It extracts reusable test architecture: how each project separates deterministic tests from live provider risk, how UI/TUI/WebUI evidence is captured, and how runtime/protocol facts are connected to visible surfaces.

## How to read this page

- Treat each local repository as a case study, not as a normative dependency.
- Copy the testing shape, not the exact stack.
- Keep limitations explicit. The Claude Code local snapshot has useful interface code but no local `package.json` or workflow metadata, so this page does not claim upstream CI behavior for that snapshot.
- When a project has UI, require both surface proof and runtime proof.


## Agent UI and Agent Skills lessons applied here

This page treats Agent UI as a primary reference for surface testing. The reusable lessons are:

- UI/TUI/WebUI/desktop states must be runtime-backed projections, not independent truth.
- Final answer text must stay separate from reasoning, tool progress, approvals, artifacts, evidence, diagnostics, and team events.
- Missing runtime facts must render as `unknown`, `unavailable`, `stale`, or `blocked`, not guessed success.
- Controlled writes such as approval, interrupt, queue, steer, artifact edit, evidence export, review, or replay must go through the owning API.
- Old sessions and long-running work need progressive hydration and surface-specific evidence.
- Metrics such as first status, first text, bridge readiness, queue wait, trace size, and cleanup time are part of QC evidence.

Agent Skills contributes the authoring style: short entrypoints, frontmatter, field tables, minimal examples, progressive disclosure, eval loops, assertion grading, and transcripts. Agent QC uses that style for quality plans rather than skill packages.

## Framework documentation lessons

Official framework docs are used as examples of evidence shape, not as mandatory tool choices:

| Framework | Reusable QC lesson |
| --- | --- |
| Playwright | Projects/devices, `webServer`, retries, reporters, trace/screenshot/video policies, and test isolation are portable browser-evidence concepts. |
| Vitest | `run`, projects/workspaces, JSON/JUnit reporters, coverage, snapshots, and browser mode map JS projects into deterministic and browser lanes. |
| pytest | markers and `-m` selection, skip/xfail, parametrization, xdist, and JUnit-style reports help Python projects separate deterministic, integration, e2e, and live suites. |
| cargo nextest/Bazel | fast Rust workspace runs, no-fail-fast behavior, release binary builds, and generated schema checks show how runtime projects layer local and release evidence. |

## Cross-project surface map

| Project | Runtime CLI / stream | TUI | WebUI | Desktop GUI | Browser automation | Channel/mobile | Eval/report UI | Release/distribution |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Codex | strong: `codex exec`, JSON/event processors, SSE fixtures | strong: ratatui/insta snapshots | indirect: app-server/client protocol surfaces | no desktop shell in inspected repo | limited through app/server tooling, not primary | no | review/protocol artifacts | strong: Bazel, release binaries, npm packages |
| Claude Code local snapshot | visible SDK stream adapters and commands | visible Ink surface and command views | not enough metadata to claim | no | remote bridge/control surfaces | no | no | not enough metadata to claim |
| OpenClaw | strong gateway/CLI/router tests | dedicated `tui` command and TUI lanes | strong control UI and QA Lab web runtime | platform release paths, mac/mobile scripts | QA Lab browser runtime, Docker/browser lanes | strong channel contracts, QR, Android/iOS, live transports | strong QA Lab scenarios/reports | strong Docker/install/release checks |
| Hermes Agent | strong Python CLI/gateway tests | strong `ui-tui` Vitest package | Vite/React dashboard package | no native shell in inspected repo | strong browser supervisor/CDP/Camofox/SSRF tests | strong gateway/channel tests | release notes and web/dashboard surfaces | Docker, uv lock, OSV, package checks |

Agent QC conclusion: a project can be "well tested" in one surface and still under-tested in another. Do not collapse all UI proof into one boolean.

## Shared test architecture pattern

Across the projects, the useful pattern is:

1. **Local deterministic lane**: format, lint, typecheck, unit, contract, fake integration.
2. **Runtime lane**: real CLI/task/session flow with fake provider or local server.
3. **Surface lane**: TUI/WebUI/GUI/browser/channel evidence with screenshots, snapshots, traces, or transcripts.
4. **Live lane**: opt-in real provider/channel/model tests with redaction and budget.
5. **Distribution lane**: install, Docker/package, cross-platform, release manifest, lock/supply-chain checks.
6. **Review/eval lane**: semantic quality, rubric, baseline diff, human or LLM review.

Agent QC plans should name which lanes apply and which lanes are intentionally out of scope.

## Codex: runtime CLI plus TUI plus protocol stack

Local source: `/Users/coso/Documents/dev/rust/codex`.

### Product shape

Codex combines several Agent product shapes:

- Rust runtime CLI and task loop.
- `codex exec` and structured stream outputs.
- TUI implemented with ratatui and snapshot tests.
- MCP/tool gateway, app server, app-server protocol, SDKs, release packaging, and sandbox layers.
- Cross-platform sandbox and process execution policies.

### How tests are organized

| Layer | Concrete signals | Agent QC interpretation |
| --- | --- | --- |
| Repository policy | root `AGENTS.md` tells contributors to run targeted crate tests first, then full `cargo test`/`just test` when common/core/protocol changed | targeted verification before broad sweeps |
| Local Rust lane | `just test` runs `cargo nextest run --no-fail-fast`; `cargo test -p <crate>` for focused work | deterministic `unit` and `runtime-e2e` evidence |
| Bazel lane | `bazel test //... --keep_going`, Bazel clippy, module lock checks, release binary builds | cross-toolchain parity and release confidence |
| Supply/policy lane | `cargo-deny`, codespell, clippy, argument-comment lint, lock checks | `static` and `distribution-release` hygiene |
| Sandbox/process lane | `exec_policy_tests`, Windows sandbox tests, sandbox tag tests, Landlock/bwrap/seatbelt-related tests | permission boundary and platform-specific runtime gates |
| Tool/protocol lane | MCP fixtures, app-server v2 protocol tests, schema fixture regeneration, dynamic tools, request permission tests | `contract-protocol` and fake integration |
| Stream lane | SSE end-to-end tests, fake response helpers, stream event utilities, JSON/event processor tests | stream shape evidence before semantic claims |
| TUI lane | ratatui/insta snapshots across chat widget, bottom pane, approval overlay, footer, request-user-input, MCP elicitation | TUI `ui-interaction` evidence |
| SDK/API lane | TypeScript SDK event/thread APIs and app-server client surfaces | `agent-sdk-api` contract evidence |
| Release lane | Bazel release binaries, npm/native package build scripts, Windows/zsh release workflows | `distribution-release` gate |

### TUI details worth standardizing

Codex demonstrates that TUI testing needs more than a screenshot:

- terminal-width and height variants: narrow, standard, and large terminals;
- approval overlays for exec, patch, network, cross-thread, and additional permissions;
- footer states: idle, running, Ctrl-C quit, Ctrl-C interrupt, Esc hint, queue hint, mode indicator, context/token status;
- request-user-input forms: options, freeform, multi-question, tight height, hidden options, long option text;
- model/session pickers: model migration prompt, fixed/auto column widths, narrow rows, scroll states;
- composer edge cases: paste, backspace after paste, slash popup, mention popup, plugin popup, remote image rows, shell-command mode;
- history/chat frames: diff syntax, code blocks, completed hook output, pending input, stream deltas, compact/resume/fork shapes;
- MCP and app-server states: MCP startup failures, elicitation forms, app-server collaboration and guardian review states;
- platform-specific snapshots such as Windows approval popup variants.

Agent QC rule: a TUI pass should cite terminal snapshots **and** runtime transcripts. Snapshot-only proof shows rendering; transcript-linked proof shows the rendering came from the correct Agent event.

### Runtime details worth standardizing

Codex separates deterministic runtime tests from live/provider risk:

- fake model server and SSE fixtures test stream shape without burning provider budget;
- app-server protocol tests assert wire shape independently from the TUI;
- apply-patch tests cover CLI and tool surfaces;
- exec/unified process tests preserve command output, cleanup, and failure semantics;
- sandbox tests assert denied actions and platform policy transforms;
- schema fixture writers make protocol drift reviewable.

Agent QC rule: CLI/runtime projects need `contract-protocol` and `runtime-e2e` gates before `semantic-eval` can be trusted.

### What to copy into Agent QC plans

For a Codex-like project, include cases such as:

- denied unsafe command produces a visible controlled error and non-success runtime event;
- apply-patch success/failure has stable CLI transcript and patch result;
- MCP tool declaration round-trips through config, server fixture, runtime event, and TUI row;
- Ctrl-C interrupts a running turn without leaving orphan subprocesses;
- app-server protocol schema diff is reviewed when command shape changes;
- release package contains expected native binaries and platform helpers.

## Claude Code local snapshot: TUI/runtime surface under incomplete repo metadata

Local source: `/Users/coso/Documents/dev/js/claudecode`.

### Source limitation

The inspected local snapshot contains source files under `src/` and `vendor/`, but no local `package.json`, lockfile, or GitHub workflow metadata. Agent QC must therefore avoid claiming upstream CI, test commands, package coverage, or release guarantees from this snapshot. The useful signal is interface-surface shape.

### Product surfaces visible in the snapshot

| Surface | Local indicators | Agent QC gate |
| --- | --- | --- |
| Ink TUI | `src/ink.ts`, `.tsx` command views, terminal focus/input/selection hooks, task views | TUI `ui-interaction` |
| Command palette | many `src/commands/**` handlers and renderable command views | command routing and TUI state snapshots |
| Remote session bridge | `src/remote/RemoteSessionManager.ts`, `src/remote/SessionsWebSocket.ts`, server direct connect manager | `contract-protocol`, `runtime-e2e` |
| Permission flow | `remotePermissionBridge.ts`, control schemas with `can_use_tool`, synthetic assistant/tool confirmation flow | high-risk TUI + protocol evidence |
| SDK stream | `src/remote/sdkMessageAdapter.ts`, `src/entrypoints/agentSdkTypes.ts`, stream/control schemas | `agent-sdk-api` stream contract |
| Skills/plugins | SDK schemas include skills/plugins; output style/plugin loading code is visible | `agent-skills-plugins` |

### What the standard should require

A Claude Code-style TUI runtime should prove:

- success, empty, error, cancelled, reconnecting, disconnected, and remote states render distinctly;
- command views route to the same state transitions as slash commands or command palette entries;
- permission prompts show tool name, request id, proposed input, permission suggestions, and deny/allow outcome;
- remote permission responses preserve request correlation and behavior (`allow`, `deny`, or project-specific modes);
- server-side cancellation removes or marks the pending prompt instead of leaving stale approvals visible;
- reconnect/interrupt cannot leave the TUI showing stale success;
- SDK stream adapters preserve event type, session id, tool-use id, and partial/final message semantics;
- tool results from a remote server render as tool results, not as prompt echoes;
- plugin/skill reload events cannot silently change allowed tools without a visible status or audit event.

### Evidence recipe

A minimal QC case should collect:

1. pseudo-terminal transcript of a remote permission request;
2. TUI snapshot showing the synthetic confirmation row;
3. WebSocket/control transcript for `can_use_tool` request and response;
4. SDK stream fixture proving event conversion;
5. negative case for cancellation or disconnect.

Agent QC rule: when repo metadata is incomplete, write the limitation into `evidence_policy` and require interface-level evidence instead of inventing a CI story.

## OpenClaw: multi-channel gateway plus WebUI plus QA Lab

Local source: `/Users/coso/Documents/dev/js/openclaw`.

### Product shape

OpenClaw is a dense Agent system:

- multi-channel gateway for provider/channel integrations;
- plugin ecosystem and plugin SDK;
- CLI, gateway, TUI command, control WebUI, Android/iOS/macOS platform paths;
- QA Lab extension with web runtime, browser runtime, scenario runner, live transport tests, and reports;
- Docker/install/release smoke paths;
- live provider lanes for models, gateways, and CLI backends.

### How tests are organized

OpenClaw's `package.json` exposes many lanes. The important Agent QC pattern is the separation, not the number of commands.

| Layer | Concrete signals | Agent QC interpretation |
| --- | --- | --- |
| Test router | `node scripts/test-projects.mjs`, `test:changed`, `test:max`, serial/max-worker variants | changed-scope and profile-aware gate selection |
| Static/policy | `check`, `lint`, import-cycle checks, LOC checks, host env policy, webhook/auth boundary lints | `static` plus security policy |
| Unit/gateway lanes | `test:unit`, `test:gateway`, gateway client/server/method configs | deterministic runtime and gateway behavior |
| Contract lanes | `test:contracts:channels`, `test:contracts:plugins`, plugin SDK export/API checks, protocol generation checks | `contract-protocol` for channel/plugin/runtime boundaries |
| WebUI lane | `test:ui`, `ui` package tests, browser-playwright-style UI config tests | `webui` under `ui-interaction` |
| TUI/platform lanes | `tui`, TUI scripts, `test:windows:ci`, `test:macos:ci`, Android/iOS unit/integration scripts | surface-specific UI/platform proof |
| QA Lab lane | `extensions/qa-lab` scenario catalog, web runtime, browser runtime, reports, live transports, suite summary JSON | `agent-evals-quality`, `eval-ui`, `webui`, `browser-automation` |
| Channel lanes | channel configs for Telegram/Matrix/Discord/Feishu/Zalo/etc., webhook/media/auth tests | `multi-channel-agent-gateway` |
| Live provider lanes | `test:live:*`, live model profiles, live gateway Docker lanes, live CLI backend lanes for Claude/Codex/Gemini-style backends | explicit `live-provider` with opt-in |
| Docker/install lanes | install smoke, OpenWebUI Docker, MCP channels Docker, QR import, plugins Docker, gateway network Docker | `distribution-release` and runtime smoke |
| Release lanes | `release:check`, npm checks, plugin release checks, version sync | release readiness and package boundary proof |
| Performance lanes | startup bench, import duration, perf budget, memory checks | performance risk gates |

### WebUI details worth standardizing

OpenClaw shows that WebUI proof should be layered:

- component/state tests for navigation, chat normalization, settings, controller panels, usage panels, tool cards, and config surfaces;
- browser-only tests for focus, markdown, sidebar status, external links, image opening, and browser APIs;
- QA Lab web runtime tests for scenario execution and report rendering;
- Docker-hosted OpenWebUI smoke to prove integration in a clean environment;
- console/network evidence whenever browser behavior is under test.

Agent QC rule: when behavior depends on DOM, focus, browser APIs, markdown sanitization, navigation, or report rendering, `webui` evidence must include browser-level artifacts, not just jsdom/component tests.

### Channel/provider details worth standardizing

OpenClaw makes four separations that Agent QC should require:

- channel contract tests are not live channel tests;
- fake provider integration is not live provider coverage;
- media/webhook/auth replay is separate from model semantic quality;
- plugin boundary tests are separate from runtime gateway tests.

Examples of useful case shapes:

- secret refs are redacted and inactive channel credentials cannot be used;
- QR import creates a scoped session and can be replayed in Docker smoke;
- webhook body verification happens before parsing user content;
- media attachments preserve type/size limits and redaction;
- live transport credentials are leased, timed out, and redacted in reports;
- control WebUI shows actual gateway status, not cached healthy state.

Agent QC rule: `multi-channel-agent-gateway` projects should never hide live-provider assumptions inside ordinary unit tests.

## Hermes Agent: Python agent plus TUI plus browser/web tools plus scheduler

Local source: `/Users/coso/Documents/dev/python/hermes-agent`.

### Product shape

Hermes combines:

- Python Agent runtime, CLI, toolsets, gateway, and ACP/MCP adapters;
- pytest-based backend tests;
- browser, web provider, CDP, Camofox, Browserbase-style provider, and SSRF hardening tests;
- cron/background scheduler, checkpointing, approval, restart/retry, and concurrency surfaces;
- `ui-tui` Ink/React TUI package with Vitest tests;
- `web` Vite/React dashboard package;
- Docker image, uv lock, OSV/security, and release checks.

### How tests are organized

| Layer | Concrete signals | Agent QC interpretation |
| --- | --- | --- |
| Canonical runner | `scripts/run_tests.sh` pins `-n 4`, `TZ=UTC`, `LANG=C.UTF-8`, `PYTHONHASHSEED=0`, activates venv, blanks credential env vars, excludes integration/e2e by default | reproducible local evidence and credential hygiene |
| Pytest backend | `tests/` with gateway, cron, CLI, ACP, browser/tool, security, restart, retry, queue, platform tests | deterministic `unit`, `fake-integration`, `runtime-e2e` |
| Tool safety | write deny, file guards, symlink confusion, URL safety, yolo/approval modes, env passthrough | permission/sandbox gates |
| Browser/web | browser supervisor, browser hardening, CDP, local SSRF, Camofox state, web providers | `browser-automation` gates |
| Gateway/channel | Discord, Feishu, Matrix, Mattermost, Google Chat, QQBot, delivery, media, reconnect, dedup, pairing, roles/DM scope | `channel-ui` and gateway contracts |
| MCP/OAuth/ACP | MCP e2e, OAuth metadata, SSE transport, reconnect, circuit breaker, tool 401 handling, ACP approval isolation | `contract-protocol` and recovery |
| Scheduler | cron jobs, cron prompt injection, inactivity timeout, workdir, scheduler MCP init, checkpoint/session cleanup | `background-agent-scheduler` |
| TUI | `ui-tui` Vitest: terminal parity, viewport, virtual history, slash parity, streaming markdown, OSC52, clipboard, terminal modes | TUI `ui-interaction` |
| Web dashboard | `web` package uses Vite/React build and lint scripts | `webui` when dashboard behavior changes |
| Distribution | Dockerfile builds browser dashboard/TUI assets; uv lock; OSV/security notes | `distribution-release` and supply chain |

### TUI/terminal details worth standardizing

Hermes TUI tests cover practical terminal mechanics:

- text wrapping, virtual history heights, scroll, viewport stores, precision wheel;
- terminal modes, truecolor, OSC52 clipboard, emoji, math Unicode, syntax/markdown;
- slash command parity, gateway events, session lifecycle, queue handling, turn store, state isolation;
- streaming markdown, reasoning/details rendering, subagent tree, status ticker;
- text input navigation, pass-through, wrapping, completion, composer state.

Agent QC rule: TUI testing should include terminal input/output mechanics, not only component snapshots.

### Browser and web details worth standardizing

Hermes browser/tool tests map directly to Agent QC:

- browser supervisor health and orphan reaper;
- browser hardening and local SSRF protections;
- CDP override, browser console, and local provider behavior;
- Camofox persistence/state isolation;
- Brave/DDGS/SearXNG/Tavily-like web provider contracts;
- CLI browser connect and gateway browser-related command tests.

Agent QC rule: browser automation gates must include safety and cleanup evidence, not only screenshots.

### Scheduler/channel details worth standardizing

Hermes shows why background agents need their own gate family:

- cron prompt injection must be scanned after skills/context are assembled, not only at user input;
- scheduler restart must not duplicate work or lose checkpoints;
- inactivity timeout should track real tool activity, not wall-clock time alone;
- gateway restart/retry/dedup tests should preserve message ids and delivery state;
- credential-shaped environment variables must be blanked or scoped in tests.

Agent QC rule: a background scheduler pass should include deterministic clock/env settings, checkpoint evidence, and cleanup evidence.

## Cross-project extraction

Agent QC generalizes these projects into ten reusable rules:

1. Start from owned risk, not from language or framework.
2. Split UI surface proof from runtime/protocol proof, then connect them with evidence refs.
3. Keep fake integration, live provider, and release smoke as separate gates.
4. For TUI/WebUI/GUI, preserve surface artifacts: snapshots, traces, screenshots, console logs, terminal transcripts.
5. For browser automation, require DOM/a11y plus console/network plus cleanup evidence.
6. For channel/mobile, separate webhook/media/auth replay from live provider tests.
7. For background agents, pin deterministic time/env/worker settings and preserve checkpoint evidence.
8. For SDK/protocol surfaces, use generated schema diffs and fake servers before live runs.
9. For release claims, test package contents and installation paths, not just source tests.
10. For incomplete local snapshots, record what was inspected and what cannot be inferred.

## Recommended Agent QC case mix

| Risk | Minimum case | Stronger case |
| --- | --- | --- |
| Permission prompt | snapshot/frame shows prompt, transcript shows request id | allow/deny/cancel/reconnect variants with protocol transcript |
| Tool stream | fake provider stream parses and renders | malformed stream, tool error, partial/final event, retry, abort |
| TUI rendering | one stable snapshot | multi-viewport, key sequence, Unicode/ANSI, runtime-linked transcript |
| WebUI control | component state test | browser trace, console/network, keyboard/a11y, reload/resume |
| Desktop bridge | shell starts | bridge health, workspace readiness, native command contract, screenshot |
| Browser control | screenshot | DOM/a11y, console/network, cleanup, SSRF/navigation safety |
| Channel adapter | contract fixture | webhook replay, media fixture, redacted transcript, live opt-in lane |
| Scheduler | deterministic unit | restart/reclaim, concurrency, checkpoint, duplicate-work prevention |
| Eval report | rubric exists | baseline delta, judge output, failing examples, reviewer note |
| Release | build succeeds | package manifest, install smoke, Docker/platform matrix, lock/security check |

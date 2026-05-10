---
title: Interaction surface testing
description: Agent QC rules for CLI streams, TUI, WebUI, desktop GUI, browser automation, channel UI, and eval UI surfaces.
---

# Interaction surface testing

Agent QC treats every user-visible or operator-visible surface as a first-class quality boundary. A generic `ui-interaction` gate is not enough. A plan must name the surface, explain which runtime facts the surface displays, and keep evidence that lets another reviewer replay the judgment.

This page follows the Agent Skills documentation style intentionally: short normative rules first, then deeper playbooks and templates for the cases that need them. The goal is progressive disclosure for QC authors, not a single huge checklist that every project blindly copies.

## Core rule

A surface test passes only when all five links in the evidence chain are visible:

1. **Entry**: the command, URL, app shell, channel, or device used to reach the surface.
2. **Action**: the typed command, key sequence, click, webhook, message, or eval run.
3. **Frame**: what the user saw: terminal frame, screenshot, DOM snapshot, channel transcript, or report page.
4. **Runtime backing**: the event, request, tool call, model stream, bridge health, process state, or database state that produced the frame.
5. **Cleanup**: exit status, detached process check, browser/session cleanup, credential redaction, and remaining risk.

If a report has a screenshot but no runtime backing, it is visual smoke. If it has a backend log but no frame, it is not a surface test.

## Surface taxonomy

| Surface | Typical products | Main risks | Minimum evidence |
| --- | --- | --- | --- |
| `cli-stream` | non-interactive commands, `exec`, JSONL, NDJSON, stdout/stderr | malformed events, wrong exit code, hidden tool failure, leaked subprocesses | command log, exit status, stdout/stderr transcript, structured sample, cleanup note |
| `tui` | Ink, ratatui, curses, terminal workbench | wrapping, ANSI/Unicode width, resize, interrupt, permission prompts, stale status rows | terminal snapshot, pseudo-terminal transcript, viewport size, key sequence log, runtime transcript |
| `webui` | browser dashboard, extension UI, admin console, QA lab | route drift, stale state, console/network errors, unsafe markdown, inaccessible approval controls | component report, browser trace, screenshot, DOM/a11y snapshot, console/network log |
| `desktop-gui` | Tauri, Electron, native shell, WebView app | bridge readiness, native permission, window lifecycle, first-run state, OS differences | shell start evidence, bridge health, screenshot/trace, OS/windowing note, workspace/session readiness |
| `browser-automation` | Playwright/CDP/browser-use/computer-use runtime | detached session, unsafe navigation, stale screenshot, no console proof, orphan browser | browser trace, screenshot, DOM/a11y snapshot, console/network log, cleanup evidence |
| `channel-ui` | mobile app, QR flow, Telegram/Discord/Slack/Matrix/webhook | auth drift, webhook replay, media handling, provider policy, group/DM scope | redacted transcript, webhook replay, media fixture, device/emulator log, credential scope note |
| `eval-ui` | QA dashboard, semantic eval runner, review/report UI | rubric drift, baseline hidden change, judge blind spot, unreadable report | rubric, judge output, baseline delta, reviewer note, report screenshot/export |

A `qc_case.surface` should be present whenever a case contains `ui-interaction`, channel, browser, CLI stream, or eval report evidence.

## Evidence chain template

Use this minimal shape inside a case report, qcloop item result, or CI artifact:

```json
{
  "surface": "tui|webui|desktop-gui|browser-automation|channel-ui|cli-stream|eval-ui",
  "runtime_backing": "real|fake-provider|mock-bridge|offline-fixture|live-provider",
  "entrypoint": "command, URL, app binary, channel, or device",
  "action": "key sequence, click path, message, webhook, or command args",
  "viewport_or_device": "80x24, Desktop Chrome, macOS Tauri, Android emulator, Telegram webhook, etc.",
  "evidence_refs": ["trace/screenshot/transcript/report refs"],
  "console_or_stderr": "clean|warnings|errors-with-waiver",
  "cleanup": "processes closed, temp state removed, session archived, credentials redacted",
  "remaining_risk": "what this surface test does not prove"
}
```

## CLI stream playbook

Use CLI stream tests when the Agent interface is a command, JSONL stream, headless runtime, or SDK-backed `exec` output.

Required checks:

- capture exact command, environment scope, working directory, exit code, stdout, and stderr;
- assert stream frame types, order, and correlation ids, not just final text;
- include failure fixtures for tool denial, malformed provider events, timeout, abort, and stderr noise;
- check process cleanup when a command starts subprocesses or sidecars;
- when the stream feeds a TUI/WebUI, link the CLI transcript to the visible frame.

Project signals:

- Codex has `codex exec`, JSON/event processors, apply-patch tests, sandbox policy tests, SSE fixtures, and app-server protocol tests.
- OpenClaw has CLI backend live Docker lanes and gateway RPC/protocol tests.
- Hermes has Python CLI tests, gateway command tests, and a canonical pytest runner that strips credential-shaped environment variables.

Common anti-patterns:

- claiming a CLI pass from a model final answer without stdout/stderr evidence;
- testing only success output and not non-zero exits;
- hiding provider/network failures behind retries without preserving the first failure.

## TUI playbook

Use TUI-specific tests for any ongoing terminal UI, even if the same product also has CLI commands.

Required checks:

- render multiple viewport sizes: narrow, standard 80x24, and a larger terminal;
- snapshot history cells, diff blocks, status/footer rows, model/session picker, queued input, permission overlays, and error states;
- simulate Enter, Esc, Ctrl-C, navigation, slash command, paste, resize, image/file rows, and interrupt;
- validate ANSI colors, Unicode width, emoji, CJK, mathematical symbols, OSC52 clipboard, terminal mode transitions, and scroll/virtual height when the product supports them;
- link every important rendered state to runtime transcript: tool call id, permission request id, MCP status, command output, stream event, or session id.

Project signals:

- Codex uses ratatui/insta snapshots for approval overlays, footer states, chat widget layouts, request-user-input forms, MCP elicitation, model picker widths, small terminal heights, remote image rows, and Ctrl-C/Esc footer modes.
- Hermes `ui-tui` uses Vitest around terminal parity, viewport stores, virtual history, OSC52, clipboard, terminal modes, streaming markdown, slash parity, gateway client, session lifecycle, queue handling, and state isolation.
- Claude Code local snapshot exposes an Ink TUI, command `.tsx` views, remote permission bridge, remote session manager, SDK stream adapter, and synthetic tool confirmation rows. Because the snapshot has no package/workflow metadata, QC must require interface evidence and must not invent CI coverage.

Common anti-patterns:

- using a pure component unit test that never renders a terminal frame as proof of TUI readiness;
- only testing a wide terminal;
- not distinguishing Ctrl-C interrupt from Ctrl-C quit;
- verifying only the final assistant message while ignoring approval, streaming, queued, and cancelled states.

## WebUI playbook

Use WebUI tests for dashboards, admin consoles, browser workbenches, extension UIs, QA labs, and report viewers.

Required checks:

- component tests for routing, state transitions, settings, command palette, chat view, tool card, config form, report table, and empty/error/loading states;
- browser-mode or Playwright tests for focus, keyboard navigation, markdown rendering, external links, image/media preview, drag/drop, browser-only APIs, and route reload/resume;
- console and network logs for every smoke/E2E run;
- fake-provider integration before live-provider tests;
- accessibility checks when the UI approves tools, secrets, external actions, or destructive operations.

Project signals:

- OpenClaw separates unit/integration, e2e, live, UI, TUI, channel, extension, contract, performance, Docker, and QA Lab lanes. Its `ui` package uses browser-playwright-style coverage, while `extensions/qa-lab` includes scenario catalogs, web runtime, browser runtime, suite summary JSON, and report tests.
- Lime has React/Vite component tests for workspace, provider settings, skills, browser runtime panels, MCP tools, resources, settings, artifacts, and chat shell; product GUI proof still requires GUI smoke or Playwright evidence.
- Hermes has a Vite/React `web` dashboard package and backend browser/tool tests around browser supervisor, CDP, Camofox, SSRF, and web providers.

Common anti-patterns:

- saying WebUI is ready because backend tests passed;
- not saving browser console/network evidence;
- using fallback mocks that hide an unimplemented bridge;
- testing only happy routes and ignoring reload, resume, empty, error, and permission-denied states.

## Desktop GUI playbook

Use desktop GUI tests when the Agent runs inside Tauri, Electron, native app shells, or WebViews.

Required checks:

- start or reuse the real app shell through the project-supported entrypoint;
- wait for bridge health before judging the page;
- prove default workspace/session readiness, not just window creation;
- record OS, windowing mode, sandbox, real backend vs mock bridge, and first-run assumptions;
- capture screenshot or trace for changed user flows;
- run contract checks when the GUI calls native commands or a typed bridge.

Project signals:

- Lime makes this boundary explicit: GUI deliverability is not proven by `lint`, `typecheck`, or unit tests alone. Its desktop pass combines `verify:local`, `test:contracts`, `verify:gui-smoke`, `bridge:health`, workspace readiness, browser-runtime smoke, and Playwright continuation for real flows.
- OpenClaw desktop/launcher-style release paths use install smoke, Docker smoke, platform lanes, control UI tests, and release checks rather than a single visual test.

Common anti-patterns:

- treating a WebView component test as a desktop shell test;
- not distinguishing DevBridge/native bridge from browser fallback mock;
- skipping first-run, workspace-missing, native permission, restart, and window lifecycle states.

## Browser automation playbook

Use browser automation gates when the Agent controls a browser, observes web pages, or delegates work to CDP/Playwright/browser-use/remote browser providers.

Required checks:

- record navigation target, viewport, user-agent/headless mode, cookies/session scope, and provider;
- keep screenshot plus DOM or accessibility snapshot so visual state is not the only evidence;
- keep console and network logs, including blocked requests and 4xx/5xx responses;
- assert cleanup: browser closed or intentionally reused, pages/tabs detached, orphan reaper passed;
- include security fixtures for local SSRF, unsafe file access, credential leakage, and disallowed navigation.

Project signals:

- Hermes has browser supervisor, browser hardening, local SSRF, CDP override, browser console, Camofox state, and web provider contract tests.
- Lime has browser runtime and site adapter smokes, plus Playwright MCP continuation guidance for user-visible flows.
- OpenClaw QA Lab contains browser runtime and web runtime tests for scenario execution and report surfaces.

Common anti-patterns:

- screenshot-only validation;
- no cleanup evidence;
- no console/network log;
- letting live websites create non-deterministic pass/fail without fixture or waiver.

## Channel and mobile UI playbook

Use channel UI tests when users interact through mobile apps, QR login, chat apps, webhook surfaces, or provider-managed UI.

Required checks:

- replay webhook and media fixtures before live channel tests;
- prove auth scope: group vs DM, channel allowlist, mention rules, webhook secret, pairing token, QR session;
- redact secrets and user identifiers;
- capture channel transcript and message ids;
- include device/emulator logs for mobile surfaces;
- separate contract tests from live provider tests.

Project signals:

- OpenClaw has channel contract lanes, QR import Docker smoke, MCP channels Docker smoke, live transport QA Lab lanes, Android node capability sweep, and many channel-specific auth/media tests.
- Hermes gateway tests cover Discord, Feishu, Matrix, Mattermost, Telegram-style delivery, approvals, restart/retry/dedup, queueing, and platform reconnect patterns.

Common anti-patterns:

- using real provider tests as the only channel coverage;
- recording raw secrets in transcripts;
- testing one channel and assuming all adapters share the same policy behavior.

## Eval and report UI playbook

Use eval UI tests when QC output itself becomes a product: QA dashboard, semantic eval report, human review console, model comparison, or benchmark explorer.

Required checks:

- keep rubric text and version;
- record model/judge identity, baseline version, seed or sampling settings, and prompt set;
- include example pass and fail items;
- assert report rendering, export shape, filter/sort, and reviewer annotations;
- require human review notes when rubric coverage is incomplete.

Project signals:

- OpenClaw QA Lab has scenario catalog, self-check, multipass, suite summary JSON, character/discovery/model-switch evals, reports, live transport lanes, and web runtime.
- Agent Skills recommends eval runs with clean context, assertion grading, human feedback, execution transcripts, and iterative improvement; Agent QC adopts the same evidence-first loop for project QC.

Common anti-patterns:

- unversioned rubric;
- no baseline delta;
- LLM judge output without evidence refs;
- polished dashboard that hides failing cases or waivers.

## Minimum surface suite by project shape

| Project shape | Must-have surface gates | Often-needed companion gates |
| --- | --- | --- |
| Runtime CLI like Codex | `cli-stream`, `tui` if interactive | `contract-protocol`, `runtime-e2e`, sandbox, SDK/API |
| TUI runtime like Claude Code snapshot | `tui`, `cli-stream` for stream adapters | remote permission contract, reconnect/cancel, SDK stream |
| Multi-channel gateway like OpenClaw | `channel-ui`, `webui`, `cli-stream` | channel contracts, live provider, Docker/install, secret redaction |
| Background agent like Hermes | `cli-stream`, `tui`, `browser-automation`, channel UI if gateway-enabled | scheduler stress, checkpoint/recovery, browser safety, Docker smoke |
| Desktop GUI like Lime | `desktop-gui`, `webui` for WebView panels, `browser-automation` if browser runtime exists | bridge contract, native command registration, workspace readiness, Playwright trace |
| Eval suite / QA lab | `eval-ui`, `webui` if dashboard exists | semantic eval, reviewer loop, baseline diff, export schema |

## Waiver rules

A surface gate may be waived only when the report states:

- exact missing capability, such as "no Windows runner" or "no real Telegram credential";
- risk accepted by the waiver;
- expiration or recheck trigger;
- substitute evidence, if any;
- why the release/change can still proceed.

A waiver cannot turn a screenshot-only test into a runtime-backed surface pass. It only documents accepted residual risk.

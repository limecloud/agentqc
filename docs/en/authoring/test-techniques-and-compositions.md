---
title: Test techniques and compositions
description: Advanced Agent QC techniques for snapshots, smoke tests, black-box, white-box, runtime, UI, skills, and composed evidence braids.
---

# Test techniques and compositions

Agent QC gate families describe **why** a boundary must be checked. Test techniques describe **how** evidence is produced. Strong Agent QC plans combine techniques instead of relying on one broad command.

Use this page when a plan says only "run tests" or "do UI smoke" and you need a richer, inspectable strategy for Agent runtime, Agent UI, skills/plugins, browser automation, channel gateways, or release packages.

## Evidence braid rule

A high-confidence Agent test usually braids five strands:

```text
white-box invariant -> protocol/contract -> black-box run -> surface artifact -> cleanup/review
```

Not every case needs all five, but every pass must state which strands are present and which claims remain unproven.

## Technique taxonomy

| Technique | What it proves | Required evidence | What it does not prove alone |
| --- | --- | --- | --- |
| Static/policy check | Formatting, types, import boundaries, generated drift, forbidden APIs | command log, SARIF or lint report, tool version | runtime behavior or UX |
| White-box unit test | Reducers, parsers, serializers, permission decisions, state machines | test report, fixture ids, assertion diffs | packaged app or user-visible behavior |
| Property/fuzz/metamorphic test | Invariants over large or generated input sets | seed, corpus, minimized failure, invariant text | exact user flow |
| Golden transcript | Stable CLI/runtime/protocol/event output shape | transcript file, update diff, dynamic-field normalization | visual layout or live provider quality |
| Snapshot test | Stable rendered output or serialized object | snapshot diff, viewport/device, update review | correctness of the source runtime fact |
| Contract/protocol test | Schema, tool declarations, SDK/API, manifest, transport behavior | schema diff, fake server transcript, generated artifact check | actual live provider behavior |
| Fake integration | Adapter/runtime behavior against a controlled local service | fake server log, request/response refs, fixture version | real provider drift |
| Black-box smoke | Minimal delivered behavior through public entrypoint | command/browser/app/channel log, exit status, screenshot when visible | deep edge cases |
| Runtime E2E | Agent loop, tools, permissions, resume, cleanup | runtime transcript, state snapshot, side-effect proof | UI projection unless linked |
| Surface E2E | User/operator can see and control the behavior | screenshot/trace/terminal frame, key/click/message sequence | underlying runtime truth unless linked |
| Replay/regression | Past failure remains fixed | replay fixture, old bug id, expected failure mode | new unknown failures |
| Stress/concurrency/chaos | Race, lease, retry, cancellation, long-running resilience | worker timeline, seed/config, duration, cleanup | semantic answer quality |
| Security/adversarial | Permission, prompt injection, path, SSRF, secret, policy boundaries | attack fixture, denial transcript, side-effect check | happy path usability |
| Semantic eval | Output quality, grounding, tool choice, policy adherence | dataset, rubric, model/judge, baseline delta | deterministic code correctness |
| Benchmark eval | Runtime/prompt/tool/context candidate improvement | frozen dataset, trial trajectories, reward details, baseline/candidate delta | release safety or P0 QC pass |
| Release/install smoke | Shipped artifact can install and run outside the source tree | package manifest, clean install, Docker/OS log, version output | source tree test coverage |

## Black-box, white-box, and gray-box

| Mode | Agent QC use | Best targets | Evidence pattern |
| --- | --- | --- | --- |
| White-box | Prove internal invariants before a user flow exists | event reducers, permission policy, tool args sanitizer, stream parser, scheduler lease | unit/property report plus fixture ids |
| Black-box | Prove delivered behavior through public entrypoint | CLI command, SDK call, TUI flow, WebUI route, desktop shell, webhook, package install | command or interaction transcript plus exit/status and artifacts |
| Gray-box | Combine public behavior with internal instrumentation | runtime UI, browser agent, channel gateway, background scheduler | black-box run plus protocol/runtime transcript and state snapshot |

Agent projects need gray-box testing more often than ordinary apps because the visible output can be plausible while the runtime state is wrong.

## Snapshot standards

Snapshots are useful only when they are scoped and reviewable.

| Snapshot kind | Use it for | Must include |
| --- | --- | --- |
| Text/golden transcript | CLI output, JSONL/NDJSON stream, model event normalization | stable fixture, exit status, dynamic id redaction |
| Terminal snapshot | TUI frame, approval overlay, footer/status row, composer | terminal size, key sequence, ANSI/Unicode policy |
| DOM/ARIA snapshot | WebUI accessibility tree, browser-mode component state | route, viewport/device, locator or role assertion |
| Screenshot/video | GUI/desktop/browser/channel report surface | action sequence, OS/browser/device, console/network note |
| Protocol/schema snapshot | generated schema, SDK wire contract, MCP/tool declaration | generator command, diff, compatibility note |
| Runtime state snapshot | session/thread/turn/tool/artifact/scheduler state | correlation ids, timestamp policy, cleanup note |
| Package manifest snapshot | tarball/image/install contents | version, platform, file allow/deny policy |

Snapshot rules:

- Normalize timestamps, random ids, temp paths, and provider-specific text before snapshotting.
- Review snapshot updates as product changes, not as mechanical noise.
- Pair UI snapshots with runtime/protocol transcripts when the claim is more than visual layout.
- Pair protocol snapshots with fake integration when the claim is more than schema shape.
- Keep one focused snapshot per behavior; avoid giant snapshots that hide meaningful diffs.

Codex-style TUI testing shows the value of terminal snapshots for approval overlays, footer modes, picker widths, request forms, narrow terminal heights, and diff/code blocks. Hermes-style TUI testing adds terminal mechanics such as OSC52, virtual history, Unicode, streaming markdown, queue state, and session lifecycle. Claude Code-style local source inspection shows that Ink TUI, remote permission, WebSocket control, and SDK stream adapters need snapshot plus control transcript, not snapshot alone.

## Smoke test ladder

Smoke tests are fast confidence checks. They do not replace runtime, contract, or surface evidence.

| Smoke level | Purpose | Examples | Exit rule |
| --- | --- | --- | --- |
| Import/build smoke | Prove package imports or builds | `cargo test -p crate`, `vitest run`, `python -m package --help` | fail fast on syntax/link/import break |
| Runtime smoke | Prove the agent loop starts with fake/local provider | `agent exec "hello"`, fake tool call, MCP list tools | transcript shows terminal status and cleanup |
| Surface smoke | Prove visible shell can open and reflect runtime state | TUI first frame, WebUI route, desktop bridge health, channel webhook replay | surface artifact plus runtime backing |
| Release smoke | Prove artifact works outside source tree | clean install, Docker start, package help/version | install log and manifest match release |
| Canary/live smoke | Prove real provider/channel still works | opt-in provider call, live channel ping, model profile probe | redacted transcript, budget, credential scope |

Use smoke for broad detection and then use targeted tests for diagnosis.

## Testing Agent runtime

Runtime tests should treat the agent as a state machine, not as a text generator.

Minimum runtime invariants:

| Runtime area | Required cases | Evidence |
| --- | --- | --- |
| Turn lifecycle | accepted, queued, running, completed, failed, cancelled | event transcript, terminal status, exit code |
| Stream shape | partial text, reasoning/tool events, final text, terminal marker | JSONL/SSE fixture, parser report, golden transcript |
| Tool execution | declaration, argument validation, progress, result, error | tool id correlation, fake tool transcript, side-effect check |
| Permission/HITL | allow, deny, edit/input, timeout, cancel, reconnect | approval request/response transcript, surface frame |
| Files/processes | cwd, sandbox, patch/write, subprocess tree, cleanup | command log, path fixture, orphan-process proof |
| Resume/persistence | old session, crash/restart, checkpoint, artifact refs | state snapshot, replay transcript, cleanup note |
| Scheduler/parallelism | lease, retry, fanout/fanin, duplicate-work prevention | deterministic clock, worker timeline, stress/chaos result |
| Credential/provider scope | fake by default, live opt-in, redaction, budget | env scope, redacted request/response, waiver if missing |

Runtime anti-patterns:

- asserting only final assistant text;
- hiding provider calls inside default unit tests;
- testing tool declaration but not invocation and failure;
- testing success but not deny/cancel/abort/resume;
- omitting cleanup proof for subprocesses, browsers, workers, or temp state.

## Testing Agent UI

Agent UI tests must prove that visible surfaces are runtime-backed projections.

| UI area | What to test | Strong evidence |
| --- | --- | --- |
| Composer/input | submit, queued input, steer-current, attachments, paste, slash commands | key/click sequence, runtime input id, snapshot |
| Status | first status before text, retrying, blocked, failed, done | runtime event order, UI frame, timing metric |
| Tool cards | safe arg summary, progress, result, error, offload refs | tool id correlation, screenshot/terminal snapshot, transcript |
| Approval/HITL | pending, allow, deny, edit, timeout, cancellation | action request/response transcript, keyboard/a11y proof |
| Artifacts | create, diff, preview, export, failed save | artifact id/path, UI snapshot, export log |
| Evidence/replay | trace links, report export, old-session hydration | evidence ids, report screenshot, hydration log |
| Team/background | queued worker, running worker, failed/retried worker, handoff | delegation graph, task card snapshot, worker transcript |
| Empty/stale states | missing facts, bridge unavailable, reconnecting, blocked | safe fallback frame, console/network log, runtime state ref |

Surface-specific upgrades:

- TUI: multi-viewport, ANSI/Unicode width, Ctrl-C vs Esc semantics, resize, clipboard/OSC52 if supported.
- WebUI: browser trace, DOM/ARIA snapshot, console/network, reload/resume, keyboard/a11y.
- Desktop GUI: app shell start, bridge health, workspace readiness, native command contract, OS note.
- Browser automation: screenshot plus DOM/a11y, console/network, unsafe navigation/SSRF fixtures, orphan cleanup.
- Channel/mobile: webhook replay, media fixture, auth proof, redacted transcript, device/emulator logs.

## Testing skills and plugins

Agent Skills-style systems need their own lifecycle tests. The standard lesson is progressive disclosure: a skill is a small package with metadata, instructions, optional scripts/assets, and evaluation evidence. Testing should follow that shape.

| Skill/plugin phase | Tests | Evidence |
| --- | --- | --- |
| Manifest/frontmatter | required fields, name/description, when-to-use, paths/hooks if supported | schema report, parse failure fixtures |
| Discovery/loading | user/project/bundled precedence, symlink canonicalization, duplicate names, disabled settings | loader transcript, fixture directory tree |
| Context budget | frontmatter-only routing, lazy loading, token/size limits | token estimate, selected skill list, rejection evidence |
| Scripts/assets | script existence, executable bit, relative path resolution, clean temp dir, no raw secrets | dry-run log, sandbox/env scope, asset manifest |
| Trust boundary | local vs managed vs remote/MCP skill policy, path traversal, hook restrictions | policy test, denial transcript, audit note |
| Runtime effect | skill changes allowed tools/prompts only through owning API | runtime event, tool declaration diff, UI status |
| Evaluation | clean-context task, assertion grading, transcript, human feedback loop | eval rubric, attempt transcripts, verifier output |
| Packaging/release | package contents, install fixture, marketplace/registry metadata | manifest snapshot, install smoke, version check |

Claude Code local source exposes useful loader concerns: `SKILL.md` directory format, frontmatter parsing, hooks validation, path frontmatter, symlink canonicalization, token estimation, duplicate detection, and remote MCP skills as untrusted. Agent QC generalizes those as skill/plugin gates; it does not require Claude Code's exact implementation.

## Advanced composition recipes

### Runtime + UI evidence braid

Use when a runtime fact is visible in TUI/WebUI/desktop GUI.

```text
contract-protocol
  -> fake runtime transcript
  -> black-box user action
  -> surface snapshot/trace
  -> state snapshot + cleanup
```

Example claims: approval overlay, tool card progress, bridge health, queued worker state.

### TUI approval braid

```text
white-box permission resolver
  -> protocol action_request fixture
  -> pseudo-terminal key sequence
  -> terminal snapshots for pending/allow/deny/cancel
  -> side-effect denial check
  -> subprocess cleanup
```

Add multi-viewport, Unicode/ANSI, Ctrl-C/Esc, and reconnect variants when the TUI is core product surface.

### Provider adapter ladder

```text
normalizer unit tests
  -> contract/schema snapshot
  -> fake provider replay
  -> runtime E2E with fake provider
  -> opt-in live canary
  -> semantic eval and reviewer note
```

Use this for LLM providers, browser providers, search providers, channel providers, or gateway backends.

### Browser agent safety braid

```text
URL/path policy unit tests
  -> SSRF/file/credential attack fixtures
  -> Playwright/browser trace with DOM+a11y snapshot
  -> console/network log inspection
  -> orphan browser/tab cleanup proof
```

A screenshot-only pass is insufficient for browser automation.

### Channel gateway braid

```text
auth verifier unit test
  -> webhook replay before body parsing
  -> media fixture and redaction check
  -> fake channel send transcript
  -> optional live channel canary
  -> report redaction review
```

Use separate gates for channel contract, media handling, live transport, and semantic model quality.

### Scheduler/recovery braid

```text
deterministic clock unit test
  -> lease/checkpoint fake integration
  -> crash/restart replay
  -> concurrency stress or chaos kill
  -> duplicate-work oracle
  -> cleanup and ownership report
```

This is mandatory for background agents, multi-agent workers, and long-running jobs.

### Skill/plugin lifecycle braid

```text
manifest schema
  -> discovery/precedence fixture
  -> script/asset dry run in clean temp dir
  -> trust boundary denial tests
  -> clean-context skill eval
  -> package/install smoke
```

Use assertion grading and transcripts for skill quality, not only a lint pass.

### Release confidence braid

```text
source tests
  -> generated/lock drift check
  -> package manifest snapshot
  -> clean install smoke
  -> first-run runtime smoke
  -> OS/Docker matrix
  -> live canary if advertised
```

A release claim is about the artifact, not only the repository.

## Technique selection matrix

| Claim | Minimum techniques | Stronger composition |
| --- | --- | --- |
| Runtime command works | black-box command smoke, exit status | contract, fake provider, stream golden, cleanup |
| Permission boundary works | white-box policy, runtime denial transcript | TUI/WebUI approval surface, side-effect oracle, reconnect/cancel |
| TUI is correct | terminal snapshot | runtime transcript, multi-viewport, Unicode/ANSI, interrupt |
| WebUI is correct | component/browser assertion | Playwright trace, DOM/ARIA, console/network, reload/resume |
| Desktop GUI is usable | shell start smoke | bridge health, workspace readiness, native contract, screenshot/trace |
| Browser agent is safe | screenshot + DOM | SSRF/navigation fixture, console/network, cleanup/orphan proof |
| Channel gateway works | contract fixture | webhook replay, media fixture, auth proof, live opt-in canary |
| Skill/plugin works | manifest parse | loader precedence, script dry run, trust boundary, clean-context eval |
| Scheduler is reliable | deterministic unit | restart/reclaim, stress, chaos kill, duplicate-work proof |
| Model quality improved | eval rubric | baseline delta, judge output, failure examples, human review |
| Package is releasable | build output | manifest snapshot, clean install, Docker/OS smoke, supply-chain check |

## QC case fields for techniques

Add these fields to the case body or report extension when the project needs richer composition:

```json
{
  "techniques": ["white-box-unit", "contract-protocol", "black-box-smoke", "surface-snapshot", "cleanup-proof"],
  "box_mode": "gray-box",
  "snapshot_policy": "normalize dynamic ids; update only after reviewer approval",
  "smoke_level": "runtime|surface|release|live-canary",
  "runtime_backing": "fake-provider|real-runtime|live-provider|mock-bridge",
  "negative_cases": ["deny", "cancel", "malformed-stream", "restart"],
  "composition_rationale": "why this braid proves the claim"
}
```

These fields are intentionally advisory. Agent QC standardizes the evidence and verdict semantics; projects decide how to encode technique metadata in their local schema.

## Anti-patterns

| Anti-pattern | Correct replacement |
| --- | --- |
| One broad `test` command as proof for every profile | profile-specific gates plus explicit evidence refs |
| Snapshot update with no review note | snapshot diff review and behavior rationale |
| Smoke test marketed as full E2E | label as smoke and list remaining risks |
| White-box unit test used as UI proof | add surface artifact and runtime link |
| Black-box final text used as runtime proof | add structured event transcript and state snapshot |
| Live provider call hidden in unit tests | explicit live lane, budget, redaction, opt-in flag |
| Browser screenshot without DOM/console/network/cleanup | browser evidence bundle |
| Skill manifest lint only | loader, script, trust, clean-context eval, package smoke |

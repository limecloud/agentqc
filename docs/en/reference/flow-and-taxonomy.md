---
title: Flow and taxonomy
description: Agent QC lifecycle, profiles, surfaces, gates, evidence, and verdict taxonomy.
---

# Flow and taxonomy

This page is the complete Agent QC lifecycle and taxonomy reference. It mirrors the specification style used by Agent UI: explicit dimensions, fields, constraints, lifecycle stages, and validation cases.

## Core contract

Agent QC is an evidence protocol for Agent project quality. A compatible QC plan classifies owned risk, selects gates, executes checks, stores evidence, and emits verdicts without turning model prose into proof.

Compatible QC reports MUST:

- classify one or more project profiles;
- name touched interaction surfaces when user-visible behavior is involved;
- map each required gate to concrete local commands, CI jobs, qcloop items, or review steps;
- preserve inspectable evidence refs for every pass/fail/blocked/exhausted/waived verdict;
- separate deterministic, runtime, surface, live-provider, release, and semantic-eval claims;
- state limitations and waivers explicitly.

Compatible QC reports MUST NOT:

- treat a final assistant answer as evidence without a linked artifact;
- infer runtime success from UI text alone;
- hide live-provider calls inside default deterministic tests;
- collapse screenshots, traces, terminal snapshots, and protocol transcripts into one vague "UI checked" claim;
- call a gate passed when required evidence is missing.

## Lifecycle overview

```text
change or release scope
  -> classify profiles
  -> identify touched surfaces
  -> assign fact owners and risk owners
  -> select gate lanes
  -> write behavior-level cases
  -> execute deterministic gates
  -> execute runtime and surface gates
  -> opt into live/release/eval gates when required
  -> collect evidence refs
  -> issue verdicts
  -> publish report, waivers, and next action
```

The flow applies to CLI agents, SDKs, MCP/tool gateways, channel bots, TUI/GUI/WebUI products, browser automation systems, schedulers, skills/plugins, distribution packages, and eval suites.

## Taxonomy dimensions

### Project profile

Profiles describe owned project shape.

| Profile | Owns | Default risks |
| --- | --- | --- |
| `agent-runtime-cli` | agent loop, CLI, task execution, sandbox, tools, resume | stream drift, permissions, subprocess cleanup, resume consistency |
| `agent-sdk-api` | public SDK, generated client, API wrappers | signature drift, async cancellation, fake-server behavior |
| `agent-tool-mcp-gateway` | tool declarations, MCP/ACP bridge, connector runtime | protocol conformance, stdio/http recovery, resource permission |
| `multi-channel-agent-gateway` | chat/channel adapters, webhooks, auth, media | identity, webhook verification, media routing, secret redaction |
| `agent-ui-tui-desktop` | GUI, TUI, desktop shell, browser-visible flows | projection drift, stale success, bridge readiness, screenshots/traces |
| `agent-skills-plugins` | skills, plugins, manifests, loaders, marketplace | manifest drift, package boundary, trust policy, fixture install |
| `background-agent-scheduler` | cron, queues, workers, retries, long-running agents | duplicate work, lost checkpoints, race, stuck loop |
| `agent-distribution-release` | package, Docker, installers, cross-platform release | missing files, broken clean install, lock drift, supply chain |
| `agent-evals-quality` | task quality, model behavior, rubrics, generated outputs | prompt drift, judge instability, baseline regression, grounding gap |

### Interaction surface

Surfaces describe where the behavior is observed.

| Surface | Use when | Required evidence |
| --- | --- | --- |
| `cli-stream` | stdout/stderr, JSONL/NDJSON, command UI | command, exit status, transcript, structured sample |
| `tui` | terminal UI, Ink, ratatui, curses | viewport, key sequence, terminal snapshot, runtime transcript |
| `webui` | browser dashboard, extension UI, QA/admin console | screenshot/trace, console log, route/state assertion |
| `desktop-gui` | Tauri, Electron, native shell | shell start, bridge health, workspace/session readiness, OS note |
| `browser-automation` | CDP, Playwright, browser-use, remote browser | DOM/a11y, screenshot, console/network, cleanup proof |
| `channel-ui` | chat app, QR, mobile, webhook-visible flows | channel transcript, media fixture, auth/webhook replay, redaction |
| `eval-ui` | QA dashboards and eval reports | rubric, judge output, baseline delta, reviewer note |

### Gate family

Gate families describe validation style, not framework names.

| Family | Default use | Escalate when |
| --- | --- | --- |
| `static` | format, lint, type, schema, dependency hygiene | generated files or policy boundaries change |
| `unit` | deterministic local behavior | algorithms, parsers, reducers, adapters change |
| `property-fuzz` | invariants and generated input | parser, sandbox, path, protocol, serializer risk is high |
| `contract-protocol` | schema/API/command/tool surfaces | any wire shape, manifest, command, or SDK shape changes |
| `fake-integration` | local fake server or adapter flow | external API behavior is simulated |
| `runtime-e2e` | real CLI/task/session without live provider risk | loop, tool, permission, resume, subprocess flow changes |
| `ui-interaction` | GUI/TUI/WebUI/browser/channel visible behavior | users or operators observe the changed behavior |
| `live-provider` | opt-in real network/model/channel path | provider/channel behavior is part of the claim |
| `stress-concurrency` | races, queue, leases, retries, long runs | scheduler, parallel agents, workers, or locks change |
| `distribution-release` | package/install/Docker/OS matrix | anything shipped outside source changes |
| `semantic-eval` | task quality, prompt, rubric, judge | model behavior or output quality is the product |
| `review` | human/LLM review | safety, policy, UX, or semantic judgment is required |

### Evidence kind

| Kind | Examples | Must include |
| --- | --- | --- |
| `command-log` | shell output, CI step, cargo/npm/pytest/vitest output | command, exit status, environment note |
| `test-report` | JUnit, JSON, coverage, HTML report | suite id, failing ids, artifact path or URL |
| `protocol-transcript` | fake server, MCP/ACP, WebSocket, HTTP transcript | request/response refs, redaction note |
| `runtime-transcript` | CLI JSONL, TUI-linked events, session state | run/session ids, event order, cleanup |
| `surface-artifact` | screenshot, video, Playwright trace, terminal snapshot | viewport/device/OS, action sequence |
| `browser-diagnostic` | console, network, DOM/a11y snapshot | route, selector or accessibility assertion |
| `release-artifact` | package manifest, tarball list, Docker smoke | version, platform, install command |
| `eval-artifact` | rubric, judge output, baseline diff | dataset, model/judge, threshold |
| `review-note` | human or LLM review | reviewer, scope, evidence refs, decision |
| `qcloop-run` | attempt and QC round refs | item value, attempt id, verifier feedback |

### Verdict status

| Status | Meaning | Required fields |
| --- | --- | --- |
| `passed` | evidence proves all required expectations | evidence refs and scope |
| `failed` | evidence disproves an expectation or a gate failed | smallest actionable failure and evidence |
| `blocked` | missing environment, credential, dependency, fixture, or binary prevents judgment | blocker and owner |
| `exhausted` | attempts or budget ended without proof | attempt refs and remaining uncertainty |
| `waived` | accountable owner accepted known gap | approver, reason, scope, expiry |
| `needs-review` | evidence exists but judgment still needs semantic/safety review | reviewer or review queue |
| `skipped` | intentionally not applicable for this scope | reason and scope |

## Fact owners

Agent QC should name who owns each fact instead of treating the report as the owner of everything.

| Owner | Owns | QC responsibility |
| --- | --- | --- |
| Runtime | task/session/tool/permission state | capture transcript and state refs |
| Protocol/SDK | schemas, generated clients, adapters | capture contract diff and fake transcript |
| UI projection | visible rendering and user controls | capture surface artifact and runtime linkage |
| Evidence service | durable traces, replay, reviews | link evidence ids and export jobs |
| Policy/security | approvals, waivers, credentials, retention | record risk decision and scope |
| Artifact/release | deliverables, package contents, versions | capture manifest and install proof |
| Scheduler | leases, checkpoints, retries, workers | capture timeline and duplicate-work proof |
| Eval system | rubrics, judge outputs, baselines | capture dataset, threshold, and deltas |

## Standard case envelope

A portable `qc_case` should carry these fields even when the JSON schema allows extension.

| Field | Required | Purpose |
| --- | --- | --- |
| `id` | yes | stable case id |
| `project_profile` | yes | one profile from the taxonomy |
| `surface` | recommended for visible cases | observation surface |
| `target` | yes | file, command, package, flow, API, or release target |
| `risk_owner` | recommended | runtime, protocol, UI, scheduler, release, eval, policy |
| `required_gates` | yes | gate families to satisfy |
| `steps` | yes | reproducible commands or interactions |
| `expected` | yes | behavior-level expectations |
| `required_evidence` | yes | artifacts needed for verdict |
| `live_policy` | conditional | opt-in, credential scope, redaction, budget |
| `waiver_policy` | conditional | owner, reason, expiry rules |
| `verdict` | after run | status and evidence refs |

## Standard report envelope

A portable QC report should answer:

| Field | Question |
| --- | --- |
| Scope | What change, release, or regression sweep is being judged? |
| Profiles | Which project profiles apply? |
| Surfaces | Which user/operator surfaces were touched? |
| Required gates | Which gates were required and why? |
| Executed gates | Which commands, CI jobs, qcloop runs, or reviews ran? |
| Evidence refs | Where are logs, traces, screenshots, transcripts, reports, and reviews? |
| Verdicts | Which cases passed, failed, blocked, exhausted, waived, or need review? |
| Remaining risk | What still should not be claimed? |
| Next action | Fix, rerun, review, release, or waive? |

## Validation cases for the standard itself

A project can claim Agent QC compatibility only if these cases are representable:

1. Codex-like runtime permission denial with CLI transcript, protocol event, and TUI row.
2. Claude Code-like remote permission request with WebSocket/control transcript and TUI prompt.
3. OpenClaw-like channel webhook replay with media fixture and redacted credential policy.
4. Hermes-like scheduler restart with deterministic time, checkpoint, and duplicate-work proof.
5. Lime-like desktop GUI change with bridge health, workspace readiness, screenshot, and command-contract proof.
6. Browser automation flow with DOM/a11y, screenshot, console/network, and cleanup evidence.
7. Release smoke with package manifest, clean install, and platform note.
8. Semantic eval regression with rubric, judge output, baseline delta, and reviewer note.

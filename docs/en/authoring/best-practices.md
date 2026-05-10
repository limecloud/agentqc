---
title: Best practices
description: Practical authoring rules for Agent QC plans, gates, evidence, and reports.
---

# Best practices

Use this page as the authoring checklist for Agent QC plans. It adapts the runtime-first style of Agent UI, the progressive-disclosure style of Agent Skills, and testing patterns observed across runtime CLIs, TUI agents, multi-channel gateways, background/browser agents, desktop clients, and eval systems.

Agent QC is a standard protocol, not a single-product checklist.

## Start from owned risk

Classify what the project owns before choosing commands.

Good wording:

> This change touches a runtime permission boundary and a TUI approval surface. The plan requires `contract-protocol`, `runtime-e2e`, and `ui-interaction` evidence.

Bad wording:

> This is a TypeScript project, so Vitest is enough.

Owned risk usually falls into one or more of these lanes:

| Risk owner | Typical proof |
| --- | --- |
| Runtime | command transcript, stream events, cleanup, state snapshot |
| Protocol or SDK | schema diff, fake server transcript, generated client check |
| Tool or MCP gateway | declaration, permission, progress, result, recovery transcript |
| UI/TUI/WebUI/desktop | snapshot, screenshot, trace, accessibility output, console log |
| Browser automation | DOM/a11y snapshot, screenshot, console/network log, cleanup proof |
| Channel gateway | webhook replay, media fixture, identity/auth proof, redaction |
| Scheduler | deterministic clock, lease/checkpoint, restart/reclaim, duplicate-work guard |
| Release | package manifest, clean install, Docker smoke, OS matrix, lock/security |
| Eval quality | rubric, baseline delta, judge output, reviewer note |

## Keep verdict facts owned by evidence

A QC report MUST NOT infer pass/fail from final prose. The verifier may summarize, but the verdict belongs to evidence.

Every pass needs:

- behavior statement;
- gate family;
- command or interaction steps;
- expected result;
- evidence refs;
- verdict status;
- remaining risk or waiver if incomplete.

If the only proof is "the agent says it passed", the status is `needs-review` or `blocked`, not `passed`.

## Separate deterministic, live, and release gates

Do not hide expensive or flaky risk inside ordinary unit tests.

| Lane | Runs by default | Typical evidence | Common anti-pattern |
| --- | --- | --- | --- |
| Deterministic | yes | lint/type/unit/contract/fake-server logs | using live keys in unit tests |
| Runtime | usually | CLI/task/session transcript and cleanup proof | judging runtime from component tests only |
| Surface | when user-visible | TUI snapshot, Playwright trace, screenshot, console log | screenshot without runtime transcript |
| Live provider | explicit opt-in | redacted request/response, budget, credential scope | live call hidden behind `npm test` |
| Release | before shipping | package/Docker/install/OS matrix output | source tests only |
| Review/eval | when semantic quality matters | rubric, judge output, examples, reviewer | pass/fail without baseline |

OpenClaw is a useful example of explicit live and Docker lanes. Hermes is a useful example of blanking provider credentials in normal tests. Codex is a useful example of fake servers and fixtures before live/provider claims.

## Map surfaces to Agent UI facts

Agent UI's most important lesson for Agent QC is runtime-backed projection. A visible surface is not enough; the visible state must link to the owning runtime fact.

| Agent UI surface | Agent QC case focus |
| --- | --- |
| Composer | submit, queue, steer, interrupt, attachments, context chips |
| Message parts | final text separated from reasoning, tools, diagnostics, artifacts |
| Runtime status | first status before text, blocked/retrying/failed/done states |
| Tool UI | tool id, safe args summary, progress, result, error, offload ref |
| Human-in-the-loop | approval/input id, scope, decision, runtime confirmation |
| Task capsule | queued/background/subagent status, ownership, failure, retry |
| Artifact workspace | artifact id, preview, version, diff, export, save failure |
| Timeline/evidence | trace, replay, verification, review, audit refs |
| Session/tabs | old-session restore, stale/hydrating state, unread/running state |
| Team workbench | coordinator, worker, handoff, review, remote/background teammate |

QC rule: a user-visible pass SHOULD connect entrypoint, user action, visible frame, runtime event, evidence ref, and cleanup.

## Treat missing facts honestly

Use explicit statuses instead of guessing:

- `blocked` when the environment, credentials, fixture, or binary is missing;
- `exhausted` when attempts or budget are consumed without proof;
- `needs-review` when evidence exists but the judgment is semantic, safety-sensitive, or disputed;
- `waived` only when an accountable owner accepts a gap with reason and expiry.

Do not show `passed` because a UI looked healthy if bridge/runtime evidence is missing. This applies to all Agent UI/TUI/WebUI projects.

## Prefer behavior-level scenarios

A QC case should read like a reproducible user or operator flow, not like a file inventory.

Good case:

> User denies a high-risk tool call; the runtime records denial, the TUI removes the pending approval, and no side effect occurs.

Weak case:

> Approval component exists.

Behavior-level cases should cover:

- happy path;
- denied or failed path;
- cancellation/interruption;
- reconnect/retry/recovery;
- stale or missing facts;
- old-session or resumed state;
- platform and viewport differences when relevant.

## Make qcloop narrow and inspectable

qcloop is best for repeated independent checks: many files, many channels, many providers, many command variants, or many prompt/eval items.

Use qcloop when each item can be judged from its own output and evidence refs. Do not use qcloop to replace required project gates such as bridge health, package install smoke, Playwright trace collection, or live-provider opt-in policy.

A good qcloop item includes:

- project profile;
- touched surface;
- gate family;
- exact input or command;
- expected behavior;
- evidence policy;
- verifier rubric;
- status mapping for pass/fail/blocked/exhausted/waived.

## Preserve source traceability

When a standard page changes, update [Source index](../reference/source-index) or a case-study page. Local repos are examples, not requirements.

Traceability levels:

| Level | Use |
| --- | --- |
| Public specification | Agent Skills, Playwright, Vitest, pytest, protocol docs |
| Local case study | Codex, Claude Code local snapshot, OpenClaw, Hermes, desktop GUI and release examples |
| Project-specific rule | a concrete product's scripts, CI, workflow, or AGENTS file |
| Evidence artifact | command output, trace, screenshot, transcript, report |

## Write for progressive disclosure

Follow the Agent Skills style: a short entry page, tables for fields and constraints, minimal examples, and deeper reference pages.

For Agent QC pages:

- quickstart pages choose the path;
- authoring pages explain how to write plans and evidence;
- contract pages define portable fields and verdict constraints;
- reference pages hold taxonomy and project research;
- example pages show real plan shapes.

## Avoid single-framework lock-in

Agent QC may mention Playwright, Vitest, pytest, cargo nextest, Bazel, Docker, qcloop, and VitePress examples, but the standard requirement is the evidence shape.

Good guidance:

> Browser UI gates should retain a trace/screenshot on failure and record console or network evidence.

Bad guidance:

> Every Agent project must use Playwright with the same config.

## Review checklist

Before publishing a QC plan or report, verify:

| Question | Required answer |
| --- | --- |
| Is this standard tied to one product? | No; profiles apply to all Agent project types. |
| Are project profiles declared? | One or more profiles are named. |
| Are touched surfaces named? | User-visible cases include `qc_case.surface`. |
| Are gates separated? | Deterministic, runtime, surface, live, release, and eval lanes are distinct. |
| Is evidence inspectable? | Each pass/fail links to logs, reports, traces, transcripts, screenshots, or review refs. |
| Are limitations explicit? | Missing metadata, blocked credentials, or local-only assumptions are recorded. |
| Are waivers accountable? | Waiver owner, reason, scope, and expiry are present. |
| Can qcloop repeat it? | Repeated cases have stable item values and verifier rubrics. |

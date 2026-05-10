---
title: Evidence contract
description: Portable contract for evidence references, verdicts, waivers, and reports.
---

# Evidence contract

A verdict is only as strong as the evidence it references. This contract defines the minimum portable fields for evidence-backed Agent QC reports.

## Evidence reference

| Field | Required | Description |
| --- | --- | --- |
| `id` | Yes | Stable evidence id inside the report. |
| `kind` | Yes | Evidence kind such as `command-log`, `test-report`, `protocol-transcript`, `surface-artifact`, `release-artifact`, `eval-artifact`, `review-note`, or `qcloop-run`. |
| `source` | Yes | Local path, artifact URL, CI URL, qcloop id, or evidence service id. |
| `scope` | Yes | Case id, gate id, command, surface, profile, or release target covered. |
| `created_at` | Recommended | Timestamp or run id. |
| `environment` | Recommended | OS, runtime, browser, terminal size, provider mode, CI job, or Docker image. |
| `redaction` | Conditional | Required when credentials, user data, provider requests, or channel transcripts are involved. |
| `summary` | Recommended | Short human-readable result. |
| `raw_ref` | Optional | Safe raw payload ref. Do not inline secret-bearing payloads. |

## Verdict object

| Field | Required | Description |
| --- | --- | --- |
| `status` | Yes | `passed`, `failed`, `blocked`, `exhausted`, `waived`, `needs-review`, or `skipped`. |
| `case_id` | Yes | Case being judged. |
| `gate_family` | Yes | Gate family being judged. |
| `evidence_refs` | Yes except `skipped` | Evidence ids supporting the claim. |
| `expectations_met` | Recommended | Explicit expectation ids or text snippets proven by evidence. |
| `failure` | Required for `failed` | Smallest actionable failure, not a broad complaint. |
| `blocker` | Required for `blocked` | Missing environment fact and owner. |
| `attempts` | Required for `exhausted` | Attempt refs, budget, and remaining uncertainty. |
| `waiver` | Required for `waived` | Approver, reason, scope, expiry. |
| `review` | Required for `needs-review` | Reviewer, queue, or reason semantic review remains. |

## Evidence minimum by gate

| Gate | Minimum evidence |
| --- | --- |
| `static` | command/CI log, tool version, failing ids or success summary |
| `unit` | test report or command log with suite and failure ids |
| `property-fuzz` | seed/corpus, invariant, failing minimized case if any |
| `contract-protocol` | schema diff, generated artifact check, fake server or protocol transcript |
| `fake-integration` | fake server log and request/response refs |
| `runtime-e2e` | runtime transcript, state snapshot, process cleanup or retry proof |
| `ui-interaction` | surface artifact plus runtime/protocol link |
| `live-provider` | opt-in flag, redacted request/response, credential scope, cost/budget note |
| `stress-concurrency` | worker timeline, seed/config, duration, race/retry result |
| `distribution-release` | package manifest, clean install, Docker/OS matrix, version output |
| `semantic-eval` | dataset/rubric, model/judge info, baseline delta, threshold |
| `review` | reviewer identity, scope, evidence refs, decision |

## Surface evidence add-ons

| Surface | Add-on evidence |
| --- | --- |
| `cli-stream` | stdout/stderr transcript, exit code, structured event sample |
| `tui` | terminal size, key sequence, terminal snapshot, linked runtime transcript |
| `webui` | Playwright or browser trace/screenshot, console output, route/state assertion |
| `desktop-gui` | shell start log, bridge health, workspace readiness, screenshot, OS note |
| `browser-automation` | DOM/a11y snapshot, console/network, screenshot, cleanup/orphan-process proof |
| `channel-ui` | webhook replay, channel transcript, media fixture, identity/auth proof |
| `eval-ui` | report screenshot/export, rubric, judge output, reviewer note |

## Waiver contract

A waiver is not a pass. It is a time-bounded risk decision.

| Field | Required | Description |
| --- | --- | --- |
| `approver` | Yes | Person, team, or policy owner accepting the risk. |
| `reason` | Yes | Why this gate is not required for this scope. |
| `scope` | Yes | Case, gate, platform, provider, or release range. |
| `expires` | Yes | Date, version, or condition that invalidates the waiver. |
| `replacement_evidence` | Recommended | Lower-strength evidence that still exists. |
| `follow_up` | Recommended | Issue, task, or next QC case. |

## Anti-patterns

| Anti-pattern | Correct status |
| --- | --- |
| "Looks good" with no artifact | `needs-review` or `blocked` |
| Screenshot without command/runtime evidence | partial `ui-interaction`, not full pass |
| Live provider output with no redaction/budget note | `needs-review` |
| Unit tests only for desktop bridge behavior | `blocked` for GUI/surface claim |
| qcloop exhausted but reported as failed without attempts | `exhausted` |
| Waiver without owner or expiry | invalid waiver |

## Report closeout checklist

A report is ready to publish when:

- every required gate has a verdict;
- every `passed` or `failed` verdict has evidence refs;
- every `blocked`, `exhausted`, `waived`, or `needs-review` status explains why it is not a pass;
- live-provider evidence is redacted and budgeted;
- surface evidence links visible behavior to runtime or protocol facts;
- remaining risk and next action are explicit.

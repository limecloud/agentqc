---
title: Evidence-driven verdicts
description: How Agent QC decides pass, fail, blocked, exhausted, waived, and needs-review.
---

# Evidence-driven verdicts

A verdict is a claim about observed evidence. The model's final prose is not enough.

Use this page for authoring guidance and the [Evidence contract](../contracts/evidence-contract) for portable fields.

## Verdict statuses

| Status | Meaning | Required proof |
| --- | --- | --- |
| `passed` | Evidence proves all required expectations. | evidence refs tied to case and gate |
| `failed` | Evidence disproves an expectation or a gate exits non-zero. | smallest actionable failure and evidence |
| `blocked` | Environment, credentials, dependency, fixture, binary, or access prevents judgment. | blocker, owner, and retry condition |
| `exhausted` | Attempts or budget were consumed without proof. | attempts, budget, verifier feedback, remaining uncertainty |
| `waived` | A responsible actor accepted a known gap. | approver, reason, scope, expiry |
| `needs-review` | Evidence exists but semantic, safety, UX, or policy review remains. | reviewer or queue and evidence refs |
| `skipped` | Gate is intentionally not applicable to the current scope. | reason and scope |

## Verdict strength ladder

| Strength | Example | When to use |
| --- | --- | --- |
| Weak observation | screenshot only | visual smoke, not runtime-backed pass |
| Deterministic proof | unit/contract/fake server report | local correctness without live risk |
| Runtime proof | CLI/session/tool transcript | agent loop and side effects are involved |
| Surface proof | trace/screenshot/terminal snapshot with runtime link | user/operator sees the behavior |
| Live proof | redacted provider/channel transcript | real network/model/channel is part of the claim |
| Release proof | clean install/package/Docker/OS matrix | artifact is shipped |
| Semantic proof | rubric, baseline, judge, reviewer | output quality is the claim |

Strong reports combine the levels required by the risk. They do not always need every level.

## Good evidence

Good evidence is inspectable and scoped:

- command log or CI job URL;
- JUnit/JSON/HTML/coverage report;
- protocol transcript or mock server request log;
- runtime transcript, event stream, or session state snapshot;
- Playwright trace, screenshot, video, DOM/a11y snapshot, or terminal snapshot;
- browser console/network log;
- qcloop attempt and QC round refs;
- package manifest, tarball listing, Docker smoke output, OS matrix;
- model output plus rubric and judge verdict;
- human review note with reviewer and scope.

## Bad evidence

Bad evidence is unverifiable or overclaims:

- "looks good";
- "the tests passed" without command, CI ref, or report path;
- hidden local state with no path or transcript;
- screenshot without runtime backing for a runtime claim;
- live provider claim with no redacted request/response or budget note;
- TUI snapshot with no viewport/key sequence;
- browser screenshot with no console/network or cleanup note;
- qcloop summary without attempts and verifier feedback;
- waiver without owner or expiry.

## Status selection guide

| Situation | Status |
| --- | --- |
| Required evidence exists and expectations are proven | `passed` |
| Command exits non-zero and failure matches changed risk | `failed` |
| Test cannot start because credential/binary/fixture is absent | `blocked` |
| Repeated qcloop attempts cannot produce proof within budget | `exhausted` |
| The product owner accepts missing Windows smoke until a date/version | `waived` |
| Eval output exists but rubric is ambiguous or safety review remains | `needs-review` |
| Mobile channel not touched by current change and not in scope | `skipped` |

## Waiver rules

A waiver must include:

| Field | Meaning |
| --- | --- |
| `approver` | accountable person/team/policy owner |
| `reason` | why risk is accepted for this scope |
| `scope` | exact case, gate, platform, provider, or release range |
| `expires` | date, version, or event requiring recheck |
| `replacement_evidence` | weaker proof still available, if any |
| `follow_up` | issue, task, or next QC case |

A waiver never converts missing evidence into a pass. It records accepted residual risk.

## Failure writing

A useful `failed` verdict answers:

1. What expectation was disproven?
2. What is the smallest command, case, selector, event id, or fixture that reproduces it?
3. Which evidence proves the failure?
4. Which claims are still valid despite the failure?
5. What should be fixed or rerun next?

Avoid broad failures like "GUI broken". Prefer "desktop-gui case `bridge-health-workspace-ready` failed: bridge health timed out after 120s; screenshot shows fallback mock banner; command contract check passed."

## Blocked vs exhausted

Use `blocked` when the run cannot meaningfully start or judge because a prerequisite is absent.

Use `exhausted` when the system tried within declared attempts/budget but still cannot prove the claim.

Examples:

| Case | Status |
| --- | --- |
| No Telegram token available for live channel test | `blocked` |
| qcloop ran 5 attempts and verifier still cannot find required evidence | `exhausted` |
| Playwright browser binary missing | `blocked` |
| flaky browser test retried according to policy and still no stable trace | `exhausted` |

## Review before pass

Use `needs-review` for:

- semantic evals where rubric coverage is incomplete;
- safety or policy-sensitive output;
- UX judgment from screenshots or recordings;
- generated content quality;
- suspicious live-provider drift;
- evidence that conflicts across gates.

A reviewer may change `needs-review` to `passed`, `failed`, or `waived`, but must cite evidence.

## Report checklist

Before finalizing a report:

- every required gate has a status;
- every `passed` and `failed` status cites evidence;
- every surface claim links visible state to runtime/protocol evidence;
- every live-provider claim has redaction and budget notes;
- every waiver has owner and expiry;
- every blocked/exhausted item has next action;
- remaining risk is written in plain language.

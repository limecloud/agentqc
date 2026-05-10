---
title: Performance and reliability metrics
description: Timing, stability, retry, cleanup, and release metrics for Agent QC evidence.
---

# Performance and reliability metrics

Agent projects often fail by appearing alive while queues, streams, tools, browsers, or background workers are stuck. QC evidence should capture enough timing and reliability data to explain perceived slowness and flaky behavior.

Agent QC does not mandate universal thresholds. Each project should define thresholds by product profile and risk.

## Runtime responsiveness

| Metric | Meaning | Applies to |
| --- | --- | --- |
| `submit_to_accept_ms` | user action to runtime acceptance | CLI, TUI, GUI, WebUI |
| `first_status_ms` | first user-visible runtime status | Agent UI/TUI/desktop |
| `first_text_delta_ms` | first model/user-facing text delta | streams and chat UIs |
| `first_tool_event_ms` | first tool start/progress event | tool/runtime gates |
| `interrupt_ack_ms` | interrupt/cancel request to runtime acknowledgement | CLI/TUI/GUI |
| `resume_ready_ms` | old session or task resume to usable state | sessions, schedulers |

These metrics are inspired by Agent UI's separation of listener binding, runtime acceptance, first status, first text, and paint timing.

## Stream and projection health

| Metric | Meaning | Evidence |
| --- | --- | --- |
| `event_sequence_gap_count` | missing or out-of-order runtime events | protocol transcript |
| `delta_backlog_depth` | queued unrendered text/tool deltas | UI diagnostics |
| `oldest_unrendered_delta_ms` | oldest pending delta age | UI diagnostics |
| `final_reconciliation_duplicates` | duplicated streamed/final text count | transcript + surface artifact |
| `stale_success_count` | UI claimed success before runtime confirmation | runtime/UI comparison |
| `missing_fact_fallback_count` | `unknown`, `unavailable`, `stale`, or `blocked` projections | UI snapshot/report |

## Tool and permission reliability

| Metric | Meaning | Evidence |
| --- | --- | --- |
| `tool_start_to_result_ms` | tool duration by tool id | tool transcript |
| `tool_error_recovery_count` | retry/recovery attempts after tool failure | runtime transcript |
| `approval_pending_ms` | time in human-in-the-loop state | action transcript |
| `approval_correlation_failures` | request/response id mismatches | protocol test |
| `denied_side_effect_count` | denied action still caused side effect | sandbox/process evidence |
| `orphan_process_count` | subprocess/browser workers left behind | cleanup evidence |

## Browser, WebUI, TUI, and desktop reliability

| Surface | Metrics |
| --- | --- |
| `webui` | page load, first status paint, console error count, failed network count, trace size |
| `desktop-gui` | shell start, bridge health time, workspace readiness, native command timeout, mock fallback count |
| `tui` | first frame, redraw latency, viewport reflow failures, key handling failures, Unicode/ANSI rendering failures |
| `browser-automation` | navigation time, DOM ready, console/network errors, screenshot/trace success, cleanup/orphan count |
| `channel-ui` | webhook verification time, dedup count, media processing time, retry count, delivery ack time |

Playwright-style projects should retain trace/screenshot/video on failure and record browser project/device when relevant. Vitest browser-mode or component tests can prove component behavior, but browser-only APIs need browser evidence.

## Scheduler and background reliability

| Metric | Meaning |
| --- | --- |
| `lease_reclaim_ms` | time to reclaim work after interrupted owner |
| `checkpoint_age_ms` | age of last durable checkpoint |
| `duplicate_job_count` | duplicate execution for same job id |
| `lost_job_count` | scheduled jobs not executed by deadline |
| `retry_attempt_count` | attempts per task before success/failure/exhaustion |
| `worker_shutdown_ms` | graceful worker termination time |
| `queue_depth` | pending work by queue or priority |

Hermes-style projects should pin deterministic clock/env for normal tests and reserve live provider/channel checks for explicit opt-in lanes.

## Release and distribution reliability

| Metric | Meaning |
| --- | --- |
| `clean_install_ms` | fresh install duration |
| `package_size_bytes` | package or image size |
| `manifest_missing_count` | expected files absent from package |
| `version_mismatch_count` | package/app/Cargo/Tauri/version drift |
| `docker_smoke_ms` | Docker smoke duration |
| `platform_failure_count` | OS matrix failures |
| `lock_drift_count` | lockfile or generated artifact drift |

Codex-style projects may use Bazel/nextest/release binaries. OpenClaw-style projects may use Docker/install smoke and plugin release checks. Agent QC only requires the evidence shape.

## Suggested threshold policy

A QC plan SHOULD define:

| Threshold | Example |
| --- | --- |
| Local default | deterministic gates must pass with no live credentials |
| Surface smoke | first status or bridge health must appear within product-specific timeout |
| Flake budget | retry count and rerun policy for known flaky lanes |
| Live budget | provider/channel cost, credential scope, and timeout |
| Release budget | install time, package size, OS matrix, Docker smoke timeout |
| Waiver expiry | date/version when missing metric must be rechecked |

## Evidence guidance

When a performance or reliability gate fails, preserve:

- the command or interaction that started the run;
- timestamps and environment;
- trace/screenshot/transcript around the slow or flaky segment;
- retry and cleanup outcome;
- whether the failure blocks release, needs review, or can be waived.

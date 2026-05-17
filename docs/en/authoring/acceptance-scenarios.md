---
title: Acceptance scenarios
description: Behavior-level Agent QC scenarios across runtime, UI, channel, scheduler, release, and eval projects.
---

# Acceptance scenarios

Agent QC validates behavior and evidence, not repository shape alone. Use these scenarios for manual QA, automated tests, qcloop batches, CI gates, or release review.

A scenario passes only when evidence proves the behavior. A scenario with missing evidence is `blocked`, `exhausted`, `waived`, or `needs-review`, not passed.

## 1. Runtime CLI permission boundary

1. User or test triggers an unsafe tool/command action.
2. Runtime emits a permission or policy decision with stable id.
3. The action is denied or requires approval.
4. No unauthorized side effect occurs.
5. CLI/TUI/WebUI shows a controlled error or pending approval.

Pass condition: denied action is visible, correlated, and side-effect-free.

Evidence: command transcript, policy event, side-effect check, surface artifact when visible.

## 2. Tool or MCP transport recovery

1. A stdio/http/WebSocket tool server disconnects or returns an error.
2. Runtime surfaces failure and recovery or terminal failure.
3. Tool state does not corrupt the next call.
4. UI/TUI shows failure outside final answer text.

Pass condition: recovery and failure are inspectable and do not invent success.

Evidence: protocol transcript, retry log, tool id correlation, surface frame.

## 3. SDK/API contract drift

1. Public SDK or generated client changes shape.
2. Schema/generation check runs.
3. Fake server or fixture verifies the new contract.
4. Old incompatible behavior is either migrated or explicitly versioned.

Pass condition: contract drift is reviewed before runtime or UI claims.

Evidence: schema diff, generated artifact check, fake server transcript.

## 4. CLI stream final reconciliation

1. Runtime streams partial text/tool events.
2. Runtime emits final message or terminal status.
3. CLI output or consumer reconciles final content without duplication.
4. Exit code matches terminal status.

Pass condition: no duplicate final text, hidden tool failure, or wrong exit status.

Evidence: stdout/stderr transcript, structured event sample, exit code.

## 5. TUI first status and interrupt

1. User submits a prompt.
2. Listener binds before submit or before the first runtime event.
3. Runtime status appears before first answer text when accepted.
4. Interrupt/cancel is available when supported.
5. Interrupt stops the run without orphan subprocesses.

Pass condition: the user can tell the agent is alive and can stop it safely.

Evidence: pseudo-terminal transcript, terminal snapshot, runtime transcript, cleanup proof.

## 6. TUI tool and permission overlay

1. Runtime emits tool start with stable tool id.
2. TUI shows safe input summary and progress.
3. Runtime emits action request for a high-risk operation.
4. User approves, rejects, edits, or answers.
5. TUI marks resolved only after runtime confirmation.

Pass condition: tool progress and approval state are visible, correlated, and auditable.

Evidence: terminal snapshot, key sequence, action request/response transcript.

## 7. WebUI reload and stale state

1. User opens a running or recently completed session.
2. WebUI renders route shell and current status.
3. Page reload or route revisit does not fabricate success.
4. Missing facts render as `unknown`, `unavailable`, `stale`, or `blocked`.

Pass condition: reload/resume preserves runtime truth and safe fallback states.

Evidence: browser trace, screenshot, console/network log, runtime state ref.

## 8. Desktop GUI bridge readiness

1. App shell starts or is reused through the supported entrypoint.
2. Bridge health is checked before judging the page.
3. Default workspace/session readiness is proven.
4. A user-visible flow runs with screenshot/trace.
5. Native command contracts are synchronized when touched.

Pass condition: desktop readiness is proven beyond component tests.

Evidence: shell log, bridge health, workspace readiness, screenshot/trace, OS note.

## 9. Browser automation safety and cleanup

1. Agent opens or controls a browser session.
2. Test records URL, viewport, provider, and session scope.
3. DOM/a11y and screenshot evidence prove the observed state.
4. Console/network logs are inspected.
5. Browser/tabs/processes are closed or intentionally reused.

Pass condition: observation, safety, and cleanup are all proven.

Evidence: screenshot, DOM/a11y, console/network, cleanup/orphan proof.

## 10. Channel gateway auth and media

1. Channel adapter receives a webhook/message with auth context and media.
2. Gateway verifies identity before parsing user content.
3. Media is stored or rejected by policy.
4. Response transcript is redacted and traceable.
5. Live channel path is opt-in if used.

Pass condition: identity, media, and response behavior are proven without leaking secrets.

Evidence: webhook replay, media fixture, redacted transcript, auth decision.

## 11. Queue and steer distinction

1. A run is active.
2. User sends another prompt or control action.
3. System distinguishes queue-next from steer-current.
4. Runtime emits stable queued/steer ids.
5. Surface shows pending state and final resolution.

Pass condition: users can distinguish "run later" from "change current run".

Evidence: runtime events, UI/TUI snapshot, queue state transcript.

## 12. Artifact handoff and evidence export

1. Runtime creates or updates an artifact.
2. UI/CLI links compact artifact reference.
3. Artifact details open through artifact service or durable path.
4. Evidence export creates durable refs.
5. Report links artifact/evidence ids to the producing case.

Pass condition: deliverables and evidence leave the chat body and become traceable artifacts.

Evidence: artifact path/id, export log, screenshot/report link.

## 13. Old-session recovery

1. User opens old session/task/thread.
2. Shell or summary appears without full history blocking first paint.
3. Recent messages/status hydrate before heavy details.
4. Tool output, artifacts, and evidence load on demand.
5. Stale or missing facts remain explicit.

Pass condition: old sessions are usable and do not guess missing truth.

Evidence: timing metrics, screenshot, hydration log, cursor/page refs.

## 14. Background scheduler restart

1. Scheduled/background task starts and writes checkpoint or lease.
2. Owner is interrupted or process restarts.
3. New owner reclaims or resumes according to policy.
4. Duplicate and lost work are prevented.
5. Final state includes cleanup and ownership evidence.

Pass condition: restart does not duplicate, lose, or hide work.

Evidence: deterministic clock/env, checkpoint, lease timeline, worker logs.

## 15. Parallel worker fanout/fanin

1. Coordinator starts multiple independent workers/subagents/tasks.
2. Each worker has stable id, role, parent, and status.
3. Partial success, failure, retry, and wait states remain visible.
4. Final synthesis links worker results without rewriting authorship.

Pass condition: parallel work is visible, resumable, and auditable.

Evidence: delegation graph, worker transcripts, final evidence refs.

## 16. Remote agent or teammate handoff

1. Runtime connects to remote agent or hands work to another teammate.
2. UI/TUI shows remote task id, owner, reason, auth/input needs, and status.
3. Input/auth required states are promoted to user controls.
4. Idle/transient state is not treated as completion.

Pass condition: remote ownership and completion truth are preserved.

Evidence: remote protocol transcript, task card snapshot, handoff log.

## 17. Eval regression and report UI

1. Prompt/eval suite runs against current behavior and baseline.
2. Rubric and judge/model settings are recorded.
3. Report shows pass/fail examples and baseline delta.
4. Reviewer can inspect raw outputs and waivers.

Pass condition: semantic quality claim is backed by comparable evidence.

Evidence: dataset/rubric, judge output, baseline delta, report screenshot/export.

## 18. Distribution install smoke

1. Release package/image is built.
2. Clean environment installs or starts it.
3. Version/help/minimal runtime command works.
4. Package contents match manifest.
5. Platform-specific limitations are recorded.

Pass condition: shipped artifact is usable outside the source tree.

Evidence: package manifest, install log, Docker/OS matrix, version output.

## 19. Live provider opt-in

1. Case declares live provider/channel/model requirement.
2. Credentials are scoped and redacted.
3. Budget/timeout is recorded.
4. Request/response or provider transcript is stored safely.
5. Failure is not retried into invisibility.

Pass condition: live behavior is proven without contaminating deterministic lanes.

Evidence: opt-in flag, redacted transcript, budget note, provider id.

## 20. qcloop repeated QC

1. Plan creates independent qcloop items.
2. Each item includes profile, surface, gates, expected result, and evidence policy.
3. Attempts and verifier rounds are preserved.
4. Exhausted items remain `exhausted`, not generic failed.
5. Aggregate report states remaining risk.

Pass condition: repetition improves coverage without hiding required project gates.

Evidence: qcloop job id, item values, attempts, verifier feedback, verdict refs.

## 21. Waiver and blocked path

1. Required gate cannot run or is intentionally deferred.
2. Report records missing fact, owner, scope, and risk.
3. Waiver includes approver, reason, expiry, and follow-up.
4. Release or next action does not call the waived gate passed.

Pass condition: incomplete proof is visible and accountable.

Evidence: waiver object, blocker note, replacement evidence, follow-up link.

## 22. Benchmark hill climbing

1. A frozen dataset and task set are selected from real Lime failures or high-risk flows.
2. Baseline and candidate configs differ by exactly one variable.
3. Each trial stores trajectory, runtime transcript, reward details, artifacts, timeout/cost metrics, and cleanup evidence.
4. Aggregate comparison reports reward delta, timeout rate, evidence completeness, and P0 QC regression count.
5. Candidate promotion is blocked if required QC gates regress, even when reward improves.

Pass condition: the improvement claim is reproducible, attributable, and still compatible with required Agent QC gates.

Evidence: dataset/task version, baseline/candidate configs, trial trajectories, reward details, comparison summary, Agent QC report refs.

## Scenario selection guide

| Project shape | Must include |
| --- | --- |
| Codex-like runtime CLI | scenarios 1, 2, 4, 5, 18 |
| Claude Code-like TUI runtime | scenarios 5, 6, 11, 16, 21 |
| OpenClaw-like channel/WebUI gateway | scenarios 7, 9, 10, 17, 18, 19 |
| Hermes-like background/browser agent | scenarios 9, 14, 15, 18, 19 |
| Desktop GUI / native bridge | scenarios 7, 8, 9, 12, 21 |
| Eval/QA lab | scenarios 17, 20, 21, 22 |
| Lime internal benchmark | scenarios 1, 5, 7, 9, 17, 22 |

---
title: Hermes background agent example
description: Agent QC profile mapping for a Python background agent with scheduler, gateway, TUI, and browser tools.
---

# Hermes background agent example

Profiles:

- `agent-runtime-cli`
- `background-agent-scheduler`
- `multi-channel-agent-gateway`
- `agent-ui-tui-desktop`
- `agent-tool-mcp-gateway`
- `agent-distribution-release`

Typical gates:

- deterministic pytest: `scripts/run_tests.sh` pins workers, timezone, locale, hash seed, and credential env cleanup.
- scheduler/concurrency: cron restart, checkpoint, inactivity timeout, duplicate-work prevention.
- browser-automation: browser supervisor, CDP, Camofox, SSRF, web provider contracts, cleanup evidence.
- TUI: `ui-tui` Vitest coverage for terminal parity, viewport, OSC52, streaming markdown, slash parity.
- channel/gateway: restart/retry/dedup, approval, delivery, media, reconnect, redacted transcripts.

Public QC plan JSON:

```json
{
  "schema_version": "0.3.0",
  "id": "hermes-scheduler-tui-browser-qc",
  "target_project": "hermes-agent",
  "project_profiles": [
    "agent-runtime-cli",
    "background-agent-scheduler",
    "multi-channel-agent-gateway",
    "agent-ui-tui-desktop",
    "agent-tool-mcp-gateway",
    "agent-distribution-release"
  ],
  "risk_level": "high",
  "risk_domains": [
    "cron",
    "checkpoint",
    "credential-isolation",
    "browser-safety",
    "tui-rendering"
  ],
  "required_gates": [
    "unit",
    "fake-integration",
    "runtime-e2e",
    "ui-interaction",
    "stress-concurrency"
  ],
  "cases": [
    {
      "id": "cron-restart-does-not-duplicate-work",
      "name": "Cron restart does not duplicate work",
      "project_profile": "background-agent-scheduler",
      "target": "cron scheduler recovery",
      "steps": [
        "Run scheduler restart test with deterministic clock/env",
        "Inspect checkpoint and evidence store",
        "Verify cleanup of ephemeral agent/session resources"
      ],
      "expected": [
        "No duplicate work item",
        "Recovered run owns final state",
        "Credential-shaped environment variables are blanked or scoped"
      ],
      "risk": "duplicate or lost background work",
      "required_gates": [
        "unit",
        "stress-concurrency"
      ],
      "required_evidence": [
        "pytest_report",
        "checkpoint_log",
        "env_scope_note"
      ],
      "status": "planned",
      "surface": "cli-stream"
    },
    {
      "id": "tui-streaming-markdown-parity",
      "name": "TUI streaming markdown and terminal parity",
      "project_profile": "agent-ui-tui-desktop",
      "target": "ui-tui package",
      "steps": [
        "Run terminal parity and streaming markdown fixtures",
        "Capture viewport, virtual history, and OSC52/clipboard assertions",
        "Compare slash command dispatch with gateway events"
      ],
      "expected": [
        "Streaming markdown renders without corrupting terminal width",
        "OSC52/clipboard and terminal mode behavior match expectations",
        "Slash command and gateway events produce consistent visible state"
      ],
      "risk": "terminal UI corrupts stream or command state",
      "required_gates": [
        "unit",
        "ui-interaction"
      ],
      "required_evidence": [
        "vitest_report",
        "terminal_snapshot_or_render_log",
        "viewport_matrix"
      ],
      "status": "planned",
      "surface": "tui"
    },
    {
      "id": "browser-local-ssrf-denied",
      "name": "Browser automation denies local SSRF",
      "project_profile": "agent-tool-mcp-gateway",
      "target": "browser/web tool safety",
      "steps": [
        "Run browser hardening or local SSRF fixture",
        "Capture browser supervisor state and console/network output",
        "Assert browser cleanup or orphan reaper result"
      ],
      "expected": [
        "Unsafe local target is denied or safely blocked",
        "Console/network evidence shows the blocked request",
        "Browser session cleanup is recorded"
      ],
      "risk": "browser tool can access forbidden local resources",
      "required_gates": [
        "fake-integration",
        "runtime-e2e"
      ],
      "required_evidence": [
        "browser_trace",
        "console_network_log",
        "cleanup_log"
      ],
      "status": "planned",
      "surface": "browser-automation"
    },
    {
      "id": "gateway-restart-deduplicates-delivery",
      "name": "Gateway restart deduplicates channel delivery",
      "project_profile": "multi-channel-agent-gateway",
      "target": "gateway restart/retry path",
      "steps": [
        "Replay a channel delivery fixture across restart",
        "Inspect message ids, retry state, and redacted transcript",
        "Verify final user-visible message count"
      ],
      "expected": [
        "Message is not delivered twice",
        "Retry/restart state is auditable",
        "Transcript redacts credentials and user-sensitive ids"
      ],
      "risk": "duplicate or leaked channel messages after restart",
      "required_gates": [
        "fake-integration",
        "runtime-e2e"
      ],
      "required_evidence": [
        "channel_transcript",
        "restart_log",
        "dedup_state_snapshot"
      ],
      "status": "planned",
      "surface": "channel-ui"
    }
  ],
  "evidence_policy": "Credential env vars must be blanked or scoped in test evidence. Scheduler, browser, TUI, and channel proofs must keep separate evidence refs."
}
```

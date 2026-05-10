---
title: Claude Code TUI runtime snapshot example
description: Agent QC profile mapping for a Claude Code-style local TUI/runtime snapshot with incomplete repository metadata.
---

# Claude Code TUI runtime snapshot example

This example is based on the local snapshot at `/Users/coso/Documents/dev/js/claudecode`. The snapshot does not include package or workflow metadata, so the example only claims interface-surface observations.

Profiles:

- `agent-runtime-cli`
- `agent-ui-tui-desktop`
- `agent-sdk-api`
- `agent-tool-mcp-gateway`
- `agent-skills-plugins`

Typical gates:

- contract/protocol: remote session manager, WebSocket/control schemas, `can_use_tool` permission flow.
- ui-interaction: Ink TUI snapshots for command views, synthetic permission rows, reconnect/cancel states.
- runtime-e2e: remote cancellation, interrupt, reconnect, and stale-state prevention.
- sdk-api: stream adapter fixtures preserving event types and tool-use ids.
- review: explicit limitation note because CI/test runner metadata is not available in the local snapshot.

Public QC plan JSON:

```json
{
  "schema_version": "0.4.0",
  "id": "claudecode-tui-permission-qc",
  "target_project": "claudecode-local-snapshot",
  "project_profiles": [
    "agent-runtime-cli",
    "agent-ui-tui-desktop",
    "agent-sdk-api",
    "agent-tool-mcp-gateway",
    "agent-skills-plugins"
  ],
  "risk_level": "high",
  "risk_domains": [
    "tui",
    "remote-permission",
    "tool-streaming",
    "session-resume",
    "plugin-skill-reload"
  ],
  "required_gates": [
    "static",
    "contract-protocol",
    "runtime-e2e",
    "ui-interaction"
  ],
  "cases": [
    {
      "id": "remote-permission-request-renders-and-resolves",
      "name": "Remote permission request renders and resolves in TUI",
      "project_profile": "agent-ui-tui-desktop",
      "target": "remote permission bridge and Ink TUI",
      "steps": [
        "Inject a remote can_use_tool control request",
        "Render the synthetic tool confirmation row in the TUI",
        "Approve or deny and capture the outbound permission response"
      ],
      "expected": [
        "Permission prompt identifies the remote tool and request id",
        "TUI does not require a local Tool object to render the request",
        "Permission response preserves behavior and request correlation"
      ],
      "risk": "remote tool permission mismatch or invisible prompt",
      "required_gates": [
        "contract-protocol",
        "ui-interaction"
      ],
      "required_evidence": [
        "tui_snapshot",
        "control_request_transcript",
        "permission_response_log"
      ],
      "status": "planned",
      "surface": "tui"
    },
    {
      "id": "sdk-stream-adapter-preserves-tool-use-id",
      "name": "SDK stream adapter preserves tool-use ids",
      "project_profile": "agent-sdk-api",
      "target": "SDK message adapter",
      "steps": [
        "Feed SDK partial assistant messages and tool results into the adapter",
        "Capture converted stream events",
        "Compare event type and tool-use id mapping"
      ],
      "expected": [
        "Partial and final events keep their event type",
        "Tool result keeps the original tool-use id",
        "Malformed input produces a controlled error or ignored event"
      ],
      "risk": "remote stream rendered as wrong tool/result state",
      "required_gates": [
        "contract-protocol",
        "unit"
      ],
      "required_evidence": [
        "stream_fixture",
        "adapter_output_snapshot",
        "negative_case_log"
      ],
      "status": "planned",
      "surface": "cli-stream"
    },
    {
      "id": "remote-cancel-clears-pending-prompt",
      "name": "Remote cancel clears pending permission prompt",
      "project_profile": "agent-ui-tui-desktop",
      "target": "remote session manager cancellation path",
      "steps": [
        "Open a pending remote permission request",
        "Inject a server-side control cancel event",
        "Capture TUI frame and pending request store"
      ],
      "expected": [
        "Pending approval is removed or clearly marked cancelled",
        "No stale allow button remains visible",
        "Runtime transcript records the cancelled request id"
      ],
      "risk": "stale approval after remote cancellation",
      "required_gates": [
        "runtime-e2e",
        "ui-interaction"
      ],
      "required_evidence": [
        "tui_snapshot",
        "control_cancel_transcript",
        "state_store_snapshot"
      ],
      "status": "planned",
      "surface": "tui"
    },
    {
      "id": "plugin-skill-reload-is-visible",
      "name": "Plugin or skill reload is visible and auditable",
      "project_profile": "agent-skills-plugins",
      "target": "skill/plugin reload surface",
      "steps": [
        "Trigger a reload or changed allowed-tools fixture",
        "Capture command/TUI status and runtime audit event",
        "Verify allowed tools changed only through the declared path"
      ],
      "expected": [
        "Reload result is visible to the operator",
        "Allowed tool changes are auditable",
        "No silent privilege expansion occurs"
      ],
      "risk": "silent tool permission drift through plugin or skill reload",
      "required_gates": [
        "contract-protocol",
        "review"
      ],
      "required_evidence": [
        "reload_transcript",
        "allowed_tools_diff",
        "review_note"
      ],
      "status": "planned",
      "surface": "tui"
    }
  ],
  "evidence_policy": "Because the local snapshot has no package or workflow metadata, do not claim upstream CI coverage; require interface-level evidence only."
}
```

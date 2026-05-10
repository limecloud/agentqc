---
title: OpenClaw channel gateway example
description: Agent QC profile mapping for a multi-channel gateway, WebUI, QA Lab, and release stack.
---

# OpenClaw channel gateway example

Profiles:

- `multi-channel-agent-gateway`
- `agent-tool-mcp-gateway`
- `agent-skills-plugins`
- `agent-ui-tui-desktop`
- `agent-evals-quality`
- `agent-distribution-release`

Typical gates:

- unit/contract: channel contracts, plugin contracts, secret refs, provider surfaces, media policies.
- fake-integration: gateway with fake provider, webhook replay, QR/import fixture, Docker smoke.
- ui-interaction: control WebUI browser trace, QA Lab report UI, channel transcript, browser runtime.
- live-provider: explicit opt-in model/channel/CLI backend lanes with redaction and budget.
- distribution-release: Docker/OpenWebUI/MCP channel/plugin install smoke and release checks.

Public QC plan JSON:

```json
{
  "schema_version": "0.4.0",
  "id": "openclaw-channel-webui-qalab-qc",
  "target_project": "openclaw",
  "project_profiles": [
    "multi-channel-agent-gateway",
    "agent-tool-mcp-gateway",
    "agent-skills-plugins",
    "agent-ui-tui-desktop",
    "agent-evals-quality",
    "agent-distribution-release"
  ],
  "risk_level": "high",
  "risk_domains": [
    "channel-auth",
    "secrets",
    "media-routing",
    "webui-state",
    "live-provider"
  ],
  "required_gates": [
    "static",
    "contract-protocol",
    "fake-integration",
    "ui-interaction",
    "distribution-release"
  ],
  "cases": [
    {
      "id": "telegram-secret-ref-isolation",
      "name": "Telegram secret ref isolation",
      "project_profile": "multi-channel-agent-gateway",
      "target": "channel secret runtime",
      "steps": [
        "Run channel contract tests",
        "Inspect redacted secret ref transcript",
        "Replay inactive-channel credential fixture"
      ],
      "expected": [
        "Secrets are referenced, not leaked",
        "Inactive channels cannot use active credentials",
        "Webhook/auth checks happen before content dispatch"
      ],
      "risk": "credential leakage or cross-channel auth drift",
      "required_gates": [
        "contract-protocol",
        "fake-integration"
      ],
      "required_evidence": [
        "test_report",
        "redacted_transcript",
        "webhook_replay_log"
      ],
      "status": "planned",
      "surface": "channel-ui"
    },
    {
      "id": "control-webui-shows-real-gateway-status",
      "name": "Control WebUI shows real gateway status",
      "project_profile": "agent-ui-tui-desktop",
      "target": "control WebUI gateway status panel",
      "steps": [
        "Start the gateway with a fake provider",
        "Open the control UI in browser mode",
        "Capture status panel, console log, and network log"
      ],
      "expected": [
        "Status panel matches gateway health response",
        "No console error is hidden behind a healthy UI state",
        "Reload or reconnect does not show stale healthy status"
      ],
      "risk": "WebUI reports cached or fake healthy state",
      "required_gates": [
        "ui-interaction",
        "fake-integration"
      ],
      "required_evidence": [
        "browser_trace",
        "screenshot",
        "console_network_log"
      ],
      "status": "planned",
      "surface": "webui"
    },
    {
      "id": "qa-lab-report-preserves-failures",
      "name": "QA Lab report preserves failing scenario evidence",
      "project_profile": "agent-evals-quality",
      "target": "QA Lab scenario runner and report UI",
      "steps": [
        "Run a mixed pass/fail scenario suite",
        "Open or export the report",
        "Inspect suite summary JSON and visible report rows"
      ],
      "expected": [
        "Failing cases remain visible in report and export",
        "Rubric, model profile, and evidence refs are preserved",
        "Summary counts match scenario-level results"
      ],
      "risk": "eval dashboard hides failures or rubric drift",
      "required_gates": [
        "semantic-eval",
        "ui-interaction",
        "review"
      ],
      "required_evidence": [
        "suite_summary_json",
        "report_screenshot",
        "rubric_and_review_note"
      ],
      "status": "planned",
      "surface": "eval-ui"
    },
    {
      "id": "openwebui-docker-smoke",
      "name": "OpenWebUI Docker smoke proves clean integration",
      "project_profile": "agent-distribution-release",
      "target": "Docker-hosted OpenWebUI integration",
      "steps": [
        "Run Docker smoke with clean state",
        "Open WebUI route and send a fixture request",
        "Capture container logs and browser evidence"
      ],
      "expected": [
        "Containers start without missing runtime assets",
        "WebUI request reaches the gateway through the expected route",
        "Cleanup removes containers or records intentional reuse"
      ],
      "risk": "release works only in dev checkout",
      "required_gates": [
        "distribution-release",
        "ui-interaction"
      ],
      "required_evidence": [
        "docker_smoke_log",
        "browser_trace",
        "cleanup_log"
      ],
      "status": "planned",
      "surface": "browser-automation"
    }
  ],
  "evidence_policy": "Live provider gates must be explicitly opted in, budgeted, and redacted. Channel contracts, WebUI browser proof, QA Lab reports, and Docker smoke evidence are separate gates."
}
```

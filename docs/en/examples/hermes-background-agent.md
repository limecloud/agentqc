---
title: Hermes background agent example
description: Agent QC profile mapping for a Hermes-style background agent.
---

# Hermes background agent example

Profiles:

- `background-agent-scheduler`
- `multi-channel-agent-gateway`
- `agent-ui-tui-desktop`
- `agent-distribution-release`

Typical gates:

- Python unit tests through a canonical runner that normalizes env.
- pytest markers to exclude integration by default.
- stress-concurrency tests for leases, queues, checkpoints, subprocesses.
- TUI Vitest tests for terminal behavior.
- Docker smoke and install tests for release paths.

```json
{
  "schema_version": "0.2.0",
  "id": "hermes-cron-recovery-qc",
  "target_project": "hermes-agent",
  "project_profiles": [
    "background-agent-scheduler",
    "multi-channel-agent-gateway",
    "agent-ui-tui-desktop",
    "agent-distribution-release"
  ],
  "risk_level": "high",
  "risk_domains": [
    "cron",
    "checkpoint",
    "credential-isolation"
  ],
  "required_gates": [
    "unit",
    "stress-concurrency",
    "fake-integration"
  ],
  "cases": [
    {
      "id": "cron-restart-does-not-duplicate-work",
      "name": "Cron restart does not duplicate work",
      "project_profile": "background-agent-scheduler",
      "target": "cron scheduler recovery",
      "steps": [
        "Run scheduler restart test",
        "Inspect checkpoint and evidence store"
      ],
      "expected": [
        "No duplicate work item",
        "Recovered run owns final state"
      ],
      "risk": "duplicate or lost background work",
      "required_gates": [
        "unit",
        "stress-concurrency"
      ],
      "required_evidence": [
        "pytest_report",
        "checkpoint_log"
      ],
      "status": "planned"
    }
  ],
  "evidence_policy": "Credential env vars must be blanked or scoped in test evidence."
}
```

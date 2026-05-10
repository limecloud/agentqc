---
title: Codex runtime CLI example
description: Agent QC profile mapping for a Codex-style runtime CLI.
---

# Codex runtime CLI example

Profiles:

- `agent-runtime-cli`
- `agent-tool-mcp-gateway`
- `agent-sdk-api`
- `agent-distribution-release`

Typical gates:

- static: `cargo fmt`, `cargo clippy`, dependency policy.
- unit/runtime: targeted crate tests and `cargo nextest run --no-fail-fast`.
- contract/protocol: MCP client/server fixtures, SSE fixtures, API bridge tests.
- runtime-e2e: CLI exec/apply-patch/resume/sandbox suites.
- distribution-release: Bazel matrix, SDK build/test, package staging.

```json
{
  "schema_version": "0.2.0",
  "id": "codex-runtime-sandbox-qc",
  "target_project": "codex",
  "project_profiles": [
    "agent-runtime-cli",
    "agent-tool-mcp-gateway",
    "agent-sdk-api",
    "agent-distribution-release"
  ],
  "risk_level": "high",
  "risk_domains": [
    "sandbox",
    "tool-execution",
    "protocol"
  ],
  "required_gates": [
    "static",
    "unit",
    "contract-protocol",
    "runtime-e2e"
  ],
  "cases": [
    {
      "id": "deny-unsafe-tool-action",
      "name": "Deny unsafe tool action",
      "project_profile": "agent-runtime-cli",
      "target": "sandbox policy",
      "steps": [
        "Run the sandbox deny fixture",
        "Capture CLI transcript and exit status"
      ],
      "expected": [
        "Unsafe action is denied",
        "Transcript includes controlled error"
      ],
      "risk": "permission bypass",
      "required_gates": [
        "unit",
        "runtime-e2e"
      ],
      "required_evidence": [
        "command_log",
        "cli_transcript"
      ],
      "status": "planned"
    }
  ],
  "evidence_policy": "Every pass must link to command, fixture, transcript, or CI evidence."
}
```

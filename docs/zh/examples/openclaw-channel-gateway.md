---
title: OpenClaw channel gateway 示例
description: OpenClaw 风格 multi-channel gateway 的 Agent QC profile 映射。
---

# OpenClaw channel gateway 示例

Profiles:

- `multi-channel-agent-gateway`
- `agent-tool-mcp-gateway`
- `agent-skills-plugins`
- `agent-distribution-release`

典型门禁：

- static：lint、typecheck、import boundary、generated baseline。
- unit/contract：channel contract、secret ref、provider surface、media policy。
- fake-integration：使用 fake provider response 的 webhook/gateway adapter。
- live-provider：显式 opt-in 的 model/channel/provider lane。
- distribution-release：Docker 与 install smoke。

```json
{
  "schema_version": "0.2.0",
  "id": "openclaw-channel-contract-qc",
  "target_project": "openclaw",
  "project_profiles": [
    "multi-channel-agent-gateway",
    "agent-tool-mcp-gateway",
    "agent-skills-plugins",
    "agent-distribution-release"
  ],
  "risk_level": "high",
  "risk_domains": [
    "channel-auth",
    "secrets",
    "media-routing"
  ],
  "required_gates": [
    "static",
    "contract-protocol",
    "fake-integration",
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
        "Inspect redacted secret ref transcript"
      ],
      "expected": [
        "Secrets are referenced, not leaked",
        "Inactive channels cannot use active credentials"
      ],
      "risk": "credential leakage",
      "required_gates": [
        "contract-protocol",
        "fake-integration"
      ],
      "required_evidence": [
        "test_report",
        "redacted_transcript"
      ],
      "status": "planned"
    }
  ],
  "evidence_policy": "Live provider gates must be explicitly opted in and redacted."
}
```

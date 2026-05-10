---
title: Project classification
description: Agent QC profile taxonomy.
---

# Project classification

Agent QC starts with classification. The same repository can match several profiles.

| Profile | Use when the project owns | Common test focus |
| --- | --- | --- |
| `agent-runtime-cli` | agent loop, CLI, task execution, sandbox, tools, resume | unit, sandbox policy, protocol streams, CLI e2e, subprocess cleanup |
| `agent-sdk-api` | public SDK, generated client, API wrappers | public signatures, fake server integration, generated contract drift |
| `agent-tool-mcp-gateway` | tool declarations, MCP/ACP bridge, connector runtime | protocol conformance, stdio/http recovery, resource and permission refs |
| `multi-channel-agent-gateway` | chat/channel adapters, webhooks, auth, media | channel contracts, auth/secrets, live opt-in, media routing, Docker smoke |
| `agent-ui-tui-desktop` | GUI, TUI, desktop shell, browser-visible flows | rendering, screenshots, terminal fixtures, Playwright, accessibility |
| `agent-skills-plugins` | skills, plugins, manifests, loaders, marketplace | schema, discovery, package boundary, fixture install, trust policy |
| `background-agent-scheduler` | cron, queues, workers, retries, long-running agents | deterministic time, leases, checkpointing, races, stress |
| `agent-distribution-release` | install, package, Docker, cross-platform release | package contents, install smoke, OS matrix, supply-chain scan |
| `agent-evals-quality` | task quality, model behavior, rubrics, generated outputs | baseline comparison, semantic judge, grounding, safety/policy evals |

## Classification rules

- Classify by owned risk, not by language.
- If a project exposes user-visible work, include the UI or runtime profile even if most code is library code.
- If a test requires credentials or a real provider, mark it `live-provider` and opt in explicitly.
- If a release artifact is shipped, include `agent-distribution-release` even for docs-heavy projects.

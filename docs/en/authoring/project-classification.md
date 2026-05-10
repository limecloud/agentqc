---
title: Project classification
description: Agent QC profile taxonomy and classification rules.
---

# Project classification

Agent QC starts with classification. The same repository can match several profiles. Classification decides which risks the report is allowed to judge.

Classify by owned risk, not by language, framework, company, or UI style.

## Profiles

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

## Mixed-profile examples

| Project shape | Profiles |
| --- | --- |
| Codex-like runtime with TUI and app-server protocol | `agent-runtime-cli`, `agent-ui-tui-desktop`, `agent-tool-mcp-gateway`, `agent-sdk-api`, `agent-distribution-release` |
| Claude Code-like local snapshot | `agent-ui-tui-desktop`, `agent-runtime-cli`, `agent-sdk-api`, `agent-skills-plugins`; mark release/CI claims as unknown if metadata is absent |
| OpenClaw-like gateway and QA Lab | `multi-channel-agent-gateway`, `agent-tool-mcp-gateway`, `agent-ui-tui-desktop`, `agent-skills-plugins`, `agent-distribution-release`, `agent-evals-quality` |
| Hermes-like Python agent | `agent-runtime-cli`, `background-agent-scheduler`, `agent-tool-mcp-gateway`, `multi-channel-agent-gateway`, `agent-ui-tui-desktop`, `agent-distribution-release` |
| Desktop GUI with native bridge | `agent-ui-tui-desktop`, `agent-tool-mcp-gateway`, `agent-runtime-cli`, `agent-skills-plugins`, `agent-distribution-release` |
| Standards/documentation site with schemas and examples | `agent-distribution-release`, optionally `agent-sdk-api` if schemas/CLI are consumed |

## Classification roles

A useful plan identifies owners:

| Role | Question |
| --- | --- |
| Profile owner | Which project shape owns the risk? |
| Fact owner | Which system writes the fact being verified? |
| Surface owner | Where is the fact projected to users/operators? |
| Gate owner | Which command, CI job, script, qcloop item, or review executes the gate? |
| Evidence owner | Where are durable logs, traces, screenshots, transcripts, reports, and waivers stored? |
| Risk owner | Who decides waiver, release, or retry? |

## Classification rules

- Classify by owned risk, not by language.
- A repository can have multiple profiles; do not force it into one label.
- If a project exposes user-visible work, include a surface classification even if most code is backend/library code.
- If a test requires credentials or a real provider, mark it `live-provider` and opt in explicitly.
- If a release artifact is shipped, include `agent-distribution-release` even for docs-heavy projects.
- If a UI shows runtime state, include both surface and runtime/protocol gates; UI alone is not runtime proof.
- If repo metadata is missing, state the limitation instead of inventing CI/release guarantees.
- If cases are repeated and independent, qcloop can execute them, but project gates still need evidence.

## Decision tree

```text
Does the project execute agent turns, tools, shell, sandbox, or resume?
  -> agent-runtime-cli
Does it expose a public SDK, generated client, schema, or app-server API?
  -> agent-sdk-api
Does it declare, route, or bridge tools/MCP/ACP/connectors?
  -> agent-tool-mcp-gateway
Does it connect to chat channels, webhooks, mobile, QR, or media routing?
  -> multi-channel-agent-gateway
Does a user/operator see GUI, TUI, WebUI, desktop, or browser UI?
  -> agent-ui-tui-desktop
Does it load skills/plugins/manifests or marketplace assets?
  -> agent-skills-plugins
Does it schedule background/long-running/retry work?
  -> background-agent-scheduler
Does it ship packages, Docker images, installers, or docs site artifacts?
  -> agent-distribution-release
Does it judge model/task quality with rubrics, baselines, or reports?
  -> agent-evals-quality
```

## What classification is not

Classification is not:

- a technology stack label;
- a maturity grade;
- a promise that all gates have passed;
- a release checklist by itself;
- a reason to ignore project-specific AGENTS/CONTRIBUTING rules.

Classification only selects the risks and evidence lanes that must be proven.

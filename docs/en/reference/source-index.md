---
title: Source index
description: Traceable sources used by Agent QC v0.2.0.
---

# Source index

Agent QC v0.2.0 is derived from local project inspection plus public documentation. Local repositories are case studies, not normative dependencies.

## Local repositories

| Source | Use |
| --- | --- |
| `/Users/coso/Documents/dev/rust/codex` | Runtime CLI, Rust, Bazel, SDK, MCP, sandbox, protocol, and release patterns. |
| `/Users/coso/Documents/dev/js/openclaw` | Multi-channel gateway, Vitest lanes, live providers, Docker/install smoke, plugin and secret tests. |
| `/Users/coso/Documents/dev/js/claudecode` | Partial local source snapshot; useful for shell/spec and permission-tool surfaces, not enough for CI conclusions. |
| `/Users/coso/Documents/dev/python/hermes-agent` | Python agent, pytest, cron, gateway, stress, TUI, Docker, lockfile, and supply-chain patterns. |
| `/Users/coso/Documents/dev/ai/aiclientproxy/lime` | Desktop GUI, Tauri bridge, command contracts, GUI smoke, Playwright continuation. |

## External docs and research inputs

| Source | Use |
| --- | --- |
| `https://agentskills.io/specification.md` | Markdown/frontmatter/progressive disclosure style for Agent-facing standards. |
| `https://agentskills.io/skill-creation/evaluating-skills.md` | Eval-driven iteration and assertion-grading pattern. |
| `https://docs.openclaw.ai/help/testing` | Public OpenClaw testing workflow reference. |
| `https://docs.openclaw.ai/ci` | Public OpenClaw CI and release proof patterns. |
| `https://vitest.dev/guide/cli.html` | Vitest CLI, coverage, reporter, project, and browser-mode conventions. |
| `https://docs.pytest.org/en/stable/example/markers.html` | pytest marker selection and suite routing conventions. |
| `https://playwright.dev/docs/test-configuration` | Playwright retries, reporters, projects, web server, trace/screenshot/video evidence. |
| `https://modelcontextprotocol.io/specification/2025-11-25/server/tools` | MCP tool declaration and protocol boundary reference. |
| `https://github.com/openai/codex/actions` | Public Codex workflow signals. |
| `https://github.com/NousResearch/hermes-agent` | Public Hermes repository and project context. |

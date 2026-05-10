---
title: 来源索引
description: Agent QC v0.3.0 使用的可追踪来源。
---

# 来源索引

Agent QC v0.3.0 来自本地项目检查和公开文档。这里的本地仓库是案例，不是规范依赖。

## 本地仓库

| 来源 | 用途 |
| --- | --- |
| `/Users/coso/Documents/dev/rust/codex` | runtime CLI、Rust、Bazel、SDK、MCP、sandbox、protocol、release 模式。 |
| `/Users/coso/Documents/dev/js/openclaw` | multi-channel gateway、Vitest 分层、live provider、Docker/install smoke、plugin 与 secret 测试。 |
| `/Users/coso/Documents/dev/js/claudecode` | 不完整本地快照；可参考 Ink TUI、remote bridge、SDK stream、command、skill/plugin 与 permission-tool 表面，不足以推断 CI。 |
| `/Users/coso/Documents/dev/python/hermes-agent` | Python agent、pytest、cron、gateway、stress、TUI、Docker、lockfile、supply-chain 模式。 |
| `/Users/coso/Documents/dev/ai/aiclientproxy/lime` | desktop GUI、Tauri bridge、command contract、GUI smoke、Playwright 续测。 |

## 外部文档和研究输入

| 来源 | 用途 |
| --- | --- |
| `https://agentskills.io/specification` | 面向 Agent 的 Markdown/frontmatter/progressive disclosure 风格。 |
| `https://agentskills.io/skill-creation/evaluating-skills` | eval-driven iteration 与 assertion grading 模式。 |
| `https://docs.openclaw.ai/help/testing` | OpenClaw 公开测试工作流参考。 |
| `https://docs.openclaw.ai/ci` | OpenClaw 公开 CI 与 release proof 模式。 |
| `https://vitest.dev/guide/cli.html` | Vitest CLI、coverage、reporter、project、browser-mode 约定。 |
| `https://docs.pytest.org/en/stable/example/markers.html` | pytest marker selection 与 suite routing 约定。 |
| `https://playwright.dev/docs/test-configuration` | Playwright retries、reporters、projects、web server、trace/screenshot/video 证据。 |
| OpenClaw local `ui/package.json` 与 `extensions/qa-lab/package.json` | Browser-playwright WebUI testing 与 QA Lab scenario/report runtime。 |
| Hermes local `ui-tui/package.json` 与 `web/package.json` | TUI Vitest package 与 Vite/React web dashboard 形态。 |
| `https://modelcontextprotocol.io/specification/2025-11-25/server/tools` | MCP tool declaration 与 protocol boundary 参考。 |
| `https://github.com/openai/codex/actions` | Codex 公开 workflow 信号。 |
| `https://github.com/NousResearch/hermes-agent` | Hermes 公开仓库与项目上下文。 |

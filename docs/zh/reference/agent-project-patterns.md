---
title: Agent 项目测试模式
description: 来自 Codex、OpenClaw、Claude Code 快照、Hermes Agent 和 Lime 的案例模式。
---

# Agent 项目测试模式

这些模式来自本地仓库检查和公开文档。它们是案例，不是规范强制要求。

更完整的系统级说明见[明星项目测试体系](./star-project-testing-systems)。

## Codex 风格 runtime CLI

本地来源：`/Users/coso/Documents/dev/rust/codex`。

观察到的测试形态：

- Rust workspace 日常本地运行使用 `cargo nextest run --no-fail-fast`。
- CI 包含 `cargo fmt`、`cargo clippy`、`cargo test`、`cargo nextest`、`cargo-deny`、`cargo shear`、Bazel test matrix 和 SDK job。
- 测试覆盖 sandbox、apply-patch、MCP server/client、protocol event、CLI execution、app server、streamable HTTP recovery 和 SDK public API。
- fixture 包括 fake model server、SSE fixture、测试用 stdio/http server、期望 patch output、terminal snapshot、app-server protocol fixture 和 SDK stream test。

Surface 覆盖：`cli-stream`、`tui`、protocol/runtime transcript 与 release artifact。

Agent QC profile 映射：`agent-runtime-cli`、`agent-tool-mcp-gateway`、`agent-sdk-api`、`agent-ui-tui-desktop`、`agent-distribution-release`。

## OpenClaw 风格 multi-channel gateway

本地来源：`/Users/coso/Documents/dev/js/openclaw` 与 OpenClaw 公开文档。

观察到的测试形态：

- 许多 Vitest lane：unit、gateway、channels、contracts、e2e、live、Docker、install smoke、performance、startup、platform-specific lane。
- CI preflight 先计算变更 scope，再路由 job，而不是只运行一个固定命令。
- 测试重点包括 channel contract、secret、provider surface、media handling、plugin boundary、Docker/install smoke 和 live opt-in provider。
- release workflow 包含 npm、Docker、plugin、install-smoke 和平台相关检查。

Surface 覆盖：`channel-ui`、`webui`、`browser-automation`、`eval-ui` 与 release smoke。

Agent QC profile 映射：`multi-channel-agent-gateway`、`agent-tool-mcp-gateway`、`agent-skills-plugins`、`agent-ui-tui-desktop`、`agent-distribution-release`、`agent-evals-quality`。

## Claude Code 风格 TUI/runtime 快照

本地来源：`/Users/coso/Documents/dev/js/claudecode`。

观察到的测试形态：

- 本地快照不完整：没有 `package.json` 或 GitHub workflows。
- 源码表面仍显示 TUI/runtime 风险：Ink rendering、shell interaction、remote session permission request、WebSocket/SSE/HTTP transport、tool-use message、SDK stream adapter 和可注入 query dependency。
- Agent QC 只能把它当成 interface-surface 参考，不能据此推断上游项目完整测试策略。

Surface 覆盖：`tui`、`cli-stream`、remote permission protocol、SDK stream adapter、skill/plugin reload visibility。

Agent QC profile 映射：`agent-runtime-cli`、`agent-ui-tui-desktop`、`agent-sdk-api`、`agent-tool-mcp-gateway`、`agent-skills-plugins`。

## Hermes 风格 background agent

本地来源：`/Users/coso/Documents/dev/python/hermes-agent` 与 Hermes 公开文档。

观察到的测试形态：

- Python 使用 pytest marker、xdist、默认忽略 integration/e2e path，并通过 canonical `scripts/run_tests.sh` 统一 env、worker、timezone、locale、hash seed 和 credential。
- 测试覆盖 cron、gateway、plugin、memory provider、stress/concurrency、checkpoint、evidence store、subprocess e2e 和 TUI Vitest test。
- CI 包含 pytest、独立 e2e、ruff/ty lint、uv lock check、OSV scanner、Docker build/smoke、docs-site check 和 skills index job。仓库还包含 `ui-tui` Vitest 测试和 Vite/React `web` dashboard package。

Surface 覆盖：`cli-stream`、`tui`、`browser-automation`、`channel-ui` 与 scheduler evidence。

Agent QC profile 映射：`agent-runtime-cli`、`background-agent-scheduler`、`multi-channel-agent-gateway`、`agent-ui-tui-desktop`、`agent-tool-mcp-gateway`、`agent-distribution-release`、`agent-skills-plugins`。

## Lime 风格 desktop GUI agent

本地来源：`/Users/coso/Documents/dev/ai/aiclientproxy/lime`。

观察到的测试形态：

- Lime 把 GUI 产品可交付性与 type/lint/unit 通过分开看待。
- 必需门禁包括 `verify:local`、`test:contracts`、`verify:gui-smoke`、bridge health、workspace-ready smoke、browser-runtime smoke，用户可见行为变更时继续 Playwright 验证。
- command 变更必须同步 frontend call、Rust handler、governance catalog、DevBridge 和 mock。

Surface 覆盖：`desktop-gui`、WebView `webui`、`browser-automation` 与 bridge/command transcript。

Agent QC profile 映射：`agent-ui-tui-desktop`、`agent-runtime-cli`、`agent-tool-mcp-gateway`、`agent-skills-plugins`。

## 跨案例结论

1. 先分类 project profile，再选择 gate。
2. fake/local integration 必须与 live provider 分离。
3. install/package/Docker smoke 应是一等 release gate。
4. protocol transcript 和 UI trace 要作为证据保留。
5. qcloop 用于重复 case，不替代框架原生门禁。
6. Agent 测试需要统一环境：credential、time、locale、working directory、concurrency 和 sandbox。

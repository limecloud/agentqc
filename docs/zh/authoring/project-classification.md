---
title: 项目分类
description: Agent QC profile 分类和判定规则。
---

# 项目分类

Agent QC 从分类开始。同一个仓库可以匹配多个 profiles。分类决定报告可以判断哪些风险。

按拥有的风险分类，不按语言、框架、公司或 UI 风格分类。

## Profiles

| Profile | Use when the project owns | Common test focus |
| --- | --- | --- |
| `agent-runtime-cli` | agent loop、CLI、task execution、sandbox、tools、resume | unit、sandbox policy、protocol streams、CLI e2e、subprocess cleanup |
| `agent-sdk-api` | public SDK、generated client、API wrappers | public signatures、fake server integration、generated contract drift |
| `agent-tool-mcp-gateway` | tool declarations、MCP/ACP bridge、connector runtime | protocol conformance、stdio/http recovery、resource and permission refs |
| `multi-channel-agent-gateway` | chat/channel adapters、webhooks、auth、media | channel contracts、auth/secrets、live opt-in、media routing、Docker smoke |
| `agent-ui-tui-desktop` | GUI、TUI、desktop shell、browser-visible flows | rendering、screenshots、terminal fixtures、Playwright、accessibility |
| `agent-skills-plugins` | skills、plugins、manifests、loaders、marketplace | schema、discovery、package boundary、fixture install、trust policy |
| `background-agent-scheduler` | cron、queues、workers、retries、long-running agents | deterministic time、leases、checkpointing、races、stress |
| `agent-distribution-release` | install、package、Docker、cross-platform release | package contents、install smoke、OS matrix、supply-chain scan |
| `agent-evals-quality` | task quality、model behavior、rubrics、generated outputs | baseline comparison、semantic judge、grounding、safety/policy evals |

## Mixed-profile examples

| Project shape | Profiles |
| --- | --- |
| Codex-like runtime with TUI and app-server protocol | `agent-runtime-cli`, `agent-ui-tui-desktop`, `agent-tool-mcp-gateway`, `agent-sdk-api`, `agent-distribution-release` |
| Claude Code-like local snapshot | `agent-ui-tui-desktop`, `agent-runtime-cli`, `agent-sdk-api`, `agent-skills-plugins`；metadata 缺失时 release/CI claims 标为 unknown |
| OpenClaw-like gateway and QA Lab | `multi-channel-agent-gateway`, `agent-tool-mcp-gateway`, `agent-ui-tui-desktop`, `agent-skills-plugins`, `agent-distribution-release`, `agent-evals-quality` |
| Hermes-like Python agent | `agent-runtime-cli`, `background-agent-scheduler`, `agent-tool-mcp-gateway`, `multi-channel-agent-gateway`, `agent-ui-tui-desktop`, `agent-distribution-release` |
| 带 native bridge 的 desktop GUI | `agent-ui-tui-desktop`, `agent-tool-mcp-gateway`, `agent-runtime-cli`, `agent-skills-plugins`, `agent-distribution-release` |
| 带 schemas/examples 的标准或文档站 | `agent-distribution-release`；如 schemas/CLI 被消费，也可包含 `agent-sdk-api` |

## Classification roles

有用的 plan 会识别 owners：

| Role | Question |
| --- | --- |
| Profile owner | 哪个项目形态拥有风险？ |
| Fact owner | 哪个系统写入被验证的事实？ |
| Surface owner | 事实投影到哪个用户/运维表面？ |
| Gate owner | 哪个 command、CI job、script、qcloop item 或 review 执行 gate？ |
| Evidence owner | durable logs、traces、screenshots、transcripts、reports、waivers 存在哪里？ |
| Risk owner | 谁决定 waiver、release 或 retry？ |

## Classification rules

- 按拥有的风险分类，不按语言。
- 一个仓库可以有多个 profiles；不要强行贴一个标签。
- 如果项目暴露用户可见工作，即使大部分代码是 backend/library，也要包含 surface classification。
- 如果测试需要凭证或真实 provider，标记 `live-provider` 并显式 opt-in。
- 如果对外发布 artifact，即使是 docs-heavy project，也要包含 `agent-distribution-release`。
- 如果 UI 展示 runtime state，需要同时包含 surface 和 runtime/protocol gates；UI alone 不是 runtime proof。
- 如果 repo metadata 缺失，写明 limitation，不要虚构 CI/release guarantees。
- 如果 cases 重复且独立，qcloop 可以执行，但 project gates 仍需要证据。

## Decision tree

```text
项目是否执行 agent turns、tools、shell、sandbox 或 resume？
  -> agent-runtime-cli
是否暴露 public SDK、generated client、schema 或 app-server API？
  -> agent-sdk-api
是否声明、路由或桥接 tools/MCP/ACP/connectors？
  -> agent-tool-mcp-gateway
是否连接 chat channels、webhooks、mobile、QR 或 media routing？
  -> multi-channel-agent-gateway
用户/运维是否看到 GUI、TUI、WebUI、desktop 或 browser UI？
  -> agent-ui-tui-desktop
是否加载 skills/plugins/manifests 或 marketplace assets？
  -> agent-skills-plugins
是否调度 background/long-running/retry work？
  -> background-agent-scheduler
是否发布 packages、Docker images、installers 或 docs site artifacts？
  -> agent-distribution-release
是否用 rubrics、baselines 或 reports 判断 model/task quality？
  -> agent-evals-quality
```

## What classification is not

Classification 不是：

- 技术栈标签；
- 成熟度评级；
- 所有 gates 已通过的承诺；
- 独立 release checklist；
- 忽略项目 AGENTS/CONTRIBUTING 规则的理由。

Classification 只负责选择必须证明的风险和 evidence lanes。

---
title: 项目分类
description: Agent QC profile taxonomy。
---

# 项目分类

Agent QC 从分类开始。同一个仓库可以同时匹配多个项目类型。

| 类型 | 项目拥有的边界 | 常见测试重点 |
| --- | --- | --- |
| `agent-runtime-cli` | agent loop、CLI、任务执行、沙箱、工具、resume | unit、沙箱策略、协议流、CLI e2e、子进程清理 |
| `agent-sdk-api` | public SDK、generated client、API wrapper | public signature、fake server integration、generated contract drift |
| `agent-tool-mcp-gateway` | tool declaration、MCP/ACP bridge、connector runtime | protocol conformance、stdio/http recovery、resource/permission refs |
| `multi-channel-agent-gateway` | chat/channel adapter、webhook、auth、media | channel contract、auth/secrets、live opt-in、media routing、Docker smoke |
| `agent-ui-tui-desktop` | GUI、TUI、desktop shell、browser-visible flow | rendering、screenshot、terminal fixture、Playwright、accessibility |
| `agent-skills-plugins` | skill、plugin、manifest、loader、marketplace | schema、discovery、package boundary、fixture install、trust policy |
| `background-agent-scheduler` | cron、queue、worker、retry、long-running agent | deterministic time、lease、checkpoint、race、stress |
| `agent-distribution-release` | install、package、Docker、cross-platform release | package contents、install smoke、OS matrix、supply-chain scan |
| `agent-evals-quality` | task quality、model behavior、rubric、generated output | baseline comparison、semantic judge、grounding、safety/policy eval |

## 分类规则

- 按项目拥有的风险分类，不按语言分类。
- 只要项目暴露用户可见工作流，即使大部分代码是库，也要加入 UI 或 runtime 类型。
- 任何需要凭证或真实 provider 的测试，都必须标为 `live-provider` 并显式 opt in。
- 只要项目交付 release artifact，即使是文档重的项目，也要加入 `agent-distribution-release`。

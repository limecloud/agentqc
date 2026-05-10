---
title: 什么是 Agent QC
description: Agent 项目质量控制概念入口。
---

# 什么是 Agent QC

Agent QC 是一个通用标准，用来证明 Agent 项目真的可用。

Agent 软件有一些普通应用测试容易漏掉的失败模式：tool call 可能与 declaration 漂移，permission gate 可能被绕过，model stream 可能产生格式错误的事件，后台任务可能卡住，live provider 可能悄悄改变行为，UI 也可能把未成功的 runtime fact 展示成成功。

Agent QC 为这些风险提供统一词汇：

1. 先分类 Agent 项目类型；
2. 选择匹配类型和风险的门禁；
3. 编写行为级 case；
4. 收集可检查证据；
5. 用显式 verdict 判定 pass/fail；
6. 报告剩余风险和 waiver。

## Lime 是一个 profile，不是标准本身

Lime 仍然是重要案例，因为它是 GUI 桌面 Agent 产品。但 Agent QC v0.3.0 的范围更广：类似 Codex 的 runtime CLI、类似 OpenClaw 的 multi-channel gateway、类似 Hermes 的 background agent、SDK、tool server、skill、plugin 和 release package 都需要 QC。

## 为什么 Agent 项目需要先分类

Rust runtime agent、Telegram gateway、VitePress 标准站点需要的门禁并不相同。因此 Agent QC 先分类，再选择门禁。

示例：

- Codex 风格 runtime：sandbox、apply-patch、MCP、protocol、CLI e2e、cross-platform release。
- Claude Code 风格 TUI runtime：Ink rendering、remote permission、WebSocket/control stream、SDK adapter、plugin/skill reload visibility。
- OpenClaw 风格 gateway：channel contract、secrets、provider live lane、Docker/install smoke、plugin boundary。
- Hermes 风格 background agent：pytest、cron、gateway、concurrency stress、Docker smoke、credential isolation。
- Lime 风格 desktop GUI：local validation、command contract、DevBridge readiness、GUI smoke、Playwright product flow。

## 什么算证据

证据可以是 test report、command log、CI URL、qcloop attempt、verifier round、Playwright trace、screenshot、model/tool transcript、package manifest、Docker smoke output 或 human review record。

模型最后一句“我检查过了”本身永远不够。

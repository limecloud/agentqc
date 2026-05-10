---
title: 什么是 Agent QC？
description: Agent 项目质量控制的概念入口。
---

# 什么是 Agent QC？

Agent QC 是一个可移植标准，用来证明 Agent 项目真的可用。

Agent 软件有很多普通应用测试容易漏掉的失败模式：tool calls 与声明漂移、permission gates 被绕过、model streams 产生 malformed events、background tasks 卡住、live providers 静默改变行为、UI surfaces 把 runtime 未确认的状态显示成成功。

Agent QC 为这些风险提供共同语言：

1. 分类 Agent project profile；
2. 识别 touched interaction surfaces；
3. 按 profile、surface 和 risk 选择 gates；
4. 编写 behavior-level cases；
5. 收集 inspectable evidence；
6. 用明确 verdicts 判断 pass/fail；
7. 报告 remaining risk、blockers、exhausted attempts、reviews 和 waivers。


## 为什么 Agent 项目需要分类

Rust runtime agent 与 Telegram gateway、TUI、browser automation harness 或 VitePress standards site 需要的 gates 不一样。因此 Agent QC 先分类，再选择 gates。

示例：

- Codex-style runtime：sandbox、apply-patch、MCP、app-server protocol、CLI e2e、TUI snapshots、cross-platform release。
- Claude Code-style TUI runtime：Ink rendering、remote permissions、WebSocket/control streams、SDK adapters、plugin/skill reload visibility。
- OpenClaw-style gateway：channel contracts、secrets、provider live lanes、QA Lab reports、WebUI/browser evidence、Docker/install smoke。
- Hermes-style background agent：pytest markers、cron、gateway、browser safety、concurrency stress、Docker smoke、credential isolation。
- Desktop GUI agent：native bridge contracts、workspace/session readiness、GUI smoke、browser evidence、release checks。

## Runtime-backed surfaces

Agent QC 采用 Agent UI 的关键规则：可见 surface 是 projection，不是真相拥有者。

一个 surface pass 应连接：

```text
entrypoint -> user action -> visible frame -> runtime/protocol fact -> evidence ref -> cleanup
```

只有 screenshot 没有 runtime backing，只是 visual smoke。只有 runtime log 没有 visible frame，也不是 surface test。

## 什么算证据

证据可以是 test report、command log、CI URL、qcloop attempt、verifier round、Playwright trace、screenshot、terminal snapshot、model/tool transcript、protocol transcript、browser console/network log、package manifest、Docker smoke output、eval rubric、judge output 或 human review record。

模型最终文字本身永远不够。

---
title: Agent 标准生态
description: Agent QC 与相邻 Agent 标准的边界。
---

# Agent 标准生态

Agent QC 负责 Agent 项目的质量控制契约。它通过引用连接相邻标准，而不是接管它们的事实。

| 标准 | 角色 | 与 Agent QC 的关系 |
| --- | --- | --- |
| Agent Knowledge | 来源可信的知识包。 | 为测试提供可信需求、文档和领域事实。 |
| Agent UI | 用户可见交互表面。 | 提供 UI/TUI/desktop 验收期望。 |
| Agent Runtime | execution fact、control、task、tool 和 recovery。 | 为 runtime gate 提供 run/task/session 状态。 |
| Agent Evidence | evidence、verification、review、replay 和 export。 | 持久化 QC verdict 引用的 evidence record。 |
| Agent Policy | permission、approval、risk、retention、waiver。 | 定义高风险测试动作是否允许执行或 waiver。 |
| Agent Artifact | durable deliverable 和 handoff package。 | 存储 report、screenshot、trace、log 和 package manifest。 |
| Agent Tool | tool declaration、call、progress、result、permission。 | 为 tool 与 MCP gate 提供 tool invocation fact。 |
| Agent Context | context selection、budget、injection、missing facts。 | 解释 worker/verifier/judge agent 获得了什么上下文。 |
| Agent QC | plan、profile、gate、evidence、verdict 和 report。 | 判定测试证据是否足以证明项目质量声明。 |

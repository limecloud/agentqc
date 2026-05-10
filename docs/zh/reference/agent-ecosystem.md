---
title: Agent 标准生态
description: Agent QC 与相邻 Agent 标准的边界。
---

# Agent 标准生态

Agent QC 当前是 Lime 专属候选标准。它把测试计划和判定连接到相邻 Agent 标准，但不吞并它们的职责。

| Standard | 角色 | 与 Agent QC 的关系 |
| --- | --- | --- |
| Agent Knowledge | 有来源的知识包。 | 提供可信测试上下文和需求。 |
| Agent UI | 用户可见交互表面。 | 提供 GUI 行为级验收期望。 |
| Agent Runtime | 执行事实、控制、任务和恢复。 | 提供长测试任务的 run/task 状态。 |
| Agent Evidence | 证据、验证、评审、回放和导出。 | 拥有 QC verdict 引用的持久证据。 |
| Agent Policy | 权限、审批、风险、保留和豁免。 | 定义高风险测试动作是否允许执行。 |
| Agent Artifact | 持久交付物和 handoff package。 | 存储测试报告、截图、日志或 evidence bundle。 |
| Agent Tool | 工具声明、调用、进度和结果。 | 提供测试执行的 tool invocation facts。 |
| Agent Context | 上下文选择、预算、注入和缺失事实。 | 解释 worker 或 verifier 可用的上下文。 |
| Agent QC | Lime 测试计划、门禁、用例、判定和报告。 | 拥有 Lime 测试 pass/fail 的质量控制契约。 |

任何标准都不应成为整个技术栈。Agent QC 判定应保留指向 runtime、evidence、artifact、tool、policy 和 qcloop 记录的 refs。

---
title: 快速开始
description: 为任意 Agent 项目创建 Agent QC 计划。
---

# 快速开始

当 Agent 需要测试一个 Agent 项目时，使用这个流程。

## 1. 分类项目

选择一个或多个项目类型：

- `agent-runtime-cli`
- `agent-sdk-api`
- `agent-tool-mcp-gateway`
- `multi-channel-agent-gateway`
- `agent-ui-tui-desktop`
- `agent-skills-plugins`
- `background-agent-scheduler`
- `agent-distribution-release`
- `agent-evals-quality`

## 2. 识别变更面

常见变更面包括 tool execution、sandbox、transport、channel adapter、secrets、scheduler、UI、package、live provider、eval benchmark。

## 3. 选择门禁

参考[门禁矩阵](./gate-matrix)。多个项目类型重叠时，需要组合门禁。

## 4. 编写证据优先的 case

每个 `qc_case` 应说明：

- 要证明的行为；
- 精确步骤或命令；
- 期望结果；
- 必需证据；
- 什么算 failed、blocked、exhausted 或 waived。

## 5. 重复验证时使用 qcloop

当多个文件、多个频道、多个 provider、多个命令、多个 prompt 或多个 package profile 可以独立判断时，使用 qcloop 批量执行。

## 6. 汇总报告

只有必需门禁都有证据驱动的 verdict，并且剩余风险被明确列出时，报告才算完整。

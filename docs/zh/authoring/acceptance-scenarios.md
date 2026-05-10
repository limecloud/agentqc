---
title: 验收场景
description: Lime Agent QC 的行为级验证场景。
---

# 验收场景

Agent QC 验收行为和证据，不验收“文件是否存在”。

## 1. 普通前端改动

1. 分类为 `frontend`。
2. 执行 `npm run verify:local`。
3. 记录命令输出证据。
4. 只有命令通过且未触碰更高风险边界，才报告通过。

通过条件：本地验证证据支持当前改动，且无需 GUI 或 Bridge 门禁。

## 2. 用户可见 UI 改动

1. 分类为 `user-visible-ui`。
2. 执行 `npm run verify:local`。
3. 若已有测试面，补或运行稳定 UI 断言。
4. 记录用户可见期望状态的证据。

通过条件：UI 行为被断言，而不是只通过类型检查。

## 3. GUI 壳或 Workspace 改动

1. 分类为 `gui-shell-workspace`。
2. 执行 `npm run verify:local`。
3. 执行 `npm run verify:gui-smoke`。
4. 记录 DevBridge 与 workspace ready 证据。

通过条件：GUI 主路径被证明可用。

## 4. Tauri 命令 / Bridge / mock 改动

1. 分类为 `tauri-command-bridge-mock`。
2. 成组检查命令面。
3. 执行 `npm run test:contracts` 与 `npm run verify:local`。
4. contracts 失败时记录具体 command id。

通过条件：前端调用、Rust 注册、catalog、mock 保持同步。

## 5. qcloop 批量回归

1. 把每个行为拆成独立 `qc_case`。
2. 创建带严格 verifier JSON 的 qcloop job。
3. 启动 job 并轮询到没有 pending / running item。
4. 分开汇总 `success`、`failed` 和 `exhausted`。

通过条件：每个必需 item 都有 verifier 支撑的证据。

## 6. 人工或 LLM judge 评审

1. 评审前定义 rubric。
2. 给 reviewer 提供输出和证据 refs。
3. 记录 verdict、reviewer 身份或 judge 配置、剩余风险。

通过条件：评审结论明确且可追踪。

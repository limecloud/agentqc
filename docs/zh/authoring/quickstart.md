---
title: 快速开始
description: 为一次 Lime 改动创建 Agent QC 测试计划。
---

# 快速开始

当 Agent 需要测试 Lime 改动时，按下面流程走。

## 1. 先分类改动

选择最接近的 `change_type`：

- 普通前端代码：`frontend`
- 用户可见 UI：`user-visible-ui`
- GUI 壳、Workspace、DevBridge 或主路径：`gui-shell-workspace`
- Tauri 命令、Bridge、catalog 或 mock：`tauri-command-bridge-mock`
- Rust 模块：`rust-module`
- 配置、版本或依赖：`config-version-dependency`

如果多个类型都命中，按最高风险组合门禁，不要只跑最轻的一层。

## 2. 选择必需门禁

使用 [Lime 门禁矩阵](./lime-gate-matrix)。仓库已有统一脚本时，不要发明平级临时门禁。

## 3. 写行为级测试项

好的 `qc_case` 应说明：

- 目标行为
- 精确步骤或命令
- 期望结果
- 所需证据
- 失败分类

不要写“检查 UI”或“确认能用”这类不可判定测试项。

## 4. 决定直接执行还是 qcloop

小而确定的门禁可以直接执行。重复、独立、需要 worker/verifier/repair 记录的测试项使用 qcloop。

## 5. 产出判定

每个 `passed` 判定都需要证据引用。每个 `failed`、`blocked` 或 `exhausted` 判定都需要具体下一步。

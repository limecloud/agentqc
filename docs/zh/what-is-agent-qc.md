---
title: 什么是 Agent QC
description: Lime 证据驱动质检标准入口。
---

# 什么是 Agent QC

Agent QC 是一个面向 Lime 的测试标准，用来把 Agent 的“我检查过了”升级成证据驱动的质量控制。

Lime 不是纯库项目。Lime 是 GUI 桌面产品，包含 Tauri 命令、Bridge 边界、Workspace 状态、浏览器模式 mock、运行时 metadata 和用户可见路径。只说 `lint` 通过或 Agent 自称检查过，不足以证明可以交付。

Agent QC 回答四个问题：

1. 这次 Lime 改动属于哪类风险？
2. 这类风险至少要跑哪些门禁？
3. 哪些行为级测试项能证明产品路径？
4. 哪些证据能支撑 pass/fail 判定？

## 与 qcloop 的关系

qcloop 负责执行批量任务。Agent QC 负责定义测什么、如何拆 item、怎么判定，以及整体结果什么时候足够支撑 Lime 交付。

```text
Agent QC plan -> qcloop job/items -> worker attempts -> verifier rounds -> evidence-backed report
```

qcloop 是执行循环，Agent QC 是测试标准。

## 与 Lime 质量工作流的关系

Agent QC 保留 Lime 现有门禁：

- 普通本地校验：`npm run verify:local`
- 命令、Bridge、mock、manifest 边界：`npm run test:contracts`
- GUI 壳、DevBridge、Workspace 主路径：`npm run verify:gui-smoke`
- 必须观察真实行为时：Playwright 或人工产品验收

Agent QC 不替代这些命令，只记录什么时候必须跑、需要什么证据。

## 非目标

Agent QC v0.1.0 不做通用测试框架、不定义 UI、不定义模型协议，也不替代 qcloop。第一版只服务 Lime。

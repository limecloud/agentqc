---
title: Lime 门禁矩阵
description: Lime 改动类型的最低测试门禁。
---

# Lime 门禁矩阵

本矩阵是 Agent QC 对 Lime 的默认映射。它遵循 Lime 仓库质量工作流，并把 GUI 产品准备态从代码检查里独立出来。

| 改动类型 | 必需门禁 | 说明 |
| --- | --- | --- |
| `frontend` | `lime.verify-local` | 不触碰 GUI 壳或 Bridge 风险的普通 TypeScript / React 改动。 |
| `user-visible-ui` | `lime.verify-local`，UI 回归断言 | 优先使用现有 `*.test.tsx` 或稳定 snapshot 类检查。 |
| `gui-shell-workspace` | `lime.verify-local`，`lime.verify-gui-smoke` | 涉及 GUI 壳、DevBridge、Workspace、主路径时必跑。 |
| `tauri-command-bridge-mock` | `lime.verify-local`，`lime.test-contracts` | 前端调用、Rust 注册、治理目录册、mock 必须同步。 |
| `rust-module` | Rust 定向测试，必要时扩大到更多 Cargo 测试 | 先跑受影响 crate 或模块。 |
| `config-version-dependency` | `lime.verify-local`，版本文件改动时补 `lime.verify-app-version` | schema、消费者、文档、锁文件成组更新。 |
| `documentation-only` | 可用时跑 docs build 或链接检查 | 除非文档就是交付物，否则不能据此声称产品通过。 |
| `large-regression-batch` | 对应门禁 + `qcloop.batch` | 多个独立重复测试项使用 qcloop。 |
| `release-readiness` | `lime.verify-local-full`，`lime.verify-gui-smoke`，聚焦 contracts 与 review | 只扩展到证明发布风险，不无限加重检查。 |

## GUI 规则

GUI 壳或 Workspace 风险不能只看代码检查。可交付判定必须有证据证明应用壳与 Bridge 主路径可用。

## 命令边界规则

命令、Bridge 或 mock 改动必须成组检查：

- 前端 `safeInvoke(...)` 或 `invoke(...)`
- Rust `tauri::generate_handler!`
- 治理命令目录册
- `mockPriorityCommands` 与 `defaultMocks`

## qcloop 规则

qcloop 用来降低漏测，不用来绕过必需门禁。qcloop pass 只是门禁矩阵中的一个证据来源。

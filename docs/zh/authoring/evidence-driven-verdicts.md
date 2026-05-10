---
title: 证据驱动判定
description: Agent QC 如何判定 passed、failed、blocked 与 exhausted。
---

# 证据驱动判定

Agent QC 把 verdict 视为对观察证据的声明。Agent 说“我检查过了”不是判定。

## 必需字段

`qc_verdict` 包含：

- `pass`：为了兼容 qcloop 的 boolean；
- `status`：`passed`、`failed`、`blocked`、`exhausted` 或 `needs-review`；
- `severity`：`none`、`low`、`medium`、`high` 或 `critical`；
- `feedback`：具体解释；
- `evidence_refs`：可检查证据引用；
- `remaining_risk`：当前证据仍未证明什么。

## 通过规则

通过必须满足：

1. 每条 expected behavior 都被证据覆盖；
2. 存在 evidence refs；
3. 没有必需门禁仍处于 running、blocked 或 exhausted；
4. 失败日志不存在，或已被清楚解释。

## 失败规则

失败应定位最小可行动问题，例如：

- 命令非 0 退出；
- GUI smoke 未到达 DevBridge ready；
- verifier 没看到期望行为证据；
- Playwright 观察到错误的用户可见状态。

## Blocked 与 exhausted

环境阻止判断时使用 `blocked`，例如 qcloop 未启动或凭证缺失。

循环已执行但在轮次或 token 限制内未通过时使用 `exhausted`。

## 证据示例

```json
[
  {
    "kind": "command_log",
    "ref": "runs/2026-05-10/verify-local.log",
    "summary": "npm run verify:local exited 0."
  },
  {
    "kind": "qcloop_qc_round",
    "ref": "qcloop://jobs/abc/items/workspace-ready/qc/1",
    "summary": "Verifier passed; evidence included GUI smoke output."
  }
]
```

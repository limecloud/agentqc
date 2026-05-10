---
title: 术语表
description: Agent QC 使用的术语。
---

# 术语表

| 术语 | 含义 |
| --- | --- |
| Gate / 门禁 | 某类改动必须跨过的验证边界。 |
| Evidence / 证据 | 支撑或推翻判定的可检查记录。 |
| Verdict / 判定 | 基于证据的 pass/fail/blocked/exhausted 结论。 |
| qcloop | worker/verifier/repair 批量执行工具。 |
| Attempt | qcloop 中某 item 的 worker 或 repair 执行。 |
| QC round | qcloop 中某 item 的 verifier 执行。 |
| Exhausted | 轮次或预算耗尽仍无法证明通过。 |
| GUI smoke | 证明 Lime GUI 壳、Bridge、Workspace 准备态的最小测试。 |
| Contract test | 捕获前端命令调用、Rust handler、catalog、mock 漂移的测试。 |
| Remaining risk | 当前证据仍未证明的风险。 |

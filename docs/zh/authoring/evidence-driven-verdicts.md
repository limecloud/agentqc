---
title: 证据驱动判定
description: Agent QC 如何判定 passed、failed、blocked、exhausted、waived 和 needs-review。
---

# 证据驱动判定

verdict 是对已观察证据的声明。模型最终 prose 不能单独作为证据。

## 判定状态

| 状态 | 含义 |
| --- | --- |
| `passed` | 证据证明所有必需期望成立。 |
| `failed` | 证据反驳某个期望，或某个门禁以非零状态退出。 |
| `blocked` | 环境、凭证、依赖或 fixture 缺失，导致无法判定。 |
| `exhausted` | 尝试次数或预算耗尽，但仍没有证明。 |
| `waived` | 负责人带理由和到期时间接受已知缺口。 |
| `needs-review` | 已有证据，但仍需要语义、安全或人工评审。 |

## 好证据

好证据必须可检查、范围明确：

- command log 或 CI job URL；
- JUnit/HTML/coverage report；
- protocol transcript 或 mock server request log；
- Playwright trace、screenshot 或 video；
- qcloop attempt 与 qc round ref；
- package manifest、tarball listing、Docker smoke output；
- model output 加 rubric 和 judge verdict；
- 带 reviewer 与 scope 的 human review note。

## 坏证据

坏证据不可验证：

- “看起来没问题”；
- “测试通过了”，但没有命令或 CI 引用；
- 没有路径或 transcript 的隐藏本地状态；
- live provider 声明没有脱敏 request/response 或预算说明。

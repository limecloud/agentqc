---
title: 证据驱动判定
description: Agent QC 如何判定 pass、fail、blocked、exhausted、waived 和 needs-review。
---

# 证据驱动判定

Verdict 是对已观察证据的声明。模型最终文字本身不是证据。

本页用于编写指导；可移植字段见[证据契约](../contracts/evidence-contract)。

## Verdict statuses

| Status | Meaning | Required proof |
| --- | --- | --- |
| `passed` | 证据证明所有 required expectations。 | evidence refs 连接 case 和 gate |
| `failed` | 证据否定 expectation 或 gate 非零退出。 | 最小可行动失败和 evidence |
| `blocked` | 环境、凭证、依赖、fixture、binary 或 access 阻止判断。 | blocker、owner 和 retry condition |
| `exhausted` | attempts 或 budget 已消耗但没有证明。 | attempts、budget、verifier feedback、remaining uncertainty |
| `waived` | 负责人接受已知缺口。 | approver、reason、scope、expiry |
| `needs-review` | 有证据但仍需 semantic、safety、UX 或 policy review。 | reviewer 或 queue 和 evidence refs |
| `skipped` | gate 对当前 scope 明确不适用。 | reason 和 scope |

## Verdict strength ladder

| Strength | Example | When to use |
| --- | --- | --- |
| Weak observation | 只有 screenshot | visual smoke，不是 runtime-backed pass |
| Deterministic proof | unit/contract/fake server report | 无 live risk 的本地正确性 |
| Runtime proof | CLI/session/tool transcript | 涉及 agent loop 和 side effects |
| Surface proof | 带 runtime link 的 trace/screenshot/terminal snapshot | 用户/运维能看到行为 |
| Live proof | redacted provider/channel transcript | real network/model/channel 是声明的一部分 |
| Release proof | clean install/package/Docker/OS matrix | artifact 被对外发布 |
| Semantic proof | rubric、baseline、judge、reviewer | output quality 是声明本身 |

强报告会组合风险需要的层级，但不一定每次都需要所有层级。

## Good evidence

好的证据可检查且有范围：

- command log 或 CI job URL；
- JUnit/JSON/HTML/coverage report；
- protocol transcript 或 mock server request log；
- runtime transcript、event stream 或 session state snapshot；
- Playwright trace、screenshot、video、DOM/a11y snapshot 或 terminal snapshot；
- browser console/network log；
- qcloop attempt 和 QC round refs；
- package manifest、tarball listing、Docker smoke output、OS matrix；
- model output 加 rubric 和 judge verdict；
- 带 reviewer 和 scope 的 human review note。

## Bad evidence

坏证据不可验证或过度宣称：

- "looks good"；
- "the tests passed" 但没有 command、CI ref 或 report path；
- 没有 path 或 transcript 的隐藏本地状态；
- 用没有 runtime backing 的 screenshot 证明 runtime claim；
- live provider claim 没有 redacted request/response 或 budget note；
- TUI snapshot 没有 viewport/key sequence；
- browser screenshot 没有 console/network 或 cleanup note；
- qcloop summary 没有 attempts 和 verifier feedback；
- waiver 没有 owner 或 expiry。

## Status selection guide

| Situation | Status |
| --- | --- |
| Required evidence 存在且 expectations 被证明 | `passed` |
| Command 非零退出且 failure 命中 changed risk | `failed` |
| 缺 credential/binary/fixture 导致测试无法启动 | `blocked` |
| qcloop 多次尝试在预算内仍无法证明 | `exhausted` |
| 产品 owner 接受 Windows smoke 缺失直到某日期/版本 | `waived` |
| Eval output 存在但 rubric 模糊或 safety review 未完成 | `needs-review` |
| Mobile channel 未被当前改动触碰且不在 scope | `skipped` |

## Waiver rules

Waiver 必须包含：

| Field | Meaning |
| --- | --- |
| `approver` | accountable person/team/policy owner |
| `reason` | 为什么当前 scope 接受风险 |
| `scope` | 精确 case、gate、platform、provider 或 release range |
| `expires` | 需要重新检查的日期、版本或事件 |
| `replacement_evidence` | 如存在，列出低强度替代证明 |
| `follow_up` | issue、task 或下一条 QC case |

Waiver 不能把缺失证据变成 pass。它只记录已接受的 residual risk。

## Failure writing

有用的 `failed` verdict 回答：

1. 哪个 expectation 被否定？
2. 最小复现 command、case、selector、event id 或 fixture 是什么？
3. 哪个 evidence 证明失败？
4. 尽管失败，哪些 claims 仍然有效？
5. 下一步应修复或重跑什么？

避免“GUI broken”这类宽泛失败。优先写“desktop-gui case `bridge-health-workspace-ready` failed: bridge health timed out after 120s; screenshot shows fallback mock banner; command contract check passed.”

## Blocked vs exhausted

当缺少先决条件导致 run 无法有意义地启动或判断，用 `blocked`。

当系统已在声明的 attempts/budget 内尝试，但仍无法证明声明，用 `exhausted`。

示例：

| Case | Status |
| --- | --- |
| live channel test 没有 Telegram token | `blocked` |
| qcloop 跑了 5 次，verifier 仍找不到 required evidence | `exhausted` |
| Playwright browser binary 缺失 | `blocked` |
| flaky browser test 按 policy 重试后仍没有 stable trace | `exhausted` |

## Review before pass

以下情况使用 `needs-review`：

- rubric 覆盖不完整的 semantic evals；
- safety 或 policy-sensitive output；
- 来自 screenshots 或 recordings 的 UX 判断；
- generated content quality；
- 可疑 live-provider drift；
- 多个 gates 的 evidence 冲突。

Reviewer 可以把 `needs-review` 改成 `passed`、`failed` 或 `waived`，但必须引用 evidence。

## Report checklist

最终报告前检查：

- 每个 required gate 都有 status；
- 每个 `passed` 和 `failed` status 都引用 evidence；
- 每个 surface claim 都连接 visible state 和 runtime/protocol evidence；
- 每个 live-provider claim 都有 redaction 和 budget notes；
- 每个 waiver 都有 owner 和 expiry；
- 每个 blocked/exhausted item 都有 next action；
- remaining risk 用清楚语言写出。

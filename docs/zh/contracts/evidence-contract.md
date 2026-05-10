---
title: 证据契约
description: evidence refs、verdict、waiver 与 report 的可移植契约。
---

# 证据契约

Verdict 的强度只取决于它引用的证据。本契约定义 Agent QC 报告中 evidence-backed verdict 的最小可移植字段。

## Evidence reference

| Field | Required | Description |
| --- | --- | --- |
| `id` | Yes | 报告内稳定 evidence id。 |
| `kind` | Yes | 例如 `command-log`、`test-report`、`protocol-transcript`、`surface-artifact`、`release-artifact`、`eval-artifact`、`review-note`、`qcloop-run`。 |
| `source` | Yes | 本地路径、artifact URL、CI URL、qcloop id 或 evidence service id。 |
| `scope` | Yes | 覆盖的 case id、gate id、command、surface、profile 或 release target。 |
| `created_at` | Recommended | timestamp 或 run id。 |
| `environment` | Recommended | OS、runtime、browser、terminal size、provider mode、CI job 或 Docker image。 |
| `redaction` | Conditional | 涉及凭证、用户数据、provider requests 或 channel transcripts 时必填。 |
| `summary` | Recommended | 简短可读结果。 |
| `raw_ref` | Optional | 安全 raw payload ref。不要内联含密 payload。 |

## Verdict object

| Field | Required | Description |
| --- | --- | --- |
| `status` | Yes | `passed`、`failed`、`blocked`、`exhausted`、`waived`、`needs-review` 或 `skipped`。 |
| `case_id` | Yes | 被判断的 case。 |
| `gate_family` | Yes | 被判断的 gate family。 |
| `evidence_refs` | 除 `skipped` 外必填 | 支撑声明的 evidence ids。 |
| `expectations_met` | Recommended | 被证据证明的 expectation ids 或文本。 |
| `failure` | `failed` 必填 | 最小可行动失败，而不是泛泛抱怨。 |
| `blocker` | `blocked` 必填 | 缺失环境事实和 owner。 |
| `attempts` | `exhausted` 必填 | attempt refs、budget 和 remaining uncertainty。 |
| `waiver` | `waived` 必填 | approver、reason、scope、expiry。 |
| `review` | `needs-review` 必填 | reviewer、queue 或仍需语义 review 的原因。 |

## 各 gate 的最低证据

| Gate | 最低证据 |
| --- | --- |
| `static` | command/CI log、tool version、failing ids 或 success summary |
| `unit` | test report 或 command log，带 suite 和 failure ids |
| `property-fuzz` | seed/corpus、invariant，如失败则带 minimized case |
| `contract-protocol` | schema diff、generated artifact check、fake server 或 protocol transcript |
| `fake-integration` | fake server log 和 request/response refs |
| `runtime-e2e` | runtime transcript、state snapshot、process cleanup 或 retry proof |
| `ui-interaction` | surface artifact 加 runtime/protocol link |
| `live-provider` | opt-in flag、脱敏 request/response、credential scope、cost/budget note |
| `stress-concurrency` | worker timeline、seed/config、duration、race/retry result |
| `distribution-release` | package manifest、clean install、Docker/OS matrix、version output |
| `semantic-eval` | dataset/rubric、model/judge info、baseline delta、threshold |
| `review` | reviewer identity、scope、evidence refs、decision |

## Surface evidence 附加项

| Surface | 附加证据 |
| --- | --- |
| `cli-stream` | stdout/stderr transcript、exit code、structured event sample |
| `tui` | terminal size、key sequence、terminal snapshot、linked runtime transcript |
| `webui` | Playwright 或 browser trace/screenshot、console output、route/state assertion |
| `desktop-gui` | shell start log、bridge health、workspace readiness、screenshot、OS note |
| `browser-automation` | DOM/a11y snapshot、console/network、screenshot、cleanup/orphan-process proof |
| `channel-ui` | webhook replay、channel transcript、media fixture、identity/auth proof |
| `eval-ui` | report screenshot/export、rubric、judge output、reviewer note |

## Waiver contract

Waiver 不是 pass，而是有时限的风险决策。

| Field | Required | Description |
| --- | --- | --- |
| `approver` | Yes | 接受风险的人、团队或 policy owner。 |
| `reason` | Yes | 为什么这个 gate 对当前 scope 不要求。 |
| `scope` | Yes | case、gate、platform、provider 或 release range。 |
| `expires` | Yes | waiver 失效的日期、版本或条件。 |
| `replacement_evidence` | Recommended | 仍然存在的低强度替代证据。 |
| `follow_up` | Recommended | issue、task 或下一条 QC case。 |

## 反模式

| 反模式 | 正确状态 |
| --- | --- |
| 没有 artifact 的“looks good” | `needs-review` 或 `blocked` |
| 只有截图，没有 command/runtime evidence | 只能算部分 `ui-interaction`，不是 full pass |
| live provider output 没有 redaction/budget note | `needs-review` |
| 只用 unit tests 证明 desktop bridge 行为 | GUI/surface 声明应为 `blocked` |
| qcloop exhausted 却不保留 attempts 直接 failed | `exhausted` |
| waiver 没有 owner 或 expiry | invalid waiver |

## Report closeout checklist

报告可发布的条件：

- 每个 required gate 都有 verdict；
- 每个 `passed` 或 `failed` verdict 都有 evidence refs；
- 每个 `blocked`、`exhausted`、`waived` 或 `needs-review` 说明为何不是 pass；
- live-provider evidence 已脱敏且记录预算；
- surface evidence 连接 visible behavior 与 runtime 或 protocol facts；
- remaining risk 和 next action 明确。

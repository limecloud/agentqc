---
title: 快速开始
description: 为任意 Agent 项目创建 Agent QC 计划。
---

# 快速开始

当 agent、维护者、CI job 或 qcloop run 需要测试 Agent 项目时，使用这个流程。流程是可移植的：Lime 只是其中一个案例。

## 1. 定义 QC 范围

用一句话写清楚要判断什么。

示例：

- "Codex-like runtime CLI 的 v1.4.0 release。"
- "Claude Code-like TUI remote-permission 改动。"
- "OpenClaw-like channel gateway auth/media 改动。"
- "Hermes-like scheduler restart 修复。"
- "Lime-like desktop GUI bridge 改动。"

范围决定报告可以宣称什么。不要让宽泛报告暗示未测试的表面已经通过。

## 2. 分类项目 profile

选择一个或多个 profiles：

- `agent-runtime-cli`
- `agent-sdk-api`
- `agent-tool-mcp-gateway`
- `multi-channel-agent-gateway`
- `agent-ui-tui-desktop`
- `agent-skills-plugins`
- `background-agent-scheduler`
- `agent-distribution-release`
- `agent-evals-quality`

按拥有的风险分类，不按语言分类。Python 项目可以拥有 browser automation；Rust 项目可以拥有 TUI；文档站也可以拥有 distribution/release surface。

## 3. 识别 touched surfaces

命名用户或运维在哪里观察行为：

- `cli-stream`
- `tui`
- `webui`
- `desktop-gui`
- `browser-automation`
- `channel-ui`
- `eval-ui`

只要行为用户可见，就加入 `qc_case.surface`。没有 surface evidence 的 UI pass 不完整。

## 4. 分配 fact owners

为每个 case 判断事实由哪个系统拥有：

| Fact | Owner example | Evidence |
| --- | --- | --- |
| runtime accepted work | agent runtime | stream 或 session transcript |
| tool call succeeded/failed | tool runtime 或 protocol adapter | tool id、progress、result/error |
| approval was resolved | policy/runtime action API | request id 和 response transcript |
| UI rendered a state | UI projection | screenshot、trace、terminal snapshot |
| artifact was created | artifact/release service | manifest、file、version、export ref |
| verdict passed | Agent QC report | linked evidence refs |

这样可以避免 Agent UI 常见错误：把可见文字当成 runtime truth。

## 5. 选择 gate lanes

使用[门禁矩阵](./gate-matrix)。至少分离这些 lanes：

1. deterministic local gates：`static`、`unit`、`contract-protocol`、`fake-integration`；
2. runtime gates：必要时包含 `runtime-e2e`、`stress-concurrency`；
3. surface gates：带命名 surface 的 `ui-interaction`；
4. live gates：`live-provider` 只能显式 opt-in；
5. release gates：有任何对外发布物时包含 `distribution-release`；
6. semantic gates：质量判断相关时包含 `semantic-eval` 和 `review`。

## 6. 编写行为优先的 cases

每个 `qc_case` 应说明：

- 要证明的行为；
- profile 和 surface；
- 精确步骤或命令；
- 期望结果；
- required gates；
- required evidence；
- fail、blocked、exhausted、waived、needs-review 的状态映射。

避免“component exists”这类 case。优先写“用户拒绝工具调用；runtime 记录拒绝；TUI 移除 pending approval；没有副作用”。

## 7. 定义 evidence policy

运行前先决定什么算证明。

| Claim | Evidence |
| --- | --- |
| CLI stream works | command、exit status、stdout/stderr transcript、structured event sample |
| TUI works | viewport、key sequence、terminal snapshot、runtime transcript |
| WebUI works | Playwright/browser trace、screenshot、console/network log、route assertion |
| Desktop GUI works | shell start、bridge health、workspace readiness、screenshot、OS note |
| Browser automation works | DOM/a11y snapshot、screenshot、console/network、cleanup proof |
| Channel works | webhook replay、media fixture、auth proof、redacted channel transcript |
| Scheduler works | deterministic time/env、checkpoint、lease/reclaim、duplicate-work proof |
| Release works | package manifest、clean install、Docker/OS matrix、version output |
| Eval works | rubric、judge output、baseline delta、reviewer note |

详见[证据契约](../contracts/evidence-contract)。

## 8. 用 qcloop 处理可重复独立检查

qcloop 适合大量相似 case：文件、频道、providers、命令、prompts、packages 或 regression examples。

不要用 qcloop 隐藏缺失的项目门禁。qcloop batch 可以产出 verdict，但 bridge health、GUI smoke、package install smoke、live-provider opt-in 仍需要自己的证据。

## 9. 从便宜到高风险运行 gates

实用顺序：

1. `static` 和 schema checks；
2. targeted unit 或 contract tests；
3. fake integration 和 runtime e2e；
4. surface smoke 或 Playwright/TUI evidence；
5. 相关时运行 stress/concurrency；
6. live provider 或 channel tests 只能 opt-in；
7. release/install/Docker checks；
8. semantic eval 和 review。

只有下游证据已经失去意义时才提前停止。否则记录部分证据并准确标记剩余 gates。

## 10. 报告 verdict 和 limits

完整报告包含：

- scope；
- profiles 和 surfaces；
- required gates 和 executed gates；
- evidence refs；
- case 级 verdicts；
- blockers、exhausted attempts、waivers、needs-review items；
- remaining risk；
- next action。

只写“tests passed”或“agent checked it”的报告不完整。

## 最小 plan skeleton

```json
{
  "schema_version": "0.4.0",
  "project": "example-agent",
  "project_profiles": ["agent-runtime-cli", "agent-ui-tui-desktop"],
  "required_gates": ["static", "contract-protocol", "runtime-e2e", "ui-interaction"],
  "cases": [
    {
      "id": "permission-denial-tui",
      "project_profile": "agent-ui-tui-desktop",
      "surface": "tui",
      "target": "remote permission prompt",
      "required_gates": ["contract-protocol", "runtime-e2e", "ui-interaction"],
      "steps": ["start fake runtime", "trigger high-risk tool", "deny approval"],
      "expected": ["runtime records denial", "TUI removes pending prompt", "no side effect occurs"],
      "required_evidence": ["protocol transcript", "terminal snapshot", "runtime transcript"]
    }
  ]
}
```

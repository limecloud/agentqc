---
title: 规范
description: Agent QC v0.1.0 product-focused 草案规范。
---

# 规范

Agent QC v0.1.0 是 product-focused 草案标准，用于定义证据驱动的测试计划、门禁、qcloop 批次、判定和报告。

它标准化的是 Agent 测试产品时应产生的质量控制事实；不拥有产品代码、qcloop 执行、证据存储、UI 投影或人工评审策略。

## 范围

Agent QC 标准化：

1. 产品改动的测试计划格式。
2. 可直接执行或映射到 qcloop 的行为级测试项。
3. 产品改动类型到最低门禁的矩阵。
4. 带证据引用的 pass/fail 判定。
5. 区分 passed、failed、exhausted、skipped 和 blocked 的最终报告。

Agent QC 不标准化模型 prompt、CLI 执行细节、浏览器自动化 API、存储引擎或视觉呈现。

## 核心对象

| Object | 用途 |
| --- | --- |
| `qc_plan` | 一次产品改动、路径或发布风险的测试计划。 |
| `qc_case` | 一个行为级测试项，包含步骤、期望、风险和所需证据。 |
| `qc_gate` | 一个验证边界，例如 `verify:local`、`test:contracts`、`verify:gui-smoke`、Playwright、qcloop 或人工评审。 |
| `qc_run` | 一次执行尝试，包含执行器、命令、环境、结果和输出引用。 |
| `qc_verdict` | 基于证据的 pass/fail/blocked/exhausted 判定。 |
| `qc_evidence` | 指向日志、截图、trace、qcloop attempt、qc round、报告或评审记录的引用。 |
| `qc_report` | 一份测试计划的聚合结果，包含剩余风险和下一步。 |

## 改动类型

标准 `change_type`：

- `frontend`
- `user-visible-ui`
- `gui-shell-workspace`
- `tauri-command-bridge-mock`
- `rust-module`
- `config-version-dependency`
- `documentation-only`
- `large-regression-batch`
- `release-readiness`

可以使用 `custom:<name>` 做本地扩展，但必须映射到明确门禁。

## 门禁 id

标准 `qc_gate.id`：

| Gate | 证据要求 |
| --- | --- |
| `lime.verify-local` | `npm run verify:local` 的命令输出。 |
| `lime.verify-local-full` | `npm run verify:local:full` 的命令输出。 |
| `lime.test-contracts` | `npm run test:contracts` 的命令输出。 |
| `lime.verify-gui-smoke` | 证明 GUI 壳、DevBridge、Workspace 准备态的 smoke 输出。 |
| `lime.verify-app-version` | `npm run verify:app-version` 的版本一致性输出。 |
| `lime.rust-targeted-test` | 受影响 crate 或模块的 Cargo 测试输出。 |
| `lime.playwright-product-flow` | 浏览器交互证据、截图、trace 或 transcript。 |
| `qcloop.batch` | qcloop job id、item、attempt、qc round 和 status 引用。 |
| `review.manual` | 人工评审记录，包含 reviewer、范围、结论和证据引用。 |
| `review.llm-judge` | LLM judge 判定，包含 rubric 和输入输出引用。 |

## 状态值

`qc_case.status`、`qc_gate.status` 和 `qc_report.status` 使用：

- `planned`：尚未执行。
- `running`：正在执行。
- `passed`：证据证明期望行为成立。
- `failed`：证据证明期望行为不成立。
- `blocked`：缺少依赖或环境导致无法判断。
- `exhausted`：重试轮次或 token 预算耗尽仍未通过。
- `skipped`：明确不在范围内，并说明原因。
- `needs-review`：已有证据，但需要人工或更强 judge 复核。

## 证据规则

`passed` 判定必须至少包含一个 `evidence_ref`。对于 GUI、Bridge 或 qcloop 门禁，assistant 自述不是有效证据。

证据引用应足够稳定，方便复核：

```json
{
  "kind": "qcloop_qc_round",
  "ref": "qcloop://jobs/job-123/items/item-9/qc/2",
  "summary": "Verifier passed after repair and linked GUI smoke output."
}
```

如果日志包含敏感内容，可以脱敏，但判定必须说明脱敏内容和原因。

## qcloop 映射

一个 `qc_case` 可以成为一个 qcloop `item_value`。复杂测试项应序列化为 JSON：

```json
{
  "name": "workspace-default-ready",
  "target": "Default workspace",
  "steps": ["Run GUI smoke", "Inspect DevBridge readiness"],
  "expected": ["DevBridge is ready", "Default workspace is available"],
  "required_evidence": ["command_log", "gui_smoke_summary"]
}
```

qcloop `attempt` 映射为 `qc_run`。qcloop `qc_round` 映射为 `qc_verdict`。qcloop `exhausted` 映射为 Agent QC 的 `exhausted`，不是 `failed`，因为它表示循环在限制内无法证明通过。

## 报告规则

只有所有必需门禁均为 `passed`，或带已接受原因的 `skipped`，测试报告才可以声称可交付。可选项失败仍必须列为剩余风险。

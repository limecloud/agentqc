---
title: Agent 标准生态
description: Agent QC 与相邻 Agent 标准的边界。
---

# Agent 标准生态

Agent QC 拥有 Agent 项目的质量控制契约。它通过 refs 连接相邻标准，而不拥有这些标准的事实。

Agent QC 应回答：**证据是否证明了这个 Agent 项目的质量声明？** 它不应该变成 runtime、UI、policy、artifact、tool 或 knowledge 标准本身。

## Boundary map

| Standard | Role | Relationship to Agent QC |
| --- | --- | --- |
| Agent Knowledge | Source-grounded knowledge packs. | 为测试提供可信 requirements、docs、domain facts、source maps 和 grounding expectations。 |
| Agent UI | User-visible interaction surfaces. | 提供 UI/TUI/desktop/WebUI 验收预期和 runtime-backed projection 规则。 |
| Agent Runtime | Execution facts、controls、tasks、tools、streams、recovery。 | 为 runtime gates 提供 run/task/session state。 |
| Agent Evidence | Evidence、verification、review、replay、export。 | 拥有 QC verdicts 引用的 durable evidence records。 |
| Agent Policy | Permissions、approvals、risk、retention、waivers。 | 定义高风险测试动作是否可以运行或 waiver。 |
| Agent Artifact | Durable deliverables 和 handoff packages。 | 存储 reports、screenshots、traces、logs、package manifests 和 generated outputs。 |
| Agent Tool | Tool declarations、calls、progress、results、permissions、audit refs。 | 为 tool、MCP、ACP、connector gates 提供 tool invocation facts。 |
| Agent Context | Context selection、budgets、injection、missing facts、compaction。 | 解释 QC 中 worker/verifier/judge agents 获得了什么 context。 |
| Agent QC | Plans、profiles、gates、evidence、verdicts、waivers、reports。 | 拥有 testing evidence 是否证明 project quality claim 的判断。 |

## Interop principles

1. **QC 引用事实，但不拥有事实。** GUI pass 引用 Agent UI projection 和 runtime events；它不定义 UI protocol。
2. **Evidence refs 必须持久。** QC report 应链接 Agent Evidence 或 artifact refs，而不是粘贴含密日志。
3. **Policy controls 在 QC 外。** QC 可以要求 approval，但 Agent Policy 拥有危险动作是否允许或 waiver。
4. **Knowledge 是输入，不是证明。** Agent Knowledge 的 requirements 指导测试；通过证据仍来自执行、trace 或 review。
5. **Artifacts 是输出，不是 verdicts。** package、screenshot 或 report 只有连接 expectation 后才是证据。
6. **Context 是可审查性的一部分。** context 影响结果时，qcloop/verifier/model-judge 结果需要 context/budget/source refs。

## Example: UI/TUI/Desktop case

```text
Agent Runtime emits run/tool/action facts
  -> Agent UI projects them into composer/status/tool/HITL surfaces
  -> Agent Evidence stores trace/screenshot/transcript refs
  -> Agent QC links refs to gate verdicts
  -> Agent Policy records waiver or approval when needed
```

QC failure 示例：screenshot 显示 "done"，但没有 runtime event 确认 completion。Agent UI projection 对 mock state 可能视觉正确，但 Agent QC 必须把 runtime-backed claim 标为 `blocked` 或 `needs-review`。

## Example: Knowledge-driven eval case

```text
Agent Knowledge supplies source-grounded requirements
  -> Agent Context selects test context and budgets
  -> qcloop or eval runner executes cases
  -> Agent Evidence stores attempts, verifier feedback, judge output
  -> Agent QC emits verdicts and remaining risk
```

QC failure 示例：模型答案引用了 source，但 source map 缺失。语义输出可能看起来合理，但 grounded-quality claim 不完整。

## Agent QC 刻意不标准化什么

- visual theme、component library、typography 或 animation；
- 单一 test framework 或 CI provider；
- 单一 runtime event protocol；
- model provider choice；
- evidence storage backend；
- product-specific release policy；
- 精确 qcloop implementation。

Agent QC 标准化的是 evidence shape 和 verdict semantics，让这些系统可以互操作。

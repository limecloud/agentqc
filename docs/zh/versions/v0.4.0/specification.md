---
title: v0.4.0 规范
description: Agent QC v0.4.0 通用草案规范。
---

# v0.4.0 规范

Agent QC v0.4.0 是面向 Agent 项目的通用草案标准，用于证据驱动的质量控制。

Agent 项目可以是 runtime CLI、SDK、tool server、MCP/ACP gateway、multi-channel bot、GUI/TUI/desktop client、skill/plugin ecosystem、background scheduler、distribution package 或 evaluation suite。Agent QC 不假设一种产品形态；它先分类项目 profile，再选择匹配风险的 gate。

## 范围

Agent QC 标准化以下内容：

1. Agent 系统的 project profile。
2. `qc_plan`、`qc_case`、`qc_gate`、`qc_run`、`qc_evidence`、`qc_verdict`、`qc_report` 对象。
3. 从静态检查到 live provider 和 release smoke 的 gate taxonomy。
4. 有证据支撑的 pass/fail 语义。
5. 面向重复独立 case 的 qcloop-compatible batch QC。
6. 代表性 runtime、TUI、gateway、scheduler、UI、skills、release 和 eval 项目的案例映射。

Agent QC 不标准化单一编程语言、CI vendor、测试框架、浏览器驱动、模型协议、存储后端或 UI 皮肤。


## 文档集合

最新标准按用途拆分：

| 页面 | 用途 |
| --- | --- |
| [快速开始](../../authoring/quickstart) | 创建 QC plan 的最快路径 |
| [最佳实践](../../authoring/best-practices) | 编写规则和反模式 |
| [项目分类](../../authoring/project-classification) | profile taxonomy 和 mixed-profile rules |
| [门禁矩阵](../../authoring/gate-matrix) | profile/surface/risk 到 gate 的映射 |
| [交互表面测试](../../authoring/interaction-surface-testing) | CLI/TUI/WebUI/desktop/browser/channel/eval UI 证据 |
| [证据契约](../../contracts/evidence-contract) | 可移植 evidence、verdict、waiver 字段 |
| [性能与可靠性指标](../../contracts/performance-and-reliability-metrics) | timing、flake、cleanup、scheduler、release metrics |
| [流程与分类](../../reference/flow-and-taxonomy) | 完整生命周期和 taxonomy reference |
| [明星项目测试体系](../../reference/star-project-testing-systems) | 代表性 Agent 项目测试体系案例 |

## Project profiles

`qc_plan.project_profiles` 数组声明项目适用的形态。

| Profile | 典型风险 | 示例门禁 |
| --- | --- | --- |
| `agent-runtime-cli` | tool execution、sandbox、permission、stream、resume、subprocess cleanup | unit、protocol、fake model server、CLI e2e、sandbox tests |
| `agent-sdk-api` | public API compatibility、generated contract、fake server behavior、async cancellation | signature tests、generated contract diff、fake server integration |
| `agent-tool-mcp-gateway` | tool declaration drift、stdio/http transport、recovery、resource access、audit refs | protocol conformance、mock server、transport recovery、contract tests |
| `multi-channel-agent-gateway` | channel adapter、auth、secret、webhook verification、provider drift、media routing | channel contract tests、secret isolation、live opt-in、docker smoke |
| `agent-ui-tui-desktop` | rendering、terminal/browser state、user controls、screenshot、accessibility、bridge readiness | UI unit、snapshot、Playwright、terminal fixture、GUI smoke |
| `agent-skills-plugins` | manifest shape、loader、package boundary、trust、marketplace/registry drift | schema、discovery、package export、fixture install、security scan |
| `background-agent-scheduler` | cron、queue、lease、retry、concurrency、idempotency、stuck-loop recovery | deterministic scheduler tests、race tests、stress tests、checkpoint/reclaim |
| `agent-distribution-release` | install、package contents、Docker、cross-platform、lockfile、supply-chain | install smoke、package dry run、Docker smoke、OS matrix、lock checks |
| `agent-evals-quality` | model behavior regression、prompt drift、rubric quality、answer grounding | eval suite、baseline comparison、LLM/human judge、qcloop batch |

一个项目可以组合多个 profile。例如 OpenClaw 同时包含 channel gateway、tool gateway、distribution、live provider 和 plugin profile。

## Interaction surfaces

project profile 说明项目拥有什么风险；interaction surface 说明用户或操作者在哪里观察 Agent。JSON schema 中 `qc_case.surface` 是可选字段，但用户可见 gate 应该填写。

| Surface | 适用对象 | 额外证据要求 |
| --- | --- | --- |
| `cli-stream` | command output、JSONL/NDJSON、stdout/stderr | exit status、stdout/stderr transcript、structured event sample |
| `tui` | terminal UI、Ink、ratatui、curses | terminal snapshot、viewport size、key sequence、runtime transcript |
| `webui` | browser dashboard、extension UI、admin/QA console | screenshot/trace、console log、route state、browser-only assertion |
| `desktop-gui` | Tauri、Electron、native shell | shell start evidence、bridge health、workspace/session readiness、OS note |
| `browser-automation` | CDP、Playwright、browser-use、remote browser provider | screenshot、DOM/a11y snapshot、console/network log、cleanup evidence |
| `channel-ui` | mobile、QR、chat apps、webhook surfaces | channel transcript、media fixture、auth/webhook replay、device/emulator log |
| `eval-ui` | QA dashboard 与 semantic evaluation report | rubric、judge output、baseline delta、reviewer note |

`ui-interaction` gate 应该明确这些 surface 之一。缺少 surface-specific evidence 的通过结论不完整。Surface proof 应连接 entrypoint、user action、visible frame、runtime backing 与 cleanup evidence。

## 核心对象

| Object | 用途 |
| --- | --- |
| `qc_plan` | 面向一次 change、release、investigation 或 regression sweep 的测试计划。 |
| `qc_case` | 行为级条目，包含 steps、expected result、required gates 和 evidence。 |
| `qc_gate` | 验证边界，例如 static、unit、contract、integration、e2e、live、stress、release 或 review。 |
| `qc_run` | 一次执行尝试，包含 command、executor、environment、output refs、duration 和 result。 |
| `qc_evidence` | 指向 logs、reports、traces、screenshots、fixtures、qcloop attempts、CI runs 或 review notes 的引用。 |
| `qc_verdict` | 基于证据的判断：passed、failed、blocked、exhausted、waived 或 needs-review。 |
| `qc_report` | 汇总结果、剩余风险、waiver 和下一步动作。 |

## Gate families

| Family | 目的 | 证据示例 |
| --- | --- | --- |
| `static` | format、lint、type、dependency 和 policy hygiene | command logs、SARIF、lockfile check output |
| `unit` | deterministic local behavior | test report、coverage、fixture output |
| `property-fuzz` | invariant 与 generated input | seed、corpus、failing case artifact |
| `contract-protocol` | schema、API、generated client、command/tool surface | contract report、schema diff、mock transcript |
| `fake-integration` | 面向 fake server 或 local adapter 的集成 | fake server log、request/response transcript |
| `runtime-e2e` | 不依赖外部 provider 的真实 CLI/runtime/task flow | CLI transcript、process cleanup evidence、state snapshot |
| `ui-interaction` | GUI/TUI/browser/terminal behavior | screenshot、trace、video、accessibility report |
| `live-provider` | opt-in real provider 或 network path | redacted transcript、credential-scope note、cost/budget |
| `stress-concurrency` | race、lease、retry、long-running loop | stress report、worker timeline、seed、benchmark |
| `distribution-release` | install、package、Docker、cross-platform release readiness | tarball manifest、Docker smoke、OS matrix、release check |
| `semantic-eval` | model output quality、grounding、policy、user intent | eval result、rubric、judge output、baseline delta |
| `review` | human 或 LLM review | reviewer decision、rubric、evidence refs |

## 状态值

`qc_case.status`、`qc_gate.status` 和 `qc_report.status` 使用：

- `planned`
- `running`
- `passed`
- `failed`
- `blocked`
- `exhausted`
- `waived`
- `skipped`
- `needs-review`

如果项目存在 waiver 流程，waived gate 必须包含 `waiver.reason`、`waiver.approver` 和 `waiver.expires`。

## 证据规则

`passed` verdict 必须包含证据。`failed` verdict 必须包含最小可行动失败。`blocked` verdict 必须指出缺失的环境事实。`exhausted` verdict 必须保留 attempts 和 verifier feedback。

self-report 不是证据。“the agent checked it” 只有在链接到 command output、test report、transcript、trace、screenshot 或 review record 时才有效。

## qcloop 映射

`qc_case` 可以成为 qcloop `item_value`。qcloop `attempt` 映射到 `qc_run`；qcloop `qc_round` 映射到 `qc_verdict`；qcloop `exhausted` 映射到 Agent QC `exhausted`，不是普通失败。

当 case 可重复、独立且适合 verifier 判定时使用 qcloop。不要用 qcloop 替代必需的项目门禁，也不要用它隐藏 live-provider 风险。


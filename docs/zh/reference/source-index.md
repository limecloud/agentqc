---
title: 来源索引
description: Agent QC v0.5.0 使用的可追踪来源。
---

# 来源索引

Agent QC v0.5.0 来自本地项目调研和公开文档。本地仓库是案例，不是规范依赖。

最后审阅：2026-05-17。

## Citation format

在设计说明或 changelog 中使用 source ids：

```text
[SRC-AGENTUI-BEST-PRACTICES] -> surface pass must link visible projection to runtime facts.
```

## Local standards repositories

| Source id | Source | Evidence used | Agent QC requirements informed |
| --- | --- | --- | --- |
| `SRC-AGENTUI-BEST-PRACTICES` | `/Users/coso/Documents/dev/ai/limecloud/agentui/docs/en/authoring/best-practices.md` | runtime-owned facts、event classes、stable ids、fallback states、controlled writes、old-session design、latency metrics | Agent QC 要求 surface evidence 把 visible frames 连接到 runtime/protocol facts，避免 UI 自己拥有 verdict。 |
| `SRC-AGENTUI-ACCEPTANCE` | `/Users/coso/Documents/dev/ai/limecloud/agentui/docs/en/authoring/acceptance-scenarios.md` | send/status、tool、HITL、queue/steer、artifact、evidence、old-session、team/parallel/remote/background scenarios | Agent QC acceptance scenarios 覆盖 runtime、TUI、WebUI、team、remote 和 eval flows。 |
| `SRC-AGENTUI-FLOW` | `/Users/coso/Documents/dev/ai/limecloud/agentui/docs/en/reference/flow-and-taxonomy.md` | lifecycle、event envelope、fact owners、scopes、phases、surfaces、controls、team taxonomy | Agent QC flow/taxonomy 采用显式维度和 fact-owner 分离。 |
| `SRC-AGENTUI-CONTRACTS` | `/Users/coso/Documents/dev/ai/limecloud/agentui/docs/en/contracts/*.md` | backend coordination、runtime event projection、performance metrics | Agent QC 增加 UI/TUI/desktop/browser gates 的 evidence、performance、reliability contracts。 |
| `SRC-AGENTKNOWLEDGE-SPEC` | `/Users/coso/Documents/dev/ai/limecloud/agentknowledge/docs/en/specification.md` | directory-as-standard、progressive disclosure、source maps、compile/eval evidence、knowledge-as-data boundary | Agent QC 把 Knowledge 作为 requirements/context input，而不是 proof，并保留 source traceability。 |

## Local project case studies

| Source id | Source | Use |
| --- | --- | --- |
| `SRC-CODEX-LOCAL` | `/Users/coso/Documents/dev/rust/codex` | Runtime CLI、Rust、Bazel、cargo nextest、SDK、MCP、app-server protocol、sandbox、process cleanup、TUI snapshots、schema fixtures、release patterns。 |
| `SRC-CLAUDECODE-LOCAL` | `/Users/coso/Documents/dev/js/claudecode` | Ink TUI、remote bridge、WebSocket control、permission flow、SDK stream adapter、commands、task/team surfaces 的本地部分源码快照；不足以推断 CI/release。 |
| `SRC-OPENCLAW-LOCAL` | `/Users/coso/Documents/dev/js/openclaw` | Multi-channel gateway、Vitest lane routing、UI browser-mode tests、QA Lab、live provider opt-in、Docker/install smoke、plugin/secret/channel contracts、mobile/platform scripts。 |
| `SRC-HERMES-LOCAL` | `/Users/coso/Documents/dev/python/hermes-agent` | Python pytest、markers、xdist、integration/e2e separation、credential blanking、cron/scheduler、browser safety、gateway/channel tests、TUI Vitest、Docker/uv/OSV。 |

## External public sources

| Source id | Source | Evidence used | Agent QC requirements informed |
| --- | --- | --- | --- |
| `SRC-AGENTSKILLS-SPEC` | `https://agentskills.io/specification` | Markdown/frontmatter style、directory-as-package、progressive disclosure、fields/constraints/examples。 | Agent QC docs 使用简短入口页、表格、示例和深入 reference pages。 |
| `SRC-AGENTSKILLS-EVAL` | `https://agentskills.io/skill-creation/evaluating-skills` | Eval-driven iteration、clean-context runs、assertion grading、execution transcripts、human feedback。 | qcloop 和 eval gates 需要 attempts、verifier feedback、rubrics 和 evidence refs。 |
| `SRC-HARBOR-DOCS` | `https://www.harborframework.com/docs`, `/docs/tasks`, `/docs/run-jobs/run-evals`, `/docs/rewardkit` | dataset/task/trial lifecycle、`/logs/agent/trajectory.json`、reward files、reward-details、artifacts、separate verifier environments。 | Benchmark 与 hill-climbing gates 要求 frozen tasks、trial trajectories、reward details、artifact refs 和 verifier isolation。 |
| `SRC-CLINE-HILL-CLIMBING` | `https://cline.bot/blog/a-practical-guide-to-hill-climbing` | baseline runs、failure analysis、one-variable A/B changes、repeated runs/pass@k for noise、Harbor execution。 | Agent QC 增加 `benchmark-eval` 与 hill-climbing authoring loop，用于改进 Lime，同时不把 benchmark 分数混同为 release gate。 |
| `SRC-YAGE-RUNTIME-BATTLEFIELD` | `https://yage.ai/share/agent-runtime-battlefield-20260516.html` | 同一模型在不同 runtime/harness 下 benchmark outcome 可显著不同；builder 应在自己的 repo 上 A/B。 | Agent QC 把 runtime/prompt/tool/context profiles 当作 benchmark variables，并要求 Lime 使用 project-local tasks 做改进。 |
| `SRC-PLAYWRIGHT-CONFIG` | `https://playwright.dev/docs/test-configuration` 与 Context7 `/microsoft/playwright.dev` | projects、webServer、retries、reporters、trace、screenshot、video、test isolation。 | WebUI/browser/desktop gates 需要 trace/screenshot/video policy、browser project/device、console/network 和相关 server startup evidence。 |
| `SRC-VITEST-DOCS` | `https://vitest.dev/guide/cli.html` 与 Context7 `/vitest-dev/vitest` | CLI run/watch、projects、reporter JSON/JUnit、coverage、browser mode、snapshots。 | JS 项目把 Vitest suites 映射到 deterministic、browser、contract、report evidence lanes。 |
| `SRC-PYTEST-MARKERS` | `https://docs.pytest.org/en/stable/example/markers.html` 与 Context7 `/pytest-dev/pytest` | markers、`-m` selection、skip/xfail、parametrization、test routing。 | Python 项目用显式 selection 和 evidence 分离 deterministic、integration、e2e、live、slow suites。 |
| `SRC-MCP-TOOLS` | `https://modelcontextprotocol.io/specification/2025-11-25/server/tools` | tool declaration/protocol boundary。 | Tool/MCP gateway gates 要求 declaration 和 invocation evidence，而不只看 final text。 |
| `SRC-CODEX-ACTIONS` | `https://github.com/openai/codex/actions` | public workflow signal。 | 只作为外部上下文；测试体系细节以本地仓库调研为准。 |
| `SRC-HERMES-GITHUB` | `https://github.com/NousResearch/hermes-agent` | public project context。 | 只用于公共项目身份；测试细节来自本地仓库调研。 |

## Requirement traceability

| Requirement area | Primary sources |
| --- | --- |
| Surface evidence 必须连接 visible frame 与 runtime facts | `SRC-AGENTUI-BEST-PRACTICES`, `SRC-AGENTUI-FLOW`, `SRC-CODEX-LOCAL`, `SRC-OPENCLAW-LOCAL`, `SRC-HERMES-LOCAL` |
| 扩展 acceptance scenarios | `SRC-AGENTUI-ACCEPTANCE`, `SRC-CODEX-LOCAL`, `SRC-OPENCLAW-LOCAL`, `SRC-HERMES-LOCAL` |
| TUI evidence | `SRC-CODEX-LOCAL`, `SRC-CLAUDECODE-LOCAL`, `SRC-HERMES-LOCAL` |
| WebUI/browser evidence | `SRC-HARBOR-DOCS` | `https://www.harborframework.com/docs`, `/docs/tasks`, `/docs/run-jobs/run-evals`, `/docs/rewardkit` | dataset/task/trial lifecycle、`/logs/agent/trajectory.json`、reward files、reward-details、artifacts、separate verifier environments。 | Benchmark 与 hill-climbing gates 要求 frozen tasks、trial trajectories、reward details、artifact refs 和 verifier isolation。 |
| `SRC-CLINE-HILL-CLIMBING` | `https://cline.bot/blog/a-practical-guide-to-hill-climbing` | baseline runs、failure analysis、one-variable A/B changes、repeated runs/pass@k for noise、Harbor execution。 | Agent QC 增加 `benchmark-eval` 与 hill-climbing authoring loop，用于改进 Lime，同时不把 benchmark 分数混同为 release gate。 |
| `SRC-YAGE-RUNTIME-BATTLEFIELD` | `https://yage.ai/share/agent-runtime-battlefield-20260516.html` | 同一模型在不同 runtime/harness 下 benchmark outcome 可显著不同；builder 应在自己的 repo 上 A/B。 | Agent QC 把 runtime/prompt/tool/context profiles 当作 benchmark variables，并要求 Lime 使用 project-local tasks 做改进。 |
| `SRC-PLAYWRIGHT-CONFIG`, `SRC-VITEST-DOCS`, `SRC-OPENCLAW-LOCAL`, `SRC-HERMES-LOCAL` |
| Python suite routing | `SRC-PYTEST-MARKERS`, `SRC-HERMES-LOCAL` |
| Live provider separation | `SRC-OPENCLAW-LOCAL`, `SRC-HERMES-LOCAL` |
| Scheduler/background gates | `SRC-HERMES-LOCAL`, `SRC-AGENTUI-ACCEPTANCE` |
| Release/distribution gates | `SRC-CODEX-LOCAL`, `SRC-OPENCLAW-LOCAL`, `SRC-HERMES-LOCAL` |
| Progressive documentation style | `SRC-AGENTSKILLS-SPEC`, `SRC-AGENTKNOWLEDGE-SPEC`, `SRC-AGENTUI-BEST-PRACTICES` |
| qcloop/eval evidence loop | `SRC-AGENTSKILLS-EVAL`, `SRC-OPENCLAW-LOCAL` |
| Benchmark/hill-climbing loop | `SRC-HARBOR-DOCS`, `SRC-CLINE-HILL-CLIMBING`, `SRC-YAGE-RUNTIME-BATTLEFIELD`, `SRC-PLAYWRIGHT-CONFIG` |

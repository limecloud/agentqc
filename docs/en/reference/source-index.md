---
title: Source index
description: Traceable sources used by Agent QC v0.4.0.
---

# Source index

Agent QC v0.4.0 is derived from local project inspection plus public documentation. Local repositories are case studies, not normative dependencies.

Last reviewed: 2026-05-10.

## Citation format

Use source ids in design notes or changelogs:

```text
[SRC-AGENTUI-BEST-PRACTICES] -> surface pass must link visible projection to runtime facts.
```

## Local standards repositories

| Source id | Source | Evidence used | Agent QC requirements informed |
| --- | --- | --- | --- |
| `SRC-AGENTUI-BEST-PRACTICES` | `/Users/coso/Documents/dev/ai/limecloud/agentui/docs/en/authoring/best-practices.md` | runtime-owned facts, event classes, stable ids, fallback states, controlled writes, old-session design, latency metrics | Agent QC requires surface evidence to link visible frames to runtime/protocol facts and avoid UI-owned verdicts. |
| `SRC-AGENTUI-ACCEPTANCE` | `/Users/coso/Documents/dev/ai/limecloud/agentui/docs/en/authoring/acceptance-scenarios.md` | send/status, tool, HITL, queue/steer, artifact, evidence, old-session, team/parallel/remote/background scenarios | Agent QC acceptance scenarios cover runtime, TUI, WebUI, team, remote, and eval flows. |
| `SRC-AGENTUI-FLOW` | `/Users/coso/Documents/dev/ai/limecloud/agentui/docs/en/reference/flow-and-taxonomy.md` | lifecycle, event envelope, fact owners, scopes, phases, surfaces, controls, team taxonomy | Agent QC flow/taxonomy mirrors explicit dimensions and fact-owner separation. |
| `SRC-AGENTUI-CONTRACTS` | `/Users/coso/Documents/dev/ai/limecloud/agentui/docs/en/contracts/*.md` | backend coordination, runtime event projection, performance metrics | Agent QC adds evidence, performance, and reliability contracts for UI/TUI/desktop/browser gates. |
| `SRC-AGENTKNOWLEDGE-SPEC` | `/Users/coso/Documents/dev/ai/limecloud/agentknowledge/docs/en/specification.md` | directory-as-standard, progressive disclosure, source maps, compile/eval evidence, knowledge-as-data boundary | Agent QC keeps Knowledge as requirements/context input, not proof, and preserves source traceability. |

## Local project case studies

| Source id | Source | Use |
| --- | --- | --- |
| `SRC-CODEX-LOCAL` | `/Users/coso/Documents/dev/rust/codex` | Runtime CLI, Rust, Bazel, cargo nextest, SDK, MCP, app-server protocol, sandbox, process cleanup, TUI snapshots, schema fixtures, release patterns. |
| `SRC-CLAUDECODE-LOCAL` | `/Users/coso/Documents/dev/js/claudecode` | Partial local source snapshot for Ink TUI, remote bridge, WebSocket control, permission flow, SDK stream adapter, commands, task/team surfaces; not enough metadata for CI/release claims. |
| `SRC-OPENCLAW-LOCAL` | `/Users/coso/Documents/dev/js/openclaw` | Multi-channel gateway, Vitest lane routing, UI browser-mode tests, QA Lab, live provider opt-in, Docker/install smoke, plugin/secret/channel contracts, mobile/platform scripts. |
| `SRC-HERMES-LOCAL` | `/Users/coso/Documents/dev/python/hermes-agent` | Python pytest, markers, xdist, integration/e2e separation, credential blanking, cron/scheduler, browser safety, gateway/channel tests, TUI Vitest, Docker/uv/OSV. |

## External public sources

| Source id | Source | Evidence used | Agent QC requirements informed |
| --- | --- | --- | --- |
| `SRC-AGENTSKILLS-SPEC` | `https://agentskills.io/specification` | Markdown/frontmatter style, directory-as-package, progressive disclosure, fields/constraints/examples. | Agent QC docs use concise entry pages, tables, examples, and deeper reference pages. |
| `SRC-AGENTSKILLS-EVAL` | `https://agentskills.io/skill-creation/evaluating-skills` | Eval-driven iteration, clean-context runs, assertion grading, execution transcripts, human feedback. | qcloop and eval gates require attempts, verifier feedback, rubrics, and evidence refs. |
| `SRC-PLAYWRIGHT-CONFIG` | `https://playwright.dev/docs/test-configuration` and Context7 `/microsoft/playwright.dev` | projects, webServer, retries, reporters, trace, screenshot, video, test isolation. | WebUI/browser/desktop gates require trace/screenshot/video policy, browser project/device, console/network, and server startup evidence when relevant. |
| `SRC-VITEST-DOCS` | `https://vitest.dev/guide/cli.html` and Context7 `/vitest-dev/vitest` | CLI run/watch, projects, reporter JSON/JUnit, coverage, browser mode, snapshots. | JS projects map Vitest suites to deterministic, browser, contract, and report evidence lanes. |
| `SRC-PYTEST-MARKERS` | `https://docs.pytest.org/en/stable/example/markers.html` and Context7 `/pytest-dev/pytest` | markers, `-m` selection, skip/xfail, parametrization, test routing. | Python projects separate deterministic, integration, e2e, live, and slow suites with explicit selection and evidence. |
| `SRC-MCP-TOOLS` | `https://modelcontextprotocol.io/specification/2025-11-25/server/tools` | tool declaration/protocol boundary. | Tool/MCP gateway gates require declaration and invocation evidence, not only final text. |
| `SRC-CODEX-ACTIONS` | `https://github.com/openai/codex/actions` | public workflow signal. | Used only as external context; local repo inspection remains the case-study detail. |
| `SRC-HERMES-GITHUB` | `https://github.com/NousResearch/hermes-agent` | public project context. | Used only for public project identity; local repo inspection supplies testing details. |

## Requirement traceability

| Requirement area | Primary sources |
| --- | --- |
| Surface evidence must link visible frame to runtime facts | `SRC-AGENTUI-BEST-PRACTICES`, `SRC-AGENTUI-FLOW`, `SRC-CODEX-LOCAL`, `SRC-OPENCLAW-LOCAL`, `SRC-HERMES-LOCAL` |
| Expanded acceptance scenarios | `SRC-AGENTUI-ACCEPTANCE`, `SRC-CODEX-LOCAL`, `SRC-OPENCLAW-LOCAL`, `SRC-HERMES-LOCAL` |
| TUI evidence | `SRC-CODEX-LOCAL`, `SRC-CLAUDECODE-LOCAL`, `SRC-HERMES-LOCAL` |
| WebUI/browser evidence | `SRC-PLAYWRIGHT-CONFIG`, `SRC-VITEST-DOCS`, `SRC-OPENCLAW-LOCAL`, `SRC-HERMES-LOCAL` |
| Python suite routing | `SRC-PYTEST-MARKERS`, `SRC-HERMES-LOCAL` |
| Live provider separation | `SRC-OPENCLAW-LOCAL`, `SRC-HERMES-LOCAL` |
| Scheduler/background gates | `SRC-HERMES-LOCAL`, `SRC-AGENTUI-ACCEPTANCE` |
| Release/distribution gates | `SRC-CODEX-LOCAL`, `SRC-OPENCLAW-LOCAL`, `SRC-HERMES-LOCAL` |
| Progressive documentation style | `SRC-AGENTSKILLS-SPEC`, `SRC-AGENTKNOWLEDGE-SPEC`, `SRC-AGENTUI-BEST-PRACTICES` |
| qcloop/eval evidence loop | `SRC-AGENTSKILLS-EVAL`, `SRC-OPENCLAW-LOCAL` |

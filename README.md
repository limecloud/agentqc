# Agent QC

Agent QC is a portable draft standard for evidence-driven testing of Agent projects: runtimes, CLIs, SDKs, tool and MCP gateways, multi-channel agents, GUI/TUI/desktop/WebUI clients, browser automation, skills/plugins, background schedulers, eval suites, and distribution packages.

Lime is now only one profile and example. The standard is meant to apply to any Agent project where "the agent says it works" is not enough. A passing result must be backed by inspectable evidence: command logs, test reports, traces, screenshots, model/tool transcripts, qcloop verifier rounds, CI URLs, or human review records.

## Core boundary

| Adjacent system | It owns | Agent QC owns |
| --- | --- | --- |
| Test frameworks | Running tests, fixtures, reporters, coverage, traces. | Which evidence each project profile must produce. |
| Agent runtime | Sessions, turns, tools, permissions, tasks, background work. | Runtime-specific QC gates and behavior acceptance. |
| qcloop | Batch execution, worker/verifier/repair loop, attempts, qc rounds. | How repeated QC cases are shaped and judged. |
| CI/CD | Job orchestration, matrices, artifacts, releases, Pages. | Gate intent, result semantics, and report aggregation. |
| Evidence systems | Durable traces, provenance, review, replay, export. | Evidence refs required by QC verdicts. |
| Humans / LLM judges | Review of semantics, UX, safety, and output quality. | Rubric shape and verdict contract. |

## What v0.4.0 defines

- A project classification model for Agent products.
- A cross-project gate matrix from static checks to live provider tests and release smoke.
- Interaction surface rules for CLI streams, TUI, WebUI, desktop GUI, browser automation, channel UI, and eval UI.
- Best practices adapted from Agent UI runtime-backed projection and Agent Skills progressive disclosure.
- Portable evidence and performance/reliability contracts.
- Core objects: `qc_plan`, `qc_case`, `qc_gate`, `qc_run`, `qc_verdict`, `qc_evidence`, and `qc_report`.
- Evidence-driven verdict rules for pass, fail, blocked, exhausted, waived, and needs-review.
- qcloop integration for repeated independent QC cases.
- Deep case studies from Codex, Claude Code local snapshot, OpenClaw, Hermes Agent, and Lime.
- Public JSON schemas and examples.

## Project profiles

Agent QC starts by classifying the project instead of assuming one stack:

- `agent-runtime-cli`: CLI/runtime agents, tool execution, sandboxing, protocol state.
- `agent-sdk-api`: client SDKs, public APIs, generated contracts, fake servers.
- `agent-tool-mcp-gateway`: tool servers, MCP/ACP gateways, connector contracts.
- `multi-channel-agent-gateway`: Telegram/Discord/Slack/Matrix/webhook gateways, auth and secrets.
- `agent-ui-tui-desktop`: GUI, TUI, desktop shell, browser automation, screenshots.
- `agent-skills-plugins`: skills, plugins, manifests, discovery, package boundaries.
- `background-agent-scheduler`: cron, queues, workers, retries, concurrency, recovery.
- `agent-distribution-release`: install, package, Docker, release, supply-chain, cross-platform.
- `agent-evals-quality`: model behavior, task quality, rubrics, regressions, judges.

A real project usually combines several profiles.

## Documentation

- [Specification](docs/en/specification.md)
- [Quickstart](docs/en/authoring/quickstart.md)
- [Best practices](docs/en/authoring/best-practices.md)
- [Project classification](docs/en/authoring/project-classification.md)
- [Gate matrix](docs/en/authoring/gate-matrix.md)
- [Interaction surface testing](docs/en/authoring/interaction-surface-testing.md)
- [qcloop integration](docs/en/authoring/qcloop-integration.md)
- [Evidence-driven verdicts](docs/en/authoring/evidence-driven-verdicts.md)
- [Acceptance scenarios](docs/en/authoring/acceptance-scenarios.md)
- [Evidence contract](docs/en/contracts/evidence-contract.md)
- [Performance and reliability metrics](docs/en/contracts/performance-and-reliability-metrics.md)
- [Flow and taxonomy](docs/en/reference/flow-and-taxonomy.md)
- [Case-study patterns](docs/en/reference/agent-project-patterns.md)
- [Star project testing systems](docs/en/reference/star-project-testing-systems.md)
- [中文规范](docs/zh/specification.md)

## LLM entrypoints

- [`llms.txt`](llms.txt): concise navigation index for AI clients.
- [`llms-full.txt`](llms-full.txt): concatenated current English documentation for model context.
- [`llm.txt`](llm.txt) and [`llm-full.txt`](llm-full.txt): compatibility aliases.

## Local development

```bash
npm install
npm run dev
```

## Build and validation

```bash
npm run check:schemas
npm run build
```

The static site is generated at `docs/.vitepress/dist`.

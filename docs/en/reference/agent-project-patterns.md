---
title: Agent project patterns
description: Case-study testing patterns from Codex, OpenClaw, Claude Code snapshot, Hermes Agent, and Lime.
---

# Agent project patterns

These patterns come from local repository inspection and public docs. They are examples, not normative requirements.

For the expanded system-by-system walkthrough, see [Star project testing systems](./star-project-testing-systems).

## Codex-style runtime CLI

Local source: `/Users/coso/Documents/dev/rust/codex`.

Observed testing shape:

- Rust workspace uses `cargo nextest run --no-fail-fast` for routine local runs.
- CI includes `cargo fmt`, `cargo clippy`, `cargo test`, `cargo nextest`, `cargo-deny`, `cargo shear`, Bazel test matrices, and SDK jobs.
- Tests cover sandboxing, apply-patch behavior, MCP server/client behavior, protocol events, CLI execution, app server, streamable HTTP recovery, and SDK public APIs.
- Fixtures include fake model servers, SSE fixtures, test stdio/http servers, expected patch outputs, terminal snapshots, app-server protocol fixtures, and SDK stream tests.

Surface coverage: `cli-stream`, `tui`, protocol/runtime transcripts, and release artifacts.

Agent QC profile mapping: `agent-runtime-cli`, `agent-tool-mcp-gateway`, `agent-sdk-api`, `agent-ui-tui-desktop`, `agent-distribution-release`.

## OpenClaw-style multi-channel gateway

Local source: `/Users/coso/Documents/dev/js/openclaw` and public OpenClaw docs.

Observed testing shape:

- Many Vitest lanes: unit, gateway, channels, contracts, e2e, live, Docker, install smoke, performance, startup, platform-specific lanes.
- CI preflight computes changed scopes and routes jobs instead of running one fixed command.
- Tests emphasize channel contracts, secrets, provider surfaces, media handling, plugin boundaries, Docker/install smoke, and live opt-in providers.
- Release workflows include npm, Docker, plugin, install-smoke, and platform-specific checks.

Surface coverage: `channel-ui`, `webui`, `browser-automation`, `eval-ui`, and release smoke.

Agent QC profile mapping: `multi-channel-agent-gateway`, `agent-tool-mcp-gateway`, `agent-skills-plugins`, `agent-ui-tui-desktop`, `agent-distribution-release`, `agent-evals-quality`.

## Claude Code-style TUI/runtime snapshot

Local source: `/Users/coso/Documents/dev/js/claudecode`.

Observed testing shape:

- The local snapshot is incomplete: no `package.json` or GitHub workflows were available.
- Source surfaces still show TUI/runtime risks: Ink rendering, shell interaction, remote session permission requests, WebSocket/SSE/HTTP transports, tool-use messages, SDK stream adapters, and injected query dependencies.
- Agent QC should treat this as interface-surface evidence only, not as a conclusion about the upstream project's test strategy.

Surface coverage: `tui`, `cli-stream`, remote permission protocol, SDK stream adapter, and skill/plugin reload visibility.

Agent QC profile mapping: `agent-runtime-cli`, `agent-ui-tui-desktop`, `agent-sdk-api`, `agent-tool-mcp-gateway`, `agent-skills-plugins`.

## Hermes-style background agent

Local source: `/Users/coso/Documents/dev/python/hermes-agent` and public Hermes docs.

Observed testing shape:

- Python uses pytest with markers, xdist, ignored integration/e2e paths, and a canonical `scripts/run_tests.sh` that normalizes env, workers, timezone, locale, hash seed, and credentials.
- Tests include cron, gateway, plugins, memory providers, stress/concurrency, checkpointing, evidence store, subprocess e2e, and TUI Vitest tests.
- CI includes pytest, separate e2e, ruff/ty lint, uv lock checks, OSV scanner, Docker build and smoke, docs-site checks, and skills index jobs. The repo also has `ui-tui` Vitest tests and a Vite/React `web` dashboard package.

Surface coverage: `cli-stream`, `tui`, `browser-automation`, `channel-ui`, and scheduler evidence.

Agent QC profile mapping: `agent-runtime-cli`, `background-agent-scheduler`, `multi-channel-agent-gateway`, `agent-ui-tui-desktop`, `agent-tool-mcp-gateway`, `agent-distribution-release`, `agent-skills-plugins`.

## Lime-style desktop GUI agent

Local source: `/Users/coso/Documents/dev/ai/aiclientproxy/lime`.

Observed testing shape:

- Lime treats GUI product readiness as distinct from type/lint/unit pass.
- Required gates include `verify:local`, `test:contracts`, `verify:gui-smoke`, bridge health checks, workspace-ready smoke, browser-runtime smoke, and Playwright continuation when user-visible behavior changes.
- Command changes must synchronize frontend calls, Rust handlers, governance catalog, DevBridge, and mocks.

Surface coverage: `desktop-gui`, WebView `webui`, `browser-automation`, and bridge/command transcripts.

Agent QC profile mapping: `agent-ui-tui-desktop`, `agent-runtime-cli`, `agent-tool-mcp-gateway`, `agent-skills-plugins`.

## Cross-case lessons

1. Use project profiles before gates.
2. Keep fake/local integration separate from live providers.
3. Treat install/package/Docker smoke as first-class release gates.
4. Preserve protocol transcripts and UI traces as evidence.
5. Use qcloop for repeated cases, not as a substitute for framework-native gates.
6. Normalize environment for agent tests: credentials, time, locale, working directory, concurrency, and sandbox.

---
title: What is Agent QC?
description: Conceptual entry point for Agent project quality control.
---

# What is Agent QC?

Agent QC is a portable standard for proving that Agent projects work.

Agent software has failure modes that ordinary app testing often misses: tool calls can drift from declarations, permission gates can be bypassed, model streams can produce malformed events, background tasks can get stuck, live providers can silently change behavior, and UI surfaces can make runtime facts look successful when they are not.

Agent QC gives these risks a shared vocabulary:

1. classify the Agent project profile;
2. identify touched interaction surfaces;
3. choose gates that match the profile, surface, and risk;
4. write behavior-level cases;
5. collect inspectable evidence;
6. judge pass/fail with explicit verdicts;
7. report remaining risk, blockers, exhausted attempts, reviews, and waivers.

## Lime is a profile, not the standard

Lime remains an important example because it is a GUI desktop Agent product. But Agent QC is broader: Codex-like runtime CLIs, Claude Code-like TUI runtimes, OpenClaw-like multi-channel gateways, Hermes-like background/browser agents, SDKs, tool servers, skills, plugins, release packages, and eval suites all need QC.

## Why Agent projects need classification

A Rust runtime agent does not need the same gates as a Telegram gateway, a TUI, a browser automation harness, or a VitePress standards site. Agent QC therefore classifies first, then chooses gates.

Examples:

- Codex-style runtime: sandbox, apply-patch, MCP, app-server protocol, CLI e2e, TUI snapshots, cross-platform release.
- Claude Code-style TUI runtime: Ink rendering, remote permissions, WebSocket/control streams, SDK adapters, plugin/skill reload visibility.
- OpenClaw-style gateway: channel contracts, secrets, provider live lanes, QA Lab reports, WebUI/browser evidence, Docker/install smoke.
- Hermes-style background agent: pytest markers, cron, gateway, browser safety, concurrency stress, Docker smoke, credential isolation.
- Lime-style desktop GUI: local validation, command contracts, DevBridge readiness, GUI smoke, Playwright product flow.

## Runtime-backed surfaces

Agent QC adopts a key Agent UI rule: visible surfaces are projections, not truth owners.

A surface pass should connect:

```text
entrypoint -> user action -> visible frame -> runtime/protocol fact -> evidence ref -> cleanup
```

A screenshot without runtime backing is visual smoke. A runtime log without visible frame is not a surface test.

## What counts as evidence

Evidence can be a test report, command log, CI URL, qcloop attempt, verifier round, Playwright trace, screenshot, terminal snapshot, model/tool transcript, protocol transcript, browser console/network log, package manifest, Docker smoke output, eval rubric, judge output, or human review record.

A model's final prose is never enough by itself.

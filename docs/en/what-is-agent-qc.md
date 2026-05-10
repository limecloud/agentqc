---
title: What is Agent QC?
description: Conceptual entry point for Agent project quality control.
---

# What is Agent QC?

Agent QC is a portable standard for proving that Agent projects work.

Agent software has failure modes that ordinary app testing often misses: tool calls can drift from declarations, permission gates can be bypassed, model streams can produce malformed events, background tasks can get stuck, live providers can silently change behavior, and UI surfaces can make runtime facts look successful when they are not.

Agent QC gives these risks a shared vocabulary:

1. classify the Agent project profile;
2. choose gates that match the profile and risk;
3. write behavior-level cases;
4. collect inspectable evidence;
5. judge pass/fail with explicit verdicts;
6. report remaining risk and waivers.

## Lime is a profile, not the standard

Lime remains an important example because it is a GUI desktop Agent product. But Agent QC v0.3.0 is broader: Codex-like runtime CLIs, OpenClaw-like multi-channel gateways, Hermes-like background agents, SDKs, tool servers, skills, plugins, and release packages all need QC.

## Why Agent projects need classification

A Rust runtime agent does not need the same gates as a Telegram gateway or a VitePress standards site. Agent QC therefore classifies first, then chooses gates.

Examples:

- Codex-style runtime: sandbox, apply-patch, MCP, protocol, CLI e2e, cross-platform release.
- Claude Code-style TUI runtime: Ink rendering, remote permissions, WebSocket/control streams, SDK adapters, plugin/skill reload visibility.
- OpenClaw-style gateway: channel contracts, secrets, provider live lanes, Docker/install smoke, plugin boundaries.
- Hermes-style background agent: pytest, cron, gateway, concurrency stress, Docker smoke, credential isolation.
- Lime-style desktop GUI: local validation, command contracts, DevBridge readiness, GUI smoke, Playwright product flow.

## What counts as evidence

Evidence can be a test report, command log, CI URL, qcloop attempt, verifier round, Playwright trace, screenshot, model/tool transcript, package manifest, Docker smoke output, or human review record.

A model's final prose is never enough by itself.

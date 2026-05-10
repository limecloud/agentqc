---
title: Quickstart
description: Create an Agent QC plan for any Agent project.
---

# Quickstart

Use this flow when an agent needs to test an Agent project.

## 1. Classify the project

Pick one or more project profiles:

- `agent-runtime-cli`
- `agent-sdk-api`
- `agent-tool-mcp-gateway`
- `multi-channel-agent-gateway`
- `agent-ui-tui-desktop`
- `agent-skills-plugins`
- `background-agent-scheduler`
- `agent-distribution-release`
- `agent-evals-quality`

## 2. Identify touched surfaces

Examples: tool execution, sandbox, transport, channel adapter, secrets, scheduler, UI, package, live provider, eval benchmark.

## 3. Select gates

Use the [gate matrix](./gate-matrix). Combine gates when profiles overlap.

## 4. Write evidence-first cases

Each `qc_case` should state:

- the behavior to prove;
- exact steps or commands;
- expected result;
- required evidence;
- what counts as fail, blocked, exhausted, or waived.

## 5. Use qcloop when repetition matters

Use qcloop for independent repeated cases: multiple files, multiple channels, multiple providers, multiple commands, multiple prompts, or multiple package profiles.

## 6. Report the result

A report is only complete when required gates have evidence-backed verdicts and remaining risks are named.

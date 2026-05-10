---
title: Acceptance scenarios
description: Behavior-level Agent QC scenarios.
---

# Acceptance scenarios

Agent QC validates behavior and evidence, not repository shape alone.

## 1. Runtime CLI permission boundary

A runtime blocks an unsafe tool action, returns a controlled error, and records the decision in a transcript or log.

Passing condition: the denied action is visible and no unauthorized side effect occurs.

## 2. Tool or MCP transport recovery

A stdio/http tool server disconnects, reconnects, or returns an error.

Passing condition: the runtime surfaces failure/recovery without corrupting tool state.

## 3. Channel gateway auth and media

A channel adapter receives a webhook or message with media and auth context.

Passing condition: the gateway verifies identity, applies secret policy, stores media safely, and emits a traceable response.

## 4. UI/TUI streaming turn

A user sends a prompt, status appears before final text, tool progress stays separate from answer text, and interruption remains available.

Passing condition: UI projection does not invent runtime success.

## 5. Background scheduler recovery

A scheduled agent job is interrupted or restarted.

Passing condition: leases/checkpoints prevent duplicate or lost work and evidence shows final ownership.

## 6. Distribution install smoke

A released package or Docker image installs in a clean environment.

Passing condition: version, help command, minimal runtime start, and package contents match expectations.

## 7. Semantic eval regression

A prompt suite is run against current and baseline behavior.

Passing condition: rubric assertions improve or stay within accepted threshold, with judge outputs preserved.

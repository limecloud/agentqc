---
title: Gate matrix
description: Generic Agent QC gate matrix.
---

# Gate matrix

The gate matrix maps project profiles to default validation gates. It defines the minimum evidence needed before a report can claim a pass.

| Profile | Minimum gate families | Optional escalation gates |
| --- | --- | --- |
| `agent-runtime-cli` | `static`, `unit`, `contract-protocol`, `runtime-e2e` | `property-fuzz`, `stress-concurrency`, `live-provider` |
| `agent-sdk-api` | `static`, `unit`, `contract-protocol`, `fake-integration` | `distribution-release`, `live-provider` |
| `agent-tool-mcp-gateway` | `contract-protocol`, `fake-integration`, `runtime-e2e` | `stress-concurrency`, `live-provider`, `review` |
| `multi-channel-agent-gateway` | `static`, `unit`, `contract-protocol`, `fake-integration` | `live-provider`, `distribution-release`, `semantic-eval` |
| `agent-ui-tui-desktop` | `static`, `unit`, `ui-interaction` | `runtime-e2e`, `live-provider`, `review` |
| `agent-skills-plugins` | `static`, `contract-protocol`, `fake-integration` | `distribution-release`, `review`, `semantic-eval` |
| `background-agent-scheduler` | `unit`, `fake-integration`, `stress-concurrency` | `runtime-e2e`, `live-provider`, `review` |
| `agent-distribution-release` | `static`, `distribution-release` | `runtime-e2e`, `live-provider`, `review` |
| `agent-evals-quality` | `semantic-eval`, `review` | `live-provider`, `stress-concurrency` |

The names above are gate families, not framework commands. A project maps each family to its local command, CI job, qcloop item, or review workflow.

## Gate escalation

Escalate gates when the change touches:

- permission, sandbox, credential, or secret handling;
- protocol or wire format;
- persistent state, migration, queue, or scheduler;
- user-visible UI or terminal rendering;
- package/install/release metadata;
- live providers or external network APIs;
- model prompt, rubric, eval, or judge behavior.

## Evidence minimums

- `static` gates need command logs, CI URLs, or SARIF-style reports.
- `contract-protocol` gates need schema/contract reports, transcript refs, or failing ids.
- `runtime-e2e` gates need CLI/runtime transcripts, state snapshots, or process-cleanup proof.
- `ui-interaction` gates need stable assertions plus screenshots, traces, videos, or accessibility output.
- `live-provider` gates need redacted request/response refs, credential scope, and budget/cost notes.
- `distribution-release` gates need package manifests, install output, Docker smoke, or OS matrix proof.
- `semantic-eval` gates need rubric, model/judge outputs, baseline delta, and waiver threshold.

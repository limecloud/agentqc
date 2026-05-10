---
title: 门禁矩阵
description: 通用 Agent QC 门禁矩阵。
---

# 门禁矩阵

门禁矩阵把 Agent 项目 profiles、surfaces 和风险改动映射到验证 gates。它定义报告宣称通过前所需的最低证据。

Gate 名称是 family，不是框架命令。项目需要把每个 family 映射到本地脚本、CI job、qcloop item 或 review workflow。

## Profile defaults

| Profile | Minimum gate families | Optional escalation gates |
| --- | --- | --- |
| `agent-runtime-cli` | `static`, `unit`, `contract-protocol`, `runtime-e2e` | `property-fuzz`, `stress-concurrency`, `live-provider`, `distribution-release` |
| `agent-sdk-api` | `static`, `unit`, `contract-protocol`, `fake-integration` | `distribution-release`, `live-provider`, `semantic-eval` |
| `agent-tool-mcp-gateway` | `contract-protocol`, `fake-integration`, `runtime-e2e` | `stress-concurrency`, `live-provider`, `review`, `property-fuzz` |
| `multi-channel-agent-gateway` | `static`, `unit`, `contract-protocol`, `fake-integration` | `live-provider`, `distribution-release`, `semantic-eval`, `stress-concurrency` |
| `agent-ui-tui-desktop` | `static`, `unit`, `ui-interaction` | `runtime-e2e`, `contract-protocol`, `live-provider`, `review`, `stress-concurrency` |
| `agent-skills-plugins` | `static`, `contract-protocol`, `fake-integration` | `distribution-release`, `review`, `semantic-eval`, `live-provider` |
| `background-agent-scheduler` | `unit`, `fake-integration`, `stress-concurrency` | `runtime-e2e`, `live-provider`, `review`, `distribution-release` |
| `agent-distribution-release` | `static`, `distribution-release` | `runtime-e2e`, `live-provider`, `review`, `stress-concurrency` |
| `agent-evals-quality` | `semantic-eval`, `review` | `live-provider`, `stress-concurrency`, `distribution-release` |

## Surface add-ons

如果 case 命名 surface，需要在 profile default 上追加 surface evidence。

| Surface | Minimum add-on | Stronger proof |
| --- | --- | --- |
| `cli-stream` | command log、exit status、stdout/stderr transcript | structured event assertion、malformed stream fixture、cleanup proof |
| `tui` | terminal snapshot、viewport、key sequence | multi-viewport、ANSI/Unicode、interrupt、approval、runtime transcript |
| `webui` | screenshot 或 browser trace、console log | Playwright trace、a11y/DOM snapshot、reload/resume、network log |
| `desktop-gui` | shell start、bridge health、screenshot | workspace readiness、native command contract、OS matrix、trace |
| `browser-automation` | screenshot 和 DOM/a11y snapshot | console/network、SSRF/navigation safety、orphan cleanup、trace/video |
| `channel-ui` | webhook/channel transcript、auth proof | media fixture、replay、device/emulator log、live opt-in lane |
| `eval-ui` | rubric、judge output、report export | baseline delta、reviewer annotation、failing examples、dashboard screenshot |

## Change-risk escalation

改动触碰以下风险时升级 gates：

| Risk touched | Add gates |
| --- | --- |
| permission、sandbox、credential 或 secret handling | `contract-protocol`、`runtime-e2e`、`review`；path/parser 边界再加 `property-fuzz` |
| protocol、schema、generated client、command 或 manifest shape | `contract-protocol`、`fake-integration`、generated artifact drift check |
| persistent state、migration、queue 或 scheduler | `unit`、`runtime-e2e`、`stress-concurrency`、recovery evidence |
| user-visible GUI/TUI/WebUI/desktop behavior | `ui-interaction`、surface evidence、stable regression |
| browser automation 或 remote browser provider | `browser-automation` surface proof、cleanup、console/network、safety fixtures |
| webhook、chat channel、mobile、QR 或 media flow | `channel-ui`、auth/media replay、redaction、可选 `live-provider` |
| package/install/release metadata | `distribution-release`、clean install、manifest、version/lock consistency |
| live provider、external network API 或 model backend | 显式 `live-provider`、credential scope、budget、redaction |
| model prompt、rubric、eval 或 judge behavior | `semantic-eval`、`review`、baseline delta、examples |
| multi-agent、subagent、background 或 remote teammate work | `runtime-e2e`、`stress-concurrency`、surface/task evidence |

## Minimal and strong gates

| Claim | Minimal gate | Stronger gate |
| --- | --- | --- |
| "Runtime command works" | command log 和 exit status | fake provider transcript、structured events、cleanup proof |
| "Tool/MCP bridge works" | schema/contract check | fake server recovery、permission denial、stdio/http disconnect |
| "TUI approval works" | terminal snapshot | key sequence、runtime action request/response transcript、cancel/reconnect variants |
| "WebUI flow works" | component assertion | browser trace、console/network、a11y、reload/resume |
| "Desktop app works" | shell start | bridge health、workspace readiness、native command contract、screenshot |
| "Browser automation works" | screenshot | DOM/a11y、console/network、cleanup、safety fixtures |
| "Channel adapter works" | contract fixture | webhook replay、media、redaction、live opt-in |
| "Scheduler works" | deterministic unit | restart/reclaim、duplicate-work proof、race/stress |
| "Package is releasable" | build output | clean install、package manifest、Docker/OS matrix、supply-chain |
| "Model quality improved" | one rubric pass | baseline delta、judge output、human review、failing examples |

## Evidence minimums

- `static` gates 需要 command logs、CI URLs 或 SARIF-style reports。
- `contract-protocol` gates 需要 schema/contract reports、transcript refs 或 failing ids。
- `runtime-e2e` gates 需要 CLI/runtime transcripts、state snapshots 或 process-cleanup proof。
- `ui-interaction` gates 需要 stable assertions 加 screenshots、traces、videos、terminal snapshots 或 accessibility output。
- `live-provider` gates 需要 redacted request/response refs、credential scope 和 budget/cost notes。
- `distribution-release` gates 需要 package manifests、install output、Docker smoke 或 OS matrix proof。
- `semantic-eval` gates 需要 rubric、model/judge outputs、baseline delta 和 waiver threshold。

## Framework mapping examples

| Ecosystem | Gate mapping |
| --- | --- |
| Rust/Codex-like | `cargo nextest`、targeted crate tests、Bazel test/build、schema fixture writers、fake model server、ratatui snapshots |
| JS/OpenClaw-like | Vitest projects、changed-test router、contract configs、live configs、Docker smoke、QA Lab report lanes |
| Python/Hermes-like | pytest markers、xdist、默认排除 integration、credential blanking、e2e directory、ruff/ty |
| GUI/Lime-like | local verify、command contracts、DevBridge health、GUI smoke、Playwright continuation、Tauri/Rust tests |

## Anti-patterns

| Anti-pattern | Why it fails |
| --- | --- |
| 一个 `npm test` checkbox 覆盖所有 profiles | 隐藏 surface/live/release 风险 |
| screenshot-only UI pass | 没有 runtime backing |
| contract-only tool pass | 没有 runtime recovery proof |
| live provider 放在默认 unit lane | 默认 flaky 且不安全 |
| release build 没有 install smoke | package 可能不可用 |
| waiver 没有 owner/expiry | 风险无边界 |

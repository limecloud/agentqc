---
title: 明星项目测试体系
description: 代表性 Agent 项目的测试体系案例。
---

# 明星项目测试体系

本参考页解释几个强 Agent 项目如何组织测试。Agent QC 不把某个项目的命令复制成通用配方，而是提炼可复用的测试架构：如何分离确定性测试与 live provider 风险，如何捕获 UI/TUI/WebUI 证据，以及如何把 runtime/protocol fact 连接到可见 surface。

## 如何阅读本页

- 把每个本地仓库当案例，不当规范依赖。
- 复制测试形态，不复制具体技术栈。
- 明确写出限制。Claude Code 本地快照有有价值的 interface code，但没有本地 `package.json` 或 workflow metadata，所以本页不声称该快照的上游 CI 行为。
- 只要项目有 UI，就必须同时要求 surface proof 与 runtime proof。



## Agent UI 和 Agent Skills 对本页的启发

本页把 Agent UI 作为 surface testing 的主要参考。可复用经验是：

- UI/TUI/WebUI/desktop 状态必须是 runtime-backed projections，而不是独立真相。
- Final answer text 必须与 reasoning、tool progress、approvals、artifacts、evidence、diagnostics、team events 分离。
- 缺失 runtime facts 时必须渲染为 `unknown`、`unavailable`、`stale` 或 `blocked`，不能猜测成功。
- approval、interrupt、queue、steer、artifact edit、evidence export、review、replay 等 controlled writes 必须走 owning API。
- Old sessions 和 long-running work 需要 progressive hydration 和 surface-specific evidence。
- first status、first text、bridge readiness、queue wait、trace size、cleanup time 等指标也是 QC 证据的一部分。

Agent Skills 贡献的是写作风格：短入口、frontmatter、字段表、最小示例、渐进披露、eval loop、assertion grading 和 transcripts。Agent QC 用这种风格来写质量计划，而不是 skill package。

## Framework documentation lessons

官方框架文档只作为 evidence shape 示例，不是强制工具选择：

| Framework | Reusable QC lesson |
| --- | --- |
| Playwright | Projects/devices、`webServer`、retries、reporters、trace/screenshot/video policies、test isolation 是可移植 browser-evidence 概念。 |
| Vitest | `run`、projects/workspaces、JSON/JUnit reporters、coverage、snapshots、browser mode 可以把 JS 项目映射到 deterministic 和 browser lanes。 |
| pytest | markers 和 `-m` selection、skip/xfail、parametrization、xdist、JUnit-style reports 帮助 Python 项目分离 deterministic、integration、e2e、live suites。 |
| cargo nextest/Bazel | 快速 Rust workspace runs、no-fail-fast、release binary builds、generated schema checks 展示 runtime 项目如何分层 local 与 release evidence。 |

## 跨项目 surface map

| Project | Runtime CLI / stream | TUI | WebUI | Desktop GUI | Browser automation | Channel/mobile | Eval/report UI | Release/distribution |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Codex | 强：`codex exec`、JSON/event processor、SSE fixture | 强：ratatui/insta snapshot | 间接：app-server/client protocol surface | 已检查仓库中不是 desktop shell | 有 app/server 工具相关覆盖，但不是主 surface | 无 | review/protocol artifact | 强：Bazel、release binary、npm package |
| Claude Code 本地快照 | 可见 SDK stream adapter 与 command | 可见 Ink surface 与 command view | metadata 不足，不能宣称 | 无 | remote bridge/control surface | 无 | 无 | metadata 不足，不能宣称 |
| OpenClaw | 强 gateway/CLI/router test | 有专用 `tui` command 与 TUI lane | 强 control UI 与 QA Lab web runtime | platform release path、mac/mobile script | QA Lab browser runtime、Docker/browser lane | 强 channel contract、QR、Android/iOS、live transport | 强 QA Lab scenario/report | 强 Docker/install/release check |
| Hermes Agent | 强 Python CLI/gateway test | 强 `ui-tui` Vitest package | Vite/React dashboard package | 已检查仓库中无 native shell | 强 browser supervisor/CDP/Camofox/SSRF test | 强 gateway/channel test | release notes 与 web/dashboard surface | Docker、uv lock、OSV、package check |

Agent QC 结论：一个项目可以在某个 surface 上“测试充分”，同时在另一个 surface 上测试不足。不要把所有 UI 证明压成一个 boolean。

## 共同测试架构模式

这些项目共同体现的有用模式是：

1. **Local deterministic lane**：format、lint、typecheck、unit、contract、fake integration。
2. **Runtime lane**：使用 fake provider 或 local server 的真实 CLI/task/session flow。
3. **Surface lane**：TUI/WebUI/GUI/browser/channel 的 screenshot、snapshot、trace 或 transcript。
4. **Live lane**：显式 opt-in 的真实 provider/channel/model 测试，带脱敏和预算。
5. **Distribution lane**：install、Docker/package、cross-platform、release manifest、lock/supply-chain check。
6. **Review/eval lane**：semantic quality、rubric、baseline diff、人类或 LLM review。

Agent QC plan 应说明哪些 lane 适用，哪些 lane 被明确排除。

## Codex：runtime CLI + TUI + protocol stack

本地来源：`/Users/coso/Documents/dev/rust/codex`。

### 产品形态

Codex 组合了多个 Agent 产品形态：

- Rust runtime CLI 和 task loop。
- `codex exec` 与 structured stream output。
- 基于 ratatui 与 snapshot test 的 TUI。
- MCP/tool gateway、app server、app-server protocol、SDK、release packaging、sandbox layer。
- 跨平台 sandbox 与 process execution policy。

### 测试如何组织

| 层级 | 具体信号 | Agent QC 解释 |
| --- | --- | --- |
| 仓库策略 | root `AGENTS.md` 要求先跑受影响 crate，再在 common/core/protocol 变更时跑全量 `cargo test`/`just test` | 先定向验证，再扩大覆盖 |
| Local Rust lane | `just test` 执行 `cargo nextest run --no-fail-fast`；`cargo test -p <crate>` 用于聚焦测试 | 确定性 `unit` 与 `runtime-e2e` 证据 |
| Bazel lane | `bazel test //... --keep_going`、Bazel clippy、module lock check、release binary build | 跨工具链一致性与 release 信心 |
| Supply/policy lane | `cargo-deny`、codespell、clippy、argument-comment lint、lock check | `static` 与 `distribution-release` hygiene |
| Sandbox/process lane | `exec_policy_tests`、Windows sandbox tests、sandbox tag tests、Landlock/bwrap/seatbelt 相关测试 | permission boundary 与平台 runtime gate |
| Tool/protocol lane | MCP fixture、app-server v2 protocol test、schema fixture regeneration、dynamic tools、request permission tests | `contract-protocol` 与 fake integration |
| Stream lane | SSE end-to-end test、fake response helper、stream event utility、JSON/event processor test | semantic claim 之前的 stream shape 证据 |
| TUI lane | chat widget、bottom pane、approval overlay、footer、request-user-input、MCP elicitation 的 ratatui/insta snapshot | TUI `ui-interaction` 证据 |
| SDK/API lane | TypeScript SDK event/thread API 与 app-server client surface | `agent-sdk-api` contract 证据 |
| Release lane | Bazel release binary、npm/native package build script、Windows/zsh release workflow | `distribution-release` gate |

### TUI 细节

Codex 说明 TUI 测试远不只是截图：

- 覆盖窄屏、标准、较大 terminal 的 width/height 变体；
- 覆盖 exec、patch、network、cross-thread、additional permission 的 approval overlay；
- footer 状态覆盖 idle、running、Ctrl-C quit、Ctrl-C interrupt、Esc hint、queue hint、mode indicator、context/token status；
- request-user-input form 覆盖 options、freeform、multi-question、tight height、hidden options、long option text；
- model/session picker 覆盖 model migration prompt、fixed/auto column width、narrow row、scroll state；
- composer edge case 覆盖 paste、backspace after paste、slash popup、mention popup、plugin popup、remote image row、shell-command mode；
- history/chat frame 覆盖 diff syntax、code block、completed hook output、pending input、stream delta、compact/resume/fork shape；
- MCP 与 app-server 状态覆盖 MCP startup failure、elicitation form、app-server collaboration、guardian review；
- 还存在 Windows approval popup 这类平台 snapshot 变体。

Agent QC 规则：TUI pass 应同时引用 terminal snapshot 和 runtime transcript。snapshot-only 证明渲染；transcript-linked 证明渲染来自正确 Agent event。

### Runtime 细节

Codex 把确定性 runtime test 与 live/provider 风险分开：

- fake model server 与 SSE fixture 不消耗 provider 预算即可验证 stream shape；
- app-server protocol test 独立于 TUI 断言 wire shape；
- apply-patch test 覆盖 CLI 与 tool surface；
- exec/unified process test 保留 command output、cleanup、failure semantics；
- sandbox test 断言 denied action 与平台 policy transform；
- schema fixture writer 让 protocol drift 可审查。

Agent QC 规则：CLI/runtime 项目必须先有 `contract-protocol` 与 `runtime-e2e`，再谈 `semantic-eval`。

### 可复制到 Agent QC plan 的 case

Codex 类项目应包含这类 case：

- unsafe command 被拒绝，并产生可见 controlled error 与非成功 runtime event；
- apply-patch 成功/失败都有稳定 CLI transcript 与 patch result；
- MCP tool declaration 贯穿 config、server fixture、runtime event 与 TUI row；
- Ctrl-C 中断 running turn 后没有 orphan subprocess；
- command shape 变化时 app-server protocol schema diff 被审查；
- release package 包含预期 native binary 与平台 helper。

## Claude Code 本地快照：metadata 不完整时的 TUI/runtime surface

本地来源：`/Users/coso/Documents/dev/js/claudecode`。

### 来源限制

检查到的本地快照包含 `src/` 与 `vendor/` 下的源码，但没有本地 `package.json`、lockfile 或 GitHub workflow metadata。因此 Agent QC 不能从这个快照宣称上游 CI、test command、package coverage 或 release guarantee。可用信号是 interface-surface shape。

### 快照中可见的产品表面

| Surface | 本地信号 | Agent QC gate |
| --- | --- | --- |
| Ink TUI | `src/ink.ts`、`.tsx` command view、terminal focus/input/selection hook、task view | TUI `ui-interaction` |
| Command palette | 大量 `src/commands/**` handler 与可渲染 command view | command routing 与 TUI state snapshot |
| Remote session bridge | `src/remote/RemoteSessionManager.ts`、`src/remote/SessionsWebSocket.ts`、server direct connect manager | `contract-protocol`、`runtime-e2e` |
| Permission flow | `remotePermissionBridge.ts`、包含 `can_use_tool` 的 control schema、synthetic assistant/tool confirmation flow | 高风险 TUI + protocol evidence |
| SDK stream | `src/remote/sdkMessageAdapter.ts`、`src/entrypoints/agentSdkTypes.ts`、stream/control schema | `agent-sdk-api` stream contract |
| Skills/plugins | SDK schema 包含 skills/plugins；可见 output style/plugin loading code | `agent-skills-plugins` |

### 标准应要求什么

Claude Code 风格 TUI runtime 应证明：

- success、empty、error、cancelled、reconnecting、disconnected、remote state 渲染不同；
- command view 与 slash command / command palette entry 走同一 state transition；
- permission prompt 显示 tool name、request id、proposed input、permission suggestions、deny/allow outcome；
- remote permission response 保留 request correlation 与 behavior（`allow`、`deny` 或项目自定义 mode）；
- server-side cancellation 会移除或标记 pending prompt，不留下 stale approval；
- reconnect/interrupt 不会让 TUI 显示 stale success；
- SDK stream adapter 保留 event type、session id、tool-use id、partial/final message 语义；
- remote server 返回的 tool result 被渲染成 tool result，而不是 prompt echo；
- plugin/skill reload event 不会在没有 visible status 或 audit event 的情况下静默改变 allowed tools。

### 证据配方

最小 QC case 应收集：

1. remote permission request 的 pseudo-terminal transcript；
2. 显示 synthetic confirmation row 的 TUI snapshot；
3. `can_use_tool` request/response 的 WebSocket/control transcript；
4. 证明 event conversion 的 SDK stream fixture；
5. cancellation 或 disconnect 的 negative case。

Agent QC 规则：当 repo metadata 不完整时，把限制写进 `evidence_policy`，要求 interface-level evidence，不能编造 CI 故事。

## OpenClaw：multi-channel gateway + WebUI + QA Lab

本地来源：`/Users/coso/Documents/dev/js/openclaw`。

### 产品形态

OpenClaw 是密集型 Agent 系统：

- multi-channel gateway 与 provider/channel integration；
- plugin ecosystem 与 plugin SDK；
- CLI、gateway、TUI command、control WebUI、Android/iOS/macOS platform path；
- QA Lab extension，包含 web runtime、browser runtime、scenario runner、live transport test 和 report；
- Docker/install/release smoke path；
- 面向 model、gateway、CLI backend 的 live provider lane。

### 测试如何组织

OpenClaw 的 `package.json` 暴露了很多 lane。对 Agent QC 重要的是分层方式，而不是命令数量。

| 层级 | 具体信号 | Agent QC 解释 |
| --- | --- | --- |
| Test router | `node scripts/test-projects.mjs`、`test:changed`、`test:max`、serial/max-worker 变体 | changed-scope 与 profile-aware gate selection |
| Static/policy | `check`、`lint`、import-cycle check、LOC check、host env policy、webhook/auth boundary lint | `static` 与安全策略 |
| Unit/gateway lane | `test:unit`、`test:gateway`、gateway client/server/method config | 确定性 runtime 与 gateway behavior |
| Contract lane | `test:contracts:channels`、`test:contracts:plugins`、plugin SDK export/API check、protocol generation check | channel/plugin/runtime boundary 的 `contract-protocol` |
| WebUI lane | `test:ui`、`ui` package test、browser-playwright 风格 UI config test | `ui-interaction` 下的 `webui` |
| TUI/platform lane | `tui`、TUI script、`test:windows:ci`、`test:macos:ci`、Android/iOS unit/integration script | surface-specific UI/platform proof |
| QA Lab lane | `extensions/qa-lab` scenario catalog、web runtime、browser runtime、report、live transport、suite summary JSON | `agent-evals-quality`、`eval-ui`、`webui`、`browser-automation` |
| Channel lane | Telegram/Matrix/Discord/Feishu/Zalo 等 channel config、webhook/media/auth test | `multi-channel-agent-gateway` |
| Live provider lane | `test:live:*`、live model profile、live gateway Docker lane、Claude/Codex/Gemini 风格 live CLI backend lane | 显式 opt-in 的 `live-provider` |
| Docker/install lane | install smoke、OpenWebUI Docker、MCP channels Docker、QR import、plugins Docker、gateway network Docker | `distribution-release` 与 runtime smoke |
| Release lane | `release:check`、npm check、plugin release check、version sync | release readiness 与 package boundary proof |
| Performance lane | startup bench、import duration、perf budget、memory check | performance risk gate |

### WebUI 细节

OpenClaw 展示 WebUI 证明应该分层：

- navigation、chat normalization、settings、controller panel、usage panel、tool card、config surface 的 component/state test；
- focus、markdown、sidebar status、external link、image opening、browser API 的 browser-only test；
- QA Lab web runtime 做 scenario execution 与 report rendering；
- Docker-hosted OpenWebUI smoke 证明 clean environment 集成；
- 测浏览器行为时必须保留 console/network evidence。

Agent QC 规则：行为依赖 DOM、focus、browser API、markdown sanitization、navigation 或 report rendering 时，`webui` 证据必须包含浏览器层 artifact，不能只有 jsdom/component test。

### Channel/provider 细节

OpenClaw 给出四个 Agent QC 应要求的分离：

- channel contract test 不是 live channel test；
- fake provider integration 不是 live provider coverage；
- media/webhook/auth replay 与 model semantic quality 分开；
- plugin boundary test 与 runtime gateway test 分开。

有用 case 形态包括：

- secret ref 被脱敏，inactive channel credential 不能被使用；
- QR import 产生 scoped session，并能在 Docker smoke 中 replay；
- webhook body verification 发生在解析用户内容之前；
- media attachment 保留 type/size limit 与 redaction；
- live transport credential 被 lease、timeout，并在 report 中脱敏；
- control WebUI 显示真实 gateway status，而不是 cached healthy state。

Agent QC 规则：`multi-channel-agent-gateway` 项目不能把 live-provider 假设藏在普通 unit test 里。

## Hermes Agent：Python agent + TUI + browser/web tools + scheduler

本地来源：`/Users/coso/Documents/dev/python/hermes-agent`。

### 产品形态

Hermes 组合了：

- Python Agent runtime、CLI、toolset、gateway、ACP/MCP adapter；
- pytest 后端测试；
- browser、web provider、CDP、Camofox、Browserbase 风格 provider、SSRF hardening 测试；
- cron/background scheduler、checkpointing、approval、restart/retry、concurrency surface；
- `ui-tui` Ink/React TUI package 与 Vitest test；
- `web` Vite/React dashboard package；
- Docker image、uv lock、OSV/security、release check。

### 测试如何组织

| 层级 | 具体信号 | Agent QC 解释 |
| --- | --- | --- |
| Canonical runner | `scripts/run_tests.sh` 固定 `-n 4`、`TZ=UTC`、`LANG=C.UTF-8`、`PYTHONHASHSEED=0`，激活 venv，清理 credential env var，默认排除 integration/e2e | 可复现本地证据与 credential hygiene |
| Pytest backend | `tests/` 中的 gateway、cron、CLI、ACP、browser/tool、security、restart、retry、queue、platform test | 确定性 `unit`、`fake-integration`、`runtime-e2e` |
| Tool safety | write deny、file guard、symlink confusion、URL safety、yolo/approval mode、env passthrough | permission/sandbox gate |
| Browser/web | browser supervisor、browser hardening、CDP、local SSRF、Camofox state、web provider | `browser-automation` gate |
| Gateway/channel | Discord、Feishu、Matrix、Mattermost、Google Chat、QQBot、delivery、media、reconnect、dedup、pairing、roles/DM scope | `channel-ui` 与 gateway contract |
| MCP/OAuth/ACP | MCP e2e、OAuth metadata、SSE transport、reconnect、circuit breaker、tool 401 handling、ACP approval isolation | `contract-protocol` 与 recovery |
| Scheduler | cron jobs、cron prompt injection、inactivity timeout、workdir、scheduler MCP init、checkpoint/session cleanup | `background-agent-scheduler` |
| TUI | `ui-tui` Vitest：terminal parity、viewport、virtual history、slash parity、streaming markdown、OSC52、clipboard、terminal modes | TUI `ui-interaction` |
| Web dashboard | `web` package 使用 Vite/React build 和 lint script | dashboard 行为变化时的 `webui` |
| Distribution | Dockerfile 构建 browser dashboard/TUI asset；uv lock；OSV/security note | `distribution-release` 与 supply chain |

### TUI/terminal 细节

Hermes TUI 测试覆盖实用 terminal mechanics：

- text wrapping、virtual history heights、scroll、viewport store、precision wheel；
- terminal modes、truecolor、OSC52 clipboard、emoji、math Unicode、syntax/markdown；
- slash command parity、gateway events、session lifecycle、queue handling、turn store、state isolation；
- streaming markdown、reasoning/details rendering、subagent tree、status ticker；
- text input navigation、pass-through、wrapping、completion、composer state。

Agent QC 规则：TUI 测试应覆盖 terminal input/output mechanics，而不只是 component snapshot。

### Browser/web 细节

Hermes 的 browser/tool 测试能直接映射到 Agent QC：

- browser supervisor health 与 orphan reaper；
- browser hardening 与 local SSRF protection；
- CDP override、browser console、本地 provider 行为；
- Camofox persistence/state isolation；
- Brave/DDGS/SearXNG/Tavily 类 web provider contract；
- CLI browser connect 与 gateway browser 相关 command test。

Agent QC 规则：browser automation gate 必须包含 safety 与 cleanup evidence，而不只是 screenshot。

### Scheduler/channel 细节

Hermes 说明后台 Agent 为什么需要独立 gate family：

- cron prompt injection 要在 skills/context 组装后扫描，而不是只扫用户输入；
- scheduler restart 不能 duplicate work 或丢 checkpoint；
- inactivity timeout 应跟踪真实 tool activity，而不只是 wall-clock；
- gateway restart/retry/dedup test 应保留 message id 与 delivery state；
- credential-shaped environment variables 必须在测试中 blank 或 scope。

Agent QC 规则：background scheduler pass 应包含 deterministic clock/env settings、checkpoint evidence 与 cleanup evidence。

## 跨项目提炼

Agent QC 从这些项目提炼出十条可复用规则：

1. 从拥有的风险出发，而不是从语言或框架出发。
2. 把 UI surface proof 与 runtime/protocol proof 分开，再用 evidence ref 连接。
3. fake integration、live provider、release smoke 必须是不同 gate。
4. TUI/WebUI/GUI 必须保留 surface artifact：snapshot、trace、screenshot、console log、terminal transcript。
5. browser automation 必须有 DOM/a11y、console/network 与 cleanup evidence。
6. channel/mobile 必须把 webhook/media/auth replay 与 live provider test 分开。
7. background agent 必须固定 deterministic time/env/worker settings，并保留 checkpoint evidence。
8. SDK/protocol surface 在 live run 前先使用 generated schema diff 与 fake server。
9. release claim 要测试 package contents 和 install path，而不只是 source test。
10. 对不完整本地快照，要记录检查了什么和不能推断什么。

## 推荐 Agent QC case 组合

| 风险 | 最小 case | 更强 case |
| --- | --- | --- |
| Permission prompt | snapshot/frame 显示 prompt，transcript 显示 request id | allow/deny/cancel/reconnect 变体 + protocol transcript |
| Tool stream | fake provider stream 可解析并渲染 | malformed stream、tool error、partial/final event、retry、abort |
| TUI rendering | 一个稳定 snapshot | multi-viewport、key sequence、Unicode/ANSI、runtime-linked transcript |
| WebUI control | component state test | browser trace、console/network、keyboard/a11y、reload/resume |
| Desktop bridge | shell starts | bridge health、workspace readiness、native command contract、screenshot |
| Browser control | screenshot | DOM/a11y、console/network、cleanup、SSRF/navigation safety |
| Channel adapter | contract fixture | webhook replay、media fixture、redacted transcript、live opt-in lane |
| Scheduler | deterministic unit | restart/reclaim、concurrency、checkpoint、duplicate-work prevention |
| Eval report | rubric exists | baseline delta、judge output、failing examples、reviewer note |
| Release | build succeeds | package manifest、install smoke、Docker/platform matrix、lock/security check |

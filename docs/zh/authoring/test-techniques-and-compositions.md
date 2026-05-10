---
title: 测试手段与组合
description: 面向快照、冒烟、黑盒、白盒、Agent runtime、Agent UI、Skills 和高级证据编织的 Agent QC 测试方法。
---

# 测试手段与组合

Agent QC 的 gate family 说明 **为什么** 要检查某个边界；测试手段说明 **如何** 产出证据。强 QC 计划不应只依赖一个大而全的命令，而应把多种手段组合成可复核的证据链。

当计划只写了“跑测试”或“做 UI 冒烟”时，用本页补足 Agent runtime、Agent UI、Skills/插件、浏览器自动化、频道网关和发行包的高级测试策略。

## 证据编织规则

高置信 Agent 测试通常由五股证据编织而成：

```text
白盒不变量 -> 协议/契约 -> 黑盒运行 -> 表面工件 -> 清理/审查
```

不是每个 case 都需要五股齐全，但每个 pass 都必须说明已有哪几股、哪些声明仍未被证明。

## 测试手段 taxonomy

| 手段 | 能证明什么 | 必需证据 | 单独不能证明什么 |
| --- | --- | --- | --- |
| Static/policy check | format、type、import 边界、generated drift、禁用 API | command log、SARIF 或 lint report、tool version | runtime 行为或 UX |
| 白盒单测 | reducer、parser、serializer、权限决策、状态机 | test report、fixture ids、assertion diff | 打包后的 app 或用户可见行为 |
| Property/fuzz/metamorphic | 大量或生成输入下的不变量 | seed、corpus、最小失败样例、invariant text | 精确用户流程 |
| Golden transcript | CLI/runtime/protocol/event 输出形状稳定 | transcript file、update diff、动态字段归一化 | 视觉布局或 live provider 质量 |
| Snapshot test | 渲染输出或序列化对象稳定 | snapshot diff、viewport/device、update review | 来源 runtime fact 是否正确 |
| Contract/protocol test | schema、tool declaration、SDK/API、manifest、transport 行为 | schema diff、fake server transcript、generated artifact check | 真实 provider 漂移 |
| Fake integration | adapter/runtime 对受控本地服务的行为 | fake server log、request/response refs、fixture version | 真实 provider 覆盖 |
| 黑盒冒烟 | 通过公开入口证明最小交付行为 | command/browser/app/channel log、exit status、可见时 screenshot | 深层边界情况 |
| Runtime E2E | agent loop、tools、permissions、resume、cleanup | runtime transcript、state snapshot、副作用证明 | UI projection，除非显式连接 |
| Surface E2E | 用户/操作者能看见并控制行为 | screenshot/trace/terminal frame、key/click/message sequence | 底层 runtime 真相，除非显式连接 |
| Replay/regression | 历史失败没有回归 | replay fixture、old bug id、预期失败模式 | 新未知问题 |
| Stress/concurrency/chaos | race、lease、retry、cancel、长任务韧性 | worker timeline、seed/config、duration、cleanup | 语义答案质量 |
| Security/adversarial | permission、prompt injection、path、SSRF、secret、policy 边界 | attack fixture、denial transcript、副作用检查 | happy path 可用性 |
| Semantic eval | 输出质量、grounding、tool choice、policy adherence | dataset、rubric、model/judge、baseline delta | 确定性代码正确性 |
| Release/install smoke | 发行物能在源码树外安装运行 | package manifest、clean install、Docker/OS log、version output | 源码测试覆盖率 |

## 黑盒、白盒和灰盒

| 模式 | Agent QC 用途 | 最适合对象 | 证据形态 |
| --- | --- | --- | --- |
| 白盒 | 用户流存在前证明内部不变量 | event reducer、permission policy、tool args sanitizer、stream parser、scheduler lease | unit/property report 加 fixture ids |
| 黑盒 | 通过公开入口证明交付行为 | CLI command、SDK call、TUI flow、WebUI route、desktop shell、webhook、package install | command 或 interaction transcript 加 exit/status 和 artifacts |
| 灰盒 | 把公开行为与内部 instrumentation 连接 | runtime UI、browser agent、channel gateway、background scheduler | 黑盒运行加 protocol/runtime transcript 和 state snapshot |

Agent 项目比普通应用更需要灰盒测试，因为可见输出可能很像成功，但 runtime state 已经错了。

## 快照标准

快照只有在范围明确且可审查时才有价值。

| 快照类型 | 用途 | 必须包含 |
| --- | --- | --- |
| Text/golden transcript | CLI output、JSONL/NDJSON stream、model event normalization | 稳定 fixture、exit status、动态 id 脱敏 |
| Terminal snapshot | TUI frame、approval overlay、footer/status row、composer | terminal size、key sequence、ANSI/Unicode policy |
| DOM/ARIA snapshot | WebUI accessibility tree、browser-mode component state | route、viewport/device、locator 或 role assertion |
| Screenshot/video | GUI/desktop/browser/channel report surface | action sequence、OS/browser/device、console/network note |
| Protocol/schema snapshot | generated schema、SDK wire contract、MCP/tool declaration | generator command、diff、compatibility note |
| Runtime state snapshot | session/thread/turn/tool/artifact/scheduler state | correlation ids、timestamp policy、cleanup note |
| Package manifest snapshot | tarball/image/install contents | version、platform、file allow/deny policy |

快照规则：

- 快照前归一化 timestamp、random id、temp path 和 provider-specific text。
- 像审产品变更一样审 snapshot update，不把它当机械噪音。
- 如果声明超过视觉布局，UI snapshot 必须搭配 runtime/protocol transcript。
- 如果声明超过 schema shape，protocol snapshot 必须搭配 fake integration。
- 一个 snapshot 聚焦一个行为，避免巨大 snapshot 掩盖真正差异。

Codex 风格 TUI 测试说明 terminal snapshot 很适合 approval overlay、footer mode、picker width、request form、窄终端高度和 diff/code block。Hermes 风格 TUI 测试进一步覆盖 OSC52、virtual history、Unicode、streaming markdown、queue state 和 session lifecycle。Claude Code 本地源码暴露了 Ink TUI、remote permission、WebSocket control 和 SDK stream adapter，这类项目需要 snapshot 加 control transcript，而不是 snapshot alone。

## 冒烟测试阶梯

冒烟测试是快速信心检查，不能替代 runtime、contract 或 surface evidence。

| 冒烟层级 | 目的 | 示例 | 退出规则 |
| --- | --- | --- | --- |
| Import/build smoke | 证明 package 能 import 或 build | `cargo test -p crate`、`vitest run`、`python -m package --help` | syntax/link/import break 立即失败 |
| Runtime smoke | 证明 agent loop 能用 fake/local provider 启动 | `agent exec "hello"`、fake tool call、MCP list tools | transcript 有 terminal status 和 cleanup |
| Surface smoke | 证明可见 shell 能打开并反映 runtime state | TUI first frame、WebUI route、desktop bridge health、channel webhook replay | surface artifact 加 runtime backing |
| Release smoke | 证明 artifact 能离开源码树运行 | clean install、Docker start、package help/version | install log 与 manifest 匹配 release |
| Canary/live smoke | 证明真实 provider/channel 仍可用 | opt-in provider call、live channel ping、model profile probe | redacted transcript、budget、credential scope |

冒烟用于广泛探测，诊断要交给更聚焦的测试。

## 如何测试 Agent runtime

Runtime 测试应把 Agent 当状态机，而不是文本生成器。

| Runtime area | 必测 case | 证据 |
| --- | --- | --- |
| Turn lifecycle | accepted、queued、running、completed、failed、cancelled | event transcript、terminal status、exit code |
| Stream shape | partial text、reasoning/tool events、final text、terminal marker | JSONL/SSE fixture、parser report、golden transcript |
| Tool execution | declaration、argument validation、progress、result、error | tool id correlation、fake tool transcript、副作用检查 |
| Permission/HITL | allow、deny、edit/input、timeout、cancel、reconnect | approval request/response transcript、surface frame |
| Files/processes | cwd、sandbox、patch/write、subprocess tree、cleanup | command log、path fixture、orphan-process proof |
| Resume/persistence | old session、crash/restart、checkpoint、artifact refs | state snapshot、replay transcript、cleanup note |
| Scheduler/parallelism | lease、retry、fanout/fanin、duplicate-work prevention | deterministic clock、worker timeline、stress/chaos result |
| Credential/provider scope | 默认 fake、live opt-in、redaction、budget | env scope、redacted request/response、缺失时 waiver |

Runtime 反模式：

- 只断言 final assistant text；
- 默认 unit tests 里隐藏 provider call；
- 只测 tool declaration，不测 invocation 和 failure；
- 只测成功，不测 deny/cancel/abort/resume；
- subprocess、browser、worker 或临时状态没有 cleanup proof。

## 如何测试 Agent UI

Agent UI 测试必须证明可见表面是 runtime-backed projection。

| UI area | 测什么 | 强证据 |
| --- | --- | --- |
| Composer/input | submit、queued input、steer-current、attachments、paste、slash commands | key/click sequence、runtime input id、snapshot |
| Status | first status before text、retrying、blocked、failed、done | runtime event order、UI frame、timing metric |
| Tool cards | safe arg summary、progress、result、error、offload refs | tool id correlation、screenshot/terminal snapshot、transcript |
| Approval/HITL | pending、allow、deny、edit、timeout、cancellation | action request/response transcript、keyboard/a11y proof |
| Artifacts | create、diff、preview、export、failed save | artifact id/path、UI snapshot、export log |
| Evidence/replay | trace links、report export、old-session hydration | evidence ids、report screenshot、hydration log |
| Team/background | queued worker、running worker、failed/retried worker、handoff | delegation graph、task card snapshot、worker transcript |
| Empty/stale states | missing facts、bridge unavailable、reconnecting、blocked | safe fallback frame、console/network log、runtime state ref |

Surface-specific 升级：

- TUI：multi-viewport、ANSI/Unicode width、Ctrl-C vs Esc 语义、resize、支持时覆盖 clipboard/OSC52。
- WebUI：browser trace、DOM/ARIA snapshot、console/network、reload/resume、keyboard/a11y。
- Desktop GUI：app shell start、bridge health、workspace readiness、native command contract、OS note。
- Browser automation：screenshot 加 DOM/a11y、console/network、unsafe navigation/SSRF fixtures、orphan cleanup。
- Channel/mobile：webhook replay、media fixture、auth proof、redacted transcript、device/emulator logs。

## 如何测试 Skills 和插件

Agent Skills 风格系统需要独立生命周期测试。标准启发是 progressive disclosure：一个 skill 是带 metadata、instructions、可选 scripts/assets 和评测证据的小包。测试也应该沿着这个结构展开。

| Skill/plugin phase | 测试 | 证据 |
| --- | --- | --- |
| Manifest/frontmatter | required fields、name/description、when-to-use、支持时包含 paths/hooks | schema report、parse failure fixtures |
| Discovery/loading | user/project/bundled precedence、symlink canonicalization、duplicate names、disabled settings | loader transcript、fixture directory tree |
| Context budget | frontmatter-only routing、lazy loading、token/size limits | token estimate、selected skill list、rejection evidence |
| Scripts/assets | script existence、executable bit、relative path resolution、clean temp dir、no raw secrets | dry-run log、sandbox/env scope、asset manifest |
| Trust boundary | local vs managed vs remote/MCP skill policy、path traversal、hook restrictions | policy test、denial transcript、audit note |
| Runtime effect | skill 只能通过 owning API 改变 allowed tools/prompts | runtime event、tool declaration diff、UI status |
| Evaluation | clean-context task、assertion grading、transcript、human feedback loop | eval rubric、attempt transcripts、verifier output |
| Packaging/release | package contents、install fixture、marketplace/registry metadata | manifest snapshot、install smoke、version check |

Claude Code 本地源码暴露了有用的 loader 关注点：`SKILL.md` 目录格式、frontmatter parsing、hooks validation、path frontmatter、symlink canonicalization、token estimation、duplicate detection，以及 remote MCP skills untrusted。Agent QC 把这些泛化为 skill/plugin gates，而不要求照搬 Claude Code 实现。

## 高级组合配方

### Runtime + UI 证据编织

适用于 runtime fact 会显示在 TUI/WebUI/desktop GUI 的场景。

```text
contract-protocol
  -> fake runtime transcript
  -> black-box user action
  -> surface snapshot/trace
  -> state snapshot + cleanup
```

示例声明：approval overlay、tool card progress、bridge health、queued worker state。

### TUI approval 编织

```text
white-box permission resolver
  -> protocol action_request fixture
  -> pseudo-terminal key sequence
  -> pending/allow/deny/cancel terminal snapshots
  -> side-effect denial check
  -> subprocess cleanup
```

如果 TUI 是核心产品表面，再加 multi-viewport、Unicode/ANSI、Ctrl-C/Esc 和 reconnect 变体。

### Provider adapter 阶梯

```text
normalizer unit tests
  -> contract/schema snapshot
  -> fake provider replay
  -> runtime E2E with fake provider
  -> opt-in live canary
  -> semantic eval and reviewer note
```

适用于 LLM provider、browser provider、search provider、channel provider 或 gateway backend。

### Browser agent 安全编织

```text
URL/path policy unit tests
  -> SSRF/file/credential attack fixtures
  -> Playwright/browser trace with DOM+a11y snapshot
  -> console/network log inspection
  -> orphan browser/tab cleanup proof
```

浏览器自动化只有 screenshot 远远不够。

### Channel gateway 编织

```text
auth verifier unit test
  -> webhook replay before body parsing
  -> media fixture and redaction check
  -> fake channel send transcript
  -> optional live channel canary
  -> report redaction review
```

channel contract、media handling、live transport 和 semantic model quality 必须是不同 gates。

### Scheduler/recovery 编织

```text
deterministic clock unit test
  -> lease/checkpoint fake integration
  -> crash/restart replay
  -> concurrency stress or chaos kill
  -> duplicate-work oracle
  -> cleanup and ownership report
```

后台 Agent、多 Agent worker 和长任务必须有这类证据。

### Skill/plugin lifecycle 编织

```text
manifest schema
  -> discovery/precedence fixture
  -> script/asset dry run in clean temp dir
  -> trust boundary denial tests
  -> clean-context skill eval
  -> package/install smoke
```

Skill 质量要用 assertion grading 和 transcripts，不是只跑 lint。

### Release confidence 编织

```text
source tests
  -> generated/lock drift check
  -> package manifest snapshot
  -> clean install smoke
  -> first-run runtime smoke
  -> OS/Docker matrix
  -> live canary if advertised
```

Release claim 判断的是 artifact，不只是 repository。

## 测试手段选择矩阵

| 声明 | 最小手段 | 更强组合 |
| --- | --- | --- |
| Runtime command works | 黑盒 command smoke、exit status | contract、fake provider、stream golden、cleanup |
| Permission boundary works | 白盒 policy、runtime denial transcript | TUI/WebUI approval surface、副作用 oracle、reconnect/cancel |
| TUI is correct | terminal snapshot | runtime transcript、multi-viewport、Unicode/ANSI、interrupt |
| WebUI is correct | component/browser assertion | Playwright trace、DOM/ARIA、console/network、reload/resume |
| Desktop GUI is usable | shell start smoke | bridge health、workspace readiness、native contract、screenshot/trace |
| Browser agent is safe | screenshot + DOM | SSRF/navigation fixture、console/network、cleanup/orphan proof |
| Channel gateway works | contract fixture | webhook replay、media fixture、auth proof、live opt-in canary |
| Skill/plugin works | manifest parse | loader precedence、script dry run、trust boundary、clean-context eval |
| Scheduler is reliable | deterministic unit | restart/reclaim、stress、chaos kill、duplicate-work proof |
| Model quality improved | eval rubric | baseline delta、judge output、failure examples、human review |
| Package is releasable | build output | manifest snapshot、clean install、Docker/OS smoke、supply-chain check |

## QC case 的 technique 字段

当项目需要表达更高级组合时，可以把这些字段放进 case body 或 report extension：

```json
{
  "techniques": ["white-box-unit", "contract-protocol", "black-box-smoke", "surface-snapshot", "cleanup-proof"],
  "box_mode": "gray-box",
  "snapshot_policy": "normalize dynamic ids; update only after reviewer approval",
  "smoke_level": "runtime|surface|release|live-canary",
  "runtime_backing": "fake-provider|real-runtime|live-provider|mock-bridge",
  "negative_cases": ["deny", "cancel", "malformed-stream", "restart"],
  "composition_rationale": "why this braid proves the claim"
}
```

这些字段是指导性扩展。Agent QC 标准化 evidence 和 verdict 语义；项目可以决定如何在本地 schema 中编码 technique metadata。

## 反模式

| 反模式 | 正确替代 |
| --- | --- |
| 一个大 `test` 命令证明所有 profile | profile-specific gates 加 explicit evidence refs |
| snapshot update 没有 review note | snapshot diff review 和 behavior rationale |
| 把 smoke test 包装成 full E2E | 标注为 smoke 并写明 remaining risk |
| 用白盒单测证明 UI | 增加 surface artifact 和 runtime link |
| 用黑盒 final text 证明 runtime | 增加 structured event transcript 和 state snapshot |
| live provider call 藏在 unit tests | explicit live lane、budget、redaction、opt-in flag |
| browser screenshot 缺 DOM/console/network/cleanup | browser evidence bundle |
| 只 lint skill manifest | loader、script、trust、clean-context eval、package smoke |

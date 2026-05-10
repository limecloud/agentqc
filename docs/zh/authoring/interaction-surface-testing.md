---
title: 交互表面测试
description: CLI stream、TUI、WebUI、desktop GUI、browser automation、channel UI 与 eval UI 的 Agent QC 细则。
---

# 交互表面测试

Agent QC 把所有用户可见、操作者可见的界面都视为一等质量边界。只写一个泛泛的 `ui-interaction` gate 不够；计划必须说明测的是哪个 surface、这个 surface 投影了哪些 runtime fact，以及证据如何让另一个审查者复核结论。

本页有意参考 Agent Skills 的文档风格：先给短规范，再给需要时读取的 playbook 和模板。目标是给 QC 作者做 progressive disclosure，而不是让所有项目无脑复制一个巨型 checklist。

## 核心规则

一个 surface test 只有在以下五段证据链都可见时才算通过：

1. **入口**：进入该 surface 的 command、URL、app shell、channel 或 device。
2. **动作**：typed command、key sequence、click、webhook、message 或 eval run。
3. **画面**：用户看到的 terminal frame、screenshot、DOM snapshot、channel transcript 或 report page。
4. **运行时支撑**：产生画面的 event、request、tool call、model stream、bridge health、process state 或 database state。
5. **清理**：exit status、detached process 检查、browser/session cleanup、credential redaction 和 remaining risk。

只有截图没有 runtime backing，只能算视觉 smoke；只有后端日志没有画面，不算 surface test。

## Surface taxonomy

| Surface | 典型产品 | 主要风险 | 最小证据 |
| --- | --- | --- | --- |
| `cli-stream` | 非交互命令、`exec`、JSONL、NDJSON、stdout/stderr | event 格式错误、exit code 错误、tool failure 被隐藏、子进程泄漏 | command log、exit status、stdout/stderr transcript、structured sample、cleanup note |
| `tui` | Ink、ratatui、curses、terminal workbench | wrapping、ANSI/Unicode width、resize、interrupt、permission prompt、stale status row | terminal snapshot、pseudo-terminal transcript、viewport size、key sequence log、runtime transcript |
| `webui` | browser dashboard、extension UI、admin console、QA lab | route drift、stale state、console/network error、markdown 不安全、审批控件不可访问 | component report、browser trace、screenshot、DOM/a11y snapshot、console/network log |
| `desktop-gui` | Tauri、Electron、native shell、WebView app | bridge readiness、native permission、window lifecycle、first-run state、OS 差异 | shell start evidence、bridge health、screenshot/trace、OS/windowing note、workspace/session readiness |
| `browser-automation` | Playwright/CDP/browser-use/computer-use runtime | session detached、不安全导航、stale screenshot、无 console 证据、orphan browser | browser trace、screenshot、DOM/a11y snapshot、console/network log、cleanup evidence |
| `channel-ui` | mobile app、QR flow、Telegram/Discord/Slack/Matrix/webhook | auth drift、webhook replay、media handling、provider policy、group/DM scope | redacted transcript、webhook replay、media fixture、device/emulator log、credential scope note |
| `eval-ui` | QA dashboard、semantic eval runner、review/report UI | rubric drift、baseline hidden change、judge blind spot、report 不可读 | rubric、judge output、baseline delta、reviewer note、report screenshot/export |

只要 case 包含 `ui-interaction`、channel、browser、CLI stream 或 eval report 证据，就应该填写 `qc_case.surface`。

## 证据链模板

可以把这个最小结构放到 case report、qcloop item result 或 CI artifact 中：

```json
{
  "surface": "tui|webui|desktop-gui|browser-automation|channel-ui|cli-stream|eval-ui",
  "runtime_backing": "real|fake-provider|mock-bridge|offline-fixture|live-provider",
  "entrypoint": "command, URL, app binary, channel, or device",
  "action": "key sequence, click path, message, webhook, or command args",
  "viewport_or_device": "80x24, Desktop Chrome, macOS Tauri, Android emulator, Telegram webhook, etc.",
  "evidence_refs": ["trace/screenshot/transcript/report refs"],
  "console_or_stderr": "clean|warnings|errors-with-waiver",
  "cleanup": "processes closed, temp state removed, session archived, credentials redacted",
  "remaining_risk": "what this surface test does not prove"
}
```

## CLI stream playbook

当 Agent 接口是命令、JSONL stream、headless runtime 或 SDK 背后的 `exec` 输出时，使用 CLI stream 测试。

必测项：

- 捕获完整 command、environment scope、working directory、exit code、stdout、stderr；
- 断言 stream frame type、顺序和 correlation id，而不是只看最终文本；
- 包含 tool deny、malformed provider event、timeout、abort、stderr noise 的失败 fixture；
- 命令会启动 subprocess/sidecar 时必须检查 cleanup；
- 如果 stream 驱动 TUI/WebUI，要把 CLI transcript 连接到可见画面。

项目证据：

- Codex 有 `codex exec`、JSON/event processor、apply-patch test、sandbox policy test、SSE fixture 和 app-server protocol test。
- OpenClaw 有 CLI backend live Docker lane 与 gateway RPC/protocol test。
- Hermes 有 Python CLI test、gateway command test，以及会清理 credential-shaped env var 的 canonical pytest runner。

反模式：

- 用模型最终回复替代 stdout/stderr 证据；
- 只测成功输出，不测非零退出；
- retry 后不保留第一次 provider/network 失败。

## TUI playbook

只要 Agent 有持续 terminal UI，就应该做 TUI-specific test，即使同一产品也有 CLI 命令。

必测项：

- 渲染多个 viewport：窄屏、标准 80x24、较大终端；
- snapshot 覆盖 history cell、diff block、status/footer row、model/session picker、queued input、permission overlay、error state；
- 模拟 Enter、Esc、Ctrl-C、navigation、slash command、paste、resize、image/file row、interrupt；
- 项目支持时验证 ANSI color、Unicode width、emoji、CJK、数学符号、OSC52 clipboard、terminal mode transition、scroll/virtual height；
- 每个重要可见状态都要能追溯到 runtime transcript：tool call id、permission request id、MCP status、command output、stream event 或 session id。

项目证据：

- Codex 使用 ratatui/insta snapshot 覆盖 approval overlay、footer state、chat widget layout、request-user-input form、MCP elicitation、model picker width、小高度 terminal、remote image row、Ctrl-C/Esc footer mode。
- Hermes `ui-tui` 用 Vitest 覆盖 terminal parity、viewport store、virtual history、OSC52、clipboard、terminal mode、streaming markdown、slash parity、gateway client、session lifecycle、queue handling、state isolation。
- Claude Code 本地快照暴露了 Ink TUI、command `.tsx` view、remote permission bridge、remote session manager、SDK stream adapter 和 synthetic tool confirmation row。因为快照没有 package/workflow metadata，QC 只能要求 interface evidence，不能编造 CI 覆盖。

反模式：

- 用从未渲染 terminal frame 的纯 component unit test 证明 TUI ready；
- 只测试宽屏终端；
- 不区分 Ctrl-C interrupt 与 Ctrl-C quit；
- 只验证最终 assistant message，忽略 approval、streaming、queued、cancelled state。

## WebUI playbook

当 Agent 暴露 dashboard、admin console、browser workbench、extension UI、QA lab 或 report viewer 时使用 WebUI 测试。

必测项：

- component test 覆盖 routing、state transition、settings、command palette、chat view、tool card、config form、report table、empty/error/loading state；
- browser-mode 或 Playwright test 覆盖 focus、keyboard navigation、markdown rendering、external link、image/media preview、drag/drop、browser-only API、route reload/resume；
- 每次 smoke/E2E 都保存 console 和 network log；
- live-provider 前先做 fake-provider integration；
- UI 能审批 tool、secret、外部动作或 destructive operation 时，必须覆盖 accessibility 与 keyboard navigation。

项目证据：

- OpenClaw 明确分离 unit/integration、e2e、live、UI、TUI、channel、extension、contract、performance、Docker、QA Lab lane。它的 `ui` package 有 browser-playwright 风格覆盖，`extensions/qa-lab` 包含 scenario catalog、web runtime、browser runtime、suite summary JSON 和 report test。
- Lime 有 workspace、provider settings、skills、browser runtime panel、MCP tools、resources、settings、artifacts、chat shell 等 React/Vite component test；但产品 GUI 证明仍然需要 GUI smoke 或 Playwright 证据。
- Hermes 有 Vite/React `web` dashboard package，后端 browser/tool 测试覆盖 browser supervisor、CDP、Camofox、SSRF 和 web provider。

反模式：

- 后端测试通过就宣称 WebUI ready；
- 不保存 browser console/network 证据；
- 用 fallback mock 掩盖未实现 bridge；
- 只测 happy route，不测 reload、resume、empty、error、permission-denied state。

## Desktop GUI playbook

当 Agent 跑在 Tauri、Electron、native app shell 或 WebView 中时，使用 desktop GUI 测试。

必测项：

- 通过项目支持的入口启动或复用真实 app shell；
- 判断页面前等待 bridge health；
- 证明 default workspace/session readiness，而不只是窗口创建；
- 记录 OS、windowing mode、sandbox、real backend vs mock bridge、first-run 假设；
- 对变更过的用户 flow 保存 screenshot 或 trace；
- GUI 调用 native command 或 typed bridge 时必须运行 contract check。

项目证据：

- Lime 明确规定：GUI deliverability 不能只由 `lint`、`typecheck` 或 unit test 证明。它的 desktop pass 组合 `verify:local`、`test:contracts`、`verify:gui-smoke`、`bridge:health`、workspace readiness、browser-runtime smoke 和真实 flow 的 Playwright continuation。
- OpenClaw 的 desktop/launcher 类 release path 通过 install smoke、Docker smoke、platform lane、control UI test 和 release check 组合验证，而不是一个单体视觉测试。

反模式：

- 把 WebView component test 当 desktop shell test；
- 不区分 DevBridge/native bridge 与 browser fallback mock；
- 跳过 first-run、workspace missing、native permission、restart、window lifecycle state。

## Browser automation playbook

当 Agent 控制浏览器、观察网页，或把工作交给 CDP/Playwright/browser-use/remote browser provider 时，使用 browser automation gate。

必测项：

- 记录 navigation target、viewport、user-agent/headless mode、cookie/session scope 和 provider；
- 同时保存 screenshot 与 DOM 或 accessibility snapshot，避免只靠视觉状态；
- 保存 console/network log，包括 blocked request 和 4xx/5xx response；
- 断言 cleanup：browser 已关闭或明确复用、page/tab 已释放、orphan reaper 通过；
- 包含 local SSRF、不安全文件访问、credential leakage、disallowed navigation 等安全 fixture。

项目证据：

- Hermes 有 browser supervisor、browser hardening、local SSRF、CDP override、browser console、Camofox state 和 web provider contract test。
- Lime 有 browser runtime 与 site adapter smoke，并有 Playwright MCP continuation 指导真实用户 flow。
- OpenClaw QA Lab 包含 browser runtime 与 web runtime test，用于 scenario execution 与 report surface。

反模式：

- 只有 screenshot；
- 没有 cleanup evidence；
- 没有 console/network log；
- 让 live website 造成不可复现 pass/fail，却没有 fixture 或 waiver。

## Channel 与 mobile UI playbook

用户通过 mobile app、QR login、chat app、webhook surface 或 provider-managed UI 交互时，使用 channel UI 测试。

必测项：

- live channel 前先 replay webhook 和 media fixture；
- 证明 auth scope：group vs DM、channel allowlist、mention rule、webhook secret、pairing token、QR session；
- 对 secret 和用户标识脱敏；
- 捕获 channel transcript 与 message id；
- mobile surface 要包含 device/emulator log；
- contract test 与 live provider test 必须分离。

项目证据：

- OpenClaw 有 channel contract lane、QR import Docker smoke、MCP channels Docker smoke、live transport QA Lab lane、Android node capability sweep，以及大量 channel-specific auth/media test。
- Hermes gateway test 覆盖 Discord、Feishu、Matrix、Mattermost、Telegram 风格 delivery、approval、restart/retry/dedup、queue、platform reconnect。

反模式：

- 只用真实 provider test 覆盖 channel；
- transcript 里记录 raw secret；
- 测了一个 channel 就假设所有 adapter 策略一致。

## Eval 与 report UI playbook

当 QC 输出本身成为产品时使用 eval UI 测试：QA dashboard、semantic eval report、human review console、model comparison 或 benchmark explorer。

必测项：

- 保存 rubric text 与 version；
- 记录 model/judge identity、baseline version、seed 或 sampling settings、prompt set；
- 包含 pass 与 fail 样例；
- 断言 report rendering、export shape、filter/sort、reviewer annotation；
- rubric 覆盖不完整时必须有人类 review note。

项目证据：

- OpenClaw QA Lab 有 scenario catalog、self-check、multipass、suite summary JSON、character/discovery/model-switch eval、report、live transport lane 和 web runtime。
- Agent Skills 建议用 clean context、assertion grading、human feedback、execution transcript 和迭代改进来评估 skill；Agent QC 采用同样的 evidence-first loop 来做项目 QC。

反模式：

- rubric 无版本；
- 没有 baseline delta；
- LLM judge output 没有 evidence refs；
- dashboard 看起来漂亮，但隐藏 failing case 或 waiver。

## 按项目形态的最小 surface suite

| 项目形态 | 必需 surface gate | 常见配套 gate |
| --- | --- | --- |
| Codex 类 runtime CLI | `cli-stream`，交互式产品还要 `tui` | `contract-protocol`、`runtime-e2e`、sandbox、SDK/API |
| Claude Code 快照类 TUI runtime | `tui`、stream adapter 的 `cli-stream` | remote permission contract、reconnect/cancel、SDK stream |
| OpenClaw 类 multi-channel gateway | `channel-ui`、`webui`、`cli-stream` | channel contract、live provider、Docker/install、secret redaction |
| Hermes 类 background agent | `cli-stream`、`tui`、`browser-automation`，启用 gateway 时还要 channel UI | scheduler stress、checkpoint/recovery、browser safety、Docker smoke |
| Lime 类 desktop GUI | `desktop-gui`、WebView panel 的 `webui`、有 browser runtime 时的 `browser-automation` | bridge contract、native command registration、workspace readiness、Playwright trace |
| Eval suite / QA lab | `eval-ui`，有 dashboard 时加 `webui` | semantic eval、reviewer loop、baseline diff、export schema |

## Waiver 规则

surface gate 只有在报告写清以下信息时才可 waiver：

- 精确缺失能力，例如 “no Windows runner” 或 “no real Telegram credential”；
- 被接受的风险；
- 过期时间或重新检查触发条件；
- 替代证据，如果有；
- 为什么该 release/change 仍可继续。

waiver 不能把只有截图的测试变成 runtime-backed surface pass。它只记录被接受的剩余风险。

## Agent UI 映射检查表

Agent UI 提供了可复用的 projection 检查表。每个 Agent QC `ui-interaction` case 都要问：项目正在证明哪个 Agent UI surface，以及哪个 runtime fact 支撑它。

| Agent UI surface | QC assertion |
| --- | --- |
| Composer | submit/queue/steer/interrupt controls 调用 owning runtime API，并显示 pending/failure state。 |
| Message parts | final answer text 与 reasoning、tool progress、diagnostics、artifact refs、evidence refs 分离。 |
| Runtime status | first status、blocked、retrying、failed、cancelled、done states 来自 runtime events。 |
| Tool UI | tool start、安全 args summary、progress、output ref、error 都保留 tool call id。 |
| Human-in-the-loop | approval/input request 包含 id、scope、consequence、response 和 runtime confirmation。 |
| Task capsule | queued/background/subagent/team work 有 stable task/agent ids 和 visible ownership。 |
| Artifact workspace | artifact preview/edit/export 使用 artifact facts，而不是复制 assistant prose。 |
| Timeline/evidence | trace、replay、verification、review、audit refs 持久且可检查。 |
| Session/tabs | old-session hydration 先显示 shell 与 recent state，不猜测缺失详情。 |
| Team workbench | coordinator、worker、remote、background、handoff、review states 不被压扁成一个 assistant。 |

这张表不是视觉设计要求，而是 fact ownership 要求。

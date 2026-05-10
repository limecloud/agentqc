---
title: 流程与分类
description: Agent QC 生命周期、profiles、surfaces、gates、evidence 与 verdict 分类参考。
---

# 流程与分类

本页是 Agent QC 的完整生命周期和分类参考。它沿用 Agent UI 的规范写法：明确维度、字段、约束、生命周期阶段和验证案例。

## 核心契约

Agent QC 是 Agent 项目质量的证据协议。兼容的 QC 计划会分类拥有的风险、选择门禁、执行检查、保存证据并输出 verdict，而不是把模型文字当证明。

兼容 QC 报告必须：

- 分类一个或多个 project profiles；
- 涉及用户可见行为时命名 interaction surfaces；
- 把每个 required gate 映射到本地命令、CI job、qcloop item 或 review step；
- 为每个 pass/fail/blocked/exhausted/waived verdict 保留可检查 evidence refs；
- 分离 deterministic、runtime、surface、live-provider、release 和 semantic-eval 声明；
- 明确写出限制和 waivers。

兼容 QC 报告不能：

- 把最终 assistant answer 当作证据，除非它链接了证据工件；
- 从 UI 文本推断 runtime 成功；
- 把 live-provider 调用藏进默认确定性测试；
- 把 screenshot、trace、terminal snapshot、protocol transcript 混成一句“UI 已检查”；
- 在 required evidence 缺失时宣称 gate 通过。

## 生命周期概览

```text
change or release scope
  -> classify profiles
  -> identify touched surfaces
  -> assign fact owners and risk owners
  -> select gate lanes
  -> write behavior-level cases
  -> execute deterministic gates
  -> execute runtime and surface gates
  -> opt into live/release/eval gates when required
  -> collect evidence refs
  -> issue verdicts
  -> publish report, waivers, and next action
```

这个流程适用于 CLI agents、SDK、MCP/tool gateways、channel bots、TUI/GUI/WebUI products、browser automation systems、schedulers、skills/plugins、distribution packages 和 eval suites。

## 分类维度

### Project profile

Profile 描述项目拥有的形态。

| Profile | 拥有 | 默认风险 |
| --- | --- | --- |
| `agent-runtime-cli` | agent loop、CLI、task execution、sandbox、tools、resume | stream drift、permissions、subprocess cleanup、resume consistency |
| `agent-sdk-api` | public SDK、generated client、API wrappers | signature drift、async cancellation、fake-server behavior |
| `agent-tool-mcp-gateway` | tool declarations、MCP/ACP bridge、connector runtime | protocol conformance、stdio/http recovery、resource permission |
| `multi-channel-agent-gateway` | chat/channel adapters、webhooks、auth、media | identity、webhook verification、media routing、secret redaction |
| `agent-ui-tui-desktop` | GUI、TUI、desktop shell、browser-visible flows | projection drift、stale success、bridge readiness、screenshots/traces |
| `agent-skills-plugins` | skills、plugins、manifests、loaders、marketplace | manifest drift、package boundary、trust policy、fixture install |
| `background-agent-scheduler` | cron、queues、workers、retries、long-running agents | duplicate work、lost checkpoints、race、stuck loop |
| `agent-distribution-release` | package、Docker、installers、cross-platform release | missing files、broken clean install、lock drift、supply chain |
| `agent-evals-quality` | task quality、model behavior、rubrics、generated outputs | prompt drift、judge instability、baseline regression、grounding gap |

### Interaction surface

Surface 描述行为在哪里被观察到。

| Surface | 使用场景 | 必需证据 |
| --- | --- | --- |
| `cli-stream` | stdout/stderr、JSONL/NDJSON、command UI | command、exit status、transcript、structured sample |
| `tui` | terminal UI、Ink、ratatui、curses | viewport、key sequence、terminal snapshot、runtime transcript |
| `webui` | browser dashboard、extension UI、QA/admin console | screenshot/trace、console log、route/state assertion |
| `desktop-gui` | Tauri、Electron、native shell | shell start、bridge health、workspace/session readiness、OS note |
| `browser-automation` | CDP、Playwright、browser-use、remote browser | DOM/a11y、screenshot、console/network、cleanup proof |
| `channel-ui` | chat app、QR、mobile、webhook-visible flows | channel transcript、media fixture、auth/webhook replay、redaction |
| `eval-ui` | QA dashboards 和 eval reports | rubric、judge output、baseline delta、reviewer note |

### Gate family

Gate family 描述验证方式，不是框架名称。

| Family | 默认用途 | 升级条件 |
| --- | --- | --- |
| `static` | format、lint、type、schema、dependency hygiene | generated files 或 policy boundaries 变化 |
| `unit` | deterministic local behavior | algorithms、parsers、reducers、adapters 变化 |
| `property-fuzz` | invariants 和 generated input | parser、sandbox、path、protocol、serializer 风险高 |
| `contract-protocol` | schema/API/command/tool surfaces | wire shape、manifest、command 或 SDK shape 变化 |
| `fake-integration` | local fake server 或 adapter flow | 外部 API 行为被模拟 |
| `runtime-e2e` | 无 live provider 风险的真实 CLI/task/session | loop、tool、permission、resume、subprocess flow 变化 |
| `ui-interaction` | GUI/TUI/WebUI/browser/channel 可见行为 | 用户或运维会看到改动 |
| `live-provider` | 显式 opt-in 的真实网络/model/channel path | provider/channel 行为属于声明的一部分 |
| `stress-concurrency` | races、queue、leases、retries、long runs | scheduler、parallel agents、workers 或 locks 变化 |
| `distribution-release` | package/install/Docker/OS matrix | 有任何对外发布物变化 |
| `semantic-eval` | task quality、prompt、rubric、judge | model 行为或输出质量是产品本身 |
| `review` | human/LLM review | 需要 safety、policy、UX 或语义判断 |

### Evidence kind

| Kind | 例子 | 必须包含 |
| --- | --- | --- |
| `command-log` | shell output、CI step、cargo/npm/pytest/vitest output | command、exit status、environment note |
| `test-report` | JUnit、JSON、coverage、HTML report | suite id、failing ids、artifact path 或 URL |
| `protocol-transcript` | fake server、MCP/ACP、WebSocket、HTTP transcript | request/response refs、redaction note |
| `runtime-transcript` | CLI JSONL、TUI-linked events、session state | run/session ids、event order、cleanup |
| `surface-artifact` | screenshot、video、Playwright trace、terminal snapshot | viewport/device/OS、action sequence |
| `browser-diagnostic` | console、network、DOM/a11y snapshot | route、selector 或 accessibility assertion |
| `release-artifact` | package manifest、tarball list、Docker smoke | version、platform、install command |
| `eval-artifact` | rubric、judge output、baseline diff | dataset、model/judge、threshold |
| `review-note` | human 或 LLM review | reviewer、scope、evidence refs、decision |
| `qcloop-run` | attempt 和 QC round refs | item value、attempt id、verifier feedback |

### Verdict status

| Status | 含义 | 必需字段 |
| --- | --- | --- |
| `passed` | 证据证明所有 required expectations | evidence refs 和 scope |
| `failed` | 证据否定 expectation 或 gate 失败 | 最小可行动失败和 evidence |
| `blocked` | 缺环境、凭证、依赖、fixture 或 binary，无法判断 | blocker 和 owner |
| `exhausted` | 尝试或预算结束但没有证明 | attempt refs 和 remaining uncertainty |
| `waived` | 负责人接受已知缺口 | approver、reason、scope、expiry |
| `needs-review` | 有证据但还需要语义/安全 review | reviewer 或 review queue |
| `skipped` | 当前 scope 不适用 | reason 和 scope |

## Fact owners

Agent QC 应说明每个事实由谁拥有，而不是让报告拥有一切。

| Owner | 拥有 | QC 职责 |
| --- | --- | --- |
| Runtime | task/session/tool/permission state | 采集 transcript 和 state refs |
| Protocol/SDK | schemas、generated clients、adapters | 采集 contract diff 和 fake transcript |
| UI projection | visible rendering 和 user controls | 采集 surface artifact 并连接 runtime |
| Evidence service | durable traces、replay、reviews | 链接 evidence ids 和 export jobs |
| Policy/security | approvals、waivers、credentials、retention | 记录 risk decision 和 scope |
| Artifact/release | deliverables、package contents、versions | 采集 manifest 和 install proof |
| Scheduler | leases、checkpoints、retries、workers | 采集 timeline 和 duplicate-work proof |
| Eval system | rubrics、judge outputs、baselines | 采集 dataset、threshold 和 deltas |

## 标准 case envelope

即使 JSON schema 允许扩展，可移植的 `qc_case` 也应携带这些字段。

| Field | Required | Purpose |
| --- | --- | --- |
| `id` | yes | stable case id |
| `project_profile` | yes | taxonomy 中的一个 profile |
| `surface` | visible case 推荐 | observation surface |
| `target` | yes | file、command、package、flow、API 或 release target |
| `risk_owner` | recommended | runtime、protocol、UI、scheduler、release、eval、policy |
| `required_gates` | yes | 要满足的 gate families |
| `steps` | yes | 可复现命令或交互 |
| `expected` | yes | 行为级期望 |
| `required_evidence` | yes | verdict 需要的工件 |
| `live_policy` | conditional | opt-in、credential scope、redaction、budget |
| `waiver_policy` | conditional | owner、reason、expiry rules |
| `verdict` | after run | status 和 evidence refs |

## 标准 report envelope

可移植 QC 报告应回答：

| Field | Question |
| --- | --- |
| Scope | 判断的是哪个 change、release 或 regression sweep？ |
| Profiles | 哪些 project profiles 适用？ |
| Surfaces | 哪些用户/运维表面被触碰？ |
| Required gates | 哪些 gates 必须运行，为什么？ |
| Executed gates | 跑了哪些 commands、CI jobs、qcloop runs 或 reviews？ |
| Evidence refs | logs、traces、screenshots、transcripts、reports、reviews 在哪里？ |
| Verdicts | 哪些 case passed、failed、blocked、exhausted、waived 或 needs review？ |
| Remaining risk | 还有什么不应宣称完成？ |
| Next action | 修复、重跑、review、release 还是 waive？ |

## 标准自身的验证案例

项目只有能表达以下案例，才能宣称兼容 Agent QC：

1. Codex-like runtime permission denial，带 CLI transcript、protocol event 和 TUI row。
2. Claude Code-like remote permission request，带 WebSocket/control transcript 和 TUI prompt。
3. OpenClaw-like channel webhook replay，带 media fixture 和 redacted credential policy。
4. Hermes-like scheduler restart，带 deterministic time、checkpoint 和 duplicate-work proof。
5. Desktop GUI native-bridge change，带 bridge health、workspace readiness、screenshot 和 command-contract proof。
6. Browser automation flow，带 DOM/a11y、screenshot、console/network 和 cleanup evidence。
7. Release smoke，带 package manifest、clean install 和 platform note。
8. Semantic eval regression，带 rubric、judge output、baseline delta 和 reviewer note。

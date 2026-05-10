---
title: 验收场景
description: 覆盖 runtime、UI、channel、scheduler、release 和 eval 项目的行为级 Agent QC 场景。
---

# 验收场景

Agent QC 验证行为和证据，而不是只验证仓库形状。可用于手工 QA、自动化测试、qcloop batch、CI gates 或 release review。

只有证据证明行为时，场景才通过。缺证据的场景应是 `blocked`、`exhausted`、`waived` 或 `needs-review`，不是 passed。

## 1. Runtime CLI permission boundary

1. 用户或测试触发 unsafe tool/command action。
2. Runtime 发出带 stable id 的 permission 或 policy decision。
3. 动作被拒绝或需要审批。
4. 没有 unauthorized side effect。
5. CLI/TUI/WebUI 显示 controlled error 或 pending approval。

通过条件：denied action 可见、可关联、无副作用。

证据：command transcript、policy event、side-effect check、可见时的 surface artifact。

## 2. Tool 或 MCP transport recovery

1. stdio/http/WebSocket tool server 断开或返回错误。
2. Runtime 暴露 failure 以及 recovery 或 terminal failure。
3. Tool state 不污染下一次调用。
4. UI/TUI 在 final answer text 外展示失败。

通过条件：recovery 和 failure 可检查，且不伪造成功。

证据：protocol transcript、retry log、tool id correlation、surface frame。

## 3. SDK/API contract drift

1. Public SDK 或 generated client shape 变化。
2. 运行 schema/generation check。
3. fake server 或 fixture 验证新契约。
4. 旧不兼容行为已迁移或明确 versioned。

通过条件：contract drift 在 runtime 或 UI 声明前已 review。

证据：schema diff、generated artifact check、fake server transcript。

## 4. CLI stream final reconciliation

1. Runtime streaming partial text/tool events。
2. Runtime 发出 final message 或 terminal status。
3. CLI output 或 consumer 对 final content 去重/对账。
4. Exit code 与 terminal status 一致。

通过条件：没有重复 final text、隐藏 tool failure 或错误 exit status。

证据：stdout/stderr transcript、structured event sample、exit code。

## 5. TUI first status and interrupt

1. 用户提交 prompt。
2. Listener 在 submit 前或 first runtime event 前绑定。
3. Runtime accepted 时 status 先于 answer text 出现。
4. 支持时 interrupt/cancel 可用。
5. Interrupt 停止 run 且没有 orphan subprocesses。

通过条件：用户能看出 agent 活着，并能安全停止。

证据：pseudo-terminal transcript、terminal snapshot、runtime transcript、cleanup proof。

## 6. TUI tool and permission overlay

1. Runtime 发出带 stable tool id 的 tool start。
2. TUI 显示安全 input summary 和 progress。
3. Runtime 为高风险动作发出 action request。
4. 用户 approve、reject、edit 或 answer。
5. TUI 只在 runtime confirmation 后标记 resolved。

通过条件：tool progress 和 approval state 可见、可关联、可审计。

证据：terminal snapshot、key sequence、action request/response transcript。

## 7. WebUI reload and stale state

1. 用户打开 running 或最近 completed session。
2. WebUI 渲染 route shell 和当前 status。
3. Page reload 或 route revisit 不伪造成功。
4. 缺失事实渲染为 `unknown`、`unavailable`、`stale` 或 `blocked`。

通过条件：reload/resume 保持 runtime truth 和安全 fallback states。

证据：browser trace、screenshot、console/network log、runtime state ref。

## 8. Desktop GUI bridge readiness

1. App shell 通过支持的 entrypoint 启动或复用。
2. 判断页面前检查 bridge health。
3. 证明 default workspace/session readiness。
4. 用户可见流程带 screenshot/trace。
5. 触碰 native command 时同步 command contracts。

通过条件：desktop readiness 不止由 component tests 证明。

证据：shell log、bridge health、workspace readiness、screenshot/trace、OS note。

## 9. Browser automation safety and cleanup

1. Agent 打开或控制 browser session。
2. 测试记录 URL、viewport、provider 和 session scope。
3. DOM/a11y 与 screenshot 证明 observed state。
4. 检查 console/network logs。
5. browser/tabs/processes 被关闭或有意复用。

通过条件：observation、safety 和 cleanup 都被证明。

证据：screenshot、DOM/a11y、console/network、cleanup/orphan proof。

## 10. Channel gateway auth and media

1. Channel adapter 接收带 auth context 和 media 的 webhook/message。
2. Gateway 在解析用户内容前验证 identity。
3. Media 按 policy 存储或拒绝。
4. Response transcript 已脱敏且可追踪。
5. 如使用 live channel path，必须 opt-in。

通过条件：identity、media 和 response behavior 被证明且不泄密。

证据：webhook replay、media fixture、redacted transcript、auth decision。

## 11. Queue and steer distinction

1. Run 正在 active。
2. 用户发送另一个 prompt 或 control action。
3. 系统区分 queue-next 和 steer-current。
4. Runtime 发出稳定 queued/steer ids。
5. Surface 显示 pending state 和最终 resolution。

通过条件：用户能区分“稍后运行”和“改变当前运行”。

证据：runtime events、UI/TUI snapshot、queue state transcript。

## 12. Artifact handoff and evidence export

1. Runtime 创建或更新 artifact。
2. UI/CLI 链接 compact artifact reference。
3. Artifact details 通过 artifact service 或 durable path 打开。
4. Evidence export 创建 durable refs。
5. Report 把 artifact/evidence ids 连接到 producing case。

通过条件：deliverables 和 evidence 离开 chat body，成为可追踪 artifacts。

证据：artifact path/id、export log、screenshot/report link。

## 13. Old-session recovery

1. 用户打开 old session/task/thread。
2. Shell 或 summary 不等 full history 就出现。
3. Recent messages/status 先于 heavy details hydrate。
4. Tool output、artifacts、evidence 按需加载。
5. Stale 或 missing facts 保持显式。

通过条件：old sessions 可用，且不猜测 missing truth。

证据：timing metrics、screenshot、hydration log、cursor/page refs。

## 14. Background scheduler restart

1. Scheduled/background task 启动并写 checkpoint 或 lease。
2. Owner 中断或 process restart。
3. New owner 按 policy reclaim 或 resume。
4. 防止 duplicate 和 lost work。
5. Final state 包含 cleanup 和 ownership evidence。

通过条件：restart 不重复、不丢失、不隐藏工作。

证据：deterministic clock/env、checkpoint、lease timeline、worker logs。

## 15. Parallel worker fanout/fanin

1. Coordinator 启动多个 independent workers/subagents/tasks。
2. 每个 worker 有 stable id、role、parent 和 status。
3. Partial success、failure、retry、wait states 保持可见。
4. Final synthesis 链接 worker results，且不改写 authorship。

通过条件：parallel work 可见、可恢复、可审计。

证据：delegation graph、worker transcripts、final evidence refs。

## 16. Remote agent or teammate handoff

1. Runtime 连接 remote agent 或把 work 交给另一个 teammate。
2. UI/TUI 显示 remote task id、owner、reason、auth/input needs 和 status。
3. Input/auth required states 提升为 user controls。
4. idle/transient state 不被当成 completion。

通过条件：remote ownership 和 completion truth 被保留。

证据：remote protocol transcript、task card snapshot、handoff log。

## 17. Eval regression and report UI

1. Prompt/eval suite 对 current behavior 和 baseline 运行。
2. 记录 rubric 和 judge/model settings。
3. Report 显示 pass/fail examples 和 baseline delta。
4. Reviewer 可以检查 raw outputs 和 waivers。

通过条件：semantic quality claim 有可比较证据支撑。

证据：dataset/rubric、judge output、baseline delta、report screenshot/export。

## 18. Distribution install smoke

1. Release package/image 已构建。
2. Clean environment 安装或启动它。
3. Version/help/minimal runtime command 可用。
4. Package contents 匹配 manifest。
5. 记录平台限制。

通过条件：shipped artifact 在 source tree 外可用。

证据：package manifest、install log、Docker/OS matrix、version output。

## 19. Live provider opt-in

1. Case 声明 live provider/channel/model requirement。
2. Credentials 已 scope 且 redacted。
3. 记录 budget/timeout。
4. Request/response 或 provider transcript 安全存储。
5. Failure 不被 retry 到不可见。

通过条件：live behavior 被证明，且不污染 deterministic lanes。

证据：opt-in flag、redacted transcript、budget note、provider id。

## 20. qcloop repeated QC

1. Plan 创建 independent qcloop items。
2. 每个 item 包含 profile、surface、gates、expected result 和 evidence policy。
3. Attempts 和 verifier rounds 被保留。
4. Exhausted items 保持 `exhausted`，不是泛化 failed。
5. Aggregate report 写清 remaining risk。

通过条件：重复提高覆盖率，但不隐藏 required project gates。

证据：qcloop job id、item values、attempts、verifier feedback、verdict refs。

## 21. Waiver and blocked path

1. Required gate 无法运行或被明确 defer。
2. Report 记录 missing fact、owner、scope 和 risk。
3. Waiver 包含 approver、reason、expiry 和 follow-up。
4. Release 或 next action 不把 waived gate 称作 passed。

通过条件：不完整证明可见且可追责。

证据：waiver object、blocker note、replacement evidence、follow-up link。

## Scenario selection guide

| Project shape | Must include |
| --- | --- |
| Codex-like runtime CLI | scenarios 1, 2, 4, 5, 18 |
| Claude Code-like TUI runtime | scenarios 5, 6, 11, 16, 21 |
| OpenClaw-like channel/WebUI gateway | scenarios 7, 9, 10, 17, 18, 19 |
| Hermes-like background/browser agent | scenarios 9, 14, 15, 18, 19 |
| Desktop GUI / native bridge | scenarios 7, 8, 9, 12, 21 |
| Eval/QA lab | scenarios 17, 20, 21 |

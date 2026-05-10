---
title: 最佳实践
description: 编写 Agent QC 计划、门禁、证据和报告的实践规则。
---

# 最佳实践

这页是 Agent QC 计划的编写检查表。它吸收 Agent UI 的 runtime-first 思路、Agent Skills 的渐进披露文档风格，以及 runtime CLI、TUI Agent、multi-channel gateway、background/browser agent、desktop client 和 eval system 中观察到的测试组织方式。

Agent QC 是标准协议，不是单一产品检查表。

## 从拥有的风险开始

先判断项目拥有什么风险，再选择命令。

好的写法：

> 这次改动触碰运行时权限边界和 TUI 审批表面，计划需要 `contract-protocol`、`runtime-e2e` 和 `ui-interaction` 证据。

不好的写法：

> 这是 TypeScript 项目，所以 Vitest 就够了。

常见风险拥有者如下：

| 风险拥有者 | 典型证明 |
| --- | --- |
| Runtime | 命令 transcript、stream 事件、清理证明、状态快照 |
| 协议或 SDK | schema diff、fake server transcript、生成客户端检查 |
| 工具或 MCP 网关 | 声明、权限、进度、结果、恢复 transcript |
| UI/TUI/WebUI/桌面端 | snapshot、screenshot、trace、a11y 输出、console log |
| 浏览器自动化 | DOM/a11y snapshot、screenshot、console/network log、清理证明 |
| 频道网关 | webhook replay、媒体 fixture、身份/auth 证明、脱敏 |
| 调度器 | 确定性时钟、lease/checkpoint、restart/reclaim、防重复工作 |
| 发行 | package manifest、干净安装、Docker smoke、OS matrix、lock/security |
| 评测质量 | rubric、baseline delta、judge output、reviewer note |

## 让判定由证据拥有

QC 报告不能从最终文字推断通过。Verifier 可以总结，但 verdict 必须由证据支撑。

每个通过项都需要：

- 行为描述；
- 门禁族；
- 命令或交互步骤；
- 期望结果；
- evidence refs；
- verdict status；
- 未完成风险或 waiver。

如果唯一证明是“Agent 说它检查过”，状态应是 `needs-review` 或 `blocked`，不是 `passed`。

## 分离确定性、真实服务和发行门禁

不要把昂贵或不稳定的风险藏在普通单测里。

| Lane | 默认运行 | 典型证据 | 常见反模式 |
| --- | --- | --- | --- |
| 确定性 | 是 | lint/type/unit/contract/fake-server logs | 单测里偷偷用 live key |
| Runtime | 通常是 | CLI/task/session transcript 和清理证明 | 只靠组件测试判断 runtime |
| Surface | 用户可见时 | TUI snapshot、Playwright trace、screenshot、console log | 只有截图，没有 runtime transcript |
| Live provider | 显式 opt-in | 脱敏请求/响应、预算、凭证范围 | live 调用藏在 `npm test` 里 |
| Release | 发版前 | package/Docker/install/OS matrix 输出 | 只有源码测试 |
| Review/eval | 语义质量相关时 | rubric、judge output、examples、reviewer | 没有 baseline 的 pass/fail |

OpenClaw 展示了显式 live 与 Docker lane。Hermes 展示了普通测试中清空 provider credential。Codex 展示了先用 fake server 和 fixture 验证，再谈 live/provider 声明。

## 把表面映射到 Agent UI 事实

Agent UI 给 Agent QC 最大的启发是 runtime-backed projection。可见表面本身不够；可见状态必须能连回拥有该事实的 runtime。

| Agent UI 表面 | Agent QC case 重点 |
| --- | --- |
| Composer | submit、queue、steer、interrupt、attachments、context chips |
| Message parts | final text 与 reasoning、tools、diagnostics、artifacts 分离 |
| Runtime status | first status before text、blocked/retrying/failed/done |
| Tool UI | tool id、安全参数摘要、progress、result、error、offload ref |
| Human-in-the-loop | approval/input id、scope、decision、runtime confirmation |
| Task capsule | queued/background/subagent status、ownership、failure、retry |
| Artifact workspace | artifact id、preview、version、diff、export、save failure |
| Timeline/evidence | trace、replay、verification、review、audit refs |
| Session/tabs | old-session restore、stale/hydrating、unread/running |
| Team workbench | coordinator、worker、handoff、review、remote/background teammate |

QC 规则：用户可见通过项应连接入口、用户动作、可见 frame、runtime event、evidence ref 和 cleanup。

## 诚实处理缺失事实

不要猜测，用明确状态：

- 环境、凭证、fixture 或二进制缺失时用 `blocked`；
- 尝试次数或预算耗尽但没有证明时用 `exhausted`；
- 有证据但仍需要语义、安全或争议审查时用 `needs-review`；
- 只有负责人带原因和过期时间接受缺口时才用 `waived`。

如果缺少 bridge/runtime 证据，不要因为 UI 看起来健康就写 `passed`。这适用于所有 Agent UI/TUI/WebUI 项目。

## 优先行为级场景

QC case 应像可复现的用户或运维流程，而不是文件清单。

好的 case：

> 用户拒绝高风险工具调用；runtime 记录拒绝，TUI 移除 pending approval，且没有副作用发生。

弱 case：

> Approval 组件存在。

行为级 case 应覆盖：

- happy path；
- deny 或 failed path；
- cancellation/interruption；
- reconnect/retry/recovery；
- stale 或 missing facts；
- old-session 或 resumed state；
- 相关时覆盖平台和 viewport 差异。

## 让 qcloop 保持窄而可检查

qcloop 最适合重复、独立的检查：多文件、多频道、多 provider、多命令变体或多 prompt/eval item。

每个 item 都能从自身输出和 evidence refs 判断时，适合 qcloop。不要用 qcloop 替代 bridge health、package install smoke、Playwright trace 收集或 live-provider opt-in policy 等项目门禁。

好的 qcloop item 包含：

- project profile；
- touched surface；
- gate family；
- 精确输入或命令；
- 期望行为；
- evidence policy；
- verifier rubric；
- pass/fail/blocked/exhausted/waived 的状态映射。

## 保持来源可追踪

标准页变化时，同步更新[来源索引](../reference/source-index)或案例研究页。本地仓库是案例，不是强制依赖。

| 层级 | 用途 |
| --- | --- |
| 公开规范 | Agent Skills、Playwright、Vitest、pytest、协议文档 |
| 本地案例 | Codex、Claude Code 本地快照、OpenClaw、Hermes、desktop GUI 和 release 示例 |
| 项目规则 | 某个产品的 scripts、CI、workflow 或 AGENTS 文件 |
| 证据工件 | command output、trace、screenshot、transcript、report |

## 使用渐进披露写法

沿用 Agent Skills 风格：入口短、字段和约束用表格、示例最小化、深入内容放参考页。

Agent QC 页面建议：

- quickstart 页负责选路径；
- authoring 页解释计划和证据怎么写；
- contract 页定义可移植字段和 verdict 约束；
- reference 页承载 taxonomy 和项目调研；
- example 页展示真实 plan 形状。

## 避免锁死单一框架

Agent QC 可以提到 Playwright、Vitest、pytest、cargo nextest、Bazel、Docker、qcloop、VitePress 示例，但标准要求的是证据形状。

好的写法：

> Browser UI 门禁应在失败时保留 trace/screenshot，并记录 console 或 network 证据。

不好的写法：

> 所有 Agent 项目必须使用同一份 Playwright config。

## Review checklist

发布 QC 计划或报告前检查：

| 问题 | 必须回答 |
| --- | --- |
| 标准是否绑定单一产品？ | 否；profiles 适用于所有 Agent 项目类型。 |
| 是否声明 project profiles？ | 至少声明一个 profile。 |
| 是否命名 touched surfaces？ | 用户可见 case 包含 `qc_case.surface`。 |
| 是否分离 gates？ | deterministic、runtime、surface、live、release、eval lane 分开。 |
| 证据是否可检查？ | 每个 pass/fail 连接 logs、reports、traces、transcripts、screenshots 或 review refs。 |
| 限制是否明确？ | 缺失 metadata、blocked credentials、本地假设都写明。 |
| waiver 是否可追责？ | 有 owner、reason、scope 和 expiry。 |
| qcloop 是否可重复？ | 重复 case 有稳定 item values 和 verifier rubrics。 |

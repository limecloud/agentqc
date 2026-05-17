---
title: 性能与可靠性指标
description: Agent QC 证据中的时延、稳定性、重试、清理与发行指标。
---

# 性能与可靠性指标

Agent 项目经常不是“完全死掉”，而是 queue、stream、tool、browser 或 background worker 卡住，同时界面看起来还活着。QC 证据应记录足够的时序和可靠性数据，解释体感慢和 flaky 行为。

Agent QC 不强制统一阈值。每个项目应按 profile 和风险定义阈值。

## Runtime 响应性

| Metric | 含义 | 适用 |
| --- | --- | --- |
| `submit_to_accept_ms` | 用户动作到 runtime 接受 | CLI、TUI、GUI、WebUI |
| `first_status_ms` | 第一个用户可见 runtime status | Agent UI/TUI/desktop |
| `first_text_delta_ms` | 第一个 model/user-facing text delta | streams 和 chat UIs |
| `first_tool_event_ms` | 第一个 tool start/progress event | tool/runtime gates |
| `interrupt_ack_ms` | interrupt/cancel 到 runtime ack | CLI/TUI/GUI |
| `resume_ready_ms` | old session 或 task resume 到可用 | sessions、schedulers |

这些指标来自 Agent UI 对 listener binding、runtime acceptance、first status、first text 和 paint timing 的分离。

## Stream 与 projection 健康

| Metric | 含义 | 证据 |
| --- | --- | --- |
| `event_sequence_gap_count` | 缺失或乱序 runtime events | protocol transcript |
| `delta_backlog_depth` | 未渲染 text/tool deltas 队列 | UI diagnostics |
| `oldest_unrendered_delta_ms` | 最老 pending delta 年龄 | UI diagnostics |
| `final_reconciliation_duplicates` | streamed/final text 重复次数 | transcript + surface artifact |
| `stale_success_count` | UI 在 runtime 确认前宣称成功 | runtime/UI comparison |
| `missing_fact_fallback_count` | `unknown`、`unavailable`、`stale` 或 `blocked` 投影次数 | UI snapshot/report |

## Tool 与权限可靠性

| Metric | 含义 | 证据 |
| --- | --- | --- |
| `tool_start_to_result_ms` | 每个 tool id 的耗时 | tool transcript |
| `tool_error_recovery_count` | tool 失败后的 retry/recovery 次数 | runtime transcript |
| `approval_pending_ms` | human-in-the-loop 状态耗时 | action transcript |
| `approval_correlation_failures` | request/response id 不匹配 | protocol test |
| `denied_side_effect_count` | 被拒动作仍产生副作用 | sandbox/process evidence |
| `orphan_process_count` | 遗留 subprocess/browser workers | cleanup evidence |

## Browser、WebUI、TUI 与桌面可靠性

| Surface | Metrics |
| --- | --- |
| `webui` | page load、first status paint、console error count、failed network count、trace size |
| `desktop-gui` | shell start、bridge health time、workspace readiness、native command timeout、mock fallback count |
| `tui` | first frame、redraw latency、viewport reflow failures、key handling failures、Unicode/ANSI rendering failures |
| `browser-automation` | navigation time、DOM ready、console/network errors、screenshot/trace success、cleanup/orphan count |
| `channel-ui` | webhook verification time、dedup count、media processing time、retry count、delivery ack time |

Playwright 风格项目应在失败时保留 trace/screenshot/video，并在相关时记录 browser project/device。Vitest browser-mode 或 component tests 可以证明组件行为，但 browser-only APIs 需要浏览器证据。

## Scheduler 与后台可靠性

| Metric | 含义 |
| --- | --- |
| `lease_reclaim_ms` | owner 中断后 reclaim work 的时间 |
| `checkpoint_age_ms` | 最近 durable checkpoint 的年龄 |
| `duplicate_job_count` | 同一 job id 被重复执行的次数 |
| `lost_job_count` | 截止时间前未执行的 scheduled jobs |
| `retry_attempt_count` | 每个 task 到 success/failure/exhaustion 前的尝试次数 |
| `worker_shutdown_ms` | worker 优雅退出时间 |
| `queue_depth` | 按 queue 或 priority 统计的 pending work |

Hermes 风格项目应在普通测试中固定 deterministic clock/env，并把 live provider/channel 检查放到显式 opt-in lane。

## Release 与 distribution 可靠性

| Metric | 含义 |
| --- | --- |
| `clean_install_ms` | fresh install 耗时 |
| `package_size_bytes` | package 或 image 大小 |
| `manifest_missing_count` | package 中缺失的 expected files |
| `version_mismatch_count` | package/app/Cargo/Tauri/version drift |
| `docker_smoke_ms` | Docker smoke 耗时 |
| `platform_failure_count` | OS matrix 失败数 |
| `lock_drift_count` | lockfile 或 generated artifact drift |

Codex 风格项目可能使用 Bazel/nextest/release binaries。OpenClaw 风格项目可能使用 Docker/install smoke 和 plugin release checks。Agent QC 只要求证据形状。


## Benchmark 与 hill-climbing 指标

| Metric | 含义 | 证据 |
| --- | --- | --- |
| `mean_reward` | task 或 trial 的平均 verifier reward | reward.json aggregate |
| `pass_rate` | trial 中通过的比例 | trial table |
| `pass_at_k` | k 次尝试中至少一次通过 | repeated trial set |
| `mean_reward_delta` | candidate reward 减 baseline reward | baseline/candidate summary |
| `timeout_rate` | 超时 trial 占比 | trial status 与 duration |
| `verifier_error_rate` | 与 agent 行为无关的 verifier 故障率 | verifier logs |
| `evidence_completeness_rate` | 包含必需 trajectory/reward/artifact refs 的 trial 占比 | evidence report |
| `cost_per_pass` | model/provider/runtime 成本除以 pass 数 | cost 与 reward summary |
| `tokens_per_trial` | 每个 trial 的 input/output/cache tokens | runtime/provider telemetry |
| `p0_qc_gate_regression_count` | benchmark 变好但必需 QC gate 回退的数量 | Agent QC report |

只有 benchmark 指标和必需 QC gates 同时支持时，candidate 才能算让产品质量变好。`mean_reward` 更高但 evidence completeness 更低，不是干净胜利。

## 建议阈值策略

QC 计划应定义：

| Threshold | Example |
| --- | --- |
| Local default | deterministic gates 必须不带 live credentials 通过 |
| Surface smoke | first status 或 bridge health 必须在产品阈值内出现 |
| Flake budget | 已知 flaky lane 的 retry count 和 rerun policy |
| Live budget | provider/channel cost、credential scope、timeout |
| Release budget | install time、package size、OS matrix、Docker smoke timeout |
| Waiver expiry | 缺失 metric 必须重新检查的 date/version |

## 证据建议

性能或可靠性 gate 失败时，保留：

- 启动 run 的 command 或 interaction；
- timestamps 和 environment；
- 慢或 flaky 片段周围的 trace/screenshot/transcript；
- retry 和 cleanup 结果；
- 该失败是阻塞 release、needs review 还是可 waiver。

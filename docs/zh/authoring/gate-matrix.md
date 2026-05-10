---
title: 门禁矩阵
description: 通用 Agent QC 门禁矩阵。
---

# 门禁矩阵

门禁矩阵把项目类型映射到默认验证边界。只有每个必需门禁都有可检查证据时，报告才能声明通过。

| 项目类型 | 最小门禁族 | 高风险升级门禁 |
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

表里的名称是门禁族，不是某个框架命令。每个项目要把门禁族映射到本地命令、CI job、qcloop item 或评审流程。

## 何时升级门禁

改动触及以下边界时，需要升级验证强度：

- 权限、沙箱、凭证或密钥处理；
- 协议或 wire format；
- 持久化状态、迁移、队列或调度器；
- 用户可见 GUI/TUI/终端渲染；
- 包、安装、发布元数据；
- live provider 或外部网络 API；
- prompt、rubric、eval 或 judge 行为。

## 最小证据

- `static` 需要命令日志、CI URL 或 SARIF 类报告。
- `contract-protocol` 需要 schema/contract 报告、协议 transcript 或失败 id。
- `runtime-e2e` 需要 CLI/runtime transcript、状态快照或进程清理证据。
- `ui-interaction` 需要稳定断言，并附截图、trace、视频或可访问性输出。
- `live-provider` 需要脱敏请求/响应、凭证范围和预算/成本说明。
- `distribution-release` 需要包 manifest、安装输出、Docker smoke 或 OS matrix 证据。
- `semantic-eval` 需要 rubric、model/judge 输出、baseline delta 和 waiver 阈值。

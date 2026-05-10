---
title: Lime 门禁矩阵
description: Lime 案例保留页；通用矩阵请看 Gate matrix。
---

# Lime 门禁矩阵

Lime 是一个 profile/example，不是 Agent QC 标准本身。通用矩阵请看[门禁矩阵](./gate-matrix)。

## Lime profile

Lime 主要映射到：

- `agent-ui-tui-desktop`
- `agent-tool-mcp-gateway`
- `agent-runtime-cli`
- `agent-skills-plugins`

## Lime-specific gates

Lime-specific gate 仍然适合作为案例：

- `verify:local`：本地 static/type/unit validation。
- `test:contracts`：frontend/Rust/mock/catalog command contract。
- `verify:gui-smoke`：GUI shell、bridge 和 workspace readiness。
- Playwright product flow：用户可见行为变更后的交互证据。

这些命令不是通用标准要求；通用标准只要求对应的 `static`、`contract-protocol`、`ui-interaction`、`runtime-e2e` 等 gate family 有证据。

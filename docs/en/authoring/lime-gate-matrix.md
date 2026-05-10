---
title: Lime profile gate matrix
description: Legacy Lime-specific profile page retained for v0.1.0 compatibility.
---

# Lime profile gate matrix

Lime is a profile/example, not the whole Agent QC standard. For the generic matrix, see [Gate matrix](./gate-matrix).

Lime maps mainly to:

- `agent-ui-tui-desktop`
- `agent-runtime-cli`
- `agent-tool-mcp-gateway`
- `agent-skills-plugins`

Lime-specific gates remain useful as an example:

| Lime risk | Generic gate family | Lime command |
| --- | --- | --- |
| ordinary local validation | `static` / `unit` | `npm run verify:local` |
| command/bridge/mock drift | `contract-protocol` | `npm run test:contracts` |
| desktop shell/workspace readiness | `ui-interaction` | `npm run verify:gui-smoke` |
| product path behavior | `ui-interaction` / `review` | Playwright or manual smoke |

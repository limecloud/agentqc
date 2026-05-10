---
title: 验收场景
description: 行为级 Agent QC 场景。
---

# 验收场景

Agent QC 验证行为和证据，而不是只验证仓库形状。

## 1. Runtime CLI 权限边界

runtime 阻止危险 tool action，返回受控错误，并把决策写入 transcript 或 log。

通过条件：被拒绝的动作可见，且没有发生未授权副作用。

## 2. Tool 或 MCP transport recovery

stdio/http tool server 断连、重连或返回错误。

通过条件：runtime 能暴露失败/恢复状态，且不会破坏 tool state。

## 3. Channel gateway auth 与 media

channel adapter 收到带 media 和 auth context 的 webhook 或消息。

通过条件：gateway 校验身份、执行 secret policy、安全存储 media，并发出可追踪响应。

## 4. UI/TUI streaming turn

用户发送 prompt 后，状态先于最终文本出现，tool progress 与 answer text 分离，并且 interrupt 仍可用。

通过条件：UI projection 不虚构 runtime success。

## 5. Background scheduler recovery

scheduled agent job 被中断或重启。

通过条件：lease/checkpoint 防止重复或丢失工作，证据显示最终 ownership。

## 6. Distribution install smoke

release package 或 Docker image 在干净环境中安装。

通过条件：version、help command、最小 runtime start 和 package contents 符合预期。

## 7. Semantic eval regression

prompt suite 同时对 current 和 baseline 行为运行。

通过条件：rubric assertion 改善或保持在可接受阈值内，并保留 judge output。

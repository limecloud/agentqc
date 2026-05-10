---
title: v0.5.0 概览
description: Agent QC v0.5.0 overview。
---

# v0.5.0 概览

Agent QC v0.5.0 为标准协议补充了更完整的测试手段层。它明确覆盖快照、冒烟、黑盒、白盒、灰盒、replay、chaos、安全对抗、runtime/UI/skills 测试，以及可复核的组合证据编织。

## Highlights

- 新增专门的[测试手段与组合](../../authoring/test-techniques-and-compositions) authoring 页面。
- 定义可复用证据编织：白盒不变量 -> 协议/契约 -> 黑盒运行 -> 表面工件 -> 清理/审查。
- 扩展 snapshot 标准，覆盖 text transcript、terminal frame、DOM/ARIA、screenshot/video、protocol/schema snapshot、runtime state 和 package manifest。
- 增加 import/build、runtime、surface、release 和 live canary 五层 smoke test。
- 补充 Agent runtime、Agent UI、skills/plugins、browser agent、channel gateway、scheduler、provider adapter 和 release artifact 的测试指导。
- 将通用文档改为产品无关协议表达；产品特定内容仅保留在旧链接兼容页、版本历史或明确示例中。

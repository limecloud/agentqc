import { defineConfig } from 'vitepress'

const base = process.env.VITEPRESS_BASE || '/'
const versions = ['0.5.0', '0.4.0', '0.3.0', '0.2.0', '0.1.0']

const enVersionItems = versions.flatMap((version) => [
  { text: `v${version} overview`, link: `/en/versions/v${version}/overview` },
  { text: `v${version} specification`, link: `/en/versions/v${version}/specification` },
  { text: `v${version} changelog`, link: `/en/versions/v${version}/changelog` }
])

const zhVersionItems = versions.flatMap((version) => [
  { text: `v${version} 概览`, link: `/zh/versions/v${version}/overview` },
  { text: `v${version} 规范`, link: `/zh/versions/v${version}/specification` },
  { text: `v${version} 变更记录`, link: `/zh/versions/v${version}/changelog` }
])

const enNav = [
  { text: 'Guide', link: '/en/what-is-agent-qc' },
  { text: 'Specification', link: '/en/specification' },
  { text: 'Best Practices', link: '/en/authoring/best-practices' },
  { text: 'Techniques', link: '/en/authoring/test-techniques-and-compositions' },
  { text: 'Benchmark', link: '/en/authoring/benchmark-and-hill-climbing' },
  { text: 'Examples', link: '/en/examples/codex-runtime-cli' },
  { text: 'Surfaces', link: '/en/authoring/interaction-surface-testing' },
  { text: 'Ecosystem', link: '/en/reference/agent-ecosystem' },
  { text: 'Version', items: [{ text: 'latest', link: '/en/specification' }, ...enVersionItems] }
]

const zhNav = [
  { text: '指南', link: '/zh/what-is-agent-qc' },
  { text: '规范', link: '/zh/specification' },
  { text: '最佳实践', link: '/zh/authoring/best-practices' },
  { text: '测试手段', link: '/zh/authoring/test-techniques-and-compositions' },
  { text: 'Benchmark', link: '/zh/authoring/benchmark-and-hill-climbing' },
  { text: '示例', link: '/zh/examples/codex-runtime-cli' },
  { text: '交互表面', link: '/zh/authoring/interaction-surface-testing' },
  { text: '生态', link: '/zh/reference/agent-ecosystem' },
  { text: '版本', items: [{ text: 'latest', link: '/zh/specification' }, ...zhVersionItems] }
]

const enSidebar = [
  { text: 'Start here', items: [
    { text: 'Overview', link: '/en/' },
    { text: 'What is Agent QC?', link: '/en/what-is-agent-qc' },
    { text: 'Specification', link: '/en/specification' }
  ] },
  { text: 'For QC authors', items: [
    { text: 'Quickstart', link: '/en/authoring/quickstart' },
    { text: 'Best practices', link: '/en/authoring/best-practices' },
    { text: 'Test techniques and compositions', link: '/en/authoring/test-techniques-and-compositions' },
    { text: 'Benchmark and hill climbing', link: '/en/authoring/benchmark-and-hill-climbing' },
    { text: 'Project classification', link: '/en/authoring/project-classification' },
    { text: 'Gate matrix', link: '/en/authoring/gate-matrix' },
    { text: 'Interaction surface testing', link: '/en/authoring/interaction-surface-testing' },
    { text: 'qcloop integration', link: '/en/authoring/qcloop-integration' },
    { text: 'Evidence-driven verdicts', link: '/en/authoring/evidence-driven-verdicts' },
    { text: 'Acceptance scenarios', link: '/en/authoring/acceptance-scenarios' }
  ] },
  { text: 'Contracts', items: [
    { text: 'Evidence contract', link: '/en/contracts/evidence-contract' },
    { text: 'Performance and reliability metrics', link: '/en/contracts/performance-and-reliability-metrics' }
  ] },
  { text: 'Reference', items: [
    { text: 'Glossary', link: '/en/reference/glossary' },
    { text: 'Agent project patterns', link: '/en/reference/agent-project-patterns' },
    { text: 'Flow and taxonomy', link: '/en/reference/flow-and-taxonomy' },
    { text: 'Star project testing systems', link: '/en/reference/star-project-testing-systems' },
    { text: 'Source index', link: '/en/reference/source-index' },
    { text: 'Agent standards ecosystem', link: '/en/reference/agent-ecosystem' }
  ] },
  { text: 'Examples', items: [
    { text: 'Codex runtime CLI', link: '/en/examples/codex-runtime-cli' },
    { text: 'Claude Code TUI runtime', link: '/en/examples/claudecode-tui-runtime' },
    { text: 'OpenClaw channel gateway', link: '/en/examples/openclaw-channel-gateway' },
    { text: 'Hermes background agent', link: '/en/examples/hermes-background-agent' },
    { text: 'qcloop batch', link: '/en/examples/qcloop-batch' }
  ] },
  { text: 'Versions', items: enVersionItems }
]

const zhSidebar = [
  { text: '开始', items: [
    { text: '概览', link: '/zh/' },
    { text: '什么是 Agent QC', link: '/zh/what-is-agent-qc' },
    { text: '规范', link: '/zh/specification' }
  ] },
  { text: 'QC 作者', items: [
    { text: '快速开始', link: '/zh/authoring/quickstart' },
    { text: '最佳实践', link: '/zh/authoring/best-practices' },
    { text: '测试手段与组合', link: '/zh/authoring/test-techniques-and-compositions' },
    { text: 'Benchmark 与 hill climbing', link: '/zh/authoring/benchmark-and-hill-climbing' },
    { text: '项目分类', link: '/zh/authoring/project-classification' },
    { text: '门禁矩阵', link: '/zh/authoring/gate-matrix' },
    { text: '交互表面测试', link: '/zh/authoring/interaction-surface-testing' },
    { text: 'qcloop 集成', link: '/zh/authoring/qcloop-integration' },
    { text: '证据驱动判定', link: '/zh/authoring/evidence-driven-verdicts' },
    { text: '验收场景', link: '/zh/authoring/acceptance-scenarios' }
  ] },
  { text: '契约', items: [
    { text: '证据契约', link: '/zh/contracts/evidence-contract' },
    { text: '性能与可靠性指标', link: '/zh/contracts/performance-and-reliability-metrics' }
  ] },
  { text: '参考', items: [
    { text: '术语表', link: '/zh/reference/glossary' },
    { text: 'Agent 项目测试模式', link: '/zh/reference/agent-project-patterns' },
    { text: '流程与分类', link: '/zh/reference/flow-and-taxonomy' },
    { text: '明星项目测试体系', link: '/zh/reference/star-project-testing-systems' },
    { text: '来源索引', link: '/zh/reference/source-index' },
    { text: 'Agent 标准生态', link: '/zh/reference/agent-ecosystem' }
  ] },
  { text: '示例', items: [
    { text: 'Codex runtime CLI', link: '/zh/examples/codex-runtime-cli' },
    { text: 'Claude Code TUI runtime', link: '/zh/examples/claudecode-tui-runtime' },
    { text: 'OpenClaw channel gateway', link: '/zh/examples/openclaw-channel-gateway' },
    { text: 'Hermes background agent', link: '/zh/examples/hermes-background-agent' },
    { text: 'qcloop 批次', link: '/zh/examples/qcloop-batch' }
  ] },
  { text: '版本', items: zhVersionItems }
]

export default defineConfig({
  base,
  title: 'Agent QC',
  description: 'A portable standard for evidence-driven quality control of Agent projects.',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'English', items: enNav },
      { text: '中文', items: zhNav }
    ],
    sidebar: { '/en/': enSidebar, '/zh/': zhSidebar },
    search: { provider: 'local' },
    footer: {
      message: 'Draft standard for evidence-driven quality control of Agent projects.',
      copyright: 'Copyright © 2026'
    }
  },
  markdown: { lineNumbers: true }
})

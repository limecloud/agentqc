import { defineConfig } from 'vitepress'

const base = process.env.VITEPRESS_BASE || '/'
const versions = ['0.1.0']

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
  { text: 'Examples', link: '/en/examples/lime-gui-change' },
  { text: 'Ecosystem', link: '/en/reference/agent-ecosystem' },
  { text: 'Version', items: [{ text: 'latest', link: '/en/specification' }, ...enVersionItems] }
]

const zhNav = [
  { text: '指南', link: '/zh/what-is-agent-qc' },
  { text: '规范', link: '/zh/specification' },
  { text: '示例', link: '/zh/examples/lime-gui-change' },
  { text: '生态', link: '/zh/reference/agent-ecosystem' },
  { text: '版本', items: [{ text: 'latest', link: '/zh/specification' }, ...zhVersionItems] }
]

const enSidebar = [
  {
    text: 'Start here',
    items: [
      { text: 'Overview', link: '/en/' },
      { text: 'What is Agent QC?', link: '/en/what-is-agent-qc' },
      { text: 'Specification', link: '/en/specification' }
    ]
  },
  {
    text: 'For test authors',
    items: [
      { text: 'Quickstart', link: '/en/authoring/quickstart' },
      { text: 'Lime gate matrix', link: '/en/authoring/lime-gate-matrix' },
      { text: 'qcloop integration', link: '/en/authoring/qcloop-integration' },
      { text: 'Evidence-driven verdicts', link: '/en/authoring/evidence-driven-verdicts' },
      { text: 'Acceptance scenarios', link: '/en/authoring/acceptance-scenarios' }
    ]
  },
  {
    text: 'Reference',
    items: [
      { text: 'Glossary', link: '/en/reference/glossary' },
      { text: 'Lime quality source index', link: '/en/reference/lime-quality-source-index' },
      { text: 'Agent standards ecosystem', link: '/en/reference/agent-ecosystem' }
    ]
  },
  {
    text: 'Examples',
    items: [
      { text: 'Lime GUI change', link: '/en/examples/lime-gui-change' },
      { text: 'Lime command bridge change', link: '/en/examples/lime-command-bridge-change' },
      { text: 'qcloop batch', link: '/en/examples/qcloop-batch' }
    ]
  },
  { text: 'Versions', items: enVersionItems }
]

const zhSidebar = [
  {
    text: '开始',
    items: [
      { text: '概览', link: '/zh/' },
      { text: '什么是 Agent QC', link: '/zh/what-is-agent-qc' },
      { text: '规范', link: '/zh/specification' }
    ]
  },
  {
    text: '测试作者',
    items: [
      { text: '快速开始', link: '/zh/authoring/quickstart' },
      { text: 'Lime 门禁矩阵', link: '/zh/authoring/lime-gate-matrix' },
      { text: 'qcloop 集成', link: '/zh/authoring/qcloop-integration' },
      { text: '证据驱动判定', link: '/zh/authoring/evidence-driven-verdicts' },
      { text: '验收场景', link: '/zh/authoring/acceptance-scenarios' }
    ]
  },
  {
    text: '参考',
    items: [
      { text: '术语表', link: '/zh/reference/glossary' },
      { text: 'Lime 质量事实源索引', link: '/zh/reference/lime-quality-source-index' },
      { text: 'Agent 标准生态', link: '/zh/reference/agent-ecosystem' }
    ]
  },
  {
    text: '示例',
    items: [
      { text: 'Lime GUI 改动', link: '/zh/examples/lime-gui-change' },
      { text: 'Lime 命令桥接改动', link: '/zh/examples/lime-command-bridge-change' },
      { text: 'qcloop 批次', link: '/zh/examples/qcloop-batch' }
    ]
  },
  { text: '版本', items: zhVersionItems }
]

export default defineConfig({
  base,
  title: 'Agent QC',
  description: 'A Lime-focused standard for evidence-driven agent quality control.',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'English', items: enNav },
      { text: '中文', items: zhNav }
    ],
    sidebar: {
      '/en/': enSidebar,
      '/zh/': zhSidebar
    },
    search: { provider: 'local' },
    footer: {
      message: 'Draft Lime-focused standard for evidence-driven agent quality control.',
      copyright: 'Copyright © 2026'
    }
  },
  markdown: { lineNumbers: true }
})

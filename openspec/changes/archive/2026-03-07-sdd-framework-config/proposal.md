## Why

平台当前硬编码使用 OpenSpec 作为唯一的 SDD 脚手架。随着团队可能采用 spec-kit、RFC-driven 等不同框架，需要在项目配置中支持选择 SDD 框架，并允许团队自定义各框架的 Spec 文档模板，以适配不同的研发规范和 CI 流程（如应用魔方的不同 pipeline 配置）。

## What Changes

- 项目配置页新增"SDD 框架"配置板块（作为 settings-page-nav 的新条目）
- 支持选择当前使用的 SDD 框架（OpenSpec / spec-kit / 自定义）
- 每个框架配有对应的 Spec 模板列表，用户可查看和编辑各模板内容
- 框架配置和自定义模板保存到 `projectConfig.sdd` 中（localStorage 持久化）
- AI 文档生成时，使用当前框架对应的模板结构生成内容

## Capabilities

### New Capabilities

- `sdd-framework-config`: 项目配置页的 SDD 框架选择与 Spec 模板管理板块

### Modified Capabilities

- `project-settings-page`: 新增"SDD 框架"导航项，nav sidebar 追加一条
- `settings-page-nav`: NAV_ITEMS 追加 `{ id: 'sdd', label: 'SDD 框架', icon: '📐' }`

## Impact

- `pm-ai-app/src/PMPlatform.jsx` — `ProjectSettingsPage` 组件新增 SDD 板块，`DEFAULT_PROJECT_CONFIG` 扩展 `sdd` 字段，`loadProjectConfig` / `saveProjectConfig` 同步更新
- `projectConfig` 数据结构扩展，新增 `sdd: { framework, templates }` 字段

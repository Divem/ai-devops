## Why

AI设计页面目前仅支持深色主题，在整体浅色主题的应用环境下视觉风格不一致。为了保持设计语言的统一性并满足不同用户的视觉偏好，需要为AI设计页面增加浅色模式支持，同时适配左侧树形导航的浅色主题样式。

## What Changes

- 为AI设计页面增加浅色主题样式变量和CSS适配
- 修改左侧文档树形导航组件，支持浅色/深色主题切换
- 确保AI设计页面与全局主题模式状态同步
- 树形导航在浅色主题下的hover、active、focus状态样式适配
- **BREAKING**: 树形导航组件的背景色和文本色可能从固定深色变为动态主题色

## Capabilities

### New Capabilities
- `ai-design-page-theme`: 为AI设计页面提供浅色/深色主题适配能力，包含页面整体布局、编辑器区域、预览区域的主题样式变量

### Modified Capabilities
- `doc-tree`: 修改文档树形导航组件，移除固定深色样式，接入主题系统支持浅色/深色切换

## Impact

- AI设计页面相关组件 (`pm-ai-platform_sdd.jsx`, `pm-ai-platform_sdd2.jsx`, `pm-ai-platform_vibe.jsx`)
- 文档树组件（位于各设计系统变体中）
- 主题状态管理（需接入全局theme context）
- 无需API变更或数据库迁移

## Why

项目配置页面目前将 AI 模型配置和 Git 仓库配置堆叠在一个长页面中，随着后续功能增加（如通知配置、权限管理、CI 集成等），页面将变得难以浏览。左侧导航菜单可以将各配置板块分区管理，提供清晰的结构和可扩展的入口。

## What Changes

- 在项目配置页面左侧新增垂直导航菜单（sidebar nav）
- 菜单项对应各配置板块：AI 模型配置、Git 仓库配置（后续可追加）
- 点击菜单项切换右侧内容区域（单页内路由，非跳转）
- 当前激活菜单项高亮显示
- 页面整体改为左右双栏布局（nav + content）

## Capabilities

### New Capabilities

- `settings-page-nav`: 项目配置页面的左侧导航菜单，支持多板块切换和高亮状态

### Modified Capabilities

- `project-settings-page`: 布局从单列改为左右双栏，内容区域改为按 activeSection 条件渲染

## Impact

- `pm-ai-app/src/PMPlatform.jsx` — `ProjectSettingsPage` 组件重构布局和状态
- 无外部依赖变更，无 API 变更

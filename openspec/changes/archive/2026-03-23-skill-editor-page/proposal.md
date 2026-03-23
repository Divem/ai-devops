# Proposal: Skill Editor Page

## Why

Skill 管理页面的"编辑"按钮当前直接跳转到项目配置页面（`setCurrentView('settings')`），用户需要在一个庞大的设置页面中找到 Skill 板块才能编辑。这破坏了用户心流，且无法聚焦于当前要编辑的 Skill。需要在 Skill 管理页面内提供独立的编辑体验。

## What Changes

- **新增**: Skill 编辑视图（内嵌在 SkillManagementPage 内），点击"编辑"后展开/切换到编辑面板
- **修改**: SkillManagementPage 支持列表/编辑两种视图模式切换
- **移除**: `onNavigateToSkillEditor` 跳转到 settings 页面的行为

## Capabilities

### New Capabilities
- `skill-inline-editor`: Skill 管理页面内置编辑器，支持查看/编辑 SKILL.md、references、scripts 文件，可用占位符提示，保存与恢复默认

### Modified Capabilities
- 无

## Impact

**代码影响**:
- `PMPlatform.jsx` — `SkillManagementPage` 组件：新增编辑视图（约 120 行），复用 ProjectSettingsPage 中已有的 Skill 编辑逻辑
- `PMPlatform` 根组件：移除 `onNavigateToSkillEditor` 跳转 settings 的 hack

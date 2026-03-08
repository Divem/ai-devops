## REMOVED Requirements

### Requirement: Settings dropdown button on kanban page
**Reason**: KanbanBoard 内的独立设置下拉框已被统一的项目配置页面（ProjectSettingsPage）替代，AI 模型选择和 API Key 配置已迁移至项目配置页面，无需在看板页面单独保留此入口。
**Migration**: 用户通过 Header 全局齿轮图标进入 ProjectSettingsPage 完成模型和 API Key 配置。

### Requirement: Settings dropdown menu
**Reason**: 下拉菜单中的"Project settings"导航和 AI 模型选择功能已整合到全局 Header 的齿轮入口中，原 KanbanBoard 局部 settings-dropdown 不再需要。
**Migration**: 全局配置入口在 Header 区域，任何视图下均可访问。

### Requirement: Close dropdown
**Reason**: 随 settings-dropdown 组件整体移除。
**Migration**: 无需迁移。

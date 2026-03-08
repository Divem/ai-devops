## ADDED Requirements

### Requirement: SDD 框架选择
项目配置页 SHALL 提供 SDD 框架选择，支持 OpenSpec、spec-kit 和自定义三种框架。

#### Scenario: 选择框架
- **WHEN** 用户在 SDD 板块选择一个框架
- **THEN** 框架说明文字更新，模板编辑区显示该框架对应的内置默认模板

#### Scenario: 保存框架选择
- **WHEN** 用户点击"保存 SDD 配置"
- **THEN** 所选框架存入 `projectConfig.sdd.framework`，持久化到 localStorage

### Requirement: Spec 模板查看与编辑
项目配置页 SHALL 提供各文档类型（Proposal / Design / Spec / Tasks）的模板编辑器，用户可查看和修改模板内容。

#### Scenario: 切换模板类型
- **WHEN** 用户点击模板类型 tab（如"Design"）
- **THEN** textarea 切换显示该类型的当前模板内容

#### Scenario: 编辑并保存模板
- **WHEN** 用户修改 textarea 内容并点击"保存模板"
- **THEN** 修改后的模板内容存入 `projectConfig.sdd.templates[type]`，持久化到 localStorage，显示保存成功提示

#### Scenario: 恢复默认模板
- **WHEN** 用户点击"恢复默认"按钮
- **THEN** 当前模板类型的内容重置为所选框架的内置默认模板，textarea 内容更新（未保存，需点击保存才持久化）

### Requirement: projectConfig 数据结构扩展
系统 SHALL 在 `projectConfig` 中新增 `sdd` 字段，包含框架标识和模板内容映射。

#### Scenario: 老数据向后兼容
- **WHEN** 用户 localStorage 中存在旧版 `project-config`（无 sdd 字段）
- **THEN** `loadProjectConfig` 使用 `DEFAULT_PROJECT_CONFIG.sdd` 兜底，不报错

#### Scenario: 配置持久化
- **WHEN** 用户保存 SDD 配置后刷新页面
- **THEN** 框架选择和自定义模板从 localStorage 恢复，不丢失

### Requirement: 导航入口
项目配置页左侧导航 SHALL 新增"SDD 框架"条目，点击后右侧展示 SDD 框架配置板块。

#### Scenario: 点击 SDD 框架导航项
- **WHEN** 用户点击左侧导航中的"SDD 框架"
- **THEN** 右侧显示 SDD 框架选择和模板编辑区，其他板块隐藏

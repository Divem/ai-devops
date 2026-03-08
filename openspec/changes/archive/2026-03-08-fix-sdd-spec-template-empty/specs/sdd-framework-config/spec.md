## MODIFIED Requirements

### Requirement: SDD 框架模板编辑器默认内容展示
当用户进入项目配置页的 SDD 框架模板编辑器时，系统 SHALL 为每个文档类型（proposal / design / spec / tasks）展示当前框架的默认模板内容，除非用户已保存过非空的自定义模板。

#### Scenario: 未保存自定义模板时显示框架默认内容
- **WHEN** 用户首次打开模板编辑器，或已保存模板为空字符串
- **THEN** 系统 SHALL 在 textarea 中展示 `SDD_FRAMEWORKS[framework].defaultTemplates[docType]` 的内容
- **THEN** spec 文档类型 SHALL 显示包含 `## ADDED Requirements`、`### Requirement:`、`#### Scenario:` 的 OpenSpec 格式模板

#### Scenario: 已保存非空自定义模板时使用用户内容
- **WHEN** 用户之前已保存过非空的自定义模板内容
- **THEN** 系统 SHALL 在 textarea 中展示用户保存的自定义内容，不使用默认模板

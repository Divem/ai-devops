## ADDED Requirements

### Requirement: AI 错误时显示示例内容按钮
当 AI 文档生成请求失败时，系统 SHALL 在错误提示下方显示「📄 查看示例内容」按钮。

#### Scenario: 429 错误触发按钮
- **WHEN** 用户点击"AI 生成"且 API 返回 429 或任意错误
- **THEN** 错误提示显示，错误提示下方出现「📄 查看示例内容」按钮

#### Scenario: 点击按钮加载 Demo 内容
- **WHEN** 用户点击「📄 查看示例内容」按钮
- **THEN** 错误提示消失，文档区域渲染对应文档类型的预置 Markdown 内容
- **THEN** Demo 内容顶部显示免责提示「⚠️ 以下为示例内容，非 AI 实时生成」

### Requirement: DEMO_DOCS 覆盖全部文档类型
系统 SHALL 为以下文档类型各提供一份预置示例：prd、proposal、design、spec、tasks。

#### Scenario: prd 类型有示例内容
- **WHEN** 用户在产品需求 SPEC 文档错误后点击「查看示例内容」
- **THEN** 显示包含功能概述、用户旅程、功能模块的 Markdown 内容

#### Scenario: proposal 类型有示例内容
- **WHEN** 用户在 Proposal 文档错误后点击「查看示例内容」
- **THEN** 显示包含 Why / What Changes / Capabilities / Impact 的 Markdown 内容

#### Scenario: tasks 类型有示例内容
- **WHEN** 用户在 Tasks 文档错误后点击「查看示例内容」
- **THEN** 显示包含分组任务列表和 checkbox 的 Markdown 内容

## ADDED Requirements

### Requirement: AI 错误时显示示例内容按钮
当 AI 请求失败时，系统 SHALL 在错误提示下方显示与当前失败场景匹配的兜底入口，以便用户继续演示流程。

#### Scenario: 文档生成错误触发示例内容按钮
- **WHEN** 用户点击"AI 生成"且 API 返回 429 或任意错误
- **THEN** 错误提示显示，错误提示下方出现「📄 查看示例内容」按钮

#### Scenario: 评审错误触发示例评审结果按钮
- **WHEN** 用户点击"AI 智能评审"且 API 返回任意错误
- **THEN** 错误提示显示，评审区域出现「🧪 使用示例评审结果（用于演示）」按钮

#### Scenario: Chatbot 请求失败自动写入示例回复
- **WHEN** 用户在 Chatbot 发送消息且 AI 请求失败
- **THEN** 系统自动将结构化示例回复写入当前会话
- **AND** 用户无需额外点击按钮即可继续对话演示

#### Scenario: 点击文档兜底按钮加载 Demo 内容
- **WHEN** 用户点击「📄 查看示例内容」按钮
- **THEN** 错误提示消失，文档区域渲染对应文档类型的预置 Markdown 内容
- **THEN** Demo 内容顶部显示免责提示「⚠️ 以下为示例内容，非 AI 实时生成」

### Requirement: AI 评审示例结果数据
系统 SHALL 提供固定结构的评审示例结果，并在评审失败后允许用户一键写入当前需求。

#### Scenario: 点击按钮写入示例评审结果
- **WHEN** 用户点击「🧪 使用示例评审结果（用于演示）」按钮
- **THEN** 系统写入示例 `aiResult`（包含 score、completeness、logic、risk、summary、risks、suggestions、passed）
- **THEN** 当前需求状态更新为 `confirm`，可继续人工确认与通过流程

#### Scenario: 示例结果显式标识
- **WHEN** 页面展示通过兜底写入的评审结果
- **THEN** 评审报告区域显示「示例数据（非 AI 实时生成）」标识

#### Scenario: 真实评审成功时不展示兜底按钮
- **WHEN** AI 评审请求成功并返回真实结果
- **THEN** 页面不显示「使用示例评审结果」按钮

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

## MODIFIED Requirements

### Requirement: AI 错误时显示示例内容按钮
当 AI 请求失败时，系统 SHALL 自动填充示例内容并继续流程，不再在错误提示下方显示手动兜底入口按钮。

#### Scenario: 文档生成错误自动填充示例内容
- **WHEN** 用户点击"AI 生成"且 API 返回任意错误
- **THEN** 系统自动填充对应文档类型的 `FALLBACK_DOCS` 内容
- **THEN** 不显示错误提示，不显示「📄 查看示例内容」按钮

#### Scenario: 评审错误自动注入示例评审结果
- **WHEN** 用户点击"AI 智能评审"且 API 返回任意错误
- **THEN** 系统自动注入 `DEMO_REVIEW_RESULT`，评审区域正常渲染
- **THEN** 不显示「🧪 使用示例评审结果（用于演示）」按钮

### Requirement: AI 评审示例结果数据
系统 SHALL 提供固定结构的评审示例结果，并在评审失败后自动写入当前需求。

#### Scenario: 自动写入示例评审结果
- **WHEN** AI 评审请求失败
- **THEN** 系统自动写入示例 `aiResult`（包含 score、completeness、logic、risk、summary、risks、suggestions、passed）
- **THEN** 评审结果可触发后续"提交并生成提案"流程

#### Scenario: 示例结果显式标识
- **WHEN** 页面展示通过自动兜底写入的评审结果
- **THEN** 评审报告区域显示「示例数据（非 AI 实时生成）」标识

#### Scenario: 真实评审成功时不使用兜底数据
- **WHEN** AI 评审请求成功并返回真实结果
- **THEN** 系统使用真实结果，不注入示例数据

### Requirement: DEMO_DOCS 覆盖全部文档类型
系统 SHALL 为以下文档类型各提供一份预置示例：prd、proposal、design、spec、tasks。

#### Scenario: 各文档类型均有示例内容可自动填充
- **WHEN** 任意文档类型（prd / proposal / design / spec / tasks）的 AI 生成失败
- **THEN** `FALLBACK_DOCS[docType]` 存在且包含该类型的有效 Markdown 内容
- **THEN** 自动填充后文档顶部显示 `⚠️ 以下为示例内容，非 AI 实时生成` 标识

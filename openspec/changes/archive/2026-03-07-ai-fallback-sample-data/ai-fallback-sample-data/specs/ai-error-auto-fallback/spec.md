## ADDED Requirements

### Requirement: 提案串行生成失败时自动兜底
当 `handleGenerateProposalDocs` 中任意步骤的 AI 请求失败时，系统 SHALL 自动使用 `FALLBACK_DOCS[step]` 填充该步骤的文档内容，并继续后续步骤，而不是中断整个流程。

#### Scenario: 单步骤生成失败自动填充并继续
- **WHEN** 提案串行生成的某一步骤（如 proposal）抛出异常
- **THEN** 系统使用 `FALLBACK_DOCS[step]` 内容填充该步骤
- **THEN** 系统继续执行后续步骤（design、spec、tasks）
- **THEN** 页面显示 toast 通知"AI 不可用，已使用示例内容继续生成"

#### Scenario: 所有步骤失败仍完成流程
- **WHEN** 提案串行生成的所有步骤均抛出异常
- **THEN** 系统依次用各步骤的 `FALLBACK_DOCS` 内容填充
- **THEN** 提案评审抽屉正常关闭，提案文件夹在文档树中展开

### Requirement: 单文档生成失败时自动兜底
当 `handleGenerate`（单文档生成）的 AI 请求失败时，系统 SHALL 自动使用 `FALLBACK_DOCS[docType]` 填充文档内容，无需用户手动点击兜底按钮。

#### Scenario: 单文档生成失败自动填充
- **WHEN** 用户点击文档生成按钮，AI 请求抛出异常
- **THEN** 系统自动将 `FALLBACK_DOCS[docType]` 写入文档
- **THEN** 文档区域正常渲染兜底内容（顶部含 `⚠️ 以下为示例内容` 标识）
- **THEN** 不显示错误提示，不显示"查看示例内容"按钮

### Requirement: AI 评审失败时自动注入示例结果
当 AI 评审请求（`handleOpenProposalReview` 或 `handleRetryReview`）失败时，系统 SHALL 自动注入 `DEMO_REVIEW_RESULT`，评审流程正常继续。

#### Scenario: 评审失败自动注入示例结果
- **WHEN** AI 评审请求抛出异常
- **THEN** 系统将 `DEMO_REVIEW_RESULT` 写入 `proposalReviewResult` 状态
- **THEN** 评审结果区域正常渲染（显示评分、建议等）
- **THEN** 页面显示 toast 通知"AI 不可用，已使用示例评审结果"

#### Scenario: 自动注入的评审结果可继续生成提案
- **WHEN** 系统自动注入 `DEMO_REVIEW_RESULT` 后
- **THEN** 用户可点击"提交并生成提案"按钮，正常进入提案生成流程

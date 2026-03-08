## Spec: AI 错误自动兜底内容展示

**Capability**: ai-error-auto-fallback
**Status**: active
**Source Change**: ai-fallback-sample-data

---

## Requirements

### Requirement: AI fallback content display
When AI document generation request fails, the system SHALL display pre-configured fallback sample content instead of error message.

#### Scenario: AI request fails
- **GIVEN** the user clicks on a document type (PRD/Proposal/Design/Spec/Tasks)
- **WHEN** the AI API request fails (network error, rate limit, invalid key, etc.)
- **THEN** the system SHALL display the fallback sample content for that document type
- **AND** display a warning message "⚠️ AI 暂时不可用，以下为示例内容" at the top

#### Scenario: Initial card has sample data
- **GIVEN** REQ-001 is displayed in the kanban
- **WHEN** the user clicks on REQ-001 to view details
- **THEN** the document tree SHALL show all document types with pre-filled content
- **AND** no AI API call is needed to view the content

### Requirement: Fallback content structure
The fallback content SHALL be structured according to OpenSpec format.

#### Scenario: PRD fallback content
- **GIVEN** AI request for PRD fails
- **WHEN** fallback content is displayed
- **THEN** the content SHALL include: 产品概述、功能需求、验收标准 sections

#### Scenario: Proposal fallback content
- **GIVEN** AI request for Proposal fails
- **WHEN** fallback content is displayed
- **THEN** the content SHALL include: Intent, Scope, Approach sections

#### Scenario: Design fallback content
- **GIVEN** AI request for Design fails
- **WHEN** fallback content is displayed
- **THEN** the content SHALL include: Technical Solution, API Definitions, Architecture sections

### Requirement: Fallback data constant
The system SHALL include a FALLBACK_DOCS constant containing sample content for all document types.

#### Scenario: Fallback constant defined
- **GIVEN** PMPlatform.jsx loads
- **WHEN** the component mounts
- **THEN** FALLBACK_DOCS object SHALL be available with keys: prd, proposal, design, spec, tasks

#### Scenario: Fallback content accessible
- **GIVEN** FALLBACK_DOCS is defined
- **WHEN** AI request fails
- **THEN** FALLBACK_DOCS[type] SHALL be returned as the result

### Requirement: AI 评审失败时自动注入示例结果
当 AI 评审请求（`handleOpenProposalReview` 或 `handleRetryReview`）失败时，系统 SHALL 自动注入 `DEMO_AI_REVIEW_RESULT`，评审流程正常继续。不得因 catch 块内部错误导致二次崩溃。

#### Scenario: 评审失败自动注入示例结果（无崩溃）
- **WHEN** AI 评审请求抛出异常
- **THEN** 系统将 `DEMO_AI_REVIEW_RESULT` 写入 `proposalReviewResult` 状态（不抛出 ReferenceError）
- **THEN** 评审结果区域正常渲染评分和建议

#### Scenario: 自动注入的评审结果可继续生成提案
- **WHEN** 系统自动注入 `DEMO_AI_REVIEW_RESULT` 后
- **THEN** 用户可点击"提交并生成提案"按钮，正常进入提案生成流程
- **THEN** 系统 SHALL 串行执行 4 步文档生成（proposal/design/spec/tasks），每步失败时用 `FALLBACK_DOCS[step]` 兜底，不中断循环
- **THEN** 4 步完成后 `ProposalReviewDrawer` SHALL 关闭，文档树显示新提案文件夹

#### Scenario: 真实评审成功时不使用兜底数据
- **WHEN** AI 评审请求成功并返回真实结果
- **THEN** 系统使用真实结果，不注入示例数据

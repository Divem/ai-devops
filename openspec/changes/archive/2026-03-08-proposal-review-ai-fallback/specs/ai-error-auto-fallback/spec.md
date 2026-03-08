## MODIFIED Requirements

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

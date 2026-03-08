## 1. 确认现有兜底实现

- [x] 1.1 检查 `handleOpenProposalReview` catch 块是否已注入 `DEMO_AI_REVIEW_RESULT`
- [x] 1.2 检查 `handleRetryReview` catch 块是否已注入 `DEMO_AI_REVIEW_RESULT`（或确认该函数已废弃）
- [x] 1.3 检查 `handleGenerateProposalDocs` 循环 catch 块是否已使用 `FALLBACK_DOCS[step]` 兜底

## 2. 补充缺失兜底逻辑

- [x] 2.1 若 `handleOpenProposalReview` catch 缺失：添加 `setProposalReviewResult(DEMO_AI_REVIEW_RESULT)` 与 `notify("AI 不可用，已使用示例评审结果")`
- [x] 2.2 若 `handleGenerateProposalDocs` 循环 catch 缺失：在每步 catch 中添加 `FALLBACK_DOCS[step]` 写入当前提案并继续循环
- [x] 2.3 确认 catch 块内无 `ReferenceError`（常量名使用 `DEMO_AI_REVIEW_RESULT` 而非 `DEMO_REVIEW_RESULT`）

## 3. 验证全流程演示

- [x] 3.1 使用无效 API Key 或断网，点击「生成提案」，确认评审抽屉展示示例评审结果
- [x] 3.2 点击「提交并生成提案」，确认 4 步生成全部完成并使用示例内容，抽屉正常关闭
- [x] 3.3 确认文档树显示新提案文件夹及 4 个子文档，内容可预览

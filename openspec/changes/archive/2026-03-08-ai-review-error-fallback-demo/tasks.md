## 1. Bug 修复（已完成）

- [x] 1.1 将 `handleOpenProposalReview` catch 块中的 `DEMO_REVIEW_RESULT` 改为 `DEMO_AI_REVIEW_RESULT`
- [x] 1.2 将 `handleRetryReview` catch 块中的 `DEMO_REVIEW_RESULT` 改为 `DEMO_AI_REVIEW_RESULT`

## 2. 验证

- [ ] 2.1 运行 `vite build` 确认无编译错误
- [ ] 2.2 在浏览器中触发 AI 评审（余额不足时），确认 `ProposalReviewDrawer` 正常显示示例结果，不再崩溃
- [ ] 2.3 确认示例评审结果展示后，"提交并生成提案"按钮可点击且提案串行生成正常触发

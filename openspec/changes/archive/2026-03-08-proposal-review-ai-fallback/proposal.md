## Why

AI 设计页「生成提案」入口会触发 PRD 评审抽屉（ProposalReviewDrawer），该抽屉依赖 `callAIReview` 和串行 `callAIDoc` 完成评审与文档生成。当 AI API 不可用（余额不足、网络超时、限流）时，抽屉停留在加载态或抛出错误，无法继续演示完整流程。需要在所有 AI 调用失败路径上自动注入示例数据，使演示可以无阻完成。

## What Changes

- `handleOpenProposalReview`：捕获 `callAIReview` 异常，自动注入 `DEMO_AI_REVIEW_RESULT`，抽屉正常显示评审结果
- `handleRetryReview`（若保留）：同上，重试失败也自动使用示例结果
- `handleGenerateProposalDocs`：串行循环中每个步骤（proposal / design / spec / tasks）的异常由 `FALLBACK_DOCS[step]` 填充，循环继续，不中断
- 兜底流程对用户透明：成功路径无任何变化，失败时仅显示轻提示 toast

## Capabilities

### New Capabilities
- `proposal-review-ai-fallback`: 提案评审抽屉 AI 失败时自动兜底，包含评审结果注入与文档生成串行兜底两条路径

### Modified Capabilities
- `ai-error-auto-fallback`: 补充覆盖 `handleOpenProposalReview` / `handleRetryReview` 的兜底场景，与已有文档生成兜底保持一致

## Impact

- `pm-ai-app/src/PMPlatform.jsx`：`handleOpenProposalReview`、`handleRetryReview`、`handleGenerateProposalDocs` catch 块
- 不涉及数据模型、API 接口或路由变更
- `DEMO_AI_REVIEW_RESULT` 和 `FALLBACK_DOCS` 常量已存在，无需新增依赖

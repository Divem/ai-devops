## Why

在实施 `ai-fallback-sample-data` 变更后，`handleOpenProposalReview` 和 `handleRetryReview` 的 catch 块引用了未定义常量 `DEMO_REVIEW_RESULT`（实际名称为 `DEMO_AI_REVIEW_RESULT`），导致 AI 评审失败时页面抛出 `ReferenceError: DEMO_REVIEW_RESULT is not defined`，整个 ProposalReviewDrawer 崩溃，用户无法继续演示流程。

## What Changes

- **修复 `DEMO_REVIEW_RESULT` 引用错误**：将两处错误引用改为正确的 `DEMO_AI_REVIEW_RESULT`（已修复）
- **验证 `FALLBACK_DOCS` 键覆盖**：确认 `FALLBACK_DOCS` 包含 `PROPOSAL_GEN_STEPS` 所需的全部键（`proposal / design / spec / tasks`）
- **构建验证**：确认修复后无新增编译错误

## Capabilities

### New Capabilities

（无新能力，仅 bug 修复）

### Modified Capabilities

- `ai-error-auto-fallback`：修复评审失败自动兜底路径中的 `ReferenceError`，使该能力实际可用

## Impact

- `pm-ai-app/src/PMPlatform.jsx`：两行常量引用修正（`DEMO_REVIEW_RESULT` → `DEMO_AI_REVIEW_RESULT`），已完成
- 不影响数据结构、API 调用或其他组件

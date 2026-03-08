## Why

点击"更新提案"触发 AI 生成提案文档时，若 API 请求失败（如网络错误、配额超限），整个流程会中断并显示错误提示，用户无法继续演示。系统已有 `FALLBACK_DOCS` 示例数据，但提案串行生成流程（`handleGenerateProposalDocs`）在失败时没有自动使用兜底数据的机制。

## What Changes

- **自动兜底**：`handleGenerateProposalDocs` 在每个生成步骤失败时，自动用 `FALLBACK_DOCS` 中对应类型的示例内容填充，而不是中断整个流程
- **提示标识**：兜底生成的文档顶部带有 `⚠️ 以下为示例内容，非 AI 实时生成` 标识（`FALLBACK_DOCS` 中已内置）
- **单文档兼容**：`handleGenerate`（单文档生成）失败时，同样自动填充兜底数据，移除现有的"查看示例内容"按钮（统一为自动填充）
- **AI 评审兜底**：`handleOpenProposalReview` / `handleRetryReview` 失败时，自动注入 `DEMO_REVIEW_RESULT`，继续流程

## Capabilities

### New Capabilities

- `ai-error-auto-fallback`: AI 请求失败时自动填充示例数据，无需用户手动点击兜底按钮，完成完整演示流程

### Modified Capabilities

- `ai-error-demo-fallback`: 原有的"手动点击兜底按钮"行为变更为"自动填充"，spec 中的按钮场景变为自动触发

## Impact

- `pm-ai-app/src/PMPlatform.jsx`：修改 `handleGenerateProposalDocs`、`handleGenerate`（DetailPage 两处）、`handleOpenProposalReview`、`handleRetryReview` 的 catch 逻辑
- 移除 `docError` 相关的"查看示例内容"按钮 UI（不再需要手动触发）
- 不影响 API key 配置、Vite proxy、现有数据结构

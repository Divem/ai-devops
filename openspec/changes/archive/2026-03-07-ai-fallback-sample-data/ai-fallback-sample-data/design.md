## Context

`PMPlatform.jsx` 已有 `FALLBACK_DOCS`（各文档类型示例内容）和 `DEMO_REVIEW_RESULT`（示例评审结果）两份兜底数据。当前流程：

- **提案串行生成**（`handleGenerateProposalDocs`）：遇到任意步骤失败即 `return`，显示错误消息，流程中断
- **单文档生成**（`handleGenerate`）：失败后设置 `docError`，页面显示"查看示例内容"按钮，需用户手动点击
- **AI 评审**（`handleOpenProposalReview` / `handleRetryReview`）：失败后显示错误，有"使用示例评审结果"按钮，需手动点击

演示场景下，手动点击兜底按钮打断了流程，用户体验不连贯。

## Goals / Non-Goals

**Goals:**
- AI 请求失败时自动使用兜底数据，流程无缝继续
- 兜底内容有明确标识（`FALLBACK_DOCS` 已内置 `⚠️` 头部）
- 统一兜底行为，移除手动触发按钮

**Non-Goals:**
- 不修改 `FALLBACK_DOCS` / `DEMO_REVIEW_RESULT` 的内容
- 不改变 API 调用逻辑本身（重试、超时等）
- 不处理网络恢复后自动重新生成

## Decisions

### 决策 1：catch 块内自动填充，不弹确认框

**选项 A（选用）**：catch 块直接填充兜底数据，继续后续步骤，toast 提示"AI 不可用，已使用示例内容"
**选项 B**：catch 块弹确认框，让用户选择"继续用示例 / 停止"

选用 A：演示场景目标是流程连续性，一次性 toast 通知已足够，减少交互中断。

### 决策 2：移除手动兜底按钮

`docError` 状态及对应的"查看示例内容"按钮不再需要，直接删除以减少 UI 复杂度。`proposalGenerateError` 状态同理——自动兜底后流程继续，不会停留在错误态。

### 决策 3：评审失败自动注入 DEMO_REVIEW_RESULT

`handleOpenProposalReview` / `handleRetryReview` catch 块注入 `DEMO_REVIEW_RESULT`，同时 toast 提示，保持与文档生成一致的体验。

## Risks / Trade-offs

- **用户无感知**：自动兜底可能让用户误以为 AI 正常工作 → 缓解：toast 明确提示"已使用示例内容"，文档顶部有 `⚠️` 标识
- **兜底内容不匹配**：`FALLBACK_DOCS` 内容与当前需求无关 → 可接受，演示场景本身不要求内容准确，仅演示流程
- **错误被静默**：`console.error` 保留，便于调试

## Migration Plan

1. 修改 `handleGenerateProposalDocs` catch 块：填充兜底 → 继续循环（或 continue）
2. 修改两处 `handleGenerate` catch 块：直接填充兜底，清除 `docError`
3. 修改 `handleOpenProposalReview` / `handleRetryReview` catch 块：注入 `DEMO_REVIEW_RESULT`
4. 删除 `docError` state 及相关 UI（"查看示例内容"按钮）
5. 保留 `proposalGenerateError` state（可选：也一并移除，视 UI 简洁度决定）

无数据迁移，无 API 变更，回滚仅需 git revert。

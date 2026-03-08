## Context

AI 设计页的「生成提案」按钮（`prd` 文档页）触发 `handleOpenProposalReview`，打开 `ProposalReviewDrawer`。该抽屉分两阶段执行：

1. **评审阶段**：调用 `callAIReview(card)` 获取 AI 评审结果（分数、风险、建议）
2. **生成阶段**：用户确认后调用 `handleGenerateProposalDocs`，串行执行 4 个步骤（proposal → design → spec → tasks），每步调用 `callAIDoc(card, step)`

当前项目已有两个兜底常量：
- `DEMO_AI_REVIEW_RESULT`：结构完整的 AI 评审示例结果
- `FALLBACK_DOCS`：包含 `{proposal, design, spec, tasks}` 的示例文档内容

约束：不引入新常量或依赖，所有变更只在 catch 块。

## Goals / Non-Goals

**Goals:**
- `callAIReview` 失败时自动注入 `DEMO_AI_REVIEW_RESULT`，抽屉正常展示评审结果
- `callAIDoc` 失败时用 `FALLBACK_DOCS[step]` 填充当步内容，串行循环不中断
- 兜底时显示轻提示 toast，让用户感知 AI 不可用但不阻断演示
- 真实 AI 成功时完全不受影响

**Non-Goals:**
- 不改动 `ProposalReviewDrawer` UI 或 `DEMO_AI_REVIEW_RESULT` 内容
- 不覆盖 `DesignStudio` 旧路径（已弃用）
- 不新增重试 UI 或错误状态展示

## Decisions

### 决策 1：直接在 catch 块注入，不引入中间状态
- 方案：`catch(e) { setProposalReviewResult(DEMO_AI_REVIEW_RESULT); notify(...); }`
- 原因：最小改动；`setProposalReviewResult` 已有 state 控制渲染，注入后 UI 自动更新
- 备选：引入 `isFallback` flag 标记，渲染时区分真实 vs 示例
- 未选原因：演示场景无需区分来源，增加不必要复杂度

### 决策 2：生成循环中单步兜底，不整体短路
- 方案：for 循环中每步 catch 独立，用 `FALLBACK_DOCS[step]` 继续，不 break
- 原因：演示需要 4 步全部完成；短路会导致部分文档缺失，树节点无内容
- 备选：整体 try/catch 一次性填充所有 FALLBACK_DOCS
- 未选原因：丢失逐步展示进度的 UX（generatingStep 进度条动画）

### 决策 3：兜底使用 notify toast，不修改渲染路径
- 方案：仅用 `notify(msg)` 提示，不在 UI 上增加 warning banner
- 原因：保持抽屉 UI 干净，演示时减少干扰
- 备选：在评审结果区上方显示 "⚠️ 以下为示例数据" banner
- 未选原因：演示优先，banner 会分散注意力

## Risks / Trade-offs

- [风险] 用户误以为 AI 已正常工作而结束演示，未意识到使用的是示例数据
  → 缓解：toast 明确提示"AI 不可用，已使用示例评审结果"

- [取舍] `FALLBACK_DOCS[step]` 内容为通用示例，与当前需求无关联
  → 演示场景可接受；真实 AI 成功时不受影响

## Migration Plan

1. 确认 `handleOpenProposalReview` catch 块已有 `DEMO_AI_REVIEW_RESULT` 注入（检查当前代码）
2. 确认 `handleGenerateProposalDocs` 循环 catch 块已有 `FALLBACK_DOCS[step]` 注入
3. 如有缺失则补充对应 catch 块
4. 手工验证：断网或使用无效 API Key，点击「生成提案」走完完整流程
5. 无需数据迁移，无需回滚策略

## Open Questions

- `handleRetryReview` 是否仍被调用？（当前 `ProposalReviewDrawer` 无 `onRetry` prop，可能已是死代码）

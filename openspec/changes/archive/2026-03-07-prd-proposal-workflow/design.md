## Context

DetailPage 是 AI 设计页面的核心组件，包含文档树（DocTreeSidebar）、文档编辑区（DocEditor）和右侧面板（ChatbotPanel/ReferencePanel）三栏布局。当前 PRD 文档编辑区只有"编辑"和"提交到仓库"两个操作，缺乏从 PRD 直接触发提案生成的入口。

提案（proposals）已有数据结构 `{id, name, proposal, design, spec, tasks}`，由 `callAIDoc()` 逐个生成。列表页的 `DetailDrawer` 已有完整的评审报告 UI（评分环、风险/建议双栏、底部操作栏），可作为样式参考。

## Goals / Non-Goals

**Goals:**
- 在 DocEditor 头部，PRD 文档时展示"生成提案"或"更新提案"按钮
- 点击后先做 AI 评审，评审结果展示在 `ProposalReviewDrawer` 抽屉中
- 抽屉底部"提交并生成提案"按钮顺序生成 proposal/design/spec/tasks 四个文档
- 数据结构预留 `baseSnapshot` 字段，为后续变更对比功能留口

**Non-Goals:**
- 不实现变更内容对比 UI（仅预留字段）
- 不新增 AI 评审的 prompt，复用现有 `callAIReview()` 逻辑
- 不修改提案文档的生成 prompt

## Decisions

### 1. 评审复用 vs 新建

**决策**：直接复用 `callAIReview(card)` 函数，结果存入局部 state（不写回 card.aiResult）。

**原因**：`callAIReview` 已有完整的 AI 调用和结果解析逻辑。写回 card.aiResult 会干扰看板列的 AI 分析状态，而此处评审是"预览性"的，不应改变卡片状态。

**替代方案**：单独写一个 `callAIReviewForPrd()` → 增加重复代码，无必要。

### 2. 抽屉放置位置

**决策**：`ProposalReviewDrawer` 作为 `DetailPage` 的子组件，在 DetailPage 内部管理开关 state。

**原因**：抽屉需要访问 `selCard`、`normDocs`、`onUpdateDocs` 等 DetailPage 级别的数据，放在 DetailPage 内部最自然。

**替代方案**：提升到顶层 PMPlatform → 传参链过长，不必要。

### 3. 提案生成策略

**决策**：顺序（串行）调用 `callAIDoc(card, docType)` 生成 proposal → design → spec → tasks，每成功一步立即写回 docs，并更新进度文案。

**原因**：每个文档依赖前一个文档的上下文（design 依赖 proposal），串行可以保证质量，也方便中途失败的错误处理。

**替代方案**：并行生成 → 文档间上下文丢失，质量下降。

### 4. 有无提案的判断

**决策**：`hasProposals = normDocs.proposals?.length > 0` 传给 DocEditor，由 DocEditor 决定按钮文案。

**原因**：DocEditor 只需要一个 boolean，不需要知道提案内容细节。

### 5. baseSnapshot 预留方式

**决策**：在 `ProposalReviewDrawer` 的 props 中预留 `baseSnapshot?: object` 字段（当前传 null），在提案生成完成后将当前 PRD 内容存为 `card.docs._prdSnapshot`（不渲染，仅存储）。

**原因**：变更对比需要知道"上次生成提案时的 PRD 内容"，提前存储后续只需读取对比。

## Risks / Trade-offs

- **评审结果不持久化** → 用户关闭抽屉后需重新触发评审，可接受（避免 state 污染）
- **串行生成耗时较长**（4 个 AI 请求，约 20-40 秒）→ 通过逐步更新进度文案缓解用户等待焦虑
- **生成中途失败处理** → 已生成的文档保留，抽屉显示具体失败的步骤，用户可手动重试

## Migration Plan

纯前端变更，无数据迁移。已有 `proposals` 数组的卡片不受影响，新增的 `_prdSnapshot` 字段向后兼容（undefined 时不触发对比逻辑）。

## Open Questions

- 更新提案时是覆盖所有提案文档，还是仅更新第一个提案？当前设计：若只有一个提案则更新它，若有多个提案则新建一个（后续可加选择 UI）。

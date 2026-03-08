## 1. DocEditor — 添加提案按钮

- [x] 1.1 在 `DocEditor` 函数签名中新增 `onGenerateProposal` 和 `hasProposals` 两个 prop
- [x] 1.2 在 DocEditor 头部操作区：当 `docType === 'prd'` 且非 editMode 时，渲染【生成提案】/【更新提案】按钮（依据 hasProposals 判断文案）
- [x] 1.3 当 content 为空时（在空状态占位区）也渲染【生成提案】按钮但置为禁用
- [x] 1.4 按钮点击调用 `onGenerateProposal()`

## 2. DetailPage — 传入新 props

- [x] 2.1 在 DetailPage 中计算 `hasProposals`（`normDocs.proposals?.length > 0`），传给 DocEditor
- [x] 2.2 在 DetailPage 中定义 `handleOpenProposalReview` 函数，赋给 DocEditor 的 `onGenerateProposal` prop

## 3. ProposalReviewDrawer 组件

- [x] 3.1 新建 `ProposalReviewDrawer` 组件，props：`card`, `onClose`, `onConfirm`, `reviewResult`, `reviewing`, `generating`, `generatingStep`, `generateError`
- [x] 3.2 实现抽屉骨架：固定右侧全高覆盖层，样式参考 DetailDrawer（深色头部、白色主体、底部操作栏）
- [x] 3.3 实现评审结果展示区：复用 ScoreRing / MiniBar，展示评分、通过/未通过结论、风险列表、改进建议
- [x] 3.4 评审加载中状态：显示骨架占位或 spinner
- [x] 3.5 评审失败状态：展示错误信息和【重试】按钮
- [x] 3.6 底部操作栏：【提交并生成提案】按钮（reviewing 或 generating 时禁用）+ 关闭按钮
- [x] 3.7 generating 时显示进度文案（如"正在生成 proposal…1/4"）

## 4. DetailPage — 评审与生成逻辑

- [x] 4.1 新增 state：`proposalReviewOpen`, `proposalReviewResult`, `proposalReviewing`, `proposalGenerating`, `proposalGeneratingStep`, `proposalGenerateError`
- [x] 4.2 实现 `handleOpenProposalReview`：设置 `proposalReviewOpen=true`，调用 `callAIReview(selCard)` 并将结果存入 `proposalReviewResult`（不写回 card.aiResult）
- [x] 4.3 实现 `handleGenerateProposalDocs`：串行调用 `callAIDoc(selCard, 'proposal')` → `'design'` → `'spec'` → `'tasks'`，每步完成写回 docs，更新 proposalGeneratingStep
- [x] 4.4 生成完成后：将 PRD 内容写入 `card.docs._prdSnapshot`，关闭抽屉
- [x] 4.5 生成失败时：设置 `proposalGenerateError` 并停止，保留已完成的文档
- [x] 4.6 在 DetailPage render 中挂载 `ProposalReviewDrawer`，传入相关 state 和回调

## 5. 确保文档树不渲染 _prdSnapshot

- [x] 5.1 检查 `normalizeDocs` 和 `DocTreeSidebar` 中的文档遍历逻辑，确认 `_prdSnapshot` 字段不会被当作文档节点渲染

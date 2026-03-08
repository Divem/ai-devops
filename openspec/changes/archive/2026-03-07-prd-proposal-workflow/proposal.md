## Why

在 AI 设计页面（DetailPage）中，产品经理完成 PRD 编写后，目前需要手动逐一生成每个提案文档，缺乏从 PRD 到提案包的一键生成入口。需要在 PRD 文档编辑区域提供"生成提案/更新提案"的快捷操作，同时在提交前展示 AI 评审报告，让产品经理确认质量后再触发提案生成。

## What Changes

- 在 DocEditor 头部操作区，当当前文档为 `prd` 时，新增一个操作按钮：
  - 无提案时显示【生成提案】
  - 已有提案时显示【更新提案】
- 点击该按钮后，先对 PRD 执行 AI 评审，评审结果在侧边抽屉（`ProposalReviewDrawer`）中展示
- 抽屉样式参考列表页的 `DetailDrawer`：深色头部、评分环、风险/建议双栏
- 抽屉底部提供【提交并生成提案】按钮，点击后顺序生成 proposal / design / spec / tasks 四个提案文档
- 抽屉数据结构和组件接口预留 `baseSnapshot` 字段，支持后续"变更对比"功能扩展（对比当前 PRD 与上次快照的差异）

## Capabilities

### New Capabilities

- `prd-proposal-workflow`: PRD 评审通过后一键生成/更新提案包的工作流，包含评审抽屉（ProposalReviewDrawer）和提案生成调度逻辑

### Modified Capabilities

- `detail-page-doc-editor`: DocEditor 头部操作区在 prd 文档时新增"生成提案/更新提案"按钮

## Impact

- `pm-ai-app/src/PMPlatform.jsx`：
  - `DocEditor` 组件新增 `onGenerateProposal`、`hasProposals` prop
  - `DetailPage` 新增 `ProposalReviewDrawer` 状态和触发逻辑
  - 新增 `ProposalReviewDrawer` 组件
  - 新增 `callAIReviewForDoc()` 辅助函数（或复用 `callAIReview`）
  - 新增 `generateProposalDocs()` 顺序生成四个提案文档的函数

## Context

`ProposalReviewDrawer` 是 DetailPage 内的右侧抽屉组件，用于展示 AI PRD 评审结果并触发提案生成。打开时会立即发起 `callAIReview`，期间 `proposalReviewing=true`。按钮 `disabled={reviewing || generating}` 导致在 AI 评审完成前无法点击。

当前状态：AI 评审是必须等待的阻塞步骤，用户无法主动跳过。

## Goals / Non-Goals

**Goals**
- 用户可在 AI 评审完成前点击"提交并生成提案"
- 生成中（`generating=true`）仍保持禁用（防止重复提交）

**Non-Goals**
- 不取消 AI 评审流程（评审仍在后台运行，结果仍会显示）
- 不改变 `handleGenerateProposalDocs` 的生成逻辑

## Decisions

**D1: 仅用 `generating` 控制按钮禁用**
- 修改 `disabled={reviewing || generating}` → `disabled={generating}`
- 同步修改 `cursor`、`background`、`color`、`boxShadow` 样式判断
- 理由：AI 评审结果是可选参考，不应阻塞提案生成操作

**D2: 不改变按钮文案**
- 保持"提交并生成提案"文案不变
- 理由：无论评审是否完成，操作语义相同

## Risks / Trade-offs

- [用户在评审完成前提交] → 无影响，`handleGenerateProposalDocs` 不依赖评审结果
- [UI 视觉一致性] → 评审 loading 时按钮可点击，需确保样式不误导用户认为评审已完成

## Migration Plan

单文件修改，热更新即生效，无需数据迁移或部署特殊步骤。

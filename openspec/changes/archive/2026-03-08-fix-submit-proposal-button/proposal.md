## Why

AI 设计页面的 PRD 评审抽屉（ProposalReviewDrawer）底部的"提交并生成提案"按钮，在 AI 需求评审加载期间始终处于禁用状态（`disabled={reviewing || generating}`）。若 AI 调用耗时较长或用户希望跳过评审直接生成，按钮就无法点击，无法进入下一步，体验差。

## What Changes

- **解除评审中的按钮锁定**：移除 `reviewing` 对提交按钮 `disabled` 的影响，仅在 `generating` 时禁用（生成中不可重复提交）
- **评审结果可选**：用户可在 AI 评审结果出来前就点击"提交并生成提案"，评审结果作为参考信息展示，不作为进入下一步的前提
- **按钮文案区分**：评审未完成时显示"跳过评审，直接生成"风格提示（可选，保持当前文案也可）

## Capabilities

### New Capabilities

- `submit-proposal-button-fix`: 修复 ProposalReviewDrawer 中"提交并生成提案"按钮的可点击性，使其在 AI 评审加载期间也可操作

### Modified Capabilities

- `prd-proposal-workflow`: 提案生成流程中，AI 评审结果从"必须等待"改为"可选参考"

## Impact

- `pm-ai-app/src/PMPlatform.jsx` — `ProposalReviewDrawer` 组件，修改按钮 `disabled` 逻辑
- 不影响 `handleGenerateProposalDocs` 逻辑，生成流程不变

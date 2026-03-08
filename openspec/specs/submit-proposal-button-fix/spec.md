## ADDED Requirements

### Requirement: 提交并生成提案按钮在评审加载期间可点击
ProposalReviewDrawer 底部的"提交并生成提案"按钮 SHALL 仅在 `generating=true`（提案生成中）时禁用，在 `reviewing=true`（AI 评审加载中）时保持可点击状态。

#### Scenario: AI 评审加载中点击提交
- **WHEN** ProposalReviewDrawer 打开且 AI 评审仍在进行中（`reviewing=true`）
- **THEN** "提交并生成提案"按钮 SHALL 处于可点击状态，点击后触发提案生成

#### Scenario: 提案生成中按钮不可重复点击
- **WHEN** 用户已点击"提交并生成提案"且提案正在生成中（`generating=true`）
- **THEN** 按钮 SHALL 处于禁用状态，防止重复提交

#### Scenario: 评审完成后按钮可点击
- **WHEN** AI 评审完成（`reviewing=false`）且未在生成中（`generating=false`）
- **THEN** 按钮 SHALL 处于可点击状态

## MODIFIED Requirements

### Requirement: prd-proposal-workflow 提案生成入口
提案生成流程中，AI 评审结果 SHALL 作为可选参考信息展示，而非必须等待的前置条件。用户可在查看评审结果前直接提交生成。

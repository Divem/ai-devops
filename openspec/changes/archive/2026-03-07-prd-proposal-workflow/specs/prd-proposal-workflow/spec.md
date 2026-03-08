## ADDED Requirements

### Requirement: Trigger proposal generation from PRD editor
当用户在 PRD 文档编辑区点击"生成提案"或"更新提案"按钮时，系统 SHALL 先执行 AI 评审，再以抽屉形式展示评审报告，用户确认后方可生成提案。

#### Scenario: No proposals exist — show generate button
- **WHEN** 当前文档为 `prd` 且 `normDocs.proposals.length === 0`
- **THEN** DocEditor 头部 SHALL 在"编辑"按钮旁显示【生成提案】按钮

#### Scenario: Proposals exist — show update button
- **WHEN** 当前文档为 `prd` 且 `normDocs.proposals.length > 0`
- **THEN** DocEditor 头部 SHALL 在"编辑"按钮旁显示【更新提案】按钮

#### Scenario: PRD content is empty — button disabled
- **WHEN** 当前 PRD 内容为空（null 或空字符串）
- **THEN** 生成提案 / 更新提案按钮 SHALL 处于禁用状态

### Requirement: Show AI review in ProposalReviewDrawer
点击"生成提案/更新提案"按钮后，系统 SHALL 触发 AI 评审并将结果展示在 ProposalReviewDrawer 抽屉中。

#### Scenario: Review starts on button click
- **WHEN** 用户点击【生成提案】或【更新提案】
- **THEN** 系统 SHALL 打开 ProposalReviewDrawer，并立即开始调用 AI 评审（显示加载状态）

#### Scenario: Review result displayed
- **WHEN** AI 评审完成
- **THEN** ProposalReviewDrawer SHALL 展示评分环、完整性/逻辑性/风险可控三项分数、AI 建议结论、风险列表、改进建议

#### Scenario: Review error handling
- **WHEN** AI 评审调用失败
- **THEN** ProposalReviewDrawer SHALL 展示错误提示，并提供"重试"按钮

### Requirement: Generate proposal docs after review confirmation
用户在 ProposalReviewDrawer 中点击【提交并生成提案】后，系统 SHALL 顺序生成 proposal / design / spec / tasks 四个提案文档。

#### Scenario: Generate button triggers sequential doc generation
- **WHEN** 用户点击【提交并生成提案】
- **THEN** 系统 SHALL 依次调用 callAIDoc 生成 proposal → design → spec → tasks，每完成一步立即写回 docs 并更新进度提示

#### Scenario: Partial success persists completed docs
- **WHEN** 生成过程中某一步失败
- **THEN** 系统 SHALL 保留已生成的文档，并在 ProposalReviewDrawer 中显示具体失败步骤

#### Scenario: All docs generated — drawer closes
- **WHEN** 四个文档全部生成完成
- **THEN** ProposalReviewDrawer SHALL 自动关闭，文档树中出现新提案文件夹

### Requirement: Store PRD snapshot for future diff
生成提案完成后，系统 SHALL 将当前 PRD 内容存入 docs._prdSnapshot，供后续变更对比功能使用。

#### Scenario: Snapshot saved after generation
- **WHEN** 四个提案文档全部生成完成
- **THEN** 系统 SHALL 将 PRD 内容写入 `card.docs._prdSnapshot`（字符串）

#### Scenario: Snapshot not rendered in UI
- **WHEN** `card.docs._prdSnapshot` 存在
- **THEN** 文档树和编辑区 SHALL NOT 将 `_prdSnapshot` 作为可选文档展示

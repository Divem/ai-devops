## ADDED Requirements

### Requirement: Trigger proposal generation from PRD editor
当用户在 PRD 文档编辑区点击"生成提案"或"更新提案"按钮时，系统 SHALL 打开评审抽屉并展示 AI 评审结果作为可选参考信息，而非提案生成的前置条件；用户可直接提交生成提案。系统 SHALL 在该主按钮下方提供“功能演示”小字入口，用于打开需求澄清交互式弹框。

#### Scenario: No proposals exist — show generate button
- **WHEN** 当前文档为 `prd` 且 `normDocs.proposals.length === 0`
- **THEN** DocEditor 头部 SHALL 在"编辑"按钮旁显示【生成提案】按钮

#### Scenario: Proposals exist — show update button
- **WHEN** 当前文档为 `prd` 且 `normDocs.proposals.length > 0`
- **THEN** DocEditor 头部 SHALL 在"编辑"按钮旁显示【更新提案】按钮

#### Scenario: PRD content is empty — button disabled
- **WHEN** 当前 PRD 内容为空（null 或空字符串）
- **THEN** 生成提案 / 更新提案按钮 SHALL 处于禁用状态

#### Scenario: Show demo entry below proposal button
- **WHEN** 当前文档为 `prd` 且处于非编辑模式
- **THEN** 系统 SHALL 在【生成提案】或【更新提案】按钮下方展示“功能演示”小字入口

#### Scenario: Demo entry opens clarification dialog
- **WHEN** 用户点击“功能演示”小字入口
- **THEN** 系统 SHALL 打开需求澄清交互式弹框
- **THEN** 关闭弹框后系统 SHALL 保持当前 PRD 文档上下文且不自动触发提案生成

#### Scenario: Demo submit appends clarification summary
- **WHEN** 用户从 PRD“功能演示”入口打开弹框并成功点击“确认补充”
- **THEN** 系统 SHALL 将本次问答摘要以单条 `clarification_summary` 消息追加到当前需求 Chatbot 历史
- **THEN** 该摘要 SHALL 保留问题顺序与答案内容（含“其他”自定义输入）

#### Scenario: Demo validation failure does not append summary
- **WHEN** 演示弹框提交时存在必填项缺失或验收标准无有效条目
- **THEN** 系统 SHALL 阻止提交并展示错误提示
- **THEN** 系统 SHALL NOT 向 Chatbot 历史写入澄清摘要消息

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

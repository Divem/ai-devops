## MODIFIED Requirements

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

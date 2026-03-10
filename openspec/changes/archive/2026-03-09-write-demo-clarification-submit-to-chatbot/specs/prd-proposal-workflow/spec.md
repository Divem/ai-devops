## MODIFIED Requirements

### Requirement: Trigger proposal generation from PRD editor
当用户在 PRD 文档编辑区点击"生成提案"或"更新提案"按钮时，系统 SHALL 打开评审抽屉并展示 AI 评审结果作为可选参考信息，而非提案生成的前置条件；用户可直接提交生成提案。系统 SHALL 在 PRD 空状态区域提供“功能演示”小字入口，该入口位于“生成提案（请先生成 PRD）”按钮下方。

#### Scenario: No proposals exist — show generate button
- **WHEN** 当前文档为 `prd` 且 `normDocs.proposals.length === 0`
- **THEN** DocEditor 头部 SHALL 在"编辑"按钮旁显示【生成提案】按钮

#### Scenario: Proposals exist — show update button
- **WHEN** 当前文档为 `prd` 且 `normDocs.proposals.length > 0`
- **THEN** DocEditor 头部 SHALL 在"编辑"按钮旁显示【更新提案】按钮

#### Scenario: PRD content is empty — button disabled
- **WHEN** 当前 PRD 内容为空（null 或空字符串）
- **THEN** 生成提案 / 更新提案按钮 SHALL 处于禁用状态

#### Scenario: Demo submit appends clarification summary
- **WHEN** 用户从 PRD 空状态“功能演示”入口打开弹框并成功点击“确认补充”
- **THEN** 系统 SHALL 将本次问答摘要以单条 `clarification_summary` 消息追加到当前需求 Chatbot 历史
- **THEN** 该摘要 SHALL 保留问题顺序与答案内容（含“其他”自定义输入）

#### Scenario: Demo validation failure does not append summary
- **WHEN** 演示弹框提交时存在必填项缺失或验收标准无有效条目
- **THEN** 系统 SHALL 阻止提交并展示错误提示
- **THEN** 系统 SHALL NOT 向 Chatbot 历史写入澄清摘要消息

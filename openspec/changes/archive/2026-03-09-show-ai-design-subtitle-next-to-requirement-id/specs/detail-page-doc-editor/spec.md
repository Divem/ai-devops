## MODIFIED Requirements

### Requirement: DocEditor 头部展示需求上下文
DocEditor 头部 SHALL 在文档类型区域右侧展示当前需求上下文，采用“需求编号 + 副标题”单行结构，其中副标题位于需求编号右侧。

#### Scenario: 展示需求编号与副标题
- **WHEN** 用户在 AI 设计页打开任意需求文档
- **THEN** 头部上下文 SHALL 显示当前 `card.id`
- **THEN** 头部上下文 SHALL 在 `card.id` 右侧显示副标题（默认使用 `card.title`）

#### Scenario: 副标题过长时处理
- **WHEN** 副标题超出头部可用宽度
- **THEN** 副标题 SHALL 保持单行并以省略号截断
- **THEN** 系统 SHALL 保证头部操作按钮区域不被挤压导致错位

### Requirement: DocEditor header action buttons
DocEditor 头部操作区 SHALL 在文档内容存在且非编辑模式时展示操作按钮。当文档类型为 `prd` 时，SHALL 额外展示"生成提案/更新提案"按钮。

#### Scenario: prd with content — show edit, commit, and proposal button
- **WHEN** docType === 'prd' 且 content 不为空，且非编辑模式
- **THEN** 头部 SHALL 展示【编辑】、【提交到仓库】、以及【生成提案】或【更新提案】按钮

#### Scenario: non-prd doc — no proposal button
- **WHEN** docType !== 'prd'
- **THEN** 头部 SHALL NOT 展示提案相关按钮

#### Scenario: prd with no content — proposal button shown but disabled
- **WHEN** docType === 'prd' 且 content 为空
- **THEN** 头部 SHALL 展示【生成提案】按钮但处于禁用状态（此时编辑和提交按钮不显示）

#### Scenario: edit mode — proposal button hidden
- **WHEN** editMode === true
- **THEN** 头部 SHALL 仅展示【取消】和【保存】，不展示提案按钮

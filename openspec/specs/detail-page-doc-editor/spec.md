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

## ADDED Requirements

### Requirement: 原始需求文档只读渲染
当编辑器当前文档类型为“原始需求”时，系统 SHALL 以只读方式展示原始需求基础信息与原始需求正文，不进入可编辑 Markdown 文档模式。

#### Scenario: 展示基础信息与正文
- **WHEN** 用户在文档树选择“原始需求”
- **THEN** 编辑区域 SHALL 展示需求方、产品经理、提报时间、所属模块、Meego 链接等基础信息
- **THEN** 编辑区域 SHALL 展示原始需求正文内容并保留换行

#### Scenario: 缺失字段回退显示
- **WHEN** 原始需求基础信息字段部分缺失
- **THEN** 系统 SHALL 对缺失值使用回退显示（如 `-` 或空态提示），并保持页面可用

#### Scenario: 说明文案展示
- **WHEN** 用户查看“原始需求”文档
- **THEN** 系统 SHALL 显示说明：原始需求来自 Meego 同步的人类需求，产品需求 SPEC 是基于原始需求转化的标准化新文档

#### Scenario: 原始需求为空时展示 PRD 摘录示例
- **WHEN** 用户查看“原始需求”文档，且当前卡片无原始需求正文
- **THEN** 系统 SHALL 展示来自 `PM_AI_Plagform_PRD` 摘录的示例基础信息与正文
- **THEN** 系统 SHALL 显示“示例内容（来自 PRD 摘录）”标识

### Requirement: 编辑模式保留当前文档内容
系统 SHALL 在用户点击编辑时，以当前选中文档的可见内容初始化编辑区文本，避免进入编辑后内容被清空。

#### Scenario: 点击编辑后保留文本
- **WHEN** 用户在非空文档中点击“编辑”
- **THEN** 编辑区 SHALL 显示与当前文档一致的文本内容

#### Scenario: 空内容文档进入编辑
- **WHEN** 当前文档本身为空内容且用户点击“编辑”
- **THEN** 系统 SHALL 保持空编辑态且不覆盖其他已有文档内容

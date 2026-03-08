## ADDED Requirements

### Requirement: 评审抽屉双 Tab 布局
`DetailDrawer` 的 body 区域 SHALL 通过 Tab 切换展示「原始需求」和「评审报告」两个内容区，默认激活「评审报告」Tab。

#### Scenario: 默认显示评审报告 Tab
- **WHEN** 用户点击看板卡片打开评审抽屉
- **THEN** 抽屉 SHALL 默认激活「评审报告」Tab，展示需求描述、用户故事、验收标准和 AI 评审报告内容

#### Scenario: 切换到原始需求 Tab
- **WHEN** 用户点击「原始需求」Tab
- **THEN** body 区域 SHALL 切换显示 `card.rawRequirement` 内容，「评审报告」内容隐藏

#### Scenario: 原始需求为空时显示空态
- **WHEN** 用户切换到「原始需求」Tab，且 `card.rawRequirement` 为空/null
- **THEN** SHALL 显示提示文字"暂无原始需求内容"及引导用户填写的说明

### Requirement: 原始需求内容展示
「原始需求」Tab SHALL 以保留换行的纯文本格式展示 `card.rawRequirement` 内容，并提供"✎ 编辑"按钮入口。

#### Scenario: 展示原始需求全文
- **WHEN** `card.rawRequirement` 有内容且未进入编辑态
- **THEN** SHALL 以 `white-space: pre-wrap` 样式展示完整原始需求文本

#### Scenario: 进入编辑态
- **WHEN** 用户点击"✎ 编辑"按钮
- **THEN** 内容区 SHALL 切换为可编辑 textarea，内容为当前 rawRequirement 文本，顶部显示"保存"与"取消"按钮

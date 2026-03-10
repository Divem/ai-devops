## MODIFIED Requirements

### Requirement: 评审抽屉双 Tab 布局
`DetailDrawer` 的 body 区域 SHALL 通过 Tab 切换展示「原始需求」和「评审报告」两个内容区，默认激活「原始需求」Tab。

#### Scenario: 默认显示原始需求 Tab
- **WHEN** 用户点击看板卡片打开评审抽屉
- **THEN** 抽屉 SHALL 默认激活「原始需求」Tab，展示原始需求基础信息与正文内容

#### Scenario: 切换到评审报告 Tab
- **WHEN** 用户点击「评审报告」Tab
- **THEN** body 区域 SHALL 切换显示需求描述、用户故事、验收标准和 AI 评审报告内容

#### Scenario: 原始需求为空时显示 PRD 摘录示例
- **WHEN** 用户打开评审抽屉且 `card.rawRequirement` 为空/null
- **THEN** 系统 SHALL 在默认激活的「原始需求」Tab 中展示来自 `PM_AI_Plagform_PRD` 摘录的示例原始需求内容（含基础信息与正文）
- **THEN** 系统 SHALL 显示“示例内容（来自 PRD 摘录）”标识

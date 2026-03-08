## ADDED Requirements

### Requirement: 详情抽屉主 AI 按钮按评审状态切换
系统 SHALL 在看板详情抽屉中根据当前需求的评审完成状态显示不同主按钮：未完成评审显示“AI 智能评审”，已完成评审显示“AI 辅助设计”。

#### Scenario: 未完成评审时显示 AI 评审
- **WHEN** 用户打开详情抽屉且当前需求尚无评审结果（`aiResult` 为空）
- **THEN** 主按钮 SHALL 显示“AI 智能评审”，点击后触发评审流程

#### Scenario: 已完成评审时显示 AI 设计
- **WHEN** 用户打开详情抽屉且当前需求已有评审结果（`aiResult` 存在）
- **THEN** 主按钮 SHALL 显示“AI 辅助设计”，点击后触发设计流程

#### Scenario: 评审完成后主按钮即时切换
- **WHEN** 用户在详情抽屉内完成一次 AI 评审并写入评审结果
- **THEN** 主按钮 SHALL 从“AI 智能评审”切换为“AI 辅助设计”

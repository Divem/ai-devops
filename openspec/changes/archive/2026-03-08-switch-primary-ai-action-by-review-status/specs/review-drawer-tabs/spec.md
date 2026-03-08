## ADDED Requirements

### Requirement: 详情抽屉主按钮阶段化引导
`DetailDrawer` 的主操作按钮 SHALL 与需求评审阶段保持一致：评审前优先引导评审，评审后优先引导设计。

#### Scenario: 评审前主操作为 AI 评审
- **WHEN** 需求尚未产生 AI 评审结果
- **THEN** 详情抽屉主操作 SHALL 为“AI 智能评审”

#### Scenario: 评审后主操作为 AI 设计
- **WHEN** 需求已存在 AI 评审结果
- **THEN** 详情抽屉主操作 SHALL 切换为“AI 辅助设计”

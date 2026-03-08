## ADDED Requirements

### Requirement: 详情抽屉 AI 双按钮主次策略
`DetailDrawer` 底部操作区 SHALL 在任意评审状态下同时展示“AI 智能评审”和“AI 辅助设计”两个按钮，并依据评审状态动态调整两者主次样式与排序。

#### Scenario: 未评审时评审为主设计为次
- **WHEN** 当前需求不存在 AI 评审结果
- **THEN** 系统 SHALL 将“AI 智能评审”渲染为主按钮
- **THEN** 系统 SHALL 将“AI 辅助设计”渲染为次按钮且保持可点击
- **THEN** 主按钮 SHALL 在按钮顺序中优先显示

#### Scenario: 已评审时设计为主评审为次
- **WHEN** 当前需求已存在 AI 评审结果
- **THEN** 系统 SHALL 将“AI 辅助设计”渲染为主按钮
- **THEN** 系统 SHALL 将“AI 智能评审”渲染为次按钮且保持可点击
- **THEN** 主按钮 SHALL 在按钮顺序中优先显示

#### Scenario: 次按钮可用性不受主次切换影响
- **WHEN** 用户点击处于次级样式的 AI 按钮
- **THEN** 系统 SHALL 正常触发对应 AI 流程，不因主次状态阻断

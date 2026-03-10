## ADDED Requirements

### Requirement: AI 设计页顶部摘要徽章
系统 SHALL 在 AI 设计页面顶部导航区域展示需求摘要徽章，并使用与看板一致的指标口径。

#### Scenario: 顶部导航显示摘要徽章
- **WHEN** 用户进入 AI 设计页面
- **THEN** 系统 SHALL 在顶部导航中展示摘要徽章（如总数、状态计数等）
- **AND** 不再渲染独立的摘要行

#### Scenario: 指标口径与看板一致
- **WHEN** 系统计算 AI 设计页摘要数据
- **THEN** 系统 SHALL 复用与看板一致的统计规则与状态映射
- **AND** 相同数据集下 AI 设计页与看板的摘要计数结果保持一致

#### Scenario: 空数据回退为 0
- **WHEN** 当前无需求数据或某指标无可用数据
- **THEN** 系统 SHALL 将对应摘要值显示为 `0`
- **AND** 页面不因空值显示 `undefined`、`null` 或空白

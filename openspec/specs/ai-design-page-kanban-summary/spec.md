## ADDED Requirements

### Requirement: AI 辅助设计页展示看板概览指标
系统 SHALL 在 AI 辅助设计页展示与看板一致的概览指标区，至少包含“总需求”“已通过”“含文档”三项。

#### Scenario: 进入 AI 辅助设计页显示概览
- **WHEN** 用户进入 AI 辅助设计页
- **THEN** 页面 SHALL 显示概览指标区
- **THEN** 指标区 SHALL 包含“总需求”“已通过”“含文档”三个指标

### Requirement: 概览指标口径与看板一致
系统 SHALL 复用当前需求卡片集合计算指标，且统计口径与看板保持一致。

#### Scenario: 总需求统计
- **WHEN** 页面基于当前 `cards` 计算概览
- **THEN** “总需求” SHALL 等于 `cards` 的总数量

#### Scenario: 已通过统计
- **WHEN** 页面基于当前 `cards` 计算概览
- **THEN** “已通过” SHALL 等于状态为 `approved` 的需求数量

#### Scenario: 含文档统计
- **WHEN** 页面基于当前 `cards` 计算概览
- **THEN** “含文档” SHALL 统计存在任一文档内容的需求数量（包括原始需求或 PRD 或任一提案文档）

### Requirement: 空数据回退展示
当 AI 辅助设计页没有可统计需求时，概览区 SHALL 展示空态值且页面保持可用。

#### Scenario: 无需求数据
- **WHEN** `cards` 为空数组或不可用
- **THEN** “总需求”“已通过”“含文档”三个指标 SHALL 显示为 `0`
- **THEN** 文档树与编辑区 SHALL 继续按现有逻辑渲染，不因概览区报错中断

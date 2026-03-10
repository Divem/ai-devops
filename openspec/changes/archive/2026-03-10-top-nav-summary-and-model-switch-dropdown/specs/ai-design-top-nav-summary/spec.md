## ADDED Requirements

### Requirement: AI 设计页概览信息并入顶部导航
系统 SHALL 在 AI 辅助设计页顶部导航同一行展示“总需求”“已通过”“含文档”三项概览信息，不再通过独立概览行展示。

#### Scenario: 顶部同排显示三项概览
- **WHEN** 用户进入 AI 辅助设计页
- **THEN** 顶部导航同一行 SHALL 显示“总需求”“已通过”“含文档”三项信息
- **THEN** 页面 SHALL NOT 渲染单独的概览信息行

### Requirement: 顶部概览口径一致
系统 SHALL 使用与看板一致的统计口径计算顶部概览值。

#### Scenario: 总需求口径
- **WHEN** 系统计算顶部概览
- **THEN** “总需求” SHALL 等于当前 `cards` 总数

#### Scenario: 已通过口径
- **WHEN** 系统计算顶部概览
- **THEN** “已通过” SHALL 等于状态属于 `approved` 或 `submitted` 的需求数量

#### Scenario: 含文档口径
- **WHEN** 系统计算顶部概览
- **THEN** “含文档” SHALL 与看板统计规则一致

### Requirement: 空数据兜底
当无可用需求数据时，顶部概览 SHALL 以空态值展示且不影响页面主体。

#### Scenario: 无数据时回退为 0
- **WHEN** `cards` 为空或不可用
- **THEN** 三项概览值 SHALL 显示为 `0`
- **THEN** 文档树、编辑区与 Chatbot SHALL 保持可用

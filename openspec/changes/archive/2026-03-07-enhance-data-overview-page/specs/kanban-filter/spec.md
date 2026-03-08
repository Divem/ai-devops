## MODIFIED Requirements

### Requirement: 筛选状态持久化
用户的筛选选择 SHALL 被持久化到本地存储，并支持来自数据概览下钻条件的注入与恢复。

#### Scenario: 保存筛选状态
- **WHEN** 用户选择或取消任何筛选条件
- **THEN** 当前筛选状态保存到 localStorage
- **AND** 保存的键名为 'kanban-filter-state'

#### Scenario: 恢复筛选状态
- **WHEN** 用户刷新页面或重新打开看板
- **THEN** 系统从 localStorage 读取筛选状态
- **AND** 恢复用户上次的选择
- **AND** 看板显示对应的筛选结果

#### Scenario: 数据概览下钻注入筛选
- **WHEN** 用户从数据概览点击任一可下钻项进入看板
- **THEN** 系统将下钻条件写入当前筛选状态
- **AND** 看板仅展示匹配下钻条件的需求卡片

#### Scenario: 下钻筛选与手动筛选共存
- **WHEN** 用户在下钻进入看板后继续手动调整筛选
- **THEN** 系统合并更新筛选状态并重新持久化

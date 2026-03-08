## ADDED Requirements

### Requirement: 卡片维度标签展示
看板卡片 SHALL 在底部展示 space、subsystem、app、iteration 字段的值（各字段有值时才渲染对应标签）。

#### Scenario: 有维度数据的卡片
- **WHEN** 卡片的 `space` 字段有值
- **THEN** 卡片底部显示对应的蓝色 badge，内容为 space 值

#### Scenario: 无维度数据的卡片
- **WHEN** 卡片的 `space`/`subsystem`/`app`/`iteration` 均为空
- **THEN** 卡片底部不渲染任何维度标签行

### Requirement: 点击维度标签触发筛选
看板卡片上的维度标签 SHALL 支持点击，点击后将该维度值加入（或切换）对应的 FilterBar 筛选条件。

#### Scenario: 点击空间标签
- **WHEN** 用户点击卡片上的空间标签
- **THEN** 该空间值被添加到 FilterBar 空间筛选，看板立即按新条件过滤；不打开卡片详情页

#### Scenario: 点击子系统标签
- **WHEN** 用户点击卡片上的子系统标签
- **THEN** 该子系统值被添加到 FilterBar 子系统筛选，看板立即过滤

#### Scenario: 点击应用标签
- **WHEN** 用户点击卡片上的应用标签
- **THEN** 该应用值被添加到 FilterBar 应用筛选，看板立即过滤

#### Scenario: 点击迭代标签
- **WHEN** 用户点击卡片上的迭代标签
- **THEN** 该迭代值被添加到 FilterBar 迭代筛选，看板立即过滤

#### Scenario: 点击不触发详情页
- **WHEN** 用户点击卡片上的维度标签
- **THEN** 不打开卡片详情页（事件阻止冒泡）

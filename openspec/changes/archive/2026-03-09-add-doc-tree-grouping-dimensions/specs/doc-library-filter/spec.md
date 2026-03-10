## MODIFIED Requirements

### Requirement: 多筛选叠加
多个筛选 chip SHALL 可同时激活，过滤条件取交集（AND 逻辑），并在启用分组时先完成筛选再执行分组渲染。

#### Scenario: 同时激活多个筛选
- **WHEN** 用户同时激活"仅本需求"和"过滤已Lock"
- **THEN** 只显示 focusCardId 对应且非终态的需求卡片

#### Scenario: 分组模式下筛选优先
- **WHEN** 用户启用任意分组维度且激活一个或多个筛选 chip
- **THEN** 系统 SHALL 先按筛选条件计算可见需求集合
- **AND** 仅对该可见需求集合执行分组并渲染

## ADDED Requirements

### Requirement: 分组模式下不渲染空分组
在分组模式中，文档库 SHALL 仅渲染至少包含 1 条可见需求的分组。

#### Scenario: 分组被筛选清空
- **WHEN** 某分组内全部需求被筛选条件过滤
- **THEN** 该分组 SHALL 不在文档树中渲染

#### Scenario: 分组保留可见需求
- **WHEN** 某分组仍有至少 1 条需求满足筛选条件
- **THEN** 该分组 SHALL 继续显示并包含满足条件的需求卡片

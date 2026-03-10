## ADDED Requirements

### Requirement: 文档库筛选 Chip UI
DocTreeSidebar SHALL 在顶部标题行右侧渲染一组筛选 chip，供用户按需激活过滤条件。

#### Scenario: 默认无筛选
- **WHEN** 用户打开详情页文档库
- **THEN** 所有 chip 均未激活，文档树显示全部需求卡片

#### Scenario: 激活筛选 chip
- **WHEN** 用户点击某个筛选 chip
- **THEN** 该 chip 高亮（accent 色），文档树立即按该条件过滤显示

#### Scenario: 取消筛选 chip
- **WHEN** 用户再次点击已激活的筛选 chip
- **THEN** 该 chip 恢复未激活状态，对应过滤条件移除

### Requirement: 仅本需求筛选
文档库 SHALL 提供"仅本需求"筛选，激活后只显示当前打开需求（focusCardId）的文档树条目。

#### Scenario: 激活仅本需求
- **WHEN** 用户激活"仅本需求"chip
- **THEN** 文档树只渲染 focusCardId 对应的需求卡片，其他需求卡片不显示

#### Scenario: focusCardId 为空时降级
- **WHEN** "仅本需求"激活但 focusCardId 为 null/undefined
- **THEN** 不过滤，显示所有卡片

### Requirement: 过滤已PR筛选
文档库 SHALL 提供"过滤已PR"筛选，激活后隐藏状态为"已通过"（col === 'approved'）的需求。

#### Scenario: 激活过滤已PR
- **WHEN** 用户激活"过滤已PR"chip
- **THEN** col 为 approved 的需求卡片从文档树中隐藏

### Requirement: 过滤已Lock筛选
文档库 SHALL 提供"过滤已Lock"筛选，激活后隐藏处于终态（col === 'approved' 或 col === 'rejected'）的需求。

#### Scenario: 激活过滤已Lock
- **WHEN** 用户激活"过滤已Lock"chip
- **THEN** col 为 approved 或 rejected 的需求卡片从文档树中隐藏

### Requirement: 多筛选叠加
多个筛选 chip SHALL 可同时激活，过滤条件取交集（AND 逻辑），并在启用分组时先完成筛选再执行分组渲染。

#### Scenario: 同时激活多个筛选
- **WHEN** 用户同时激活"仅本需求"和"过滤已Lock"
- **THEN** 只显示 focusCardId 对应且非终态的需求卡片

#### Scenario: 分组模式下筛选优先
- **WHEN** 用户启用任意分组维度且激活一个或多个筛选 chip
- **THEN** 系统 SHALL 先按筛选条件计算可见需求集合
- **AND** 仅对该可见需求集合执行分组并渲染

### Requirement: 分组模式下不渲染空分组
在分组模式中，文档库 SHALL 仅渲染至少包含 1 条可见需求的分组。

#### Scenario: 分组被筛选清空
- **WHEN** 某分组内全部需求被筛选条件过滤
- **THEN** 该分组 SHALL 不在文档树中渲染

#### Scenario: 分组保留可见需求
- **WHEN** 某分组仍有至少 1 条需求满足筛选条件
- **THEN** 该分组 SHALL 继续显示并包含满足条件的需求卡片

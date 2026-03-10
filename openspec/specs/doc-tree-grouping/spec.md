## ADDED Requirements

### Requirement: 文档树支持按维度分组
DocTreeSidebar SHALL 提供分组维度切换，并按所选维度渲染“分组 -> 需求卡片 -> 文档节点”的层级结构。

#### Scenario: 默认不分组
- **WHEN** 用户首次打开详情页文档树
- **THEN** 系统 SHALL 以当前卡片平铺方式展示，不额外插入分组层

#### Scenario: 切换到分组模式
- **WHEN** 用户将分组维度切换为任一业务维度
- **THEN** 系统 SHALL 在文档树中先渲染分组节点，再渲染组内需求卡片

### Requirement: 分组维度覆盖业务字段
系统 SHALL 支持以下分组维度：`space`、`subsystem`、`app`、`iteration`、`priority`、`status`、`demander`、`productManager`。

#### Scenario: 按提出人分组
- **WHEN** 用户选择“提出人（需求方）”作为分组维度
- **THEN** 系统 SHALL 使用需求卡片的 `demander` 字段进行分组

#### Scenario: 按受理人分组
- **WHEN** 用户选择“受理人（产品经理）”作为分组维度
- **THEN** 系统 SHALL 使用需求卡片的 `productManager` 字段进行分组

### Requirement: 缺失维度值归入未分配
当分组维度对应字段为空时，系统 SHALL 将该需求卡片归入“未分配”分组，而不是隐藏。

#### Scenario: 维度字段为空
- **WHEN** 某需求卡片在当前分组维度下没有有效值
- **THEN** 该卡片 SHALL 出现在“未分配”分组内

### Requirement: 分组节点支持折叠与计数
分组节点 SHALL 支持展开/收起，并展示组内需求数量。

#### Scenario: 折叠分组
- **WHEN** 用户点击已展开的分组节点
- **THEN** 组内需求卡片 SHALL 被收起且仅显示分组头信息

#### Scenario: 展开分组
- **WHEN** 用户点击已收起的分组节点
- **THEN** 组内需求卡片 SHALL 重新显示，且组头继续显示该组需求数

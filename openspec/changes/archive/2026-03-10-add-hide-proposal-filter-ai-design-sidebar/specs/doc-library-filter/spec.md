## ADDED Requirements

### Requirement: 隐藏提案筛选条件
DocTreeSidebar SHALL 提供“隐藏提案”筛选 chip；激活后，文档树中所有 OpenSpec 提案相关文档节点 MUST 被隐藏。

#### Scenario: 默认不隐藏提案
- **WHEN** 用户首次进入 AI 设计页面且未激活“隐藏提案”
- **THEN** 文档树继续展示原始需求、PRD 与提案相关文档节点

#### Scenario: 激活隐藏提案
- **WHEN** 用户点击并激活“隐藏提案”chip
- **THEN** 文档树中提案目录（多提案文件夹）与提案子文档项（Proposal、Design、Delta Spec、Tasks）全部不渲染
- **AND** 原始需求与 PRD 文档节点继续可见

#### Scenario: 取消隐藏提案
- **WHEN** 用户再次点击已激活的“隐藏提案”chip
- **THEN** 文档树恢复渲染全部提案相关节点

### Requirement: 隐藏提案与其他筛选叠加
“隐藏提案”筛选 SHALL 与“仅本需求”“过滤已PR”“过滤已Lock”等已存在筛选按 AND 逻辑叠加生效。

#### Scenario: 与仅本需求叠加
- **WHEN** 用户同时激活“仅本需求”和“隐藏提案”
- **THEN** 文档树仅显示当前需求卡片下的非提案文档节点

#### Scenario: 与状态过滤叠加
- **WHEN** 用户同时激活“过滤已Lock”和“隐藏提案”
- **THEN** 文档树仅展示未被状态过滤且为非提案类型的文档节点

#### Scenario: 分组模式下叠加生效
- **WHEN** 用户启用任意分组并激活“隐藏提案”
- **THEN** 系统先计算可见需求集合与可见文档节点，再执行分组渲染
- **AND** 不渲染仅包含提案节点而被过滤为空的分组

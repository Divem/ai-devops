## Context

当前 `DocTreeSidebar` 先基于筛选 chip 计算 `visibleCards`，再直接按卡片渲染树节点，不存在“分组层”。当需求数量增加时，用户只能依赖滚动和标题搜索，无法按组织维度快速定位。现有数据结构已包含 `space/subsystem/app/iteration/priority/col/demander/productManager` 等字段，具备分组条件，且不需要后端变更。

约束：
- 保持现有选中文档键格式（`selectedKey`）与文档编辑联动逻辑不变。
- 保持现有筛选 chip 行为不变，仅新增“筛选后分组”能力。
- 缺失字段需可见，不能因为空值导致卡片消失。

## Goals / Non-Goals

**Goals:**
- 在左侧文档树新增分组维度切换能力，支持 `none/space/subsystem/app/iteration/priority/status/demander/productManager`。
- 引入组级折叠与计数展示，提升大量卡片时的可浏览性。
- 明确筛选与分组顺序：先筛选后分组，确保与现有筛选逻辑兼容。
- 对空值统一归类为“未分配”，确保数据完整可见。

**Non-Goals:**
- 不调整右侧编辑器和 Chat 区域交互。
- 不改变文档内容结构（`docs.prd`、`docs.proposals` 等）。
- 不引入后端接口、数据库字段或权限策略改造。

## Decisions

### 1) 在 DocTreeSidebar 增加“分组状态 + 分组计算”
- 决策：新增 `groupBy`（当前分组维度）与 `expandedGroups`（组展开状态）状态，并使用 `useMemo` 计算 `groupedCards`。
- 原因：分组是左侧导航本地视图逻辑，放在 `DocTreeSidebar` 可最小化影响面，避免把展示态提升到页面级。
- 备选方案：
  - 方案A：在 `DetailPage` 预先分组再传入 Sidebar；缺点是增加跨组件耦合，后续维护成本更高。
  - 方案B：新增全局 store；缺点是超出需求复杂度。

### 2) 采用“筛选后分组”管线
- 决策：沿用现有 `visibleCards` 筛选结果，再按 `groupBy` 聚合。
- 原因：用户对筛选语义已有预期，先筛选可保证组内只显示符合条件的卡片，避免“组存在但组内为空”的困惑。
- 备选方案：先分组后筛选；缺点是需要处理空组清理与计数一致性，交互理解成本更高。

### 3) 统一维度映射与兜底文案
- 决策：通过维度配置表定义 `id/label/valueGetter/sortStrategy`，空值统一映射为 `未分配`。
- 原因：新增维度（本次的提出人、受理人）只需扩展配置，不需要复制渲染逻辑。
- 备选方案：在渲染处分支判断每个维度；缺点是条件分叉增加，容易遗漏。

### 4) 保持文档节点与选中键协议不变
- 决策：分组层只包裹“卡片层”，不改变卡片层以下树结构和 `selectedKey` 生成规则。
- 原因：可避免影响 `DocEditor`、提案展开和提交 Git 状态等现有能力。
- 备选方案：将分组键纳入 `selectedKey`；缺点是需要同步改动文档解析逻辑，风险高且收益低。

## Risks / Trade-offs

- [风险] 分组后节点层级增加，用户首屏可见内容减少 → [缓解] 默认保留“不分组”，仅在用户主动切换时启用。
- [风险] 空字段较多时“未分配”分组过大 → [缓解] 在组头显示计数并支持折叠，避免导航噪音。
- [风险] 维度排序不一致导致认知负担 → [缓解] 对 `priority/status/iteration` 使用固定排序策略，其他维度按文本排序。
- [风险] 大量卡片时重复计算影响渲染性能 → [缓解] 使用 `useMemo`，并避免在渲染期做深层对象拷贝。

## Migration Plan

1. 增加分组维度配置、`groupBy` 与 `expandedGroups` 状态。
2. 将现有 `visibleCards` 渲染改为 `groupedCards` 渲染（`groupBy=none` 保持现状分支）。
3. 添加“分组维度”选择器和组级折叠交互。
4. 验证与筛选 chip 叠加、文档选中、提案展开等既有能力回归正常。

回滚策略：
- 回滚到不使用 `groupedCards` 的旧渲染路径；`groupBy` 相关状态和 UI 可整体移除，不涉及数据迁移。

## Open Questions

- “状态”分组展示文案是否直接复用看板列中文名（如“待评审/评审中”），还是使用内部值映射？建议复用中文名。
- 是否需要记忆用户上次分组选择（localStorage）？本次可先不做，后续按体验反馈迭代。

## Why

当前 AI 设计页左侧文档树仅按需求卡片平铺展示，需求数量增多后定位效率显著下降。需要新增按业务维度分组能力，让用户能按语义视角快速收敛并浏览文档。

## What Changes

- 在文档树顶部新增“分组维度”选择器，支持在不同维度之间切换分组展示。
- 新增分组维度：空间、子系统、应用、迭代、优先级、状态、提出人（需求方）、受理人（产品经理），并保留“不分组”模式。
- 在分组模式下增加组级折叠/展开与计数展示，组内保持现有“需求卡片 → 文档节点/提案文件夹”结构不变。
- 分组能力与现有筛选 chip（仅本需求、过滤已PR、过滤已Lock）叠加生效，筛选后再分组。
- 对缺失维度值的需求卡片统一归入“未分配”分组，避免丢失可见性。

## Capabilities

### New Capabilities
- `doc-tree-grouping`: 定义文档树分组维度、分组渲染、组交互与未分配兜底行为。

### Modified Capabilities
- `doc-library-filter`: 明确筛选与分组的叠加规则（筛选后分组）及在分组模式下的可见性约束。

## Impact

- 受影响代码：`pm-ai-app/src/PMPlatform.jsx`（`DocTreeSidebar` 分组状态、分组计算、树渲染结构）。
- 受影响数据字段：复用需求卡片已有字段 `space/subsystem/app/iteration/priority/col/demander/productManager`。
- 外部依赖与 API：无新增后端接口、无新增第三方依赖。

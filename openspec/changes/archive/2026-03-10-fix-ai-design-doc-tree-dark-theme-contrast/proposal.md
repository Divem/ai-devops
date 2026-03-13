## Why

AI 辅助设计页面左侧树形导航近期出现亮色背景，和既有暗色侧栏视觉体系冲突，降低信息层级可读性并影响整体一致性。需要恢复并规范暗色主题下的导航对比与交互态，以避免后续样式回归。

## What Changes

- 修复 AI 设计页面左侧文档树容器与节点背景，确保在暗色侧栏中保持统一主题。
- 统一文档树节点的默认态、悬浮态、激活态、焦点态颜色对比，避免出现突兀亮底。
- 约束筛选 chip、分组下拉、文件夹/文档项在暗色背景下的可读性与边界表现。
- 增加暗色主题兼容要求，明确后续变更不得引入破坏暗色侧栏的一次性亮色样式。

## Capabilities

### New Capabilities
- `ai-design-doc-tree-dark-theme-compat`: 规范 AI 设计页左侧树形导航在暗色主题下的背景与交互态视觉一致性。

### Modified Capabilities
- (none)

## Impact

- 受影响模块：`pm-ai-app/src/PMPlatform.jsx` 中 `DocTreeSidebar` 及相关交互样式。
- 受影响范围：前端样式与状态态（default/hover/active/focus-visible）表现，不涉及业务逻辑与数据结构。
- 不新增外部依赖，不变更 API。

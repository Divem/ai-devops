## Why

AI 设计页面左侧树形导航中，需求文件夹行只显示优先级徽标和编号（如 `REQ-100`），需求标题只在展开后才出现在缩进的子区域。用户无法在折叠态下快速识别需求内容，需要反复展开/收起来定位目标需求。在编号右侧内联副标题可以大幅提升导航效率。

## What Changes

- `FolderItem` 文件夹行：编号右侧新增副标题（`subtitle` prop），截断时用 `title` 属性提供鼠标悬浮 tooltip
- 需求文件夹 `FolderItem` 调用处：传入 `card.title` 作为 `subtitle`
- 展开后的独立标题子区域可保留（不影响折叠态信息）

## Capabilities

### New Capabilities
（无）

### Modified Capabilities
- `doc-tree-card-header`: 文件夹行新增 subtitle 显示，支持截断 tooltip

## Impact

- `pm-ai-app/src/PMPlatform.jsx` — `FolderItem` 组件 + 需求文件夹 label 调用处（行 ~3880 & ~3957）

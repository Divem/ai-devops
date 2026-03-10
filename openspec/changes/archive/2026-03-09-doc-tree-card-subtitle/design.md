## Context

`FolderItem` 当前签名：`{ label, open, onToggle, count }`，`label` 是 ReactNode。需求文件夹调用时传入 `<span>优先级+编号</span>`。`FolderItem` 内部将 label 和折叠图标、文档计数渲染在同一行的 flexbox 中。

## Goals / Non-Goals

**Goals:**
- `FolderItem` 新增可选 `subtitle` prop，显示在 label 右侧
- subtitle 超出可用空间时截断（`overflow: hidden, textOverflow: ellipsis, whiteSpace: nowrap`）
- `title` 属性值为完整 subtitle 文字，实现浏览器原生 tooltip

**Non-Goals:**
- 不修改其他 `FolderItem` 调用处（顶部 PRD 文件夹等，不传 subtitle 则不显示）
- 不实现自定义 tooltip 弹层，使用原生 `title` 属性即可

## Decisions

**布局方案**：label 部分用 `flex:0 0 auto`（最小宽度），subtitle 用 `flex:1 1 0, minWidth:0`（可收缩），count badge 保持 `flexShrink:0`。这样 subtitle 在空间不足时自动收缩而不挤压编号和计数。

**实现位置**：`FolderItem` 接受 `subtitle` 可选 prop，不影响其他调用。调用处在行 ~3957 的需求文件夹 `FolderItem` 传入 `subtitle={card.title}`。

## Risks / Trade-offs

- 侧边栏宽度 260px，编号+优先级约占 80px，计数徽标约占 30px，subtitle 可用宽度约 150px，足够显示 12-16 个中文字符。

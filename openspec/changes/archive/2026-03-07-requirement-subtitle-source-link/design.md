## Context

`ChatbotPanel` 的 Header 副标题（line 2525）和 `ReferencePanel` 的 Header 副标题（line 2617）当前渲染写死字符串。需要改为渲染可点击的需求描述链接。

## Goals / Non-Goals

**Goals:**
- 副标题文字内容改为 `card.desc`（截断超长文字）
- 鼠标移入时：`cursor: pointer`、颜色变为 accent 蓝、显示下划线
- 点击时：`window.open(card.sourceUrl || "https://www.github.com", "_blank")`

**Non-Goals:**
- 不在 UI 上添加编辑 `sourceUrl` 的入口（由数据层配置）
- 不修改 TopBar 面包屑中的需求标题
- 不修改 DocEditor header 中的副标题

## Decisions

### 用 `<a>` 标签还是 onClick？

用 `<a href=... target="_blank">` 原生链接，比 `onClick + window.open` 更语义化，中间键点击也能正确在新标签页打开。同时设置 `rel="noreferrer noopener"`。

### 副标题文本截断
`card.desc` 最长显示 40 个字符，超出以 `…` 截断，避免撑破 Header 布局。

### 默认 sourceUrl
`card.sourceUrl || "https://www.github.com"`，占位地址帮助演示效果，生产使用时替换为真实 Jira/飞书链接。

## Risks / Trade-offs

- [desc 可能为空] → `card.desc || card.title` 兜底，确保始终有文字可显示

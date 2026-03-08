## 1. KanbanCard 新增维度标签与回调

- [x] 1.1 `KanbanCard` props 新增 `onFilterClick`（可选，默认 noop）
- [x] 1.2 在 `👤 author` 行之前插入维度标签行：遍历 `[['space','空间',C.accent,C.accentLight], ['subsystem','子系统',C.purple,C.purpleLight], ['app','应用',C.warn,C.warnLight], ['iteration','迭代',C.teal,C.tealLight]]`，有值则渲染对应 badge
- [x] 1.3 每个 badge 的 `onClick` 调用 `e.stopPropagation()` 后调 `onFilterClick(dimension, value)`
- [x] 1.4 若四个维度均无值，整行不渲染（避免空白间距）

## 2. 根组件新增 handleCardFilterClick

- [x] 2.1 在 `PMPlatform` 中实现 `handleCardFilterClick(dimension, value)`，dispatch 到对应 toggle handler（space/subsystem/app/iteration）
- [x] 2.2 将 `handleCardFilterClick` 作为 `onFilterClick` 传入 `<KanbanCard>`

## 3. 验证

- [x] 3.1 卡片上有 space 值时，底部显示蓝色空间 badge
- [x] 3.2 点击空间 badge，FilterBar 空间筛选变化，看板立即过滤
- [x] 3.3 点击 badge 不打开详情页
- [x] 3.4 无维度数据的卡片底部无额外空白

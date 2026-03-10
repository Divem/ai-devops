# Tasks: doc-tree-card-subtitle

- [x] `FolderItem` 组件新增 `subtitle` 可选 prop，在 label 右侧渲染截断副标题（flex 布局，`overflow:hidden, textOverflow:ellipsis, whiteSpace:nowrap`，`title={subtitle}` 提供 tooltip）
- [x] 需求文件夹 `FolderItem` 调用处（行 ~3957）传入 `subtitle={card.title}`
- [x] 验证：折叠态显示副标题；长标题截断并 hover 显示 tooltip；其他 FolderItem 调用不受影响

## 1. 修改 ChatbotPanel Header 副标题

- [x] 1.1 将 `<div>帮你分析、优化和完善需求</div>` 替换为可点击的 `<a>` 链接元素
- [x] 1.2 链接文本：`card.desc` 截断至 40 字符，兜底 `card.title`
- [x] 1.3 href 使用 `card.sourceUrl || "https://www.github.com"`，`target="_blank"` + `rel="noreferrer noopener"`
- [x] 1.4 默认样式：`fontSize:11, color:C.muted, textDecoration:"none"`
- [x] 1.5 hover 样式：`color:C.accent, textDecoration:"underline"`（通过 onMouseEnter/Leave 实现）

## 2. 修改 ReferencePanel Header 副标题

- [x] 2.1 将 `<div>相似的需求参考</div>` 同样改为可点击链接，样式与 1.x 保持一致
- [x] 2.2 同样使用 `card.desc`（截断）+ `card.sourceUrl` 逻辑
- [x] 2.3 注意：ReferencePanel 接收的是 `currentCard` prop，确保字段访问正确

## 3. 验证

- [x] 3.1 打开任意需求详情页，查看右侧面板 Header 副标题显示 desc 内容
- [x] 3.2 鼠标移入副标题，确认光标变为 pointer、文字变蓝并带下划线
- [x] 3.3 点击副标题，确认在新标签页打开 github.com

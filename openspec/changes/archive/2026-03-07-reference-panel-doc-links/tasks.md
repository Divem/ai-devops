## 1. 重构 ReferencePanel 组件

- [x] 1.1 在组件顶部定义 `REF_TYPE_META` 映射（feishu/prd/spec 的图标和颜色）
- [x] 1.2 新增"参考文档"分组区块：渲染 `currentCard.references` 列表
- [x] 1.3 每条文档渲染为可点击行（icon + title + →），`target="_blank"` 打开 url
- [x] 1.4 `references` 为空/缺失时渲染占位卡片（虚线边框 + 引导文字）
- [x] 1.5 相似需求列表移至下方，加"相似需求"分组标题

## 2. 补充 INITIAL_CARDS 示例数据

- [x] 2.1 为 REQ-100 添加 3 条 references（feishu + prd + spec 各一条，url 用 github 占位）
- [x] 2.2 为 REQ-101 添加 2 条 references（feishu + prd）

## 3. 验证

- [x] 3.1 打开有 references 数据的卡片详情页，切换到"参考资料"TAB，确认文档列表正常渲染
- [x] 3.2 切换到无 references 的卡片，确认占位卡片正常显示，面板不再空白
- [x] 3.3 点击文档行，确认在新标签页跳转

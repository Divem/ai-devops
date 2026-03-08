## 1. 添加筛选 state

- [x] 1.1 在 `DocTreeSidebar` 组件内添加 `filters` state：`const [filters, setFilters] = useState(new Set())`
- [x] 1.2 实现 `toggleFilter(id)` helper：若 id 在 Set 中则删除，否则添加（返回新 Set）

## 2. 计算 visibleCards

- [x] 2.1 在渲染前计算 `visibleCards`，从 `cards` 派生：
  - `focus` 激活且 focusCardId 存在：只保留 `card.id === focusCardId` 的卡片
  - `no-approved` 激活：过滤掉 `card.col === 'approved'` 的卡片
  - `no-locked` 激活：过滤掉 `card.col === 'approved' || card.col === 'rejected'` 的卡片
- [x] 2.2 将原 `cards.map(...)` 改为 `visibleCards.map(...)`

## 3. 渲染筛选 Chip UI

- [x] 3.1 定义 `FILTER_CHIPS` 常量数组：`[{ id: 'focus', label: '仅本需求' }, { id: 'no-approved', label: '过滤已PR' }, { id: 'no-locked', label: '过滤已Lock' }]`
- [x] 3.2 将"文档库"标题行改为 flex row（justify-content: space-between），右侧放 chip 组
- [x] 3.3 实现 chip 按钮样式：激活时 `background: C.accent, color: '#fff'`，未激活时 `background: C.sbHover, color: C.sbMuted`
- [x] 3.4 chip font-size: 10px，padding: 2px 7px，border-radius: 10px，cursor: pointer

## 4. 验证

- [x] 4.1 打开详情页，确认筛选 chip 在文档库顶部右侧显示
- [x] 4.2 点击"仅本需求"，确认只显示当前需求文档树
- [x] 4.3 点击"过滤已PR"/"过滤已Lock"，确认对应状态的需求被隐藏
- [x] 4.4 多选叠加，确认 AND 逻辑正确
- [x] 4.5 再次点击已激活 chip，确认取消过滤

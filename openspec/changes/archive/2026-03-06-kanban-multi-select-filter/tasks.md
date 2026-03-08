## 1. 数据模型扩展

- [x] 1.1 在 INITIAL_CARDS 中为每个卡片添加 `space` 和 `iteration` 字段
- [x] 1.2 准备模拟数据：定义 3-5 个空间名称和对应的迭代列表
- [x] 1.3 为每个卡片分配合理的 space 和 iteration 值

## 2. 状态管理

- [x] 2.1 在 PMPlatform 组件中添加 `selectedSpaces` state（默认为空数组）
- [x] 2.2 在 PMPlatform 组件中添加 `selectedIterations` state（默认为空数组）
- [x] 2.3 添加 `spaceDropdownOpen` state 控制空间下拉框展开/收起
- [x] 2.4 添加 `iterationDropdownOpen` state 控制迭代下拉框展开/收起

## 3. 筛选逻辑实现

- [x] 3.1 使用 useMemo 创建 `availableSpaces` 计算所有可用空间列表
- [x] 3.2 使用 useMemo 创建 `availableIterations` 根据选中空间计算可用迭代列表
- [x] 3.3 使用 useMemo 创建 `filteredCards` 根据筛选条件过滤卡片
- [x] 3.4 实现级联逻辑：空间变化时自动清理不属于该空间的迭代选择
- [x] 3.5 实现 `handleSpaceToggle` 函数处理空间选择/取消
- [x] 3.6 实现 `handleIterationToggle` 函数处理迭代选择/取消
- [x] 3.7 实现 `handleClearAllFilters` 函数清除所有筛选

## 4. 本地存储

- [x] 4.1 创建 `saveFilterState` 函数保存筛选状态到 localStorage
- [x] 4.2 创建 `loadFilterState` 函数从 localStorage 恢复筛选状态
- [x] 4.3 在 useEffect 中加载初始筛选状态
- [x] 4.4 在筛选条件变化时自动保存到 localStorage

## 5. MultiSelectFilter 组件

- [x] 5.1 创建 `MultiSelectFilter` 组件基础结构
- [x] 5.2 实现空间下拉框的渲染和交互
- [x] 5.3 实现迭代下拉框的渲染和交互
- [x] 5.4 实现已选条件标签展示
- [x] 5.5 实现标签的 × 关闭按钮功能
- [x] 5.6 添加"清除筛选"按钮
- [x] 5.7 应用 SDD 样式（颜色变量、圆角、边框等）

## 6. PMPlatform 集成

- [x] 6.1 在看板列标题上方添加筛选器区域
- [x] 6.2 将 MultiSelectFilter 组件集成到 PMPlatform 布局中
- [x] 6.3 更新看板渲染逻辑使用 `filteredCards` 替代 `cards`
- [x] 6.4 添加空状态提示：无筛选结果时显示友好提示

## 7. 测试验证

- [x] 7.1 测试初始加载：筛选器正确显示默认状态
- [x] 7.2 测试空间单选：选择空间后看板正确过滤
- [x] 7.3 测试空间多选：选择多个空间后看板正确显示
- [x] 7.4 测试级联选择：选择空间后迭代下拉仅显示该空间的迭代
- [x] 7.5 测试迭代选择：选择迭代后看板正确过滤
- [x] 7.6 测试标签移除：点击标签 × 按钮正确移除筛选条件
- [x] 7.7 测试清除全部：点击"清除筛选"按钮重置所有条件
- [x] 7.8 测试状态持久化：刷新页面后筛选状态正确恢复
- [x] 7.9 测试无结果状态：筛选无结果时显示正确提示
- [x] 7.10 测试样式：筛选器样式符合 SDD 设计规范

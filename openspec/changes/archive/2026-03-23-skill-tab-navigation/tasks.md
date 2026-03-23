# Tasks: Skill Tab Navigation

## 1. 导航 Tab 集成

- [x] 1.1 将 "Skill 管理" 加入顶部导航 tab 数组（与 kanban/stats 平级）
- [x] 1.2 移除导航栏中单独的 "Skill 管理" 按钮（原 `setCurrentView('skills')` 按钮）

## 2. SkillManagementPage 改造

- [x] 2.1 移除 `SkillManagementPage` 的 header 区域（返回按钮 + logo + 标题 + ThemeModeToggle）
- [x] 2.2 移除 `SkillManagementPage` 的外层全屏容器样式（height:100vh 等），改为纯内容
- [x] 2.3 移除 `onBack` prop

## 3. 主组件路由调整

- [x] 3.1 移除 `currentView === 'skills'` 的 early return 分支
- [x] 3.2 在 `activeTab === 'skills'` 时渲染 SkillManagementPage 内容（与 stats tab 同模式）

## 4. 验证

- [x] 4.1 验证点击 Skill 管理 tab 后顶部导航不变、内容正确显示
- [x] 4.2 验证 tab 高亮样式与其他 tab 一致
- [x] 4.3 验证 Skill 编辑（内联编辑器）在 tab 模式下正常工作
- [x] 4.4 验证从 Skill tab 切回看板/数据概览正常

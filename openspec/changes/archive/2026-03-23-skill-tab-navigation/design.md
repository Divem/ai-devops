# Design: Skill Tab Navigation

## Context

**当前状态**:
- 主导航有两个 tab：`kanban`（需求评审看板）、`stats`（数据概览），通过 `activeTab` state 切换
- Skill 管理使用 `currentView === 'skills'`，渲染独立全屏页面（含自己的 header + 返回按钮 + ThemeModeToggle）
- `SkillManagementPage` 组件包含完整的页面壳（header、滚动容器）

## Goals / Non-Goals

**Goals:**
- Skill 管理成为与看板、数据概览同级的 tab
- 点击 tab 切换时顶部导航保持不变
- Skill 管理 tab 高亮样式与其他 tab 一致

**Non-Goals:**
- 不改变 Skill 管理内部功能（编辑、禁用、导出等）
- 不改变 ProjectSettingsPage 中的 Skill 板块

## Decisions

### 1. 导航 tab 列表新增 skills

**决策**: 将导航 tab 数组从 `[{id:"kanban",...},{id:"stats",...}]` 扩展为 `[{id:"kanban",...},{id:"stats",...},{id:"skills",...}]`。

**理由**: 最简改动，复用现有 tab 渲染逻辑，样式自动一致。

### 2. SkillManagementPage 改为纯内容组件

**决策**: 移除 `SkillManagementPage` 的 header（返回按钮 + logo + 标题 + ThemeModeToggle），仅保留内容区域。移除 `onBack` prop。外层容器由主组件提供。

### 3. 移除 currentView === 'skills' 分支

**决策**: 删除 `currentView === 'skills'` 的 early return 分支。Skill 管理内容在 `activeTab === 'skills'` 时渲染，与 stats tab 同样模式。

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| SkillManagementPage 原来有自己的 header 和滚动容器 | 改为在主布局的内容区渲染，滚动由外层容器提供 |

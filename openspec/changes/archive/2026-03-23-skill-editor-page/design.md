# Design: Skill Editor Page

## Context

**当前状态**:
- `SkillManagementPage` 是一个独立的卡片列表页面（`currentView === 'skills'`），展示所有 Skill 的状态、启用/禁用、导出等操作
- "编辑" 按钮调用 `onNavigateToSkillEditor(skillId)`，但实现为 `setCurrentView('settings')`，跳转到完整的项目配置页面
- `ProjectSettingsPage` 内包含完整的 Skill 编辑 UI（Skill 列表 + 文件结构树 + 文件编辑器 + 占位符提示），约 200 行

**约束条件**:
- 编辑逻辑（`normalizeSkillConfig`、`buildDefaultSkillFiles`、`handleSaveSkills` 等）已在 `ProjectSettingsPage` 中实现
- Skill 数据存储在 `localStorage['ai_skill_prompts']`

## Goals / Non-Goals

**Goals:**
- 在 `SkillManagementPage` 内提供完整的 Skill 编辑功能（列表→编辑→返回列表）
- 复用已有的文件结构编辑模式（SKILL.md / references / scripts）
- 编辑后保存立即生效

**Non-Goals:**
- 不重构 `ProjectSettingsPage` 中的 Skill 板块（保留作为嵌入式编辑入口）
- 不改变 Skill 数据存储格式
- 不新增 Skill 模板或文件类型

## Decisions

### 1. 编辑模式：页内切换

**决策**: `SkillManagementPage` 新增 `editingSkillId` state。当有值时显示编辑面板替代卡片列表。

**理由**:
- 避免新增路由或 `currentView` 值，保持架构简单
- 用户始终在 Skill 管理页面内，返回按钮回到列表

**替代方案**: 新增 `currentView === 'skill-editor'` — 过于重量级，且增加路由复杂度。

### 2. 复用编辑 UI 结构

**决策**: 从 `ProjectSettingsPage` 的 Skill 编辑板块提取编辑 UI 到 `SkillManagementPage` 内部。包含：
- 左侧：文件结构树（SKILL.md / references/ / scripts/）
- 右侧：文件编辑器（textarea）+ 占位符标签
- 底部：保存 / 恢复默认按钮

**理由**: 用户已熟悉这套 UI，保持一致性。

### 3. 移除跳转 hack

**决策**: `onNavigateToSkillEditor` 不再跳转到 settings，改为内部 `setEditingSkillId(skillId)`。PMPlatform 不再传递该 prop。

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| 编辑逻辑在两处维护（Settings + SkillManagement） | 编辑 UI 代码独立于组件内部，数据层共用 `normalizeSkillConfig` 等工具函数 |
| 编辑面板替换列表视图可能丢失筛选状态 | 返回列表时保留 filter 状态（state 不受 editingSkillId 切换影响） |

# Proposal: Skill Tab Navigation

## Why

点击顶部导航的 "Skill 管理" 后，整个页面被替换为独立的 `SkillManagementPage`（含自己的 header 和返回按钮），与 "需求评审看板" 和 "数据概览" 的 tab 切换体验不一致。用户期望 Skill 管理跟数据概览一样，只是主导航下的一个 tab 页，顶部导航保持不变。

## What Changes

- **修改**: Skill 管理从 `currentView === 'skills'` 独立页面模式改为 `activeTab === 'skills'` tab 模式
- **修改**: 顶部导航 tab 列表新增 "Skill 管理" 项，与看板和数据概览平级
- **修改**: `SkillManagementPage` 去掉自带的 header（返回按钮 + 标题栏），改为纯内容组件
- **移除**: `currentView === 'skills'` 分支及 `onBack` prop

## Capabilities

### New Capabilities
- `skill-tab-integration`: 将 Skill 管理页面集成为主导航 tab

### Modified Capabilities
- 无

## Impact

**代码影响**:
- `PMPlatform.jsx` — 主组件：导航 tab 列表新增 skills 项，`activeTab === 'skills'` 时渲染 Skill 内容
- `PMPlatform.jsx` — `SkillManagementPage`：移除顶部 header，接受在主布局容器内渲染

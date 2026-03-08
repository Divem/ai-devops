## Why

文档库（DocTreeSidebar）目前展示所有需求卡片的文档树，随着需求数量增多，难以快速定位目标文档。用户常见场景是只关注当前打开的需求、屏蔽已进入终态（已通过/已拒绝）的需求，或只看还未完成的需求。加入筛选条件可大幅提升浏览效率。

## What Changes

- 在文档库顶部（"文档库"标签行）右侧新增筛选区域
- 提供多个可切换的筛选 chip：
  1. **仅本需求** — 只显示当前打开需求（focusCardId）的文档，其余折叠隐藏
  2. **过滤已PR** — 隐藏状态为"已通过"（approved）的需求（视为已提 PR、归档）
  3. **过滤已Lock** — 隐藏处于终态（approved / rejected）的需求
- 筛选 chip 可多选，互相叠加过滤
- 激活状态高亮，无激活时显示全部

## Capabilities

### New Capabilities

- `doc-library-filter`: 文档库筛选条件 UI，支持多选 chip 按需求状态过滤树列表

### Modified Capabilities

- `project-settings-page`: 无变更（仅影响 DocTreeSidebar）

## Impact

- `pm-ai-app/src/PMPlatform.jsx` — `DocTreeSidebar` 组件添加筛选 state 和过滤逻辑
- 不影响卡片数据结构，不增加新字段，仅为纯 UI 过滤

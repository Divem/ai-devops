## Why

目前 AI 模型选择散落在各组件内部，缺乏统一的项目级配置入口；同时平台缺少与 Git 仓库的集成，导致生成的产品需求文档和 SPEC 无法自动提交到 CI 平台（应用魔方），影响研发流程的连续性。需要新增一个集中的项目配置页面来解决这两个问题。

## What Changes

- **新增项目配置页面**：通过顶部导航栏可进入，提供统一的项目级配置界面
- **Git 仓库配置**：支持配置仓库 URL、分支、认证 Token，配置后平台生成的 PRD 和 SPEC 文档可自动提交到指定仓库，触发应用魔方 CI 流程
- **AI 模型配置迁移**：将分散的 AI 模型选择（Claude、GLM-4 等）和 API Key 设置统一迁移到项目配置页面
- **导航入口**：在顶部 Header 增加"项目设置"入口（齿轮图标）
- **文档自动提交**：需求卡片通过后，可将关联的 PRD/SPEC 文档一键提交（或自动提交）到 Git 仓库

## Capabilities

### New Capabilities

- `project-settings-page`: 项目配置页面，包含 Git 仓库配置区块和 AI 模型配置区块，支持持久化存储（localStorage）
- `git-repo-integration`: Git 仓库集成能力，配置仓库信息后可将指定文档提交到远程仓库（通过 GitHub/GitLab API 或 fetch 实现）

### Modified Capabilities

- `settings-dropdown`: 原来在 KanbanBoard 右上角的 AI 模型设置下拉框将被移除，模型选择逻辑迁移到项目配置页面

## Impact

- `pm-ai-app/src/PMPlatform.jsx`：主要修改文件，新增路由/页面状态、Header 导航入口、ProjectSettingsPage 组件
- `openspec/specs/settings-dropdown/spec.md`：现有 settings-dropdown spec 将被标记为已废弃/替代
- AI 调用链（`callAIReview`, `callAIDoc`, `handleSendMessage`）将从全局配置读取模型和 API Key，而非局部状态

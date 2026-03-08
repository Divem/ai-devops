## Context

当前 PMPlatform.jsx 是单一大文件，AI 模型选择和 API Key 通过局部 useState 管理，分散在 KanbanBoard（settings-dropdown）等组件内。应用缺少统一的"项目级配置"入口，也没有任何 Git 集成能力。

本次变更在现有单文件 React 应用架构下，新增 ProjectSettingsPage 视图，并将配置状态提升到顶层，通过 localStorage 持久化。

## Goals / Non-Goals

**Goals:**
- 新增 ProjectSettingsPage 组件，通过 Header 入口（齿轮图标）切换视图
- 将 AI 模型选择和 API Key 配置迁移到 ProjectSettingsPage
- 在 ProjectSettingsPage 中新增 Git 仓库配置（URL、Branch、Token、平台类型）
- 配置信息通过 localStorage 持久化，刷新后不丢失
- 需求卡片通过后，文档提交功能调用 Git 平台 REST API 将 Markdown 写入仓库

**Non-Goals:**
- 不实现完整的 Git 客户端（clone/pull/merge），只做 API 文件写入
- 不支持多项目配置，仅单一项目配置
- 不实现应用魔方的直接 API 对接，仅通过 Git 提交触发 CI
- 不修改后端/服务端，纯前端实现

## Decisions

### D1：配置状态提升到 App 顶层

**选择**：在 `PMPlatform`（根组件）用 `useState` + `useEffect` 管理 `projectConfig`，通过 props 或轻量 Context 传递给需要的子组件。

**理由**：避免引入 Redux/Zustand 等外部状态库（现有架构无依赖），与现有模式一致。AI 调用函数（`callAIReview`, `callAIDoc`）已在顶层，天然可以读取顶层 state。

**替代方案**：每个组件各自读 localStorage → 会导致不一致；引入全局状态库 → 过重。

### D2：视图切换用 currentView state

**选择**：在 `PMPlatform` 增加 `currentView` state（`'kanban' | 'detail' | 'settings'`），Settings 入口在 Header 里，点击切换视图。

**理由**：与现有 `currentCard` 判断跳转 DetailPage 的模式完全一致，零新依赖。

### D3：Git 集成通过 REST API 实现

**选择**：使用 GitHub API (`PUT /repos/:owner/:repo/contents/:path`) 或 GitLab API (`PUT /projects/:id/repository/files/:file_path`) 将 Markdown 文件写入仓库。

**理由**：纯前端可调用，无需服务端代理（注意：需要用户配置 Personal Access Token）。应用魔方监听仓库变更触发 CI，不需要平台直连。

**安全**：Token 存储在 localStorage，与现有 Anthropic API Key 存储方式一致，仅本地使用。

### D4：文件提交路径规则

提交路径按需求 ID 组织：
```
docs/requirements/{req-id}/prd.md
docs/requirements/{req-id}/proposals/{proposal-id}/proposal.md
docs/requirements/{req-id}/proposals/{proposal-id}/design.md
docs/requirements/{req-id}/proposals/{proposal-id}/spec.md
docs/requirements/{req-id}/proposals/{proposal-id}/tasks.md
```

### D5：settings-dropdown 废弃方式

直接从 KanbanBoard Header 区域移除 settings-dropdown 按钮和相关 state，改为在 Header 顶部增加全局 AI 设置入口或引导用户到 ProjectSettingsPage。不保留向后兼容层。

## Risks / Trade-offs

- [CORS 风险] 浏览器直接调用 GitHub/GitLab API 可能遇到 CORS 限制 → GitHub API 支持 CORS，GitLab 自建实例可能需要配置；先支持 GitHub/GitLab.com，自建实例标注为实验性
- [Token 安全] Personal Access Token 明文存 localStorage → 与现有 API Key 处理方式一致，属于已知 trade-off，在 UI 上加警示说明
- [大文件] 文档内容经 Base64 编码后超过 API 限制 → GitHub API 单文件限制 100MB，正常 Markdown 文档不会触达
- [冲突] 如果仓库同路径文件已存在，PUT 接口需要传入当前文件的 SHA → 提交前先 GET 文件获取 SHA，处理 404（新建）和 200（更新）两种情况

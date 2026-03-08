## ADDED Requirements

### Requirement: 项目配置页面入口
系统 SHALL 在顶部 Header 区域提供一个齿轮图标按钮，点击后切换到项目配置页面（ProjectSettingsPage）视图。配置页面与看板视图和详情页视图互斥显示。

#### Scenario: 点击齿轮图标进入配置页
- **WHEN** 用户在任意视图点击 Header 的齿轮图标
- **THEN** 系统切换到项目配置页面视图，显示所有配置区块

#### Scenario: 从配置页返回看板
- **WHEN** 用户点击配置页的"返回"按钮或 Header 中的"看板"入口
- **THEN** 系统切换回看板视图（kanban）

### Requirement: AI 模型配置区块
项目配置页面 SHALL 包含 AI 模型配置区块，提供模型选择（Claude Sonnet / GLM-4 等）和对应 API Key 输入，替代原 KanbanBoard 内的 settings-dropdown。

#### Scenario: 选择 AI 模型
- **WHEN** 用户在 AI 配置区块选择一个模型
- **THEN** 系统更新全局 `projectConfig.ai.model`，后续所有 AI 调用使用该模型

#### Scenario: 配置 API Key
- **WHEN** 用户输入 Anthropic API Key 并点击保存
- **THEN** 系统将 Key 存入 localStorage 的 `projectConfig` 中，并在 AI 调用时使用该 Key

#### Scenario: 配置持久化
- **WHEN** 用户保存配置后刷新页面
- **THEN** 系统从 localStorage 恢复所有配置，配置不丢失

### Requirement: Git 仓库配置区块
项目配置页面 SHALL 包含 Git 仓库配置区块，支持配置仓库地址（Repo URL）、目标分支（Branch）、Personal Access Token 和 Git 平台类型（GitHub / GitLab）。

#### Scenario: 填写并保存 Git 配置
- **WHEN** 用户填写仓库 URL、分支名、Token，并选择平台类型后点击保存
- **THEN** 系统将配置存入 localStorage 的 `projectConfig.git` 中，并显示保存成功提示

#### Scenario: Git 配置校验
- **WHEN** 用户点击保存但仓库 URL 或 Token 为空
- **THEN** 系统显示字段校验错误，不执行保存

#### Scenario: 测试连接
- **WHEN** 用户填写完 Git 配置并点击"测试连接"
- **THEN** 系统调用对应平台 API 验证 Token 有效性，显示"连接成功"或具体错误信息

## ADDED Requirements

### Requirement: 项目配置页面入口
系统 SHALL 在顶部 Header 区域提供设置下拉入口；用户需通过下拉菜单中的"项目设置"菜单项进入项目配置页面（ProjectSettingsPage）视图。配置页面与看板视图和详情页视图互斥显示。配置页面 SHALL 采用左右双栏布局（左侧导航菜单 + 右侧内容区），初始激活第一个板块。

#### Scenario: 点击下拉中的项目设置进入配置页
- **WHEN** 用户在任意视图点击 Header 设置触发器并选择"项目设置"菜单项
- **THEN** 系统切换到项目配置页面视图，左侧显示导航菜单，右侧默认展示"项目配置"板块（项目关联配置，支持多选）

#### Scenario: 从配置页返回看板
- **WHEN** 用户点击配置页的"返回"按钮或 Header 中的"看板"入口
- **THEN** 系统切换回看板视图（kanban）

### Requirement: AI 模型配置区块
项目配置页面 SHALL 包含 AI 模型配置区块，提供模型选择（Claude Sonnet / GLM-4 / ARK Code Latest 等）和对应 API Key 输入，替代原 KanbanBoard 内的 settings-dropdown。

#### Scenario: 选择 AI 模型
- **WHEN** 用户在 AI 配置区块选择一个模型
- **THEN** 系统更新全局 `projectConfig.ai.model`，后续所有 AI 调用使用该模型

#### Scenario: 配置 API Key
- **WHEN** 用户输入模型对应的 API Key 并点击保存
- **THEN** 系统将 Key 存入 localStorage 的 `projectConfig` 与对应模型本地键中，并在 AI 调用时使用该 Key

#### Scenario: 配置持久化
- **WHEN** 用户保存配置后刷新页面
- **THEN** 系统从 localStorage 恢复所有配置，配置不丢失

#### Scenario: 选择 ARK 模型后展示 ARK Key 输入
- **WHEN** 用户将 AI 模型切换为 `ark`
- **THEN** 配置区块 SHALL 展示 ARK API Key 输入框与获取地址提示

#### Scenario: 保存 ARK Key 后可恢复
- **WHEN** 用户填写 ARK API Key 并保存后刷新页面
- **THEN** ARK API Key SHALL 从本地配置恢复并用于后续 ARK 请求

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

### Requirement: 项目配置页关键区块顺序
项目配置页面 SHALL 保持关键配置区块顺序清晰，且 AI Skill 区块支持结构化 Skill 文件管理体验。

#### Scenario: 首屏展示顺序符合规范
- **WHEN** 用户进入项目配置页面
- **THEN** 系统按既定顺序展示关键区块，并可通过左侧导航进入 AI Skill 区块

#### Scenario: 导航与内容顺序一致
- **WHEN** 用户查看左侧导航并切换相关配置项
- **THEN** 导航条目顺序与右侧内容区块顺序保持一致，不出现交叉错位

### Requirement: AI Skill 区块结构化编辑体验
项目配置页面中的 AI Skill 区块 SHALL 提供结构化文件编辑体验，包括 Skill 列表、文件树、代码/Markdown 编辑区以及保存反馈。

#### Scenario: 进入 AI Skill 区块后展示三栏结构
- **WHEN** 用户点击左侧导航"AI Skill"
- **THEN** 右侧显示 Skill 列表、文件树和编辑器三栏布局（或窄屏等效布局）

#### Scenario: 保存结构化 Skill 配置
- **WHEN** 用户编辑任意 Skill 文件并点击保存
- **THEN** 系统保存结构化配置并显示"已保存"状态反馈

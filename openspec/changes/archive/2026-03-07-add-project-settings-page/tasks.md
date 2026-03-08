## 1. 配置状态提升与持久化

- [x] 1.1 在 PMPlatform 根组件新增 `projectConfig` state，结构包含 `ai`（model、anthropicKey、glmKey）和 `git`（platform、repoUrl、branch、token、owner、repo）字段
- [x] 1.2 实现 `projectConfig` 的 localStorage 读取（初始化时）和写入（保存时）逻辑
- [x] 1.3 将现有 AI 调用函数（`callAIReview`、`callAIDoc`、`handleSendMessage`）中硬编码的模型名和 API Key 改为从 `projectConfig.ai` 读取

## 2. Header 全局导航入口

- [x] 2.1 在 Header 区域（顶部栏）添加齿轮图标按钮，点击触发 `setCurrentView('settings')`
- [x] 2.2 在 PMPlatform 的视图路由逻辑中新增 `'settings'` 分支，渲染 `<ProjectSettingsPage>`

## 3. ProjectSettingsPage 组件 - AI 配置区块

- [x] 3.1 创建 `ProjectSettingsPage` 组件，包含页面标题、返回看板按钮
- [x] 3.2 实现"AI 模型配置"区块：模型选择下拉框（claude-sonnet-4-20250514、glm-4-plus 等选项）
- [x] 3.3 实现 Anthropic API Key 输入框（password 类型）
- [x] 3.4 实现 GLM API Key 输入框（按需显示，当选中 GLM 系列模型时）
- [x] 3.5 实现保存按钮，点击后更新 `projectConfig.ai` 并持久化到 localStorage

## 4. ProjectSettingsPage 组件 - Git 仓库配置区块

- [x] 4.1 实现"Git 仓库配置"区块：平台类型选择（GitHub / GitLab）
- [x] 4.2 实现仓库 URL 输入框（示例：`https://github.com/org/repo`）
- [x] 4.3 实现目标分支输入框（默认值 `main`）
- [x] 4.4 实现 Personal Access Token 输入框（password 类型），附带安全说明文字
- [x] 4.5 实现"测试连接"按钮，调用 Git 平台 API 验证 Token 有效性并显示结果
- [x] 4.6 实现保存按钮，点击后更新 `projectConfig.git` 并持久化到 localStorage
- [x] 4.7 实现字段校验：仓库 URL 和 Token 为必填项，为空时显示错误提示

## 5. Git 文档提交功能

- [x] 5.1 实现 `commitDocToGit(card, docKey, content, config)` 工具函数，支持 GitHub Contents API 和 GitLab Repository Files API
- [x] 5.2 实现文件路径生成规则：`docs/requirements/{req-id}/prd.md` 和 `docs/requirements/{req-id}/proposals/{proposal-id}/*.md`
- [x] 5.3 实现文件已存在时先 GET SHA 再更新（PUT with sha）的冲突处理逻辑
- [x] 5.4 在 DetailPage 的文档操作区域添加"提交到仓库"按钮
- [x] 5.5 点击"提交到仓库"时，检查 `projectConfig.git` 完整性；未配置则显示引导提示和跳转入口
- [x] 5.6 提交成功后显示 commit URL，提交失败显示具体错误信息

## 6. 移除旧的 settings-dropdown

- [x] 6.1 从 KanbanBoard（或 Header 区域）移除原有 settings-dropdown 按钮及相关组件代码
- [x] 6.2 清理移除后不再使用的局部 state（如 `showSettings`、局部 `selectedModel`、局部 `apiKey`）

## 7. 验证

- [x] 7.1 验证：配置保存后刷新页面，AI 模型和 Git 配置均正确恢复
- [x] 7.2 验证：AI 调用使用配置页面设定的模型和 API Key
- [x] 7.3 验证：Git 测试连接对有效/无效 Token 均正确响应
- [x] 7.4 验证：详情页文档提交功能在 GitHub/GitLab 两种平台下均正常工作
- [x] 7.5 验证：未配置 Git 时点击"提交到仓库"显示引导提示

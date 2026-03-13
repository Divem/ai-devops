## 1. Base URL 下拉选择器

- [x] 1.1 Claude 配置区块：将 Base URL `<input>` 替换为 `<select>` 下拉选择器，选项：`Claude 默认: https://api.anthropic.com/v1/messages` / `本地代理: /api/anthropic/v1/messages` / `自定义...`
- [x] 1.2 GLM 配置区块：将 Base URL 替换为 `<select>`，选项：`GLM 默认: https://open.bigmodel.cn/api/paas/v4/chat/completions` / `自定义...`
- [x] 1.3 ARK 配置区块：将 Base URL 替换为 `<select>`，选项：`ARK 默认: https://ark.cn-beijing.volces.com/api/coding/v3/chat/completions` / `本地代理: /api/ark/v3/chat/completions` / `自定义...`
- [x] 1.4 Kimi 配置区块：将 Base URL 替换为 `<select>`，选项：`Kimi 默认: https://api.kimi.com/coding/v1/messages` / `本地代理: /api/kimi/v1/messages` / `自定义...`

## 2. 自定义选项交互

- [x] 2.1 当用户选择"自定义..."时，在下拉框下方展开一个 `<input>` 文本输入框，允许手动填写 Base URL
- [x] 2.2 从预设切回"自定义"时保留之前手动输入的值；从"自定义"切回预设时直接设置对应 URL 值
- [x] 2.3 Custom（自定义模型）的 Base URL 保持原有 `<input>` 输入框 + 动态拼接地址提示

## 3. Model Name 可选模型提示更新

- [x] 3.1 Claude Model Name 提示更新为：`可选: claude-sonnet-4-6, claude-opus-4-6, claude-haiku-4-5-20251001`
- [x] 3.2 GLM Model Name 提示更新为：`可选: glm-4-plus, glm-4-long, glm-4-flash, glm-4.7-flash`
- [x] 3.3 ARK Model Name 提示更新为：`可选: ark-code-latest,doubao-seed-2.0-code, doubao-seed-2.0-pro, doubao-seed-2.0-lite`
- [x] 3.4 Kimi Model Name 提示更新为：`可选: kimi-k2.5, kimi-k2-instruct`

## 4. 验证

- [x] 4.1 启动 `npm run dev`，进入项目设置 > AI 配置，逐个切换模型确认下拉选择器显示正确
- [x] 4.2 验证选择预设选项时 Base URL state 正确更新
- [x] 4.3 验证选择"自定义"时输入框正确展开，输入值生效

## 1. 数据结构与持久化扩展

- [x] 1.1 扩展 `DEFAULT_PROJECT_CONFIG.ai`，新增字段：`anthropicBaseUrl`, `anthropicModel`, `glmBaseUrl`, `glmModel`, `arkBaseUrl`, `arkModel`, `customName`, `customBaseUrl`, `customModel`, `customKey`, `customAuthStyle`（默认值均为空字符串，`customAuthStyle` 默认 `'Bearer'`）
- [x] 1.2 扩展 `loadProjectConfig`，从 localStorage 读取 `ai_model_claude_baseurl`、`ai_model_claude_modelname`、`ai_model_glm_baseurl`、`ai_model_glm_modelname`、`ai_model_ark_baseurl`、`ai_model_ark_modelname`、`ai_model_custom_*` 各字段并合并到配置
- [x] 1.3 扩展 `saveProjectConfig`，将新字段分别写入对应 localStorage key；空字符串时 `removeItem`

## 2. AIClient Provider 更新

- [x] 2.1 `ClaudeProvider` 构造函数中，`apiEndpoint` 和 `model` 优先从 localStorage `ai_model_claude_baseurl` / `ai_model_claude_modelname` 读取，空值 fallback 到原硬编码默认
- [x] 2.2 `GLMProvider` 构造函数中，`apiEndpoint` 和 `model` 优先从 `ai_model_glm_baseurl` / `ai_model_glm_modelname` 读取
- [x] 2.3 `ArkProvider` 构造函数中，`apiBaseUrl`（append `/chat/completions`） 和 `model` 优先从 `ai_model_ark_baseurl` / `ai_model_ark_modelname` 读取
- [x] 2.4 新增 `CustomProvider` 类：从 localStorage 读取 `ai_model_custom_*`，使用 OpenAI Chat Completions 格式发起请求，支持 `Bearer` 和 `x-api-key` 两种 auth style
- [x] 2.5 在 `AIClient._createProvider` 中新增 `'custom'` 分支返回 `CustomProvider` 实例
- [x] 2.6 在 `ModelRegistry` 中新增 custom 条目

## 3. ProjectSettingsPage UI 更新

- [x] 3.1 新增四个 show/hide 状态：`showAnthropicKey`, `showGlmKey`, `showArkKey`, `showCustomKey`（初始值 `false`）
- [x] 3.2 新增各自定义字段的 state：`anthropicBaseUrl`, `anthropicModel`, `glmBaseUrl`, `glmModel`, `arkBaseUrl`, `arkModel`, `customName`, `customBaseUrl`, `customModel`, `customKey`, `customAuthStyle`
- [x] 3.3 封装 `KeyInput` 内联辅助组件（或内联写法）：在密码输入框右侧绝对定位眼睛按钮，点击切换 type，适用所有 API Key 输入框
- [x] 3.4 将现有 Anthropic / GLM / ARK API Key `<input type="password">` 替换为带显示/隐藏按钮的输入框
- [x] 3.5 在 Anthropic Key 下方增加 API Base URL 和 Model Name 两个输入框（placeholder 为默认值），始终显示（不折叠）
- [x] 3.6 在 GLM 和 ARK 条件区块中同样增加 Base URL 和 Model Name 输入框
- [x] 3.7 在模型选择下拉新增 `<option value="custom">自定义模型（OpenAI Compatible）</option>`
- [x] 3.8 `{aiModel === 'custom'}` 条件区块：显示 Display Name / Base URL / Model Name / API Key（带显示/隐藏）/ Auth Style（下拉 Bearer | x-api-key）
- [x] 3.9 更新 `handleSaveAI`，将所有新字段写入 config 并调用更新后的 `saveProjectConfig`

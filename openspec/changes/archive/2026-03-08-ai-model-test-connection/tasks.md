## 1. 状态与测试函数

- [x] 1.1 在 `ProjectSettingsPage` 中新增 `aiTestStatus`（初始 `null`）和 `aiTestMsg`（初始 `''`）两个 state
- [x] 1.2 新增 `handleTestAI` 异步函数，按 `aiModel` 分支构造请求：
  - `claude`：POST `${anthropicBaseUrl || '/api/anthropic/v1/messages'}`，headers `x-api-key` + `anthropic-version: 2023-06-01`，body 为 Anthropic Messages 格式（max_tokens: 5）
  - `glm`：POST `${glmBaseUrl || 'https://open.bigmodel.cn/api/paas/v4/chat/completions'}`，`Authorization: Bearer ${glmKey}`，OpenAI 格式
  - `ark`：POST `${arkBaseUrl || 'https://ark.cn-beijing.volces.com/api/coding/v3'}/chat/completions`，`Authorization: Bearer ${arkKey}`，OpenAI 格式
  - `custom`：POST `${customBaseUrl}/chat/completions`，auth 按 `customAuthStyle`，OpenAI 格式
- [x] 1.3 `handleTestAI` 执行逻辑：调用前 `setAiTestStatus('testing')`，成功后设置 `'success'` + 成功消息，失败设置 `'error'` + 错误信息，catch 设置网络错误信息

## 2. UI 集成

- [x] 2.1 在 AI 配置区块的保存按钮行中，紧随"保存 AI 配置"按钮之后添加"测试请求"按钮；`disabled` 条件：testing 状态中，或当前模型 key 为空（claude: `!anthropicKey.trim()`；glm: `!glmKey.trim()`；ark: `!arkKey.trim()`；custom: `!customKey.trim() || !customBaseUrl.trim() || !customModel.trim()`）
- [x] 2.2 在"保存"按钮行上方（保存行内）添加测试结果展示条：`{aiTestStatus && <div style={...}>...</div>}`，样式与 Git 测试结果保持一致（success 绿色 / error 红色 / testing 蓝色）

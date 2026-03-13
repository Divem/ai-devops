## 1. 数据层与配置持久化

- [x] 1.1 在 `DEFAULT_PROJECT_CONFIG.ai` 中新增 `customFormat: 'openai'` 字段
- [x] 1.2 在 `loadProjectConfig` 中读取 `localStorage.getItem('ai_model_custom_format')`，在 `saveProjectConfig` 中写入该键

## 2. CustomProvider 适配

- [x] 2.1 在 `CustomProvider` 构造函数中读取 `ai_model_custom_format`，默认 `'openai'`
- [x] 2.2 根据 `format` 字段切换请求逻辑：OpenAI 走 `/chat/completions`，Anthropic 走 `/v1/messages` 并设置 `x-api-key` + `anthropic-version` header
- [x] 2.3 根据 `format` 字段切换响应解析：OpenAI 解析 `choices[0].message.content`，Anthropic 解析 `content[0].text`

## 3. ProjectSettingsPage UI

- [x] 3.1 在自定义模型配置表单中增加"API 格式"下拉选择（OpenAI Compatible / Anthropic），默认 OpenAI Compatible
- [x] 3.2 选择 Anthropic 格式时自动将 Auth Style 设为 `x-api-key` 并禁用选择，切换回 OpenAI 时恢复可选
- [x] 3.3 `handleSaveAI` 中包含 `customFormat` 字段的保存逻辑

## 4. 测试连接适配

- [x] 4.1 `handleTestAI` 中为 custom 模型根据 `customFormat` 切换测试请求格式（OpenAI / Anthropic）

## 5. 回归验证

- [x] 5.1 验证 OpenAI 格式自定义模型的配置、保存、测试连接、AI 调用流程不受影响
- [x] 5.2 验证 Anthropic 格式自定义模型的配置、保存、测试连接、AI 调用流程正常工作
- [x] 5.3 验证格式切换时 Auth Style 联动行为正确

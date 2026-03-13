## Why

当前自定义模型仅支持 OpenAI Compatible 格式（`/chat/completions`）。用户如果使用 Anthropic 兼容的中转服务（如国内代理、私有部署的 Claude 实例），无法通过自定义模型接入，因为 Anthropic API 的请求格式（`/v1/messages`、`x-api-key` + `anthropic-version` header）和响应格式（`content[0].text`）与 OpenAI 不兼容。需要在自定义模型中增加"API 格式"选项，让用户选择 OpenAI 或 Anthropic 格式。

## What Changes

- 在自定义模型配置中新增"API 格式"选项（OpenAI Compatible / Anthropic），默认 OpenAI Compatible
- CustomProvider 根据所选格式动态构造请求 header、body 和解析响应
  - OpenAI 格式：保持现有逻辑不变
  - Anthropic 格式：使用 `x-api-key` + `anthropic-version` header，body 使用 `messages` + `max_tokens`，响应解析 `content[0].text`
- ProjectSettingsPage 的自定义模型表单增加格式选择 UI
- localStorage 持久化新增 `ai_model_custom_format` 字段

## Capabilities

### New Capabilities

（无新增独立能力）

### Modified Capabilities

- `ai-custom-model`: 新增 API 格式选项（OpenAI / Anthropic），CustomProvider 支持按格式切换请求与响应逻辑

## Impact

- `ai-client.js` — `CustomProvider` 类需要根据 format 切换请求构造与响应解析
- `pm-ai-app/src/PMPlatform.jsx` — ProjectSettingsPage 自定义模型表单增加格式选择、handleTestAI 增加 Anthropic 格式测试逻辑、loadProjectConfig/saveProjectConfig 增加 format 字段
- localStorage — 新增 `ai_model_custom_format` 键

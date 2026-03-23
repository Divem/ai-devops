## MODIFIED Requirements

### Requirement: 自定义 OpenAI-compatible 模型
系统 SHALL 支持配置一个自定义 AI 模型，使用 OpenAI Chat Completions 兼容格式或 Anthropic Messages 格式。配置项包括：显示名称、Base URL、Model Name、API Key、鉴权方式（Bearer / x-api-key）、API 格式（OpenAI Compatible / Anthropic）。

#### Scenario: 选择 Custom 模型显示配置表单
- **WHEN** 用户在模型选择下拉菜单中选择"自定义模型"选项
- **THEN** 页面 SHALL 显示包含 Display Name、Base URL、Model Name、API Key、Auth Style、API Format 的配置表单

#### Scenario: 保存自定义模型配置
- **WHEN** 用户填写完 Custom 模型配置并点击保存
- **THEN** 配置（含 API Format）SHALL 持久化到 localStorage，下次打开页面时 SHALL 恢复填写内容

#### Scenario: Custom 模型以 OpenAI 格式发起 API 请求
- **WHEN** 系统以 `custom` 模型调用 AI 功能且 API Format 为 `openai`
- **THEN** `CustomProvider` SHALL 向 `${baseUrl}/chat/completions` 发送 POST 请求，使用配置的 auth style 传递 API Key，body 格式符合 OpenAI Chat Completions 规范，响应解析 `choices[0].message.content`

#### Scenario: Custom 模型以 Anthropic 格式发起 API 请求
- **WHEN** 系统以 `custom` 模型调用 AI 功能且 API Format 为 `anthropic`
- **THEN** `CustomProvider` SHALL 向 `${baseUrl}/v1/messages` 发送 POST 请求，header 包含 `x-api-key` 和 `anthropic-version: 2023-06-01`，body 包含 `model`、`max_tokens`、`messages` 字段，响应解析 `content[0].text`

#### Scenario: 选择 Anthropic 格式时自动锁定 Auth Style
- **WHEN** 用户将 API Format 切换为 `anthropic`
- **THEN** Auth Style SHALL 自动设为 `x-api-key` 并禁用选择；切换回 `openai` 时 SHALL 恢复可选

#### Scenario: Custom 模型 Base URL 格式说明
- **WHEN** 用户填写 Custom Base URL 输入框
- **THEN** 页面 SHALL 在输入框下方提示格式（如 `https://api.openai.com`，不含路径）

#### Scenario: 测试连接适配 Anthropic 格式
- **WHEN** 用户在 API Format 为 `anthropic` 时点击测试连接
- **THEN** 系统 SHALL 使用 Anthropic 格式发送测试请求并显示连接结果

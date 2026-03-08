## ADDED Requirements

### Requirement: 自定义 OpenAI-compatible 模型
系统 SHALL 支持配置一个自定义 AI 模型，使用 OpenAI Chat Completions 兼容格式。配置项包括：显示名称、Base URL、Model Name、API Key、鉴权方式（Bearer / x-api-key）。

#### Scenario: 选择 Custom 模型显示配置表单
- **WHEN** 用户在模型选择下拉菜单中选择"自定义模型"选项
- **THEN** 页面 SHALL 显示包含 Display Name、Base URL、Model Name、API Key、Auth Style 的配置表单

#### Scenario: 保存自定义模型配置
- **WHEN** 用户填写完 Custom 模型配置并点击保存
- **THEN** 配置 SHALL 持久化到 localStorage，下次打开页面时 SHALL 恢复填写内容

#### Scenario: Custom 模型发起 API 请求
- **WHEN** 系统以 `custom` 模型调用 AI 功能
- **THEN** `CustomProvider` SHALL 向 `${baseUrl}/chat/completions` 发送 POST 请求，使用配置的 auth style 传递 API Key，body 格式符合 OpenAI Chat Completions 规范

#### Scenario: Custom 模型 Base URL 格式说明
- **WHEN** 用户填写 Custom Base URL 输入框
- **THEN** 页面 SHALL 在输入框下方提示格式（如 `https://api.openai.com`，不含路径）

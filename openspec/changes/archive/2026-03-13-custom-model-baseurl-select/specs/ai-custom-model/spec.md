## MODIFIED Requirements

### Requirement: 自定义 OpenAI-compatible 模型
系统 SHALL 支持配置一个自定义 AI 模型，使用 OpenAI Chat Completions 或 Anthropic 兼容格式。配置项包括：显示名称、Base URL（下拉选择器 + 自定义输入）、Model Name、API Key、API 格式、鉴权方式。

#### Scenario: 选择 Custom 模型显示配置表单
- **WHEN** 用户在模型选择下拉菜单中选择"自定义模型"选项
- **THEN** 页面 SHALL 显示包含 Display Name、Base URL（下拉选择器）、Model Name、API Key、API Format、Auth Style 的配置表单

#### Scenario: 保存自定义模型配置
- **WHEN** 用户填写完 Custom 模型配置并点击保存
- **THEN** 配置 SHALL 持久化到 localStorage，下次打开页面时 SHALL 恢复填写内容

#### Scenario: Custom 模型发起 API 请求
- **WHEN** 系统以 `custom` 模型调用 AI 功能
- **THEN** `CustomProvider` SHALL 向 `${baseUrl}/chat/completions`（OpenAI 格式）或 `${baseUrl}/v1/messages`（Anthropic 格式）发送 POST 请求，使用配置的 auth style 传递 API Key

#### Scenario: Custom 模型 Base URL 下拉选择
- **WHEN** 用户配置 Custom Base URL
- **THEN** 页面 SHALL 显示 `<select>` 下拉选择器，包含当前 API 格式对应的常用厂商预设和"自定义..."选项
- **AND** 选择"自定义..."时 SHALL 展开输入框
- **AND** 输入框下方 SHALL 保留动态路径拼接提示

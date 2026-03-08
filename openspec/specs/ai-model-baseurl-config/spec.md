## ADDED Requirements

### Requirement: 内置模型 API 端点可配置
AI 模型配置页 SHALL 为每个内置模型（Claude / GLM / ARK）展示其默认 API Base URL 和 Model Name，并提供输入框允许用户覆盖；空值 SHALL 保持使用 Provider 内置默认值。

#### Scenario: 展示并编辑 Claude Base URL
- **WHEN** 用户在 AI 配置区块查看 Claude 配置
- **THEN** 页面 SHALL 展示 API Base URL 输入框，placeholder 为 `/api/anthropic/v1/messages`

#### Scenario: 覆盖 Base URL 生效
- **WHEN** 用户填写自定义 Base URL 并保存
- **THEN** `AIClient` 下次实例化 ClaudeProvider 时 SHALL 使用该自定义 URL 替代内置默认值

#### Scenario: 清空覆盖值恢复默认
- **WHEN** 用户清空 Base URL 输入框并保存
- **THEN** Provider SHALL 回退到内置硬编码默认端点

### Requirement: 内置模型 Model Name 可覆盖
AI 模型配置页 SHALL 为每个内置模型提供 Model Name 覆盖输入框；空值 SHALL 使用 Provider 内置模型名称。

#### Scenario: 覆盖 Claude 模型名称
- **WHEN** 用户在 Model Name 输入框填写 `claude-opus-4-20250514` 并保存
- **THEN** ClaudeProvider 发起 API 请求时 SHALL 使用 `claude-opus-4-20250514` 作为 model 字段值

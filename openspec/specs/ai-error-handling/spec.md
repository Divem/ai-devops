## ADDED Requirements

### Requirement: AI quota error notification
当 AI 请求因配额不足失败时，系统 SHALL 在 toast 中显示引导用户充值的明确提示，而非通用错误文案。

#### Scenario: Credit balance too low
- **WHEN** AI 请求返回 `"credit balance is too low"` 错误
- **THEN** 系统 SHALL 显示 toast：`⚠️ API 配额不足，请前往 Anthropic 控制台充值`

### Requirement: AI API key error notification
当 AI 请求因 Key 未配置或无效失败时，系统 SHALL 提示用户检查设置。

#### Scenario: API key not configured
- **WHEN** AI 请求因 API Key 为空失败
- **THEN** 系统 SHALL 显示 toast：`⚠️ 未配置 API Key，请在设置中填写`

#### Scenario: API key invalid
- **WHEN** AI 请求返回 `authentication_error`
- **THEN** 系统 SHALL 显示 toast：`⚠️ API Key 无效，请检查设置`

### Requirement: Generic AI error fallback
其他 AI 错误（网络超时、服务过载等）使用通用提示。

#### Scenario: Unknown error
- **WHEN** AI 请求因未知原因失败
- **THEN** 系统 SHALL 显示 toast：`AI 请求失败，请稍后重试`

### Requirement: Typed error from AI client
`ai-client.js` 中的 ClaudeProvider 和 GLMProvider SHALL 通过 throw 方式传递错误，错误对象携带 `errorType` 和 `errorMessage` 属性，以便调用方识别错误类型。

#### Scenario: API error is thrown with type
- **WHEN** API 返回错误响应
- **THEN** AIClient SHALL throw 一个 Error，携带 `errorType`（对应 API 错误类型）和 `errorMessage`（原始英文消息）属性

## ADDED Requirements

### Requirement: Base URL 下拉预设选项
Custom 模型的 Base URL 字段 SHALL 显示为 `<select>` 下拉选择器，包含常用厂商预设和"自定义..."选项。

#### Scenario: OpenAI 格式下显示对应预设
- **WHEN** API 格式为 OpenAI Compatible
- **THEN** 下拉选项 SHALL 包含：默认（空值）、OpenAI (`https://api.openai.com`)、DeepSeek (`https://api.deepseek.com`)、Groq (`https://api.groq.com/openai`)、Together AI (`https://api.together.xyz`)、自定义...

#### Scenario: Anthropic 格式下显示对应预设
- **WHEN** API 格式为 Anthropic
- **THEN** 下拉选项 SHALL 包含：默认（空值）、Anthropic (`https://api.anthropic.com`)、自定义...

#### Scenario: 选择预设选项
- **WHEN** 用户从下拉列表选择一个预设选项
- **THEN** `customBaseUrl` state SHALL 更新为该选项的 value

#### Scenario: 选择自定义选项
- **WHEN** 用户选择"自定义..."
- **THEN** 下方 SHALL 展开一个文本输入框供用户手动输入 URL

### Requirement: 自定义输入框条件显示
当 `customBaseUrl` 值不匹配当前格式的任何预设选项 value 时，SHALL 在下拉选择器下方显示文本输入框。

#### Scenario: 预设值不显示输入框
- **WHEN** `customBaseUrl` 匹配某个预设选项的 value（含空字符串）
- **THEN** 文本输入框 SHALL 隐藏

#### Scenario: 自定义值显示输入框
- **WHEN** `customBaseUrl` 不匹配任何预设选项的 value
- **THEN** 文本输入框 SHALL 显示，且 value 绑定到 `customBaseUrl`

### Requirement: 格式切换时重置预设值
当用户切换 API 格式（OpenAI ↔ Anthropic）时，如果当前 Base URL 匹配旧格式的预设值，SHALL 重置为空字符串。

#### Scenario: 从 OpenAI 预设切到 Anthropic
- **WHEN** 当前 `customBaseUrl` 为 OpenAI 格式预设值（如 `https://api.openai.com`）
- **AND** 用户将 API 格式切换为 Anthropic
- **THEN** `customBaseUrl` SHALL 重置为空字符串

#### Scenario: 自定义值切换格式保留
- **WHEN** 当前 `customBaseUrl` 为用户手动输入的自定义值
- **AND** 用户切换 API 格式
- **THEN** `customBaseUrl` SHALL 保持不变

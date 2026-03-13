## Requirements

### Requirement: 内置模型 API 端点可配置
AI 模型配置页 SHALL 为每个内置模型（Claude / GLM / ARK / Kimi）提供 Base URL **下拉选择器**，选项格式为 `厂商名: 完整请求路径`；空值 SHALL 保持使用 Provider 内置默认值。

每个下拉选择器 SHALL 包含以下预设选项：
1. 默认端点（显示厂商名 + 真实外部 API 地址，value 为空字符串）
2. 本地代理（显示代理路径，value 为代理 URL）
3. 自定义...（value 为 `__custom__`，选中后展开输入框）

Model Name 输入框下方 SHALL 显示一行可选模型名称提示，使用最新模型列表。

#### Scenario: Claude Base URL 下拉选项
- **WHEN** 用户在 AI 配置区块查看 Claude 配置
- **THEN** Base URL SHALL 显示为下拉选择器，包含以下选项：
  - `Claude 默认: https://api.anthropic.com/v1/messages`
  - `本地代理: /api/anthropic/v1/messages`
  - `自定义...`

#### Scenario: GLM Base URL 下拉选项
- **WHEN** 用户在 AI 配置区块查看 GLM 配置
- **THEN** Base URL SHALL 显示为下拉选择器，包含以下选项：
  - `GLM 默认: https://open.bigmodel.cn/api/paas/v4/chat/completions`
  - `自定义...`

#### Scenario: ARK Base URL 下拉选项
- **WHEN** 用户在 AI 配置区块查看 ARK 配置
- **THEN** Base URL SHALL 显示为下拉选择器，包含以下选项：
  - `ARK 默认: https://ark.cn-beijing.volces.com/api/coding/v3/chat/completions`
  - `本地代理: /api/ark/v3/chat/completions`
  - `自定义...`

#### Scenario: Kimi Base URL 下拉选项
- **WHEN** 用户在 AI 配置区块查看 Kimi 配置
- **THEN** Base URL SHALL 显示为下拉选择器，包含以下选项：
  - `Kimi 默认: https://api.kimi.com/coding/v1/messages`
  - `本地代理: /api/kimi/v1/messages`
  - `自定义...`

#### Scenario: 选择自定义展开输入框
- **WHEN** 用户在下拉选择器中选择"自定义..."
- **THEN** 下方 SHALL 展开一个文本输入框，允许用户手动填写 Base URL

#### Scenario: 下拉选择直接设值
- **WHEN** 用户在下拉选择器中选择一个预设选项
- **THEN** 对应的 Base URL state 变量 SHALL 立即更新为该选项的 value

#### Scenario: 覆盖 Base URL 生效
- **WHEN** 用户选择非默认的 Base URL 并保存
- **THEN** `AIClient` 下次实例化 Provider 时 SHALL 使用该选定 URL 替代内置默认值

#### Scenario: 恢复默认端点
- **WHEN** 用户在下拉中选回默认选项
- **THEN** Provider SHALL 回退到内置硬编码默认端点

### Requirement: 内置模型 Model Name 可覆盖
AI 模型配置页 SHALL 为每个内置模型提供 Model Name 覆盖输入框；空值 SHALL 使用 Provider 内置模型名称。

Model Name 输入框下方 SHALL 显示最新可选模型名称提示文字。

#### Scenario: Claude Model Name 可选提示
- **WHEN** 用户查看 Claude 的 Model Name 输入框
- **THEN** 输入框下方 SHALL 显示 `可选: claude-sonnet-4-6, claude-opus-4-6, claude-haiku-4-5-20251001`

#### Scenario: GLM Model Name 可选提示
- **WHEN** 用户查看 GLM 的 Model Name 输入框
- **THEN** 输入框下方 SHALL 显示 `可选: glm-4-plus, glm-4-long, glm-4-flash, glm-4.7-flash`

#### Scenario: ARK Model Name 可选提示
- **WHEN** 用户查看 ARK 的 Model Name 输入框
- **THEN** 输入框下方 SHALL 显示 `可选: doubao-seed-2.0-code, doubao-seed-2.0-pro, doubao-seed-2.0-lite`

#### Scenario: Kimi Model Name 可选提示
- **WHEN** 用户查看 Kimi 的 Model Name 输入框
- **THEN** 输入框下方 SHALL 显示 `可选: kimi-k2.5, kimi-k2-instruct`

#### Scenario: 覆盖模型名称
- **WHEN** 用户在 Model Name 输入框填写自定义模型名称并保存
- **THEN** Provider 发起 API 请求时 SHALL 使用该自定义名称作为 model 字段值

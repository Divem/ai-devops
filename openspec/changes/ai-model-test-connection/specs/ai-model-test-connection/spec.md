## ADDED Requirements

### Requirement: AI 模型配置页支持测试请求
AI 模型配置区块 SHALL 提供"测试请求"按钮，使用当前表单填写的值（未保存）向 AI 端点发起最小请求，并展示测试结果。

#### Scenario: 点击测试按钮发起请求
- **WHEN** 用户填写 API Key 后点击"测试请求"按钮
- **THEN** 系统 SHALL 向当前配置的 AI 端点发送一条最小请求（max_tokens: 5）并显示"测试中…"状态

#### Scenario: 测试成功
- **WHEN** AI 端点返回有效响应（HTTP 2xx 且无 error 字段）
- **THEN** 页面 SHALL 显示绿色成功提示，内容包含"测试成功"

#### Scenario: 测试失败（认证错误）
- **WHEN** AI 端点返回 4xx 错误（如 API Key 无效）
- **THEN** 页面 SHALL 显示红色错误提示，包含错误信息

#### Scenario: 测试失败（网络错误）
- **WHEN** 请求因网络问题无法到达端点
- **THEN** 页面 SHALL 显示红色错误提示，内容为"网络错误: <message>"

#### Scenario: Key 为空时按钮禁用
- **WHEN** 当前模型的 API Key 输入框为空
- **THEN** "测试请求"按钮 SHALL 处于禁用状态，不可点击

#### Scenario: 测试使用当前表单值而非已保存值
- **WHEN** 用户修改了 API Key 但尚未保存，点击"测试请求"
- **THEN** 系统 SHALL 使用表单中当前填写的值发起测试，而非 localStorage 中的旧值

#### Scenario: 自定义模型缺少必要字段时按钮禁用
- **WHEN** 模型为"自定义"且 Base URL / Model Name / API Key 任一为空
- **THEN** "测试请求"按钮 SHALL 处于禁用状态

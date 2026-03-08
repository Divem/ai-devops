## Why

AI 模型配置完成后，用户无法直接验证 API Key、Base URL 和 Model Name 是否有效，只能等到实际生成文档时才能发现配置错误。参考已有的 Git 连接测试功能，AI 配置区块同样需要一个「测试请求」按钮，让用户在保存前即可确认配置可用。

## What Changes

- **新增 `handleTestAI` 函数**：使用当前表单中的值（key / baseUrl / modelName）直接构造一次最小请求（max_tokens: 10，prompt: "Hello"），不依赖已保存的 localStorage 值，避免"保存前测试"场景下的数据不一致
- **新增 UI 状态**：`aiTestStatus`（null / 'testing' / 'success' / 'error'）和 `aiTestMsg`，驱动结果展示
- **保存按钮旁新增「测试请求」按钮**：点击时 disabled 状态（Key 为空或正在测试中），显示 loading → 成功 / 失败结果条

## Capabilities

### New Capabilities

- `ai-model-test-connection`: AI 模型配置页"测试请求"功能——使用表单当前值发起最小 AI 调用，展示成功/失败结果

### Modified Capabilities

（无需修改已有规格）

## Impact

- `pm-ai-app/src/PMPlatform.jsx`
  - `ProjectSettingsPage` 新增 `aiTestStatus`、`aiTestMsg` state
  - 新增 `handleTestAI` 异步函数（按模型类型分支构造请求）
  - AI 配置区块保存按钮旁添加「测试请求」按钮 + 结果展示条

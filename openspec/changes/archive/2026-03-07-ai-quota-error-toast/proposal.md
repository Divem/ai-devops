## Why

AI 功能（评审、文档生成、Chatbot）调用失败时，所有错误统一显示"AI评审失败，请重试"，用户无法判断是配额不足、Key 未配置还是网络问题，导致无效重试。目前 Anthropic API 余额不足时返回 `"Your credit balance is too low..."` 错误，需要将其识别并提示用户去充值。

## What Changes

- `ai-client.js`：`ClaudeProvider.chat()` 和 `GLMProvider.chat()` 改为 **throw typed Error**（携带 `errorType` 属性），不再返回 `❌` 前缀字符串
- `PMPlatform.jsx`：新增 `getAIErrorMessage(e)` 工具函数，将错误类型映射为用户友好的中文提示
- `PMPlatform.jsx`：更新 `handleAIReview`、`handleSendMessage`、文档生成的 catch 块，使用 `getAIErrorMessage(e)` 展示具体 toast

## Capabilities

### New Capabilities

- `ai-error-handling`: AI 请求错误分类处理，区分配额不足、Key 未配置、认证失败、网络错误四种类型，每种类型显示对应的操作引导提示

### Modified Capabilities

（无需求层面变更）

## Impact

- `ai-client.js`（项目根目录）— 错误处理方式改为 throw
- `pm-ai-app/src/PMPlatform.jsx` — 新增错误映射函数，更新 3 处 catch 块
- 不影响正常成功路径

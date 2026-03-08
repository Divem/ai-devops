## 1. 修改 ai-client.js 错误处理

- [x] 1.1 在 `ClaudeProvider.chat()` 中，将 `data.error` 分支从 `return this._error(...)` 改为 throw Error（携带 `errorType` = `data.error.type`，`errorMessage` = `data.error.message`）
- [x] 1.2 在 `ClaudeProvider.chat()` 的 catch 块中，将网络错误也改为 throw Error（`errorType = 'network_error'`）
- [x] 1.3 对 `GLMProvider.chat()` 做相同修改（throw 代替 return `_error`）

## 2. 在 PMPlatform.jsx 添加错误映射函数

- [x] 2.1 在 `callAI` 函数附近添加 `getAIErrorMessage(e)` 函数，映射四种错误类型：配额不足 / Key 未配置 / Key 无效 / 通用错误

## 3. 更新 catch 块

- [x] 3.1 更新 `handleAIReview`（约 3691 行）的 catch：`notify(getAIErrorMessage(e), false)`
- [x] 3.2 更新 `handleSendMessage`（约 3735 行）的 catch：`notify(getAIErrorMessage(e), false)`
- [x] 3.3 更新 DetailPage `handleGenerate`（约 2865 行）的 catch：`setDocError(getAIErrorMessage(e))`
- [x] 3.4 更新 DesignStudio `handleGenerate`（约 1734 行）的 catch：补充 `console.error` 并添加 toast 或 log（该处没有 notify 引用，仅 console.error 即可）

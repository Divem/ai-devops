## Context

当前错误链路：
1. `ClaudeProvider.chat()` → 遇到 API 错误时调用 `this._error(msg)` 返回 `❌ API 错误: xxx` 字符串
2. `callAIReview()` 对返回值做 `JSON.parse()`，parse 失败 → catch 块执行 → `notify("AI评审失败，请重试", false)`
3. catch 块没有错误信息，无法区分类型

Anthropic 的错误结构：`data.error.type` 为 `'invalid_request_error'`（含配额不足），`'authentication_error'`（含 Key 错误），`'overloaded_error'` 等。

## Goals / Non-Goals

**Goals:**
- 四类错误给出不同中文 toast：配额不足 / Key 未配置 / 认证失败 / 通用网络错误
- 改动最小：只改 `ai-client.js` 错误抛出方式 + 增加一个 mapping 函数

**Non-Goals:**
- 不做错误重试机制
- 不做错误上报/日志
- 不修改 UI 样式（复用现有 `notify` toast）

## Decisions

### ai-client.js：throw typed Error 而非返回字符串

将 `_error(msg)` 替换为直接 throw：

```js
// ClaudeProvider.chat() 中
if (data.error) {
  const err = new Error(data.error.message);
  err.errorType = data.error.type;         // 'invalid_request_error' | 'authentication_error' | ...
  err.errorMessage = data.error.message;   // 原始英文消息（含 "credit balance" 等关键词）
  throw err;
}
```

这样所有 caller 的 try/catch 都能拿到结构化错误，不需要 parse 字符串。

### PMPlatform.jsx：getAIErrorMessage(e)

```js
function getAIErrorMessage(e) {
  const msg = e?.errorMessage || e?.message || '';
  if (msg.includes('credit balance') || msg.includes('too low')) {
    return '⚠️ API 配额不足，请前往 Anthropic 控制台充值';
  }
  if (!msg || msg.includes('未配置 API Key') || msg.includes('API Key')) {
    return '⚠️ 未配置 API Key，请在设置中填写';
  }
  if (e?.errorType === 'authentication_error' || msg.includes('invalid x-api-key')) {
    return '⚠️ API Key 无效，请检查设置';
  }
  return 'AI 请求失败，请稍后重试';
}
```

## Risks / Trade-offs

- [callAIReview 依赖返回值] 原来 parse `❌` 字符串也会 throw，逻辑不变；改为直接 throw 后行为更明确
- [GLMProvider 同步修改] GLMProvider 使用相同的 `_error` 模式，一并修改保持一致

## Migration Plan

1. 修改 `ai-client.js` ClaudeProvider 和 GLMProvider 的错误处理
2. 在 PMPlatform.jsx 添加 `getAIErrorMessage` 函数
3. 更新 3 处 catch 块

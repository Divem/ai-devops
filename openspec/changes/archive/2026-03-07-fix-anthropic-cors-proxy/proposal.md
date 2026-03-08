## Why

浏览器直接调用 `https://api.anthropic.com/v1/messages` 时，由于 Anthropic 未设置 CORS 响应头，浏览器的预检请求（preflight）被拦截，导致 AI 智能评审、文档生成等所有 AI 功能报错失败。需通过开发服务器代理转发请求，绕过浏览器同源限制。

## What Changes

- 在 `pm-ai-app/vite.config.js` 添加 proxy 配置，将 `/api/anthropic` 转发到 `https://api.anthropic.com`
- 将 `ai-client.js` 中 `ClaudeProvider` 的 `apiEndpoint` 从绝对 URL 改为相对路径 `/api/anthropic/v1/messages`，使请求经由 Vite 代理发出

## Capabilities

### New Capabilities

- `anthropic-cors-proxy`: Vite dev server proxy 配置，将前端对 `/api/anthropic/*` 的请求转发到 `https://api.anthropic.com/*`，消除 CORS 错误

### Modified Capabilities

（无需求层面变更）

## Impact

- `pm-ai-app/vite.config.js` — 新增 `server.proxy` 配置
- `ai-client.js`（项目根目录）— `ClaudeProvider.apiEndpoint` 改为相对路径
- 所有调用 Claude API 的功能（AI 评审、文档生成、Chatbot）均受益，无破坏性变更

## 1. 配置 Vite 代理

- [x] 1.1 在 `pm-ai-app/vite.config.js` 的 `defineConfig` 中添加 `server.proxy` 配置，将 `/api/anthropic` 转发到 `https://api.anthropic.com`，设置 `changeOrigin: true` 并使用 `rewrite` 去掉路径前缀

## 2. 更新 API 端点

- [x] 2.1 将 `ai-client.js` 中 `ClaudeProvider` 的 `apiEndpoint` 从 `'https://api.anthropic.com/v1/messages'` 改为 `'/api/anthropic/v1/messages'`

## 3. 验证

- [x] 3.1 重启 Vite dev server，点击 AI 智能评审，确认请求成功无 CORS 报错

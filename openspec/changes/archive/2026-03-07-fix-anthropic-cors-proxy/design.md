## Context

`pm-ai-app/src/main.jsx` 从项目根目录导入 `ai-client.js`（路径 `../../ai-client.js`），并将 `AIClient`、`ClaudeProvider` 等挂载到 `window`。`ClaudeProvider` 在实例化时将 `apiEndpoint` 硬编码为 `https://api.anthropic.com/v1/messages`，导致浏览器直接跨域请求 Anthropic 服务器，触发 CORS 预检失败。

## Goals / Non-Goals

**Goals:**
- 消除浏览器 CORS 报错，使所有 AI 功能正常调用
- 改动最小：只改两处（`vite.config.js` 代理 + `ai-client.js` 端点 URL）
- 仅影响开发环境，不引入新依赖

**Non-Goals:**
- 不搭建独立后端服务
- 不处理生产环境部署（生产环境需另行配置反向代理）
- 不修改其他 AI Provider（GLMProvider 不受影响）

## Decisions

### 使用 Vite proxy 而非新增 Express 中间件

Vite 内置 `server.proxy`，零依赖、零配置复杂度，在开发模式下完全满足需求。引入 Express 会增加维护成本，不必要。

**代理配置：**
```js
server: {
  proxy: {
    '/api/anthropic': {
      target: 'https://api.anthropic.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
    }
  }
}
```

### ClaudeProvider 端点改为相对路径

将 `apiEndpoint` 从 `'https://api.anthropic.com/v1/messages'` 改为 `'/api/anthropic/v1/messages'`，请求将发到同源的 Vite dev server，再由代理转发到 Anthropic，浏览器不会触发跨域检查。

**替代方案**：在 `ClaudeProvider` 中做运行时判断（开发/生产）——过度工程，当前不需要。

## Risks / Trade-offs

- [仅修复开发环境] Vite proxy 只在 `vite dev` 时生效，生产构建需要独立的反向代理 → 当前场景为本地开发工具，可接受；如后续部署生产需另行处理
- [ai-client.js 在项目根目录] 该文件路径耦合了 `pm-ai-app`，相对路径有一定脆弱性 → 不在本次变更范围，维持现状

## Migration Plan

1. 修改 `pm-ai-app/vite.config.js`，添加 proxy
2. 修改 `ai-client.js`，更新 `ClaudeProvider.apiEndpoint`
3. 重启 Vite dev server
4. 验证 AI 评审功能正常发起请求

**回滚**：还原两处文件修改，重启服务即可。

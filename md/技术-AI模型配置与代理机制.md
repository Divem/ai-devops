# 技术说明：AI 模型配置与代理机制

## 背景

平台支持多个 AI 模型提供商（Claude、GLM、ARK、Kimi、自定义模型），但由于浏览器的 CORS（跨域资源共享）安全策略，前端无法直接请求第三方 API 域名。因此所有 AI 请求都需要通过 **Vite 开发代理** 中转。

本文档说明整个请求链路的工作原理、自定义模型的配置方式、以及当前方案的局限性。

---

## 一、为什么需要代理？

### 1.1 同源策略（Same-Origin Policy）

浏览器的核心安全机制。"同源"要求 **协议 + 域名 + 端口** 完全一致：

| 源 A | 源 B | 是否同源 |
|------|------|---------|
| `http://localhost:5173` | `http://localhost:5173/api` | 同源 |
| `http://localhost:5173` | `http://localhost:3000` | 不同源（端口不同） |
| `http://localhost:5173` | `https://api.kimi.com` | 不同源（协议+域名+端口全不同） |

### 1.2 同源策略解决的核心安全问题

**浏览器的关键行为：不管请求从哪个页面发出，只要目标是 `b.com`，就自动带上 `b.com` 的 Cookie。** 浏览器按目标域名匹配 Cookie，不看发起方是谁。

这意味着如果没有同源策略，恶意网站可以利用用户已登录的身份窃取数据：

```
用户已登录 bank.com（浏览器存有 bank.com 的 session cookie）
      ↓
用户访问 evil.com
      ↓
evil.com 的 JS: fetch("https://bank.com/api/account")
      ↓
浏览器自动附带 bank.com 的 cookie  ←── 问题根源
      ↓
bank.com 服务器以为是用户本人操作，正常返回数据
      ↓
evil.com 的 JS 读取响应，窃取用户账户信息
```

这就是 **CSRF（跨站请求伪造）** 攻击。同源策略的拦截点在于：**请求发了，响应也回来了，但浏览器不让 `evil.com` 的 JS 读到响应内容。**

### 1.3 CORS（跨域资源共享）

CORS 是服务器**主动声明**"我允许哪些源访问我"的机制。服务器通过响应头授权：

```
Access-Control-Allow-Origin: http://localhost:5173
```

这相当于 `bank.com` 说："我信任 `localhost:5173`，允许它的 JS 读取我的响应。" 授权必须由数据持有方（被请求的服务器）来决定，而不是请求发起方。

对于非简单请求（带自定义 Header、Content-Type 为 JSON 等），浏览器会先发一个 **预检请求（Preflight）**：

```
OPTIONS /api/chat
Origin: http://localhost:5173
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Authorization, Content-Type
```

服务器必须回复允许，否则真正的请求不会发出。

### 1.4 本项目的情况

大多数 AI API 服务器不会返回允许 `localhost` 的 CORS 头，导致请求被浏览器拦截。

**解决方案**：Vite 开发服务器在本地起一个代理，前端请求发给本地代理（同源，不触发 CORS），代理再转发给真实的 API 服务器。

---

## 二、代理规则配置

代理规则定义在 `pm-ai-app/vite.config.js`：

```javascript
server: {
  proxy: {
    '/api/anthropic': {
      target: 'https://api.anthropic.com',
      rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
      // /api/anthropic/v1/messages → https://api.anthropic.com/v1/messages
    },
    '/api/ark': {
      target: 'https://ark.cn-beijing.volces.com',
      rewrite: (path) => path.replace(/^\/api\/ark/, ''),
      // /api/ark/api/coding/v3/chat/completions → https://ark.cn-beijing.volces.com/api/coding/v3/chat/completions
    },
    '/api/glm': {
      target: 'https://open.bigmodel.cn',
      rewrite: (path) => path.replace(/^\/api\/glm/, ''),
      // /api/glm/api/paas/v4/chat/completions → https://open.bigmodel.cn/api/paas/v4/chat/completions
    },
    '/api/kimi': {
      target: 'https://api.kimi.com/coding',
      rewrite: (path) => path.replace(/^\/api\/kimi/, ''),
      // /api/kimi/v1/messages → https://api.kimi.com/coding/v1/messages
    },
  },
}
```

**工作原理**：Vite 按 URL 前缀匹配代理规则。请求以 `/api/kimi` 开头就走 Kimi 代理，以 `/api/glm` 开头就走 GLM 代理，互不干扰。

---

## 三、请求完整链路（以 Kimi 为例）

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. KimiProvider 发起请求                                        │
│    fetch('/api/kimi/v1/messages', { headers: { x-api-key: ... }})│
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Vite 代理匹配 /api/kimi 前缀                                 │
│    - 去掉前缀: /api/kimi/v1/messages → /v1/messages              │
│    - 拼接 target: https://api.kimi.com/coding + /v1/messages     │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. 实际请求                                                     │
│    POST https://api.kimi.com/coding/v1/messages                  │
│    Headers: x-api-key, anthropic-version: 2023-06-01             │
│    Body: { model, max_tokens, messages }                         │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. 响应返回（Anthropic 格式）                                    │
│    { content: [{ text: "AI 回复内容" }] }                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 四、两种 API 格式对比

平台支持两种 API 格式，内置模型使用固定格式，自定义模型可选择：

| 维度 | OpenAI Compatible | Anthropic |
|------|-------------------|-----------|
| **端点路径** | `${baseUrl}/chat/completions` | `${baseUrl}/v1/messages` |
| **鉴权 Header** | `Authorization: Bearer <key>` 或 `x-api-key` | `x-api-key` + `anthropic-version: 2023-06-01` |
| **请求 Body** | `{ model, max_tokens, messages }` | `{ model, max_tokens, messages }` |
| **响应结构** | `choices[0].message.content` | `content[0].text` |
| **使用此格式的模型** | GLM、ARK、大多数国内模型 | Claude、Kimi |

---

## 五、自定义模型配置说明

### 配置字段

| 字段 | 说明 | 示例 |
|------|------|------|
| **显示名称** | 在模型切换下拉中显示的名称 | `My Kimi` |
| **API 格式** | OpenAI Compatible 或 Anthropic | `Anthropic` |
| **Base URL** | 代理路径前缀（不含 API 路径） | `/api/kimi` |
| **Model Name** | 模型标识符 | `kimi-latest` |
| **API Key** | API 密钥 | `sk-kimi-xxx` |
| **鉴权方式** | Bearer Token 或 x-api-key（Anthropic 格式下自动锁定为 x-api-key） | `x-api-key` |

### 配置示例：用自定义模型接入 Kimi

| 字段 | 值 |
|------|-----|
| API 格式 | `Anthropic` |
| Base URL | `/api/kimi` |
| Model Name | `kimi-latest` |
| API Key | `sk-kimi-8H2mClz0...` |
| 鉴权方式 | （自动锁定为 x-api-key） |

代码自动拼接路径：`/api/kimi` + `/v1/messages` → Vite 代理转发到 `https://api.kimi.com/coding/v1/messages`

---

## 六、当前局限性

### 问题：自定义模型只能用已有代理

Vite 代理的 target 在服务启动时就固定了，不支持运行时动态更改。因此自定义模型的 Base URL **只能填已配置的代理路径**（`/api/anthropic`、`/api/glm`、`/api/ark`、`/api/kimi`），无法直接填任意第三方 URL。

如果填了未配置代理的外部 URL（如 `https://api.other-vendor.com`），浏览器会因 CORS 拦截请求。

### 解决方案对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| **A. 手动添加代理规则** | 简单直接 | 每加一个厂商要改 vite.config.js 并重启 |
| **B. 通用代理中间件** | 自定义模型填任意 URL 都能走代理 | 需要开发中间件，有安全风险（开放代理） |
| **C. 用户自建本地代理** | 不需要改代码 | 用户配置成本高 |
| **D. 后端 API 网关** | 生产环境的正确方案 | 需要部署后端服务 |

**当前采用方案 A**（手动添加），未来如需支持更多厂商可考虑方案 B 或 D。

### 如何手动添加新厂商代理

在 `pm-ai-app/vite.config.js` 的 `server.proxy` 中添加：

```javascript
'/api/新厂商': {
  target: 'https://api.新厂商.com',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api\/新厂商/, ''),
  configure: (proxy) => {
    proxy.on('proxyReq', (proxyReq) => {
      proxyReq.removeHeader('origin');
      proxyReq.removeHeader('referer');
    });
  },
},
```

添加后重启 dev server（`npm run dev`）生效。

---

## 七、相关代码位置

| 文件 | 内容 |
|------|------|
| `ai-client.js:18-64` | `AIClient` 统一客户端，根据模型 ID 创建对应 Provider |
| `ai-client.js:69-151` | `ClaudeProvider` — Anthropic 格式 |
| `ai-client.js:156-239` | `GLMProvider` — OpenAI 格式 |
| `ai-client.js:244-316` | `ArkProvider` — OpenAI 格式 |
| `ai-client.js:323-374` | `KimiProvider` — Anthropic 格式 |
| `ai-client.js:379-443` | `CustomProvider` — 支持 OpenAI / Anthropic 格式切换 |
| `pm-ai-app/vite.config.js` | Vite 代理规则配置 |
| `pm-ai-app/src/PMPlatform.jsx:7223-7235` | `DEFAULT_PROJECT_CONFIG` 默认配置 |
| `pm-ai-app/src/PMPlatform.jsx:7252-7281` | `loadProjectConfig()` 从 localStorage 加载 |
| `pm-ai-app/src/PMPlatform.jsx:7284-7307` | `saveProjectConfig()` 保存到 localStorage |
| `pm-ai-app/src/PMPlatform.jsx:7487-7556` | `handleTestAI()` 测试连接 |

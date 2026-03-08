## Why

当前 AI 模型选项仅支持 Claude 与 GLM，无法直接选择和调用火山方舟的 ARK Code Latest。为支持团队在同一工作流中按场景切换模型，需要把 ARK 模型纳入统一模型配置与请求链路。

## What Changes

- 在 AI 模型配置中新增火山方舟模型选项（`ark-code-latest`）。
- 为火山方舟新增独立 API Key 配置项与本地持久化键。
- 扩展统一 AI 客户端路由，支持将请求发送到火山方舟 OpenAI Completions 兼容端点。
- 保持现有 Claude / GLM 行为与默认模型不变，新增模型为可选项。

## Capabilities

### New Capabilities
- `volc-ark-model-integration`: 支持火山方舟 ARK Code Latest 的模型注册、认证与请求发送。

### Modified Capabilities
- `project-settings-page`: AI 模型配置区新增火山方舟选项与对应 API Key 输入/保存行为。

## Impact

- 前端配置与 UI：`pm-ai-app/src/PMPlatform.jsx`（模型下拉、API Key 字段、配置读写）。
- AI 请求抽象层：`ai-client.js`（新增 provider、模型注册、错误处理适配）。
- localStorage 键空间：新增火山方舟 key 的读写约定。

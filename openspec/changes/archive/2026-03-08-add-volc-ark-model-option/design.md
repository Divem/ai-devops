## Context

当前应用的 AI 模型链路由 `PMPlatform.jsx` 的配置页与 `ai-client.js` 的统一客户端共同组成：
- 配置页仅暴露 `claude` 与 `glm` 两个模型选项。
- `projectConfig.ai` 仅维护 `anthropicKey` 与 `glmKey`。
- `AIClient` 仅支持 `ClaudeProvider` 与 `GLMProvider`。

本次变更需要在不破坏现有模型行为的前提下，将火山方舟 `ark-code-latest` 接入为第三个可选模型，并沿用当前“本地存储 + 统一调用入口”的实现风格。

## Goals / Non-Goals

**Goals:**
- 在 AI 模型下拉中提供火山方舟模型选项。
- 新增火山方舟 API Key 的配置、保存与恢复能力。
- 扩展 `AIClient` provider 分发，支持请求到 `https://ark.cn-beijing.volces.com/api/coding/v3`（OpenAI Completions 兼容）。
- 保持现有 Claude/GLM 的默认行为与用户数据兼容。

**Non-Goals:**
- 不引入服务端密钥托管或后端代理。
- 不改造历史 `ApiKeyModal` 的交互入口，仅保证主配置页可完成配置。
- 不在本次变更中扩展多模型并发、自动路由或成本统计。

## Decisions

1. 扩展现有 `projectConfig.ai` 而不是新建配置结构
   - 决策：新增 `arkApiKey`（或同等语义字段），并映射到 localStorage 键 `ai_model_ark_key`。
   - 原因：最小改动接入第三模型，复用现有保存/恢复逻辑。
   - 备选：引入 `providers` 动态数组结构；被拒绝，当前单文件应用中改动面过大。

2. 在 `AIClient` 中新增 `ArkProvider`，继续使用 provider switch
   - 决策：沿用 `switch(model)` 路由，新增 `ark` 分支与 `ArkProvider` 实现。
   - 原因：与现有架构一致，可控且易回归。
   - 备选：重构为注册表驱动工厂；被拒绝，本次只需增量接入一个模型。

3. 统一返回文本格式，屏蔽供应商差异
   - 决策：`ArkProvider.chat()` 解析 OpenAI Completions 风格响应（`choices[0].message.content`）并返回纯文本字符串。
   - 原因：上层 UI 已依赖 `callAI()` 返回字符串，不应因新增模型改变契约。
   - 备选：返回结构化对象；被拒绝，会扩大前端影响范围。

4. 安全策略与现有模型保持一致
   - 决策：API Key 仅保存在浏览器 localStorage；源码中不写入真实密钥。
   - 原因：与当前 Claude/GLM 一致，符合现有安全边界。
   - 备选：将 API Key 写入项目配置文件；被拒绝，存在泄露风险。

## Risks / Trade-offs

- [Risk] ARK 端点/协议与 OpenAI 兼容细节偏差导致请求失败 → Mitigation: 独立 provider 封装请求体与错误处理，失败时返回统一错误文案并保留 console 细节。
- [Risk] 新增字段后旧配置对象缺字段 → Mitigation: `loadProjectConfig()` 提供默认值兜底，保证向后兼容。
- [Risk] 模型切换后历史对话按模型隔离，用户感知“消息丢失” → Mitigation: 复用当前按 `chatHistory_<model>` 存储策略，在说明文案中保持一致预期。
- [Trade-off] 继续使用本地存储密钥虽然实现快，但无法跨设备同步 → Mitigation: 保持现状，后续可单独提案做服务端密钥托管。

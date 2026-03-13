## Context

当前 `CustomProvider` 仅支持 OpenAI Chat Completions 格式。所有自定义模型请求都发送到 `${baseUrl}/chat/completions`，使用 `Authorization: Bearer` 或 `x-api-key` 鉴权，响应解析 `choices[0].message.content`。

Anthropic API 格式与 OpenAI 存在三个核心差异：
1. **端点路径**：`/v1/messages`（非 `/chat/completions`）
2. **鉴权头**：必须包含 `x-api-key` 和 `anthropic-version: 2023-06-01`
3. **响应结构**：`content[0].text`（非 `choices[0].message.content`）

## Goals / Non-Goals

**Goals:**
- 自定义模型支持 Anthropic API 格式，与现有 OpenAI 格式并存
- 用户可在 ProjectSettingsPage 中选择格式
- 测试连接功能适配 Anthropic 格式
- 配置持久化到 localStorage

**Non-Goals:**
- 不新增独立的模型提供商（复用 CustomProvider）
- 不支持 Anthropic 流式响应（streaming）
- 不修改内置 Claude 提供商的逻辑

## Decisions

### 1. 在 CustomProvider 内部通过 format 字段切换逻辑

**选择**：在现有 `CustomProvider` 中增加 `format` 属性（`openai` | `anthropic`），根据值切换请求构造与响应解析。

**替代方案**：新建 `CustomAnthropicProvider` 类。
**理由**：两种格式仅在 header/body/response 解析上有差异，核心逻辑（读取配置、错误处理）完全相同，拆分为两个类会导致重复代码。

### 2. 格式选项使用 select 下拉而非 radio

**选择**：在自定义模型配置区使用 `<select>` 下拉选择 API 格式。

**理由**：与现有 Auth Style 选择保持一致的 UI 模式，且未来如需扩展更多格式（如 Google Gemini）易于添加。

### 3. Anthropic 格式下固定端点路径

**选择**：Anthropic 格式请求发送到 `${baseUrl}/v1/messages`。

**理由**：与内置 ClaudeProvider 保持一致。用户填写 Base URL 时不含路径（如 `https://my-proxy.com`），系统自动拼接。

### 4. 选择 Anthropic 格式时自动切换 Auth Style 为 x-api-key

**选择**：当用户选择 Anthropic 格式时，Auth Style 自动设为 `x-api-key` 并锁定（Anthropic API 仅支持此方式）。切换回 OpenAI 时恢复可选。

**理由**：减少配置错误，Anthropic 格式强制要求 `x-api-key`。

## Risks / Trade-offs

- **[兼容性]** 部分 Anthropic 代理可能不严格遵循官方 API 格式 → 用户可通过测试连接功能验证
- **[配置复杂度]** 新增一个配置项增加了表单复杂度 → 默认值为 OpenAI，对不需要的用户无感知

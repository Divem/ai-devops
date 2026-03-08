## Context

Git 测试连接通过 `handleTestConnection` 函数调用 GitHub/GitLab API。AI 测试需要类似模式，但 AIClient 从 localStorage 读取配置，而用户可能尚未保存表单，因此不能直接用 `new AIClient()`——需直接使用表单状态值发起请求。

## Goals / Non-Goals

**Goals**
- 使用当前表单值（未保存）测试 AI 端点连通性和认证有效性
- 四种模型类型均有对应测试逻辑（claude / glm / ark / custom）
- 测试结果展示与 Git 测试风格一致

**Non-Goals**
- 不写入 localStorage（保存操作由用户主动触发）
- 不测试 AI 输出质量，只验证请求可达且认证通过

## Decisions

**D1: 直接构造 fetch 请求，不经过 AIClient**

AIClient 在构造时从 localStorage 读取 key/baseUrl，若用户未保存则使用旧值。直接在 `handleTestAI` 中用表单 state 值构造请求，确保测试的是「当前填写的配置」。

**D2: 请求参数最小化**

`max_tokens: 5`，prompt: `"Hi"`——降低消耗，加快响应，仅验证认证和路由。

**D3: 各模型请求构造方式**

| 模型 | Endpoint | Auth Header | Body |
|------|----------|-------------|------|
| claude | `${anthropicBaseUrl \|\| '/api/anthropic/v1/messages'}` | `x-api-key`, `anthropic-version` | Anthropic Messages 格式 |
| glm | `${glmBaseUrl \|\| 'https://open.bigmodel.cn/api/paas/v4/chat/completions'}` | `Authorization: Bearer` | OpenAI 格式 |
| ark | `${arkBaseUrl \|\| 'https://ark.cn-beijing.volces.com/api/coding/v3'}/chat/completions` | `Authorization: Bearer` | OpenAI 格式 |
| custom | `${customBaseUrl}/chat/completions` | Bearer 或 x-api-key | OpenAI 格式 |

**D4: 结果展示样式**

复用 Git 测试的样式模式：
```jsx
{aiTestStatus && (
  <div style={{ padding: '8px 12px', borderRadius: 6, marginBottom: 12, fontSize: 12,
    background: aiTestStatus==='success' ? C.successLight : aiTestStatus==='error' ? C.dangerLight : C.accentLight,
    color: ..., border: ... }}>
    {aiTestStatus === 'testing' ? '测试中…' : aiTestMsg}
  </div>
)}
```

**D5: 测试按钮 disabled 条件**

- claude：`!anthropicKey.trim()`
- glm：`!glmKey.trim()`
- ark：`!arkKey.trim()`
- custom：`!customKey.trim() || !customBaseUrl.trim() || !customModel.trim()`

成功结果：显示模型返回的片段（如 `"测试成功: Hello"` 或仅显示"请求成功"）。

## Risks / Trade-offs

- [测试消耗 API 额度] → 仅 max_tokens: 5，成本极低
- [claude 代理路径下 CORS 限制] → 与实际调用路径相同，测试结果有参考价值

## Migration Plan

纯 UI 功能添加，无数据迁移。

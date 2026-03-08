# Design: Add Zhipu GLM-4.7 Model Support

## Context

**当前状态**:
- 平台仅支持 Anthropic Claude API (claude-sonnet-4-20250514)
- API Key 配置方式：代码常量 + localStorage + .env 文件
- API 调用直接内联在各个组件中

**约束条件**:
- 保持向后兼容，现有 Claude 功能不受影响
- 纯前端应用，无后端代理
- 需要支持多个应用文件（sdd.jsx, sdd2.jsx, vibe.jsx）

**利益相关者**:
- 产品用户：需要稳定的 AI 功能
- 开发者：需要简洁的配置方式

## Goals / Non-Goals

**Goals:**
- 添加智谱 GLM-4.7 模型作为备选 AI 提供商
- 统一 API 调用接口，便于未来扩展更多模型
- 提供用户友好的模型切换方式
- 支持智谱 API Key 的多种配置方式

**Non-Goals:**
- 不重构现有架构（仅抽象 AI 调用层）
- 不实现模型路由/负载均衡
- 不添加模型性能对比功能

## Decisions

### 1. AI 客户端抽象层

**决策**: 创建轻量级 `AIClient` 类，封装不同模型的调用差异。

**理由**:
- 保持代码 DRY，避免每个组件重复处理多模型逻辑
- 便于未来添加更多模型（如文心一言、通义千问）
- 集中处理错误和重试逻辑

**替代方案**:
- 方案 A: 每个组件内联处理多模型（❌ 代码重复，难以维护）
- 方案 B: 引入 SDK（❌ 增加依赖，项目追求轻量）
- **方案 C: 轻量抽象层（✅ 采用）**

### 2. 模型配置优先级

**决策**: 配置优先级：代码常量 > localStorage > 环境变量

```
API_KEY 顺序:
1. localStorage['ai_model_claude_key'] / localStorage['ai_model_glm_key']
2. import.meta.env.VITE_ANTHROPIC_API_KEY / VITE_ZHIPU_API_KEY
3. 代码中的 API_KEY 常量（兜底）
```

**理由**:
- localStorage 优先级最高，便于用户临时配置
- 环境变量次之，适合开发环境
- 代码常量兜底，确保演示环境可用

### 3. 智谱 API 集成

**决策**: 使用智谱开放平台 API (GLM-4)

```javascript
// API 端点
https://open.bigmodel.cn/api/paas/v4/chat/completions

// 请求格式
{
  "model": "glm-4",
  "messages": [{"role": "user", "content": "..."}],
  "temperature": 0.7
}

// 认证方式
Authorization: Bearer <API_KEY>
```

**理由**:
- GLM-4 与 Claude 性能相当，中文理解能力更强
- 智谱 API 格式与 OpenAI 兼容，集成简单

### 4. UI 模型选择器

**决策**: 在设置面板添加模型选择下拉框，默认使用 Claude。

**理由**:
- 非侵入式，不影响现有用户习惯
- 可随时切换，便于对比效果

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| GLM API 响应格式与 Claude 不一致 | AIClient 统一处理响应格式，确保上层组件无感知 |
| API Key 泄露风险 | .env 文件加入 .gitignore，代码中不包含真实密钥 |
| 模型切换导致上下文丢失 | 每个模型维护独立的 chatHistory |
| GLM API 配额限制 | 添加错误提示，引导用户切换回 Claude |

## Implementation Plan

### Phase 1: 核心抽象层
1. 创建 `AIClient` 类
2. 实现 `ClaudeProvider` 和 `GLMProvider`
3. 统一响应格式处理

### Phase 2: 配置支持
1. 添加环境变量 `VITE_ZHIPU_API_KEY`
2. 更新 localStorage key 命名规范
3. 更新 .gitignore

### Phase 3: UI 更新
1. 添加模型选择器组件
2. 更新设置面板
3. 添加 API Key 管理界面

### Phase 4: 集成测试
1. 测试 Claude 功能不受影响
2. 测试 GLM 基本功能
3. 测试模型切换

## Open Questions

- [ ] Q1: 是否需要支持流式输出（SSE）？
  - **建议**: GLM 支持，但 V1.0 暂不实现，保持简单

- [ ] Q2: 默认使用哪个模型？
  - **建议**: 默认 Claude（已有稳定使用），用户可切换

- [ ] Q3: 是否需要记录每个请求使用的模型？
  - **建议**: V1.0 不记录，后续可添加日志

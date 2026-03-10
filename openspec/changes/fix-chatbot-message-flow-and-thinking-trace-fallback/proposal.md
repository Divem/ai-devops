## Why

当前 Chatbot 发送链路存在关键体验问题：用户发送后消息不能立即进入对话区、输入框不及时清空、AI 失败时会话中无可见回复，导致“像没发出去”。同时系统缺少可演示的思考过程视图，无法像 Claude 一样直观展示已调用的 Skill 与执行步骤。该问题直接影响评审流程稳定性与演示可信度，需要优先修复。

## What Changes

- 重构 Chatbot 发送链路为“乐观更新”：先写入用户消息与思考占位，再异步请求 AI 并原位回填结果。
- 新增会话消息状态模型（pending/done/failed/fallback）与消息唯一 ID，支持并发请求的原位替换和防串线。
- 新增“思考过程”折叠面板：默认仅显示执行轨迹摘要，展开后可查看 Skill 调用、模型请求与结果阶段。
- 为 Chatbot 增加 AI 失败演示兜底：自动写入结构化示例回复，明确标识“示例数据（非 AI 实时生成）”。
- 增加失败重试入口与会话内错误可见性，避免仅靠 toast 提示。

## Capabilities

### New Capabilities
- `chatbot-thinking-trace`: 在 Chatbot 回复中展示可折叠执行轨迹，包含 Skill 调用摘要与阶段详情。

### Modified Capabilities
- `ai-chatbot`: 调整发送与回复时序，确保用户消息即时可见，并将失败状态写入会话。
- `ai-error-demo-fallback`: 扩展错误兜底范围到 Chatbot 会话，支持自动示例回复与显式演示标识。

## Impact

- 主要影响代码：`pm-ai-app/src/PMPlatform.jsx`（`ChatbotPanel`、`handleSendMessage`、消息渲染与状态更新逻辑）。
- 可能补充公共 helper（消息构建、原位替换、fallback 生成）以降低分支复杂度。
- 不引入新后端 API，不改变现有模型配置存储结构；仅变更前端会话状态与展示行为。

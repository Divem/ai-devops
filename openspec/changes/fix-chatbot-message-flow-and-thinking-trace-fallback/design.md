## Context

当前 Chatbot 会话逻辑集中在 `pm-ai-app/src/PMPlatform.jsx`，其中 `ChatbotPanel` 负责输入与渲染，`handleSendMessage` 负责调用 AI 与写回历史。现有实现采用“请求完成后一次性写历史”，导致用户消息不可即时可见；请求失败仅 toast，不写会话，演示链路中断。项目已有文档与评审的 fallback 机制，但未覆盖 Chatbot。

约束：
- 不修改后端 API，不引入服务端流式协议。
- 保持现有按模型分历史（`chatHistory_<model>`）并兼容 `chatHistory` 旧字段。
- 思考过程采用执行轨迹（Skill/模型/结果），不展示完整推理文本。

## Goals / Non-Goals

**Goals:**
- 发送后立即在会话中显示用户消息，并立即清空输入框。
- 使用占位 assistant 消息表达“思考中”状态，请求完成后原位替换。
- 在每条 assistant 回复中支持折叠式“思考过程”轨迹。
- AI 失败时自动写入可演示的结构化示例回复，并显式标识 fallback 来源。
- 支持并发发送的消息对齐，避免响应串线覆盖。

**Non-Goals:**
- 不实现 token 级流式打字效果。
- 不新增后端日志采集或远端 tracing 系统。
- 不改动非 Chatbot 侧的文档生成与评审流程。

## Decisions

### D1. 发送链路改为“乐观写入 + 原位回填”
- 方案：`handleSendMessage` 在调用 AI 前即写入 `userMessage` 与 `assistantThinkingMessage`。
- 回填：请求成功后按 `assistantMessageId` 替换占位；失败则替换为 demo/fallback。
- 原因：最小改动即可解决“未发送感”，并与当前非流式架构兼容。
- 备选：继续等待请求完成再写入（被拒绝，体验差且无法展示步骤中状态）。

### D2. 引入消息 ID 与状态字段
- 方案：会话消息增加 `id/type/status/source/meta/trace` 扩展字段，旧消息按默认值兼容渲染。
- 原因：支持精确替换、重试、并发隔离和可视化状态。
- 备选：按数组最后一条替换（被拒绝，并发时会错替）。

### D3. 思考过程显示“执行轨迹”而非推理正文
- 方案：`trace.summary + trace.steps[]`，步骤至少包含 `skill_prepare`、`model_request`、`result`。
- 细节：默认折叠，仅显示“调用 N 个 Skill + 模型 + 耗时”；点击展开步骤详情。
- 原因：满足演示透明度，同时避免暴露不可控的模型推理内容。

### D4. Chatbot fallback 自动化
- 方案：新增 `buildChatbotFallbackReply(card, message)` 生成结构化示例回复。
- 输出形态：包含“结论摘要/风险/建议/后续问题”，并前置免责声明。
- 原因：保证 AI 异常时流程可继续演示，且结果可读、可复用。
- 备选：仅 toast + 空回复（被拒绝，演示不可持续）。

### D5. 失败可见性前移到会话内
- 方案：失败时除 toast 外，消息本体显示 `type=demo` 或 `type=error`，并提供“重试真实 AI”入口。
- 原因：用户无需关注瞬时 toast，即可在会话中理解系统状态。

## Risks / Trade-offs

- [消息结构复杂度上升] → 通过统一 helper（append/replace/build）降低分支散落。
- [历史数据兼容风险] → 渲染层对缺失字段提供默认值，读写时保持旧字段同步策略。
- [fallback 被误认为真实 AI] → 在气泡与轨迹头部双重标识“示例数据（非 AI 实时生成）”。
- [并发请求顺序错位] → 使用消息 ID 原位替换，禁止“按最后一条”更新。

## Migration Plan

1. 增量引入消息扩展字段与 helper，不修改既有消息读取入口。
2. 切换 `handleSendMessage` 到新状态机，保留现有 `callAI` 调用方式。
3. 升级 `ChatbotPanel` 渲染逻辑，支持 thinking/trace/demo/error 类型显示。
4. 补充 fallback 生成器与重试动作。
5. 手工回归：成功发送、失败 fallback、连续并发发送、模型切换后会话展示。
6. 若出现问题，可回滚到旧发送逻辑（仅需回退 `handleSendMessage` 与新增渲染分支）。

## Open Questions

- 是否需要在设置页增加“强制演示模式”（无论成功与否都优先展示 demo）？本变更默认不启用。
- 重试按钮策略采用“原位替换”还是“追加新消息”更符合当前产品习惯？当前设计默认原位替换。

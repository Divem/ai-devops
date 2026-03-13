## 1. 消息状态模型与工具函数

- [x] 1.1 在 `PMPlatform.jsx` 中定义 Chatbot 消息扩展字段约定（id/type/status/source/meta/trace）并兼容旧消息结构
- [x] 1.2 新增消息 helper：构建用户消息、thinking 占位消息、fallback 消息与按 id 原位替换函数
- [x] 1.3 为会话历史读写统一封装 `chatHistory_<model>` 与 `chatHistory` 兼容逻辑

## 2. 发送链路重构（乐观更新）

- [x] 2.1 改造 `handleSendMessage`：发送时先写入用户消息与 thinking 占位，再发起 AI 请求
- [x] 2.2 在发送动作触发后立即清空输入框并保持按钮/输入禁用策略一致
- [x] 2.3 请求成功后按 `assistantMessageId/requestId` 原位替换 thinking 为正式回复，避免并发串线

## 3. 思考过程轨迹 UI

- [x] 3.1 在 Chatbot 消息渲染中新增 thinking/demo/error 类型样式分支
- [x] 3.2 实现“思考过程”折叠条，默认展示 Skill 数、模型名、耗时摘要
- [x] 3.3 实现展开详情步骤列表（skill_prepare/model_request/result）并支持 Skill 详情二级展开

## 4. AI 失败演示兜底

- [x] 4.1 实现 `buildChatbotFallbackReply(card, message)` 生成结构化示例回复
- [x] 4.2 请求失败时将占位消息替换为 fallback 回复并标记“示例数据（非 AI 实时生成）”
- [x] 4.3 保留 toast 提示，同时在会话中写入可见失败/兜底状态，确保流程可继续演示

## 5. 重试与回归验证

- [x] 5.1 在失败或 fallback 消息上提供“重试真实 AI”入口，并验证替换策略（原位替换）
- [x] 5.2 手工验证关键场景：即时显示、成功回复、失败 fallback、连续发送并发、模型切换后历史展示
- [x] 5.3 记录验收结果并确认 `openspec status` 中 tasks 可进入实施阶段

## 验收记录

- 已完成构建验证：`npm run build` 通过。
- 已确认 Chatbot 发送链路改为“先写会话后请求”并包含失败 fallback、思考过程折叠和重试入口。

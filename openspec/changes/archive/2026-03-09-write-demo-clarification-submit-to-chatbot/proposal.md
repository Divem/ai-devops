## Why

当前“功能演示”弹框在用户点击确认提交后仅关闭弹框，不会把问答结果沉淀到 Chatbot，导致演示路径与真实评审路径体验不一致。将演示提交结果写入 Chatbot，可让用户立即看到结构化澄清记录并继续基于该上下文对话。

## What Changes

- 在 PRD 页“功能演示”弹框确认提交成功后，生成并追加一条澄清问答摘要到当前需求 Chatbot 历史。
- 摘要内容沿用现有 Q/A 结构（问题 + 答案），支持多次提交追加，不覆盖历史消息。
- 保持现有校验逻辑：当必填校验失败时，不写入 Chatbot 消息。
- 对齐演示路径与真实评审路径的消息展示与可追溯体验。

## Capabilities

### New Capabilities
- 无

### Modified Capabilities
- `prd-proposal-workflow`: 扩展 PRD 页“功能演示”确认提交后的行为，新增写入 Chatbot 摘要。
- `ai-chatbot`: 明确演示路径产生的澄清摘要消息也应被持久化并渲染。

## Impact

- 受影响代码：`pm-ai-app/src/PMPlatform.jsx`（演示弹框提交分支、chatHistory 写入）。
- 受影响体验：演示流程提交后，Chatbot 可立即看到问答摘要，交互闭环更完整。
- 外部依赖：无新增 API、无数据结构升级。

## Why

当前 Chatbot 输入区仍保留 Markdown 预览输入模式，操作路径偏长，且与技能面板键盘行为存在冲突，影响产品经理高频使用效率。需要将输入交互收敛为“直接编辑 + 直接发送”的轻量模式，并明确 slash 面板下 Tab/Enter 的行为。

## What Changes

- 移除 Chatbot 输入区的 Markdown 预览输入模式与编辑/预览切换流程。
- 输入区统一为单一编辑态，按 Enter 直接发送，Shift+Enter 换行。
- slash 技能面板激活时，Tab SHALL 将焦点返回输入框并仅保留当前输入，不触发发送。
- slash 技能面板激活时，Enter SHALL 直接执行当前高亮技能并发送到会话消息。
- 保持现有 fallback、重试与历史消息链路兼容。

## Capabilities

### New Capabilities
- （无）

### Modified Capabilities
- `ai-chatbot`: 调整输入交互模型，补充 slash 面板下 Tab/Enter 键盘语义。
- `chatbo-preview-first-ui`: 明确移除 Markdown 预览输入能力，统一为直接输入发送。

## Impact

- 前端：`pm-ai-app/src/PMPlatform.jsx` 的 `ChatbotPanel` 输入区和 slash 面板事件处理。
- 交互：消息发送触发时机、焦点管理、键盘可访问性。
- 验收：需覆盖普通聊天、技能调用、重试、模型切换与历史展示回归。

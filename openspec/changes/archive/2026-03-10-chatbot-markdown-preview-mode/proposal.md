## Why

当前 Chatbot 输入区仅支持纯文本输入，用户在编写包含标题、列表、代码块等 Markdown 内容时无法预览最终渲染效果，容易导致发送后格式不符合预期。引入预览模式可以显著提升内容组织效率与可读性，尤其适用于需求分析中的结构化回复。

## What Changes

- 在 Chatbot 输入区增加“编辑/预览”模式切换，支持发送前查看 Markdown 渲染效果。
- 预览模式下复用现有 Markdown 渲染能力，确保与文档区渲染风格一致。
- 发送消息后保持当前模式与输入状态策略一致（可配置为清空输入并回到编辑模式）。
- 为 Chatbot 消息展示补充 Markdown 渲染能力（至少 assistant 消息），提升会话内容可读性。
- 增加基础安全与容错策略（空内容、非法语法、超长内容降级为文本显示）。

## Capabilities

### New Capabilities
- （无）

### Modified Capabilities
- `ai-chatbot`: 在现有对话能力上增加 Markdown 预览与渲染相关行为规范。

## Impact

- 主要影响 `pm-ai-app/src/PMPlatform.jsx` 的 `ChatbotPanel` 消息渲染与输入区交互。
- 可能复用既有 `MarkdownRenderer` 组件，不引入后端改动。
- 不改变 AI 请求协议与会话存储结构，仅增加前端展示与交互状态。

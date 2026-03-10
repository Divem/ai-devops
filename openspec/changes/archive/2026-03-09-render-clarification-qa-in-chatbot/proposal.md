## Why

当前用户在需求澄清弹框中完成“确认补充”后，只能看到字段被回填，无法在 Chatbot 区域直观看到完整澄清过程，导致上下文不连续。将问答对自动渲染到 Chatbot，可形成可追溯的对话记录，方便后续继续追问与迭代。

## What Changes

- 在需求澄清弹框点击“确认补充并评审/确认补充”成功后，自动生成一条结构化问答摘要消息写入 Chatbot 历史。
- 问答摘要消息包含每个问题与对应答案，按“Q/A”分组展示，样式参考截图中的信息块风格（清晰分组、弱背景、可读性优先）。
- 同一需求可多次补充；每次提交都追加一条新的澄清记录，不覆盖既有聊天消息。
- 失败校验场景（必填缺失）不写入 Chatbot，避免噪声记录。

## Capabilities

### New Capabilities
- 无

### Modified Capabilities
- `ai-review-confirmation-dialog`: 在确认补充成功后新增“输出澄清问答摘要到 Chatbot”行为约束。
- `ai-chatbot`: 增加对“澄清问答摘要”系统消息的渲染规范与持久化要求。

## Impact

- 受影响代码：`pm-ai-app/src/PMPlatform.jsx`（确认弹框提交逻辑、chatHistory 写入、ChatbotPanel 消息渲染）。
- 受影响体验：用户可在 Chatbot 侧栏看到结构化澄清轨迹，便于后续继续对话。
- 外部依赖：无新增 API、无后端变更。

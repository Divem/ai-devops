## Why

当前 Chatbot 只能自由输入文本，缺少“可发现、可复用、可一键调用”的技能与命令入口，导致产品经理在高频分析场景下重复编写提示词、输出口径不稳定。现在需要在输入区增加类似命令面板的交互，让用户通过 `/` 快速选择并执行标准化能力。

## What Changes

- 在 Chatbot 输入框中新增 `/` 触发的技能/命令面板，支持键盘与鼠标选择。
- 新增“技能（Skills）”与“命令（Commands）”统一注册表，支持默认条目展示与调用。
- 预置一组产品经理高频能力：需求评审、风险检查、相关需求、功能点总结、完备性检查。
- 选择技能/命令后，自动生成结构化执行请求并写入会话，返回结果按卡片化格式展示。
- 为后续扩展自定义技能保留兼容接口（先以内置为主，不做复杂权限与远端市场）。

## Capabilities

### New Capabilities
- `chatbot-skill-command-center`: 为 Chatbot 提供技能/命令发现、选择、调用与结果展示的标准能力。

### Modified Capabilities
- `ai-chatbot`: 在现有聊天交互上增加 slash 触发面板、技能命令执行流和结果消息样式。

## Impact

- 前端：`pm-ai-app/src/PMPlatform.jsx` 中 Chatbot 输入区、消息渲染、发送链路与状态管理。
- 数据结构：扩展 Chat 消息类型与元信息（command/skill id、执行状态、结构化结果）。
- 配置：与 AI Skill 配置页对齐内置技能定义，后续可复用结构化 `SKILL.md`。
- 文档：新增能力规格并更新 `ai-chatbot` 相关行为要求。

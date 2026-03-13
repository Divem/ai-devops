## Why

AI 设计页面当前在普通浏览状态下鼠标经常呈现为点击手势，导致用户误以为整页都可点击，降低可用性与可信度。同时部分可操作区域缺少明确的悬浮焦点反馈，用户难以快速判断哪些元素可交互。

## What Changes

- 修正 AI 设计页面的鼠标光标语义：默认区域使用箭头光标，仅在可点击/可编辑/可拖拽元素上使用对应交互光标。
- 为可操作区域补充统一的 hover/focus 视觉反馈（边框、背景或阴影高亮），提升可发现性。
- 规范键盘焦点态（focus-visible）与鼠标悬浮态的一致性，避免只对鼠标用户友好。
- 保持现有功能与信息结构不变，仅优化交互反馈层。

## Capabilities

### New Capabilities
- `ai-design-interaction-feedback`: 定义 AI 设计页面光标语义与交互元素悬浮/焦点反馈规则。

### Modified Capabilities
- (none)

## Impact

- 受影响模块：`pm-ai-app/src/PMPlatform.jsx` 中 AI 设计页相关容器、文档树、按钮、可点击行与拖拽手柄样式。
- 受影响范围：前端样式与交互反馈逻辑（cursor/hover/focus-visible）。
- 不涉及 API、数据模型或外部依赖变更。

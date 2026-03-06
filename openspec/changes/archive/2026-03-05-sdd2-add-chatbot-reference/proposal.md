## Why

SDD2.jsx (pm-ai-platform_sdd2.jsx) 目前实现了看板和 DesignStudio 组件，但缺少 AI 辅助需求分析和历史需求参考功能。这些功能在 SDD.jsx 中已实现并经过验证，能显著提升需求评审效率和质量。

## What Changes

- 在 `DesignStudio` 组件右侧添加 `RightPanel` 面板，包含双 TAB 切换
- 添加 `ChatbotPanel` 组件：AI 需求分析助手，支持用户提问并获得 AI 分析建议
- 添加 `ReferencePanel` 组件：显示相似的历史需求，基于标签和优先级匹配
- 在卡片数据结构中添加 `chatHistory` 字段，存储与 AI 对话的历史记录
- 添加 `handleSendMessage` 函数，调用 Claude API 进行需求分析对话

## Capabilities

### New Capabilities
- `ai-chatbot`: AI 需求分析助手，支持用户与 AI 对话来分析、优化需求
- `reference-panel`: 历史需求参考面板，基于相似度算法推荐相关历史需求

### Modified Capabilities
- 无（仅添加新功能，不修改现有行为）

## Impact

- **代码修改**: `pm-ai-platform_sdd2.jsx`
- **新增组件**: `ChatbotPanel`, `ReferencePanel`, `RightPanel`
- **API 调用**: 复用现有的 `callClaude` 函数进行 AI 对话
- **数据结构**: 卡片对象新增 `chatHistory` 字段

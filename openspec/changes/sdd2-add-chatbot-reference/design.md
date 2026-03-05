## Context

SDD2.jsx 是 PM AI 平台的第二个 UI 变体，目前已经实现了：
- 看板视图（六阶段工作流）
- DesignStudio 组件（需求详情页，包含文档树和编辑器）

SDD.jsx 中已实现并验证了 ChatbotPanel 和 ReferencePanel 功能，现需要将这些功能移植到 SDD2.jsx。

**现有约束**：
- 项目使用纯 React hooks，无外部状态管理库
- 调用 Anthropic Claude API (`callClaude` 函数已存在)
- 使用 inline styles（不使用 CSS-in-JS 或外部样式表）

## Goals / Non-Goals

**Goals:**
- 在 DesignStudio 右侧添加可切换的双 TAB 面板（Chatbot / 参考资料）
- 实现 AI 需求分析助手，支持对话历史记录
- 实现相似需求推荐，基于标签和优先级匹配
- 复用 SDD.jsx 中已验证的组件逻辑和样式

**Non-Goals:**
- 修改现有的看板和文档编辑功能
- 实现新的 API 调用逻辑（复用现有的 `callClaude`）
- 修改数据存储方式（仅添加 `chatHistory` 字段）

## Decisions

### 1. 组件架构

复用 SDD.jsx 的组件结构：
- `RightPanel`: 容器组件，管理 TAB 状态
- `ChatbotPanel`: AI 对话界面
- `ReferencePanel`: 相似需求列表

**原因**：已验证的 UI/UX 模式，代码复用度高

### 2. 数据结构扩展

在卡片对象中添加 `chatHistory` 字段：
```javascript
{
  // ... 现有字段
  chatHistory: [
    { role: "user", content: "..." },
    { role: "assistant", content: "..." }
  ]
}
```

**原因**：轻量级方案，无需引入新的状态管理

### 3. 相似度算法

使用简单的标签匹配算法：
- 标签匹配：每个共同标签 +10 分
- 优先级匹配：+5 分
- 返回 Top 5

**原因**：实现简单，对于小规模数据集效果足够

### 4. AI Prompt 设计

复用 SDD.jsx 的 prompt 模板，包含需求上下文（标题、描述、用户故事、验收标准）。

**原因**：经过验证的 prompt 效果良好

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| 大规模对话历史可能导致性能问题 | 仅在进入详情页时加载，未做持久化 |
| 相似度算法过于简单 | 后续可升级为向量搜索 |
| Claude API 调用可能失败 | 添加错误处理和用户提示 |

## Migration Plan

1. 在 `DesignStudio` 组件中添加 `RightPanel`
2. 添加 `handleSendMessage` 函数到主组件
3. 更新 `mkDocs()` 函数，初始化 `chatHistory` 为空数组
4. 更新 `INITIAL_CARDS`，为每个卡片添加 `chatHistory` 字段

**Rollback**: 移除新增的组件和字段即可

## Open Questions

无

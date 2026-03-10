## Why

AI 设计页面（DetailPage）与设计工作室（DesignStudio）中的原始需求区域存在两个体验问题：一是在原始需求内容上方显示"示例内容（来自 PRD 摘录）"标签，混淆了 sample data 的演示语义，使用户误认为这是临时说明而非正式需求内容；二是 DesignStudio 中的原始需求使用纯文本渲染（`whiteSpace: pre-wrap`），无法正确显示 Markdown 格式内容。

## What Changes

- 删除两处"示例内容（来自 PRD 摘录）"标签渲染（`rawDisplay.isSample` 条件块）
- DesignStudio 原始需求区域改用 `<MarkdownRenderer>` 替代纯文本渲染

## Capabilities

### New Capabilities
（无）

### Modified Capabilities
- `raw-requirement-display`: 原始需求展示行为更新，删除 sample 标签，支持 Markdown 渲染

## Impact

- `pm-ai-app/src/PMPlatform.jsx` — 两处 `rawDisplay.isSample` 条件块 + DesignStudio 原始需求渲染区

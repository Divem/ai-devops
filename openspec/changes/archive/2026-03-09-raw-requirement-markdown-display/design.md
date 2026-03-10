## Context

`rawDisplay` 对象包含 `isSample` 标志，原意是区分演示数据与真实数据。目前在两处渲染了"示例内容（来自 PRD 摘录）"标签，但这个标签在演示场景中显得突兀，在真实业务场景中也不应出现。DesignStudio 的原始需求区使用 `whiteSpace: pre-wrap` 纯文本渲染，DetailPage 已经使用了 `<MarkdownRenderer>`，两者行为不一致。

## Goals / Non-Goals

**Goals:**
- 删除两处 `rawDisplay.isSample` 条件块（不渲染"示例内容"标签）
- DesignStudio 原始需求改为 `<MarkdownRenderer>` 渲染

**Non-Goals:**
- 不移除 `rawDisplay.isSample` 属性本身（其他地方可能仍使用）
- 不修改 `rawDisplay` 计算逻辑

## Decisions

直接删除 `isSample` 标签块，不替换为其他提示。内容本身足以区分 sample 与真实数据。

## Risks / Trade-offs

无风险，仅为 UI 删除与组件替换。

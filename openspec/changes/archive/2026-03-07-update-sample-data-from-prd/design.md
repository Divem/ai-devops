## Context

当前项目中的多个入口文件（pm-ai-app/src/PMPlatform.jsx, pm-ai-platform_sdd.jsx, pm-ai-platform_sdd2.jsx, pm-ai-platform_vibe.jsx, preview-apps/vibe-app/src/PMPlatform.jsx）都包含相同的 INITIAL_CARDS 示例数据。这些数据需要与产品需求文档保持一致，以便准确展示产品功能。

## Goals / Non-Goals

**Goals:**
- 从 PRD 提炼 6 个核心功能模块的示例需求
- 确保需求卡片包含所有必填字段
- 为部分需求生成示例文档（PRD、Proposal、Design、Tasks）
- 同步更新所有相关文件

**Non-Goals:**
- 不修改数据模型或组件逻辑
- 不添加新功能
- 不改变应用行为

## Decisions

- **数据提炼原则**: 从 PRD 第 3 节"功能模块设计"直接提炼，确保与文档一致
- **文档生成**: 为关键需求（如 Git 同步模块）生成完整的 4 类文档，其余需求仅生成 PRD
- **同步更新**: 所有包含 INITIAL_CARDS 的文件都需要更新，避免数据不一致

## Risks / Trade-offs

- [风险] 多文件同步更新可能遗漏 → 检查所有包含 INITIAL_CARDS 的文件
- [风险] 示例数据可能过于复杂 → 控制每个需求的字段长度，保持可读性

## Migration Plan

1. 从 PRD 提炼 6 个功能模块的需求信息
2. 为每个需求生成符合数据结构的卡片对象
3. 为部分需求生成示例文档内容
4. 更新 pm-ai-app/src/PMPlatform.jsx
5. 同步更新其他相关文件

## Open Questions

- 是否需要为所有 6 个需求都生成完整文档？(目前计划仅生成 1-2 个)

## Why

当前看板示例需求数量偏少，难以完整覆盖演示场景中的状态流转、筛选组合和文档链路。需要基于 `PM_AI_Plagform_PRD.md` 抽取更多真实功能主题，扩充到 15 条示例需求，提升演示与培训效果。

## What Changes

- 基于 `md/PM_AI_Plagform_PRD.md` 中的功能模块提取需求主题，新增并补齐看板示例需求到 15 条。
- 为新增示例需求补充结构化字段（状态、优先级、标签、负责人、用户故事、验收标准、维度信息），确保与现有筛选与卡片展示兼容。
- 调整示例需求在各列的分布，覆盖看板主要阶段以便演示拖拽流转与数据概览统计。
- 在示例数据注入策略中保持“真实卡片优先、示例补充兜底”，避免覆盖用户已有数据。

## Capabilities

### New Capabilities
- `kanban-prd-seeded-sample-requirements`: 定义从 PRD 提取主题并扩展看板示例需求到 15 条的生成与展示规则。

### Modified Capabilities
- `kanban-filter-dimensions`: 示例需求需提供完整空间/子系统/应用/迭代维度字段，以保证多维筛选可稳定演示。

## Impact

- 受影响代码：`pm-ai-app/src/PMPlatform.jsx`（示例需求常量、初始卡片装载逻辑、可能的维度映射）。
- 受影响文档：示例需求来源与覆盖范围将引用 `md/PM_AI_Plagform_PRD.md`。
- 受影响行为：仅演示数据层变更，不新增后端依赖与 API 调用。

## PRD 主题映射

本次新增示例需求覆盖以下 PRD 功能主题：需求列表看板、Meego 同步、AI 需求澄清、规范框架扩展、提案生成、提案评审修改、Git 同步、历史需求参考、AI Skill 管理。

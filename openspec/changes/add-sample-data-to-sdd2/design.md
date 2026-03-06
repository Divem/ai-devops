## Context

SDD2 页面（`pm-ai-platform_sdd2.jsx`）是采用 SDD 规范框架的需求管理工作台。当前 `INITIAL_CARDS` 只包含 6 条需求数据，标题使用的是通用名称（如"需求列表页面（看板视图）"）。需要根据 `md/PM_AI_Plagform_PRD.md` 文档创建更丰富的示例数据。

## Goals / Non-Goals

**Goals:**
- 从 PRD 文档提取 6 个核心功能模块的需求
- 每条需求使用与原文档不同的新标题
- 确保需求分布在不同看板列（backlog、reviewing、ai_review、confirm、approved、rejected）
- 保持与现有组件的数据结构兼容

**Non-Goals:**
- 不修改现有组件逻辑
- 不添加新的 PRD 文档内容到 docs 字段

## Decisions

1. **需求拆分策略**: 将 PRD 文档中的 6 个功能模块拆分为独立的需求卡片
2. **标题命名**: 使用业务场景化的新标题，例如：
   - "需求看板可视化管理系统" 替代 "需求列表页面（看板视图）"
   - "智能需求对话助手" 替代 "AI 需求澄清模块"
3. **状态分布**: 将需求分布在不同列以展示完整流程

## Risks / Trade-offs

- [风险] 新数据格式不兼容 →  mitigation: 保持与现有数据结构完全一致
- [风险] 需求数量过多影响性能 →  mitigation: 控制在 8-10 条以内

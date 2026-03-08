## Context

**当前状态**: `pm-ai-platform_sdd.jsx` 文件包含 `DOC_TYPES` 数组定义了 4 种文档类型（prd、proposal、design、tasks），而 SDD2 版本包含 5 种（多了 spec）。

**约束**: 这是一个演示/原型应用，所有代码都在单个 JSX 文件中，无需复杂的构建流程。

**涉益方**: 需要保持 SDD 和 SDD2 两个版本特性的同步。

## Goals / Non-Goals

**Goals:**
- 在 SDD 中添加 `spec` 文档类型定义
- 添加至少一个完整的 spec 示例内容（`DEMO_SPEC_*` 常量）
- 更新示例数据以展示 spec 内容

**Non-Goals:**
- 不涉及后端 API 变更
- 不影响现有的文档生成逻辑
- 不需要数据库迁移

## Decisions

### 1. Spec 类型定义方式

**决策**: 直接在 `DOC_TYPES` 数组中添加 `spec` 类型项，位置在 `prd` 之后

**理由**: 与 SDD2 保持一致，spec 是产品文档组的延伸，放在 prd 之后符合逻辑顺序

### 2. 示例内容设计

**决策**: 创建 `DEMO_SPEC_REVIEW` 作为示例内容，基于 PRD 文档 3.4 节"提案评审与修改模块"

**理由**:
- 与项目实际需求直接相关，具有参考价值
- PRD 3.4 节已详细描述该模块功能（评审视图、修改工具、状态管理）
- 包含完整的 spec 结构（概述、功能规格、UI规格、数据规格）
- 与现有示例内容风格一致

**内容来源**: 基于 `/md/PM_AI_Plagform_PRD.md` 第 83-89 行的内容：
- **评审视图**: 分屏对比、评论批注、版本历史
- **修改工具**: 富文本编辑器、Markdown 语法、实时预览
- **状态管理**: 草稿、待评审、已确认

### 3. 示例数据更新

**决策**: 更新 `REQ-005` 需求卡片的 `docs.spec` 字段

**理由**: REQ-005 是"提案评审与修改模块"，与 spec 文档类型相关联，适合展示 spec 示例

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| DOC_TYPES 顺序变更可能影响现有代码 | 确认代码中使用 key 而非 index 访问 DOC_TYPES |
| 示例内容过长影响文件可读性 | 使用合理的缩进和注释分隔 |

## Migration Plan

1. 在 `DOC_TYPES` 数组中添加 spec 类型定义
2. 创建 `DEMO_SPEC_REVIEW` 常量（基于 PRD 3.4 节提案评审与修改模块）
3. 更新 `mkDocs()` 函数，确保包含 spec 字段
4. 更新 `INITIAL_CARDS` 中 REQ-005 的 docs.spec 字段
5. 验证应用正常运行

## Open Questions

无 - 这是一个简单的文档类型添加变更，技术实现明确。

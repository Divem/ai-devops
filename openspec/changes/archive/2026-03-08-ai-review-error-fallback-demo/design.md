## Context

`DEMO_AI_REVIEW_RESULT` 是在 PMPlatform.jsx 顶部（第 54 行）定义的全局常量，用于提供 AI 评审的示例结果数据。在 `ai-fallback-sample-data` 变更中，catch 块错误地使用了 `DEMO_REVIEW_RESULT`（不存在），导致引用错误在 catch 块内再次抛出，绕过了错误恢复逻辑。

## Goals / Non-Goals

**Goals:**
- 修正常量名引用，使评审失败兜底路径正常工作
- 验证 `FALLBACK_DOCS` 键与 `PROPOSAL_GEN_STEPS` 完全对齐

**Non-Goals:**
- 不增加新的兜底数据
- 不修改错误处理策略（策略在上一变更已定义）

## Decisions

### 决策：直接替换，无需额外封装

正确的常量名是 `DEMO_AI_REVIEW_RESULT`，两处 catch 块均已替换。无需引入别名或包装函数——保持最小改动。

## Risks / Trade-offs

- 低风险：仅为名称修正，不改变逻辑
- 已通过 `vite build` 构建验证无新增错误

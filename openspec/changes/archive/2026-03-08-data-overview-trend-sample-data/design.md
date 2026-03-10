## Context

报告页趋势图通过 `overviewData.trends`（由 `filteredCards` 按周/月分组计算）来绘制折线图。当所有 sample 卡片日期相同，趋势仅有 1 个数据点；当筛选条件导致无卡片时，趋势为 0 个数据点。两种场景均无法展示有意义的时间趋势，影响产品演示。

## Goals / Non-Goals

**Goals:**
- 数据点少于 3 个时，自动注入示例趋势数据供演示
- 示例数据呈现合理的业务曲线（新增先升后稳、通过逐步提升、积压先增后降）
- 注入时显示"示例数据"标记，区分真实数据与演示数据

**Non-Goals:**
- 不修改 `overviewData` 计算逻辑本身
- 不持久化示例数据到 cards 状态

## Decisions

**在渲染层注入，而非计算层**：`overviewData` 由 `useMemo` 计算，修改它会影响其他依赖（漏斗、维度分布等）。在趋势图渲染部分直接使用 `displayTrends` 变量（真实数据或 fallback），隔离影响范围。

**Fallback 数据结构**：与 `overviewData.trends` 保持一致：`{ key, label, newCount, approved, rejected, backlog }`，生成最近 6 个月的月度数据，数值模拟真实业务场景。

**触发阈值**：`trends.length < 3`，单点和双点都缺乏趋势意义，统一 fallback。

## Risks / Trade-offs

- [风险] 用户误把示例数据当真实数据 → 在图表右上角或标题旁显示"示例数据"徽标
- [权衡] Fallback 仅针对趋势图，其余指标卡（吞吐、通过率等）仍显示真实值（可能为 0）

## Migration Plan

仅修改 `PMPlatform.jsx` 趋势图渲染区，不涉及 API 或外部依赖，无需迁移计划。

## Why

报告页的趋势图（新增 / 通过 / 积压）在 sample 数据场景下显示"当前筛选无数据"，无法直观展示产品功能，影响演示效果。由于所有 sample 卡片日期相同，趋势图仅有单点或为空，不能体现时间序列价值。

## What Changes

- 当趋势图数据点不足 3 个时，自动注入 6 个月的示例趋势数据
- 示例数据呈现合理的业务曲线：新增先增后稳、通过率逐步提升、积压先增后降
- 注入的示例数据带有"示例数据"标记，提示用户当前为演示模式

## Capabilities

### New Capabilities
- `overview-trend-fallback`: 报告页趋势图数据不足时，自动注入示例趋势数据供演示

### Modified Capabilities
（无）

## Impact

- `pm-ai-app/src/PMPlatform.jsx` — 趋势图渲染区（`overviewData.trends.length === 0` 条件分支）

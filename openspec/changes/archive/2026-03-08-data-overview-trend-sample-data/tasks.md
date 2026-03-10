# Tasks: data-overview-trend-sample-data

## Implementation Tasks

- [x] 在 PMPlatform.jsx 趋势图渲染区，定义 `FALLBACK_TRENDS` 常量（6 个月示例月度数据）
- [x] 在趋势图渲染代码处，用 `displayTrends` 替代直接引用 `overviewData.trends`（当 `trends.length < 3` 时使用 FALLBACK_TRENDS）
- [x] 定义 `isUsingFallbackTrend` 布尔值
- [x] 在趋势图标题行右侧，当 `isUsingFallbackTrend` 为 true 时渲染"示例数据"徽标
- [x] 验证：无筛选时趋势图正常显示示例数据；筛选后数据足够时不显示示例标记

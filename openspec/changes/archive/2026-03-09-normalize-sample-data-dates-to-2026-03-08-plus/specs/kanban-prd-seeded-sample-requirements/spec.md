## ADDED Requirements

### Requirement: 示例需求日期基线
看板内置示例需求的 `date` 字段 SHALL 使用 `2026-03-08` 及之后的日期，以保证演示时间线一致性。

#### Scenario: 加载示例需求时日期满足基线
- **WHEN** 用户首次进入看板且系统加载内置示例需求
- **THEN** 每条示例需求的 `date` 值 SHALL 大于或等于 `2026-03-08`

#### Scenario: 示例需求日期格式保持兼容
- **WHEN** 系统渲染示例需求卡片日期
- **THEN** `date` 字段 SHALL 继续使用 `YYYY-MM-DD` 格式，且不影响现有展示与统计逻辑

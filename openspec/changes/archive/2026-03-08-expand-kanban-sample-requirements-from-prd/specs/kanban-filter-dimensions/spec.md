## ADDED Requirements

### Requirement: 示例需求包含完整四维筛选字段
系统 SHALL 确保内置示例需求均包含 `space`、`subsystem`、`app`、`iteration` 四个筛选字段，以保证四维筛选联动在演示数据下稳定生效。

#### Scenario: 示例需求参与四维筛选
- **WHEN** 用户在看板中组合选择空间、子系统、应用、迭代筛选条件
- **THEN** 新增示例需求 SHALL 按四维 AND 逻辑被正确过滤，不出现因字段缺失导致的异常显示

#### Scenario: 清除筛选后恢复完整示例集
- **WHEN** 用户点击「清除筛选」按钮
- **THEN** 看板恢复展示全部 15 条示例需求

## ADDED Requirements

### Requirement: 需求名称支持飞书链接跳转
SDD2 设计工作台副标题中的需求名称 SHALL 支持飞书文档链接跳转。当需求数据包含 `feishuUrl` 字段且非空时，需求名称 SHALL 渲染为可点击的链接样式。

#### Scenario: 需求有飞书链接
- **WHEN** 选中一个包含非空 `feishuUrl` 的需求
- **THEN** 副标题中的需求名称显示为蓝色带下划线的链接样式
- **AND** 点击需求名称时在新标签页打开飞书文档

#### Scenario: 需求无飞书链接
- **WHEN** 选中一个不包含 `feishuUrl` 字段或 `feishuUrl` 为空的的需求
- **THEN** 副标题中的需求名称显示为普通文字样式（与当前行为一致）

### Requirement: 飞书链接字段为可选
需求数据中的 `feishuUrl` 字段 SHALL 为可选字段，不影响现有需求数据的正常使用。

#### Scenario: 兼容现有数据
- **WHEN** 渲染不包含 `feishuUrl` 字段的历史需求数据
- **THEN** 副标题正常显示需求名称，无链接样式
- **AND** 不抛出任何错误或警告

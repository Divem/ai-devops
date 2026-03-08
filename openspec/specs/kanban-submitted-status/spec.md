## ADDED Requirements

### Requirement: 看板支持已提交状态列
系统 SHALL 在需求看板中新增状态列 `submitted`，列标题显示为“已提交”，用于标识需求文档已提交到 Git、产品阶段告一段落。

#### Scenario: 看板渲染已提交列
- **WHEN** 用户打开需求看板
- **THEN** 系统 SHALL 显示“已提交”列
- **THEN** 列标识值 SHALL 为 `submitted`

#### Scenario: 已提交列样式为灰色系
- **WHEN** 系统渲染“已提交”列
- **THEN** 列颜色 SHALL 采用灰色风格并与“待评审”视觉风格一致（中性低饱和）

### Requirement: 已提交状态语义
处于 `submitted` 状态的需求 SHALL 表示“文档已成功提交到 Git，产品阶段暂告完成”。

#### Scenario: 已提交状态解释一致
- **WHEN** 卡片 `col` 为 `submitted`
- **THEN** 系统 SHALL 将其视为产品侧交付完成状态并展示在“已提交”列

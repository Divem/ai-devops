## ADDED Requirements

### Requirement: 原始需求基础信息字段映射
系统 SHALL 为原始需求提供结构化基础信息映射能力，至少覆盖需求方、产品经理、提报时间、所属模块和 Meego 链接字段，以支持评审抽屉稳定展示。

#### Scenario: 使用结构化字段映射基础信息
- **WHEN** 卡片数据中存在结构化原始需求元数据对象（如 `rawRequirementMeta`）
- **THEN** 系统 SHALL 从该对象读取需求方、产品经理、提报时间、所属模块与 Meego 链接

#### Scenario: 结构化字段缺失时兼容旧字段
- **WHEN** 结构化元数据对象不存在或字段不完整
- **THEN** 系统 SHALL 尝试从兼容字段映射获取对应值
- **THEN** 无法获取时 SHALL 返回空值并交由 UI 按回退规则展示

#### Scenario: Meego 链接合法性兜底
- **WHEN** 映射得到的 Meego 链接不是可用 URL
- **THEN** 系统 SHALL 将其视为不可用链接并返回空值

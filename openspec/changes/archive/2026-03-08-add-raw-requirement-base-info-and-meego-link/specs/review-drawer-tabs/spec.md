## MODIFIED Requirements

### Requirement: 原始需求内容展示
「原始需求」Tab SHALL 采用分区展示方式，包含基础信息区、Meego 链接区与原始需求正文区；正文仍 SHALL 以保留换行的纯文本格式展示 `card.rawRequirement`，并提供"✎ 编辑"按钮入口。

#### Scenario: 展示原始需求基础信息
- **WHEN** 用户切换到「原始需求」Tab
- **THEN** 系统 SHALL 展示需求方、产品经理、提报时间、所属模块四个基础字段标签
- **THEN** 对缺失字段值 SHALL 使用 `-` 作为回退显示

#### Scenario: 展示 Meego 链接入口
- **WHEN** `card.meegoUrl`（或等效映射字段）存在且为可用链接
- **THEN** 系统 SHALL 显示可点击的 Meego 链接入口
- **THEN** 点击后 SHALL 在新窗口打开对应需求页面

#### Scenario: Meego 链接缺失时显示空态
- **WHEN** `card.meegoUrl`（或等效映射字段）为空或不可用
- **THEN** 系统 SHALL 显示"未关联 Meego 链接"提示，不渲染可点击入口

#### Scenario: 展示原始需求全文
- **WHEN** `card.rawRequirement` 有内容且未进入编辑态
- **THEN** SHALL 以 `white-space: pre-wrap` 样式展示完整原始需求文本

#### Scenario: 进入编辑态
- **WHEN** 用户点击"✎ 编辑"按钮
- **THEN** 内容区 SHALL 切换为可编辑 textarea，内容为当前 rawRequirement 文本，顶部显示"保存"与"取消"按钮

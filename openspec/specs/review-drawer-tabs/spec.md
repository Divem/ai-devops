# review-drawer-tabs Specification

## Purpose
TBD - created by archiving change review-drawer-raw-req-tabs. Update Purpose after archive.
## Requirements
### Requirement: 评审抽屉双 Tab 布局
`DetailDrawer` 的 body 区域 SHALL 通过 Tab 切换展示「原始需求」和「评审报告」两个内容区，默认激活「原始需求」Tab。

#### Scenario: 默认显示原始需求 Tab
- **WHEN** 用户点击看板卡片打开评审抽屉
- **THEN** 抽屉 SHALL 默认激活「原始需求」Tab，展示原始需求基础信息与正文内容

#### Scenario: 切换到评审报告 Tab
- **WHEN** 用户点击「评审报告」Tab
- **THEN** body 区域 SHALL 切换显示需求描述、用户故事、验收标准和 AI 评审报告内容

#### Scenario: 原始需求为空时显示 PRD 摘录示例
- **WHEN** 用户打开评审抽屉且 `card.rawRequirement` 为空/null
- **THEN** 系统 SHALL 在默认激活的「原始需求」Tab 中展示来自 `PM_AI_Plagform_PRD` 摘录的示例原始需求内容（含基础信息与正文）
- **THEN** 系统 SHALL 显示“示例内容（来自 PRD 摘录）”标识

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

### Requirement: 详情抽屉主按钮阶段化引导
`DetailDrawer` 的主操作按钮 SHALL 与需求评审阶段保持一致：评审前优先引导评审，评审后优先引导设计。

#### Scenario: 评审前主操作为 AI 评审
- **WHEN** 需求尚未产生 AI 评审结果
- **THEN** 详情抽屉主操作 SHALL 为“AI 智能评审”

#### Scenario: 评审后主操作为 AI 设计
- **WHEN** 需求已存在 AI 评审结果
- **THEN** 详情抽屉主操作 SHALL 切换为“AI 辅助设计”

### Requirement: 详情抽屉 AI 双按钮主次策略
`DetailDrawer` 底部操作区 SHALL 在任意评审状态下同时展示“AI 智能评审”和“AI 辅助设计”两个按钮，并依据评审状态动态调整两者主次样式与排序。

#### Scenario: 未评审时评审为主设计为次
- **WHEN** 当前需求不存在 AI 评审结果
- **THEN** 系统 SHALL 将“AI 智能评审”渲染为主按钮
- **THEN** 系统 SHALL 将“AI 辅助设计”渲染为次按钮且保持可点击
- **THEN** 主按钮 SHALL 在按钮顺序中优先显示

#### Scenario: 已评审时设计为主评审为次
- **WHEN** 当前需求已存在 AI 评审结果
- **THEN** 系统 SHALL 将“AI 辅助设计”渲染为主按钮
- **THEN** 系统 SHALL 将“AI 智能评审”渲染为次按钮且保持可点击
- **THEN** 主按钮 SHALL 在按钮顺序中优先显示

#### Scenario: 次按钮可用性不受主次切换影响
- **WHEN** 用户点击处于次级样式的 AI 按钮
- **THEN** 系统 SHALL 正常触发对应 AI 流程，不因主次状态阻断

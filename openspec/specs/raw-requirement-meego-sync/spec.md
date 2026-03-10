# raw-requirement-meego-sync Specification

## Purpose
TBD - created by archiving change review-drawer-raw-req-tabs. Update Purpose after archive.
## Requirements
### Requirement: 原始需求本地编辑保存
用户在「原始需求」编辑态修改内容后，系统 SHALL 将新内容写回卡片的 `rawRequirement` 字段并持久化到本地状态。

#### Scenario: 保存编辑内容
- **WHEN** 用户在编辑态修改内容后点击"保存"
- **THEN** 系统 SHALL 调用 `onUpdateCard(card.id, { rawRequirement: newText })` 更新卡片数据
- **THEN** 编辑态 SHALL 退出，展示更新后的原始需求内容

#### Scenario: 取消编辑
- **WHEN** 用户点击"取消"
- **THEN** 系统 SHALL 退出编辑态，内容恢复为编辑前的 rawRequirement，不更新卡片数据

### Requirement: 同步原始需求到 Meego
「原始需求」Tab SHALL 提供"同步到 Meego"按钮，将当前 `rawRequirement` 内容通过配置的 Meego API 端点推送更新。该按钮 SHALL 与"✎ 编辑"按钮在同一操作区并列展示（非编辑态）。

#### Scenario: 非编辑态操作区展示同步按钮
- **WHEN** 用户处于「原始需求」Tab 且未进入编辑态
- **THEN** 系统 SHALL 在“原始需求（Meego）”标题行右侧与“✎ 编辑”并列展示“同步到 Meego”按钮

#### Scenario: 编辑态隐藏同步按钮
- **WHEN** 用户进入原始需求编辑态
- **THEN** 系统 SHALL 隐藏“同步到 Meego”按钮，仅保留编辑态相关操作

#### Scenario: Meego 已配置时触发同步
- **WHEN** `projectConfig.meego.apiUrl` 和 `projectConfig.meego.token` 均已配置
- **WHEN** 用户点击"同步到 Meego"按钮
- **THEN** 系统 SHALL 发起 PUT 请求至 `{meego.apiUrl}/requirements/{card.id}`，携带 `rawRequirement` 内容
- **THEN** 同步期间按钮显示加载态"同步中…"
- **THEN** 成功后显示"✓ 已同步到 Meego" toast 提示

#### Scenario: Meego 未配置时提示引导
- **WHEN** `projectConfig.meego` 未配置或字段缺失
- **WHEN** 用户点击"同步到 Meego"按钮
- **THEN** 系统 SHALL 显示提示"未配置 Meego，请前往项目配置页面完善配置"，不发起网络请求

#### Scenario: 同步失败时显示错误
- **WHEN** Meego API 请求返回非 2xx 响应或网络错误
- **THEN** 系统 SHALL 显示错误提示"同步失败：{错误信息}"，按钮恢复可点击状态

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

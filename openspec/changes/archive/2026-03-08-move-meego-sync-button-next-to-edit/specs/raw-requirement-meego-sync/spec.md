## MODIFIED Requirements

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

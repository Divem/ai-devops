## ADDED Requirements

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
「原始需求」Tab SHALL 提供"同步到 Meego"按钮，将当前 `rawRequirement` 内容通过配置的 Meego API 端点推送更新。

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

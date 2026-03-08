## MODIFIED Requirements

### Requirement: AI 模型配置区块
项目配置页面 SHALL 包含 AI 模型配置区块，提供模型选择（Claude Sonnet / GLM-4 / ARK Code Latest 等）和对应 API Key 输入，替代原 KanbanBoard 内的 settings-dropdown。

#### Scenario: 选择 AI 模型
- **WHEN** 用户在 AI 配置区块选择一个模型
- **THEN** 系统更新全局 `projectConfig.ai.model`，后续所有 AI 调用使用该模型

#### Scenario: 配置 API Key
- **WHEN** 用户输入模型对应的 API Key 并点击保存
- **THEN** 系统将 Key 存入 localStorage 的 `projectConfig` 与对应模型本地键中，并在 AI 调用时使用该 Key

#### Scenario: 配置持久化
- **WHEN** 用户保存配置后刷新页面
- **THEN** 系统从 localStorage 恢复所有配置，配置不丢失

#### Scenario: 选择 ARK 模型后展示 ARK Key 输入
- **WHEN** 用户将 AI 模型切换为 `ark`
- **THEN** 配置区块 SHALL 展示 ARK API Key 输入框与获取地址提示

#### Scenario: 保存 ARK Key 后可恢复
- **WHEN** 用户填写 ARK API Key 并保存后刷新页面
- **THEN** ARK API Key SHALL 从本地配置恢复并用于后续 ARK 请求

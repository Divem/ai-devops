## ADDED Requirements

### Requirement: 顶部导航提供模型切换下拉框
系统 SHALL 在 AI 辅助设计页顶部导航提供“模型切换”下拉框，允许用户手动选择当前模型。

#### Scenario: 显示模型切换下拉框
- **WHEN** 用户进入 AI 辅助设计页
- **THEN** 顶部导航 SHALL 显示模型切换下拉框
- **THEN** 下拉框当前值 SHALL 反映当前生效模型

### Requirement: 模型选项来源与可用性
模型切换下拉框 SHALL 包含内置模型选项，并在自定义模型已配置可用时展示自定义模型选项。

#### Scenario: 展示内置模型
- **WHEN** 下拉框展开
- **THEN** 选项中 SHALL 包含 Claude、GLM、ARK

#### Scenario: Custom 可用时展示
- **WHEN** 用户已完成 Custom 模型关键配置
- **THEN** 下拉框 SHALL 展示 Custom 选项

#### Scenario: Custom 不可用时处理
- **WHEN** Custom 模型未完成关键配置
- **THEN** 下拉框 SHALL 不展示或禁用 Custom 选项

### Requirement: 手动切换模型持久化
用户在顶部下拉框切换模型后，系统 SHALL 持久化该选择并用于后续 AI 请求。

#### Scenario: 切换后立即生效
- **WHEN** 用户在顶部下拉框选择新模型
- **THEN** 系统 SHALL 更新当前模型选择状态
- **THEN** 后续发起的 AI 请求 SHALL 使用新模型

#### Scenario: 刷新后恢复选择
- **WHEN** 用户刷新页面或重新进入 AI 辅助设计页
- **THEN** 下拉框 SHALL 恢复上次选择的模型

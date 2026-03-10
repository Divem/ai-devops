## ADDED Requirements

### Requirement: 顶部导航模型切换下拉
系统 SHALL 在顶部导航提供模型切换下拉菜单，支持 Claude、GLM、ARK，并在可用时显示 Custom。

#### Scenario: 顶部导航展示模型选项
- **WHEN** 用户打开顶部导航模型下拉菜单
- **THEN** 系统 SHALL 展示 `claude`、`glm`、`ark` 三个内置选项
- **AND** 当 Custom 模型可用时 SHALL 额外展示 `custom` 选项

#### Scenario: 切换后立即生效
- **WHEN** 用户在顶部导航选择任一模型选项
- **THEN** 系统 SHALL 将后续 AI 请求路由到所选模型提供方

#### Scenario: 使用既有 key 持久化选择
- **WHEN** 用户完成模型切换
- **THEN** 系统 SHALL 使用现有的 selected model localStorage key 持久化当前选择
- **AND** 不引入新的模型选择存储 key

#### Scenario: 刷新后恢复模型选择
- **WHEN** 用户刷新页面或重新打开应用
- **THEN** 系统 SHALL 从既有 selected model key 恢复上次模型选择并更新顶部导航显示

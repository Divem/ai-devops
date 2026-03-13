## ADDED Requirements

### Requirement: Slash 触发技能与命令面板
系统 SHALL 在 Chatbot 输入框检测到 `/` 前缀时展示技能与命令面板，并支持快速选择。

#### Scenario: 输入斜杠显示面板
- **WHEN** 用户在 Chatbot 输入框输入 `/` 或以 `/` 开头的检索词
- **THEN** 系统 SHALL 展示技能与命令面板
- **AND** 面板 SHALL 展示条目名称与简要说明

#### Scenario: 键盘选择条目
- **WHEN** 面板处于打开状态且用户按上下方向键
- **THEN** 系统 SHALL 移动当前高亮条目
- **AND** 用户按 Enter 时 SHALL 选中高亮条目

### Requirement: 默认产品经理技能集
系统 SHALL 提供默认产品经理技能集，至少包含：需求评审、风险检查、相关需求、总结功能点、完备性检查。

#### Scenario: 首次进入可见默认技能
- **WHEN** 用户首次进入 Chatbot 且无自定义覆盖配置
- **THEN** 面板 SHALL 展示上述默认技能条目

#### Scenario: 默认技能支持检索
- **WHEN** 用户输入 `/风`、`/需` 等关键字
- **THEN** 系统 SHALL 根据技能名称和描述过滤结果

### Requirement: 技能命令执行消息规范
系统 SHALL 在用户选择技能或命令后生成结构化执行消息，并记录来源元信息。

#### Scenario: 选择技能后写入结构化消息
- **WHEN** 用户在面板中选择“风险检查”技能
- **THEN** 系统 SHALL 生成对应结构化请求并写入 chatHistory
- **AND** 消息元信息 SHALL 包含 `source=skill` 与 `skillId`

#### Scenario: 执行结果可追溯
- **WHEN** 技能执行完成并返回结果
- **THEN** 系统 SHALL 在消息中保留技能名称、执行状态与时间信息

### Requirement: 技能结果展示一致性
系统 SHALL 以结构化格式展示技能执行结果，确保产品评审可读性和一致性。

#### Scenario: 需求评审结果结构化展示
- **WHEN** “需求评审”技能执行成功
- **THEN** 系统 SHALL 展示评分、结论、关键建议分区

#### Scenario: 完备性检查结果结构化展示
- **WHEN** “完备性检查”技能执行成功
- **THEN** 系统 SHALL 展示缺失项列表与补充建议列表

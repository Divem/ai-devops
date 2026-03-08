## ADDED Requirements

### Requirement: SKILL 管理导航入口
项目配置页左侧导航 SHALL 新增"AI Skill"条目，点击后右侧展示 SKILL 管理板块。

#### Scenario: 点击 AI Skill 导航项
- **WHEN** 用户点击左侧导航"AI Skill"
- **THEN** 右侧显示 SKILL 列表与编辑器，其他板块隐藏

### Requirement: SKILL 列表展示
SKILL 管理板块 SHALL 展示所有 AI 功能的 SKILL 卡片，包括：需求评审、PRD 生成、SPEC 生成、Proposal 生成、Design 生成、Tasks 生成、Chatbot。

#### Scenario: 查看 SKILL 列表
- **WHEN** 用户进入 AI Skill 板块
- **THEN** 左侧显示所有 SKILL 名称列表，默认选中第一项，右侧显示其 prompt 模板

#### Scenario: 切换 SKILL
- **WHEN** 用户点击不同 SKILL 条目
- **THEN** 右侧 textarea 切换显示对应 SKILL 的当前 prompt 模板（自定义或默认）

### Requirement: Prompt 模板编辑
SKILL 管理板块 SHALL 允许用户查看和修改各 SKILL 的 prompt 模板。

#### Scenario: 编辑并保存 prompt
- **WHEN** 用户修改 textarea 内容并点击"保存 Skill"
- **THEN** 自定义 prompt 存入 localStorage `ai_skill_prompts` 键，后续 AI 调用使用该版本

#### Scenario: 恢复默认 prompt
- **WHEN** 用户点击"恢复默认"按钮
- **THEN** textarea 重置为内置默认 prompt，需点击保存才生效

#### Scenario: 占位符提示
- **WHEN** 用户查看 prompt 编辑器
- **THEN** 编辑器上方显示可用占位符列表（`{{card.title}}` 等），点击可复制到剪贴板

### Requirement: AI 调用使用自定义 Prompt
系统 SHALL 在执行 AI 功能时，优先使用 localStorage 中的自定义 prompt 模板，无自定义则 fallback 到内置默认。

#### Scenario: 使用自定义 prompt 生成文档
- **WHEN** 用户配置了 PRD 生成的自定义 prompt，然后触发 PRD 生成
- **THEN** 系统使用自定义模板（替换 `{{card.xxx}}` 占位符后）发送给 AI

#### Scenario: 无自定义 prompt 时 fallback
- **WHEN** 用户未配置某 SKILL 的自定义 prompt
- **THEN** 系统使用内置默认 prompt 模板，行为与原来一致

## MODIFIED Requirements

### Requirement: SKILL 管理导航入口
项目配置页左侧导航 SHALL 保留"AI Skill"条目，点击后右侧展示结构化 SKILL 管理板块（Skill 列表 + 文件树 + 编辑器）。

#### Scenario: 点击 AI Skill 导航项
- **WHEN** 用户点击左侧导航"AI Skill"
- **THEN** 右侧显示 Skill 列表、所选 Skill 的文件树和文件编辑器，其他板块隐藏

### Requirement: SKILL 列表展示
SKILL 管理板块 SHALL 展示所有 AI 功能的 Skill 条目，包括：需求评审、PRD 生成、SPEC 生成、Proposal 生成、Design 生成、Tasks 生成、Chatbot；每个 Skill 条目默认包含标准目录结构。

#### Scenario: 查看 SKILL 列表
- **WHEN** 用户进入 AI Skill 板块
- **THEN** 左侧显示所有 Skill 名称列表，默认选中第一项，并在文件树中展示其标准目录

#### Scenario: 切换 SKILL
- **WHEN** 用户点击不同 Skill 条目
- **THEN** 文件树与编辑器切换到该 Skill 的结构化文件内容

### Requirement: Prompt 模板编辑
SKILL 管理板块 SHALL 允许用户按文件维度编辑和保存 Skill 内容，其中 `SKILL.md` 作为主指令文件，`references/*` 和 `scripts/*` 作为辅助资产。

#### Scenario: 编辑并保存 SKILL.md
- **WHEN** 用户修改 `SKILL.md` 内容并点击"保存 Skill"
- **THEN** 系统将结构化文件对象持久化到 localStorage `ai_skill_prompts` 键

#### Scenario: 编辑 references 与 scripts 文件
- **WHEN** 用户切换并编辑 `references/*` 或 `scripts/*` 文件后保存
- **THEN** 系统持久化对应文件内容，刷新后可恢复

#### Scenario: 恢复默认结构模板
- **WHEN** 用户点击"恢复默认"
- **THEN** 当前 Skill 的文件结构与示例内容重置为系统内置模板，需点击保存才生效

### Requirement: AI 调用使用自定义 Prompt
系统 SHALL 在执行 AI 功能时，优先读取当前 Skill 的 `SKILL.md` 作为主 prompt；若不存在结构化配置，则 fallback 到旧版字符串 prompt 或内置默认模板。

#### Scenario: 使用结构化 SKILL.md 生成文档
- **WHEN** 用户为 PRD Skill 配置了结构化 `SKILL.md` 并触发 PRD 生成
- **THEN** 系统使用该 `SKILL.md` 内容（替换占位符后）发送给 AI

#### Scenario: 无结构化配置时 fallback
- **WHEN** 用户未配置结构化 Skill 文件
- **THEN** 系统使用旧版字符串 prompt 或内置默认 prompt，行为与原来一致

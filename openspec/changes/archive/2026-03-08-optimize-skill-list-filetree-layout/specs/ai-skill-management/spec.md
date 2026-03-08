## MODIFIED Requirements

### Requirement: SKILL 列表展示
SKILL 管理板块 SHALL 展示所有 AI 功能的 SKILL 卡片，包括：需求评审、PRD 生成、SPEC 生成、Proposal 生成、Design 生成、Tasks 生成、Chatbot；Skill 列表与文件结构 SHALL 贴合展示为连续导航区域。

#### Scenario: 查看 SKILL 列表
- **WHEN** 用户进入 AI Skill 板块
- **THEN** 左侧显示所有 SKILL 名称列表，默认选中第一项，右侧显示其 prompt 模板

#### Scenario: 切换 SKILL
- **WHEN** 用户点击不同 SKILL 条目
- **THEN** 右侧 textarea 切换显示对应 SKILL 的当前 prompt 模板（自定义或默认）

#### Scenario: Skill 列表与文件结构贴合展示
- **WHEN** 用户在 AI Skill 板块查看导航区域
- **THEN** Skill 列表与文件结构在视觉上紧邻、边框与间距一致，形成连续的一体化导航体验

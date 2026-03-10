## MODIFIED Requirements

### Requirement: 项目配置页关键区块顺序
项目配置页面 SHALL 保持关键配置区块顺序清晰，且 AI Skill 区块支持结构化 Skill 文件管理体验。

#### Scenario: 首屏展示顺序符合规范
- **WHEN** 用户进入项目配置页面
- **THEN** 系统按既定顺序展示关键区块，并可通过左侧导航进入 AI Skill 区块

#### Scenario: 导航与内容顺序一致
- **WHEN** 用户查看左侧导航并切换相关配置项
- **THEN** 导航条目顺序与右侧内容区块顺序保持一致，不出现交叉错位

### Requirement: AI Skill 区块结构化编辑体验
项目配置页面中的 AI Skill 区块 SHALL 提供结构化文件编辑体验，包括 Skill 列表、文件树、代码/Markdown 编辑区以及保存反馈。

#### Scenario: 进入 AI Skill 区块后展示三栏结构
- **WHEN** 用户点击左侧导航"AI Skill"
- **THEN** 右侧显示 Skill 列表、文件树和编辑器三栏布局（或窄屏等效布局）

#### Scenario: 保存结构化 Skill 配置
- **WHEN** 用户编辑任意 Skill 文件并点击保存
- **THEN** 系统保存结构化配置并显示"已保存"状态反馈

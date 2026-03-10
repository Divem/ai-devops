## ADDED Requirements

### Requirement: 演示文档包含典型页面示例
系统相关的新用户演示文档 SHALL 包含典型页面示例章节，覆盖主要页面及其关键区域说明，帮助读者理解页面效果与使用目的。

#### Scenario: Markdown 手册展示页面示例
- **WHEN** 用户打开 `NEW_USER_DEMO_MANUAL.md`
- **THEN** 文档包含典型页面示例章节，且每个示例至少包含页面名称、关键区域、用户价值

#### Scenario: PPT 演示页展示页面示例
- **WHEN** 用户打开 `NEW_USER_DEMO_MANUAL_PPT.html`
- **THEN** 演示页包含与手册对应的页面示例内容，并能用于逐页讲解

### Requirement: 演示文档包含信息架构图
新用户演示材料 SHALL 提供信息架构图，描述核心模块层级关系与主要导航路径。

#### Scenario: Markdown 手册包含 IA 图
- **WHEN** 用户查看手册中的架构章节
- **THEN** 文档展示一张可读的信息架构图，并标注核心模块关系

#### Scenario: PPT 演示包含 IA 图
- **WHEN** 用户播放演示文稿
- **THEN** 演示中包含与手册一致的信息架构图页面

### Requirement: 手册与演示内容一致性
`NEW_USER_DEMO_MANUAL.md` 与 `NEW_USER_DEMO_MANUAL_PPT.html` SHALL 在页面示例与 IA 图的模块命名和章节顺序上保持一致。

#### Scenario: 关键章节顺序一致
- **WHEN** 用户对照手册与演示文稿目录
- **THEN** 页面示例与 IA 图章节顺序一致，不出现缺失或错位

#### Scenario: 模块命名一致
- **WHEN** 用户在两份材料中查看相同模块
- **THEN** 模块名称与术语保持一致，避免理解歧义

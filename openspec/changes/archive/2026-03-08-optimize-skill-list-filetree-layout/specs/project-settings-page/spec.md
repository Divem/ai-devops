## MODIFIED Requirements

### Requirement: 项目配置页关键区块顺序
项目配置页面 SHALL 按以下顺序展示关键配置区块：项目配置、Git 仓库配置、AI 模型配置。

#### Scenario: 首屏展示顺序符合规范
- **WHEN** 用户进入项目配置页面
- **THEN** 系统按"项目配置 -> Git 仓库配置 -> AI 模型配置"顺序展示对应区块

#### Scenario: 导航与内容顺序一致
- **WHEN** 用户查看左侧导航并切换相关配置项
- **THEN** 导航条目顺序与右侧内容区块顺序保持一致，不出现交叉错位

#### Scenario: AI Skill 导航子区块样式紧凑
- **WHEN** 用户进入 AI Skill 区块
- **THEN** Skill 列表与文件结构在不改变导航顺序的前提下，使用紧凑样式并贴合展示

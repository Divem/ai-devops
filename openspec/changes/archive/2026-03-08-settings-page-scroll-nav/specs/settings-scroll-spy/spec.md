## ADDED Requirements

### Requirement: 配置页全区块连续展示
ProjectSettingsPage 的右侧内容区 SHALL 同时渲染所有配置区块（AI 模型配置、Git 仓库配置、SDD 框架、AI Skill），垂直排列，区块间有明确间距，整体可垂直滚动。

#### Scenario: 打开配置页默认显示全部区块
- **WHEN** 用户打开项目配置页
- **THEN** 右侧内容区 SHALL 展示所有四个配置区块，无需点击导航即可看到

#### Scenario: 内容区可连续滚动
- **WHEN** 用户向下滚动右侧内容区
- **THEN** SHALL 可连续浏览 AI、Git、SDD、Skills 四个区块

### Requirement: 滚动时左侧导航自动高亮
ProjectSettingsPage 左侧导航 SHALL 在用户滚动时自动更新高亮项，高亮当前视口中心所在的配置区块对应的导航项。

#### Scenario: 滚动到 Git 区块时 Git 导航项高亮
- **WHEN** 用户滚动使 Git 仓库配置区块进入视口中心区域
- **THEN** 左侧导航中"Git 仓库配置"项 SHALL 高亮显示，其他导航项恢复默认样式

#### Scenario: 初始状态高亮第一项
- **WHEN** 配置页首次渲染，未发生滚动
- **THEN** 左侧导航 SHALL 默认高亮"AI 模型配置"项

### Requirement: 点击导航项平滑滚动定位
用户点击左侧导航项时，右侧内容区 SHALL 平滑滚动到对应配置区块顶部。

#### Scenario: 点击 SDD 框架导航项
- **WHEN** 用户点击左侧导航"SDD 框架"
- **THEN** 右侧内容区 SHALL 以平滑动画滚动，使 SDD 框架区块顶部对齐视口

#### Scenario: 点击当前高亮项
- **WHEN** 用户点击已高亮的导航项
- **THEN** 内容区 SHALL 仍执行滚动定位（回到该区块顶部）

## MODIFIED Requirements

### Requirement: 项目配置页面入口
系统 SHALL 在顶部 Header 区域提供一个齿轮图标按钮，点击后切换到项目配置页面（ProjectSettingsPage）视图。配置页面与看板视图和详情页视图互斥显示。配置页面 SHALL 采用左右双栏布局（左侧导航菜单 + 右侧内容区），初始激活第一个板块。

#### Scenario: 点击齿轮图标进入配置页
- **WHEN** 用户在任意视图点击 Header 的齿轮图标
- **THEN** 系统切换到项目配置页面视图，左侧显示导航菜单，右侧默认展示项目关联配置板块（支持多选）

#### Scenario: 从配置页返回看板
- **WHEN** 用户点击配置页的"返回"按钮或 Header 中的"看板"入口
- **THEN** 系统切换回看板视图（kanban）

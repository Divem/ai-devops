## ADDED Requirements

### Requirement: 文件夹行内联副标题
文档树需求文件夹行 SHALL 在编号右侧显示需求标题作为副标题，副标题在空间不足时 SHALL 截断并以省略号结尾，不得挤压编号和计数徽标的显示空间。

#### Scenario: 副标题正常显示
- **WHEN** 用户查看 AI 设计页左侧树形导航中的需求文件夹行
- **THEN** 编号（如 REQ-100）右侧显示需求标题（如"需求列表页面（看板视图）"），两者同行

#### Scenario: 副标题截断时显示 tooltip
- **WHEN** 需求标题较长导致副标题文本被截断显示
- **THEN** 鼠标悬浮到副标题区域时，浏览器原生 tooltip 显示完整标题文本

#### Scenario: 不传 subtitle 时不显示
- **WHEN** FolderItem 调用时未提供 subtitle prop（如顶部 PRD 文件夹等其他调用场景）
- **THEN** 文件夹行不显示副标题区域，保持原有布局不变

## MODIFIED Requirements

### Requirement: 原始需求展示
原始需求内容区域 SHALL 使用 Markdown 渲染器展示内容，不得以纯文本方式呈现。原始需求区域 SHALL NOT 显示"示例内容（来自 PRD 摘录）"或任何 sample 标识标签。

#### Scenario: 原始需求以 Markdown 格式显示
- **WHEN** 用户在 DetailPage 或 DesignStudio 中查看原始需求
- **THEN** 内容通过 MarkdownRenderer 渲染，标题、列表、粗体等格式正确显示

#### Scenario: 不显示示例内容标签
- **WHEN** 原始需求内容来自 sample 数据（`rawDisplay.isSample === true`）
- **THEN** 内容区域不显示"示例内容（来自 PRD 摘录）"标签

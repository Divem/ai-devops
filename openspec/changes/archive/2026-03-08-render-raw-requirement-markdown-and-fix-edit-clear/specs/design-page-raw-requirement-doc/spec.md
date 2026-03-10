## ADDED Requirements

### Requirement: 原始需求正文支持 Markdown 渲染
系统 SHALL 在“原始需求”文档视图中按 Markdown 语义渲染正文内容，以便展示标题、列表、段落和代码块等结构。

#### Scenario: 正文包含 Markdown 语法
- **WHEN** 原始需求正文包含 Markdown 内容
- **THEN** 系统 SHALL 按 Markdown 语义渲染而非纯文本拼接显示

#### Scenario: 正文为空时保持空态
- **WHEN** 原始需求正文为空
- **THEN** 系统 SHALL 继续展示现有空态提示，不渲染空白 Markdown 区域

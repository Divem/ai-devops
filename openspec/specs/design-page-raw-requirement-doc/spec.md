## ADDED Requirements

### Requirement: AI 辅助设计页提供原始需求文档
系统 SHALL 在 AI 辅助设计页面为每个需求提供“原始需求”文档入口，并在编辑区域显示该需求的基础信息与原始需求正文。

#### Scenario: 点击原始需求文档
- **WHEN** 用户在文档树点击“原始需求”节点
- **THEN** 编辑区域 SHALL 显示原始需求基础信息与原始需求正文内容

#### Scenario: 原始需求缺失时展示空态
- **WHEN** 需求未同步到原始需求正文或正文为空
- **THEN** 编辑区域 SHALL 显示明确空态提示，且不影响其他文档查看

### Requirement: 原始需求与产品需求 SPEC 关系说明
系统 SHALL 在原始需求文档视图中说明：原始需求是人类提出并从 Meego 同步而来，产品需求 SPEC 是基于原始需求转化形成的标准化新文档。

#### Scenario: 展示关系说明文案
- **WHEN** 用户打开“原始需求”文档
- **THEN** 系统 SHALL 展示上述关系说明，帮助用户理解两类文档的职责与来源

### Requirement: 原始需求正文支持 Markdown 渲染
系统 SHALL 在“原始需求”文档视图中按 Markdown 语义渲染正文内容，以便展示标题、列表、段落和代码块等结构。

#### Scenario: 正文包含 Markdown 语法
- **WHEN** 原始需求正文包含 Markdown 内容
- **THEN** 系统 SHALL 按 Markdown 语义渲染而非纯文本拼接显示

#### Scenario: 正文为空时保持空态
- **WHEN** 原始需求正文为空
- **THEN** 系统 SHALL 继续展示现有空态提示，不渲染空白 Markdown 区域

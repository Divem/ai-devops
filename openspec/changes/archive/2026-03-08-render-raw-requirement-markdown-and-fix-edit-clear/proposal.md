## Why

当前“原始需求”内容在设计页中未按 Markdown 结构化展示，阅读体验与其他文档不一致；同时点击编辑后内容被清空，导致用户存在误操作风险与数据不信任。需要补齐 Markdown 渲染并修复编辑态内容丢失问题。

## What Changes

- 在“原始需求”文档视图中支持 Markdown 格式展示（标题、列表、段落、代码块等基础语义）。
- 修复文档点击编辑后内容被清空的问题，确保进入编辑态时保留当前文档文本。
- 保持原始需求的只读策略不变：原始需求仍不可编辑，仅提升展示效果；编辑修复适用于可编辑文档类型。

## Capabilities

### New Capabilities
- 无

### Modified Capabilities
- `design-page-raw-requirement-doc`: 原始需求正文展示从纯文本提升为 Markdown 语义化渲染。
- `detail-page-doc-editor`: 修复编辑态初始化逻辑，确保点击编辑不会清空已有内容。

## Impact

- 受影响代码：`pm-ai-app/src/PMPlatform.jsx` 中原始需求渲染与编辑模式切换逻辑。
- 受影响体验：原始需求阅读可读性提升；编辑安全性与稳定性提升。
- 外部依赖：无新增后端依赖。

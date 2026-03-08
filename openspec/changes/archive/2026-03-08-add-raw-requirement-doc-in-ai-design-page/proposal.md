## Why

AI 辅助设计页面当前从产品需求 SPEC 开始浏览，缺少对“人类原始需求”的直接入口，导致上下文断层。把原始需求文档放在产品需求 SPEC 上方，可以帮助用户先理解需求来源，再查看标准化转化结果。

## What Changes

- 在 AI 辅助设计页面的每个需求文档树中，新增“原始需求”文档节点，并放在“产品需求 SPEC”上方。
- 点击“原始需求”后，在编辑区域展示原始需求基础信息与原始需求正文内容。
- 在展示区补充说明：原始需求来自 Meego 同步的人类需求；产品需求 SPEC 是基于原始需求转化出的标准化文档。
- 原始需求为只读展示，不改变现有 SPEC 编辑和提案文档流程。

## Capabilities

### New Capabilities
- `design-page-raw-requirement-doc`: 定义 AI 辅助设计页中“原始需求”文档节点的展示内容与说明文案。

### Modified Capabilities
- `multi-proposal-doc-tree`: 文档树新增“原始需求”节点并调整与“产品需求 SPEC”的顺序关系。
- `detail-page-doc-editor`: 编辑区域新增“原始需求”文档渲染规则（基础信息 + 原始需求正文 + 来源说明）。

## Impact

- 前端页面：`pm-ai-app/src/PMPlatform.jsx`（文档树节点、编辑区渲染、只读文档视图）。
- 数据来源：复用现有 `rawRequirement` 与原始需求元数据映射字段。
- OpenSpec：新增 `design-page-raw-requirement-doc` 规格，并更新 `multi-proposal-doc-tree`、`detail-page-doc-editor` 规格。

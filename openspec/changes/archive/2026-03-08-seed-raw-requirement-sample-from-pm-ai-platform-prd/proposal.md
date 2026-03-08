## Why

AI 看板抽屉与 AI 设计页面中的“原始需求”在无数据时常为空，演示与培训时无法直观看到完整信息结构。基于 `PM_AI_Plagform_PRD` 摘录示例内容做默认填充，可以保证演示可用性并减少空态理解成本。

## What Changes

- 为看板抽屉“原始需求”视图增加示例兜底：当原始需求为空时，展示从 `PM_AI_Plagform_PRD` 摘录的示例内容。
- 为 AI 设计页面中的“原始需求”文档视图增加同源示例兜底，保持与抽屉内容一致。
- 示例内容仅用于演示（无真实同步数据时），不覆盖用户已录入/已同步的真实原始需求。
- 示例填充应包含基础信息与正文片段，保持现有只读/编辑规则不变。

## Capabilities

### New Capabilities
- （无）

### Modified Capabilities
- `review-drawer-tabs`: 扩展原始需求空态行为，支持 PRD 摘录示例兜底展示。
- `detail-page-doc-editor`: 扩展原始需求文档渲染，支持与抽屉一致的示例兜底展示。

## Impact

- `pm-ai-app/src/PMPlatform.jsx`：原始需求展示数据源增加“真实数据优先 + 示例兜底”逻辑。
- `md/PM_AI_Plagform_PRD.md`：作为示例内容来源（摘录文本常量或映射内容）。
- 演示体验：空态减少，首次进入即可看到示例原始需求结构。

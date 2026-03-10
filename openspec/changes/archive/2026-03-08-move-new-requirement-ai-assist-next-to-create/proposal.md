## Why

当前“AI 辅助生成”按钮位于新建需求抽屉内容区上方，与底部主操作区分离。用户在填写后通常关注底部操作，导致 AI 入口可发现性下降。将其移动到底部并与“创建需求”相邻可形成更连续的操作路径。

## What Changes

- 将“AI 辅助生成”按钮从内容区移动到底部固定操作区，并与“创建需求”按钮并列显示。
- 保持 AI 生成逻辑、加载态、失败保护与字段回填行为不变。
- 优化底部操作区按钮分组与间距，确保主次操作清晰且不影响“取消”操作。

## Capabilities

### New Capabilities
- 无

### Modified Capabilities
- `kanban-new-requirement-drawer`: 调整底部固定操作区按钮编排，新增 AI 辅助生成按钮与主操作并列。
- `new-requirement-ai-assist`: 更新 AI 辅助生成入口位置要求，入口位于底部操作区并保持现有行为。

## Impact

- 受影响代码：`pm-ai-app/src/PMPlatform.jsx` 中 `AddCardDrawer` 的 footer 布局与按钮渲染。
- 受影响体验：新建需求阶段 AI 辅助入口更靠近提交动作，降低操作跳转成本。
- 外部依赖：无新增依赖与 API 改动。

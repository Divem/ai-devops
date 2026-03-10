## Why

看板新建需求抽屉中，AI 辅助生成入口不在主操作区时，用户在填写完成后需要回到上方触发生成，操作路径割裂。将 AI 入口放到底部并与“创建需求”并列，可减少跳转并提升可发现性。

## What Changes

- 将“AI 辅助生成”按钮统一放到新建需求抽屉底部固定操作区。
- 让“AI 辅助生成”与“创建需求”相邻展示，形成连续操作流。
- 保持 AI 生成回填、加载态、失败保留输入等行为不变，仅调整入口位置与布局。

## Capabilities

### New Capabilities
- 无

### Modified Capabilities
- `kanban-new-requirement-drawer`: 调整底部固定操作区按钮编排，包含 AI 辅助生成入口并与创建按钮相邻。
- `new-requirement-ai-assist`: 调整 AI 辅助生成入口位置至底部固定操作区。

## Impact

- 受影响代码：`pm-ai-app/src/PMPlatform.jsx` 中 `AddCardDrawer` 的操作区渲染与样式。
- 受影响体验：新建需求流程中“生成→编辑→创建”路径更短，交互一致性更高。
- 外部依赖：无新增 API 或第三方依赖。

## Why

当前看板“新建需求”抽屉的底部操作按钮顺序不符合常用习惯，且按钮未固定在底部，长表单滚动时操作不便。同时用户在创建需求时缺少 AI 辅助生成入口，填写成本较高。

## What Changes

- 调整新建需求抽屉底部操作区：交换“创建需求”和“取消”按钮位置。
- 将操作区固定在抽屉底部，表单滚动时始终可见。
- 在新建需求流程中新增“AI 辅助生成”能力，用于根据输入上下文生成需求草稿并回填表单字段。

## Capabilities

### New Capabilities
- `new-requirement-ai-assist`: 新建需求抽屉支持 AI 辅助生成需求草稿并回填字段。

### Modified Capabilities
- `kanban-new-requirement-drawer`: 更新抽屉底部操作区布局，要求按钮顺序调整且操作区固定展示。

## Impact

- 受影响代码：`pm-ai-app/src/PMPlatform.jsx` 中 `AddCardDrawer` 的底部操作区和 AI 生成交互逻辑。
- 受影响体验：新建需求操作效率提升，长内容场景下操作可达性提高。
- 外部依赖：复用现有 AI 调用能力，不新增后端接口。

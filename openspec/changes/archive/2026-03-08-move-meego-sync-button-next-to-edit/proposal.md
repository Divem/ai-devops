## Why

当前看板详情抽屉中“同步到 Meego”按钮位于原始需求内容区底部，与“编辑”入口分离，用户在编辑前后容易忽略同步动作。将同步按钮移动到编辑按钮旁边可形成同一操作组，降低路径成本并提升可发现性。

## What Changes

- 在“原始需求”Tab 中将“同步到 Meego”按钮从底部区域移动到“编辑”按钮同一行。
- 保持“同步到 Meego”的原有可用条件、请求行为、成功/失败提示不变。
- 调整按钮对齐与间距，确保编辑态/非编辑态切换时操作区布局稳定。

## Capabilities

### New Capabilities
- 无

### Modified Capabilities
- `raw-requirement-meego-sync`: 调整同步按钮在原始需求抽屉中的布局位置，要求与编辑入口并列展示。

## Impact

- 受影响代码：`pm-ai-app/src/PMPlatform.jsx` 中 `DetailDrawer` 的“原始需求”Tab 操作区。
- 受影响体验：原始需求编辑与同步动作更集中，操作路径更短。
- 外部依赖：无新增依赖与接口变更。

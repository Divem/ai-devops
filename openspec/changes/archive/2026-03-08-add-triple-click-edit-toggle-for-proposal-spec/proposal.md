## Why

当前 AI 设计页中文档预览进入编辑态仅能通过顶部“编辑”按钮，针对高频审阅的 Proposal 与 Spec 操作路径偏长。增加三连击快速进入编辑态，可在不改变现有按钮逻辑的前提下提升编辑效率与连贯性。

## What Changes

- 在 AI 设计页文档预览区域新增“三连击进入编辑态”交互。
- 三连击仅对 `proposal` 与 `spec` 文档类型生效。
- 复用现有编辑入口逻辑（`onEditMode`），保持保存/取消与数据写回流程不变。
- 保留现有“✎ 编辑”按钮，作为并行入口。

## Capabilities

### New Capabilities
- `proposal-spec-triple-click-edit`: 定义 Proposal/Spec 文档在预览态下支持三连击进入编辑态的交互行为与边界条件。

### Modified Capabilities
- 无

## Impact

- 受影响模块：AI 设计页文档预览与编辑切换交互。
- 受影响文件：`pm-ai-app/src/PMPlatform.jsx`（`DocEditor` 主路径）。
- API/数据结构：无变化。
- 依赖与系统：无新增依赖，无后端改动。

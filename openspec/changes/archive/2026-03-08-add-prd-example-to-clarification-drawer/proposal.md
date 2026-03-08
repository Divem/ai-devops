## Why

看板页面的需求澄清抽屉在空状态下缺少直观参考，用户不清楚应该如何描述或补充需求信息。提供一段来自 `PM_AI_Plagform_PRD.md` 的示例摘录，可以降低填写门槛并提升澄清效率。

## What Changes

- 在看板页面需求澄清抽屉中新增“原始需求示例”展示区。
- 示例内容从 `PM_AI_Plagform_PRD.md` 中摘录固定片段，作为可读参考文本。
- 明确示例为参考信息，不覆盖用户已输入的原始需求。
- 当示例源不可用或内容为空时，展示明确的降级提示。

## Capabilities

### New Capabilities
- `clarification-drawer-prd-example`: 在需求澄清抽屉中展示 PRD 摘录示例，并定义可见性与降级行为。

### Modified Capabilities
- `ai-review-confirmation-dialog`: 澄清抽屉中新增示例展示要求，补充用户在信息不完整时的参考引导。

## Impact

- 前端页面：`pm-ai-app/src/PMPlatform.jsx`（需求澄清抽屉 UI 与数据读取逻辑）。
- 文档来源：`PM_AI_Plagform_PRD.md`（示例摘录来源）。
- OpenSpec：新增 `clarification-drawer-prd-example` 能力规格，并修改 `ai-review-confirmation-dialog` 规格。

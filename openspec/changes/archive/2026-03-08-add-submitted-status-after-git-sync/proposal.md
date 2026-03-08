## Why

当前需求在提交到 Git 后仍停留在产品评审流转状态，无法直观看出“产品阶段已完成并已交付研发资产”。新增“已提交”状态可以明确里程碑，帮助团队区分“已通过但未落库”和“已提交落库”的需求。

## What Changes

- 在看板状态中新增 `submitted`（中文显示“已提交”）列，用于表示需求文档已成功提交到 Git。
- “已提交”列颜色使用灰色系，视觉参考“待评审”列（低饱和中性表达）。
- 当用户执行“提交到 Git”并成功后，需求卡片状态自动更新为 `submitted`。
- 保持现有“已通过/已拒绝”等状态语义不变，新增状态仅用于标识产品阶段收尾。

## Capabilities

### New Capabilities
- `kanban-submitted-status`: 定义看板新增“已提交”状态的展示、颜色和状态语义。

### Modified Capabilities
- `proposal-git-status`: 扩展 Git 提交成功后的行为，增加卡片状态自动流转到 `submitted`。

## Impact

- `pm-ai-app/src/PMPlatform.jsx`：看板列定义新增 `submitted`，颜色与文案更新。
- Git 提交流程：提交成功后同步更新 `card.col = "submitted"`。
- 看板数据统计/过滤逻辑需兼容新状态（如列计数与渲染）。

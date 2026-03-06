## Why

SDD2 页面目前缺少丰富的示例数据，无法直观展示完整的产品功能。用户需要看到来自真实 PRD 文档的需求示例，以便更好地理解系统功能和进行演示。

## What Changes

- 从 `md/PM_AI_Plagform_PRD.md` 文档中提取需求，拆分成多个需求卡片
- 将拆分后的需求数据更新到 `pm-ai-platform_sdd2.jsx` 的 `INITIAL_CARDS` 中
- 每个需求卡片使用新的标题（与原文档不同），包含完整的字段：id、col、priority、title、desc、tags、author、date、userStory、acceptanceCriteria、aiResult、docs、chatHistory
- 需求分布在不同看板列，展示完整的流水线状态

## Capabilities

### New Capabilities

- **sample-data-sdd2**: 为 SDD2 页面创建示例需求数据，涵盖智能需求分析与设计工作流的各个功能模块

### Modified Capabilities

- (无)

## Impact

- 主要影响 `pm-ai-platform_sdd2.jsx` 文件中的 `INITIAL_CARDS` 数据
- 需确保新数据格式与现有组件兼容

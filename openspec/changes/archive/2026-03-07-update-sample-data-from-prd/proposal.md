## Why

当前的 PMPlatform.jsx 中的示例数据 (INITIAL_CARDS) 需要与产品需求文档 (PM_AI_Plagform_PRD.md) 保持一致，以便准确反映产品的核心功能模块和典型用户场景。

## What Changes

- 根据 PRD 第 3 节"功能模块设计"提炼示例需求卡片
- 覆盖 6 个核心功能模块的需求示例：
  - 需求列表页面（看板视图）
  - AI 需求澄清模块
  - 规范框架扩展模块
  - 提案生成模块
  - 提案评审与修改模块
  - Git 同步与版本管理模块
- 确保需求卡片包含 PRD 中定义的所有字段（需求编号、优先级、标题、标签、日期、负责人、AI 评审等）
- 为部分需求生成对应的示例文档（PRD、Proposal、Design、Tasks）

## Capabilities

### New Capabilities
- 无新功能，仅更新示例数据

### Modified Capabilities
- 无需求变更，仅数据更新

## Impact

- `pm-ai-app/src/PMPlatform.jsx` - 更新 INITIAL_CARDS 数组
- `pm-ai-platform_sdd.jsx` - 同步更新示例数据
- `pm-ai-platform_sdd2.jsx` - 同步更新示例数据
- `pm-ai-platform_vibe.jsx` - 同步更新示例数据
- `preview-apps/vibe-app/src/PMPlatform.jsx` - 同步更新示例数据

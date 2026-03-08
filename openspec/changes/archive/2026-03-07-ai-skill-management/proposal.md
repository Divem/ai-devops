## Why

平台的 AI 功能（需求评审、PRD 生成、SPEC 生成、Proposal/Design/Tasks 生成、Chatbot）目前使用硬编码的 prompt 模板，团队无法根据业务场景调整 AI 指令。不同团队有不同的文档规范和评审标准，需要能够自定义 prompt 来提升 AI 输出质量。SKILL 管理功能让用户在项目配置页面查看和编辑各 AI 功能的 prompt 模板。

## What Changes

- 项目配置页新增"AI Skill"导航项（NAV_ITEMS 追加一条）
- SKILL 管理板块展示所有 AI 功能的 prompt 模板列表
- 每个 SKILL 显示：功能名称、用途描述、prompt 编辑器（textarea）
- 支持使用 `{{card.title}}` `{{card.desc}}` 等变量占位符，运行时自动替换
- 自定义 prompt 保存到 `projectConfig.skills` 中，AI 调用时优先使用自定义版本，无则 fallback 到内置 prompt
- 支持"恢复默认"重置到内置 prompt

## Capabilities

### New Capabilities

- `ai-skill-management`: 项目配置页 SKILL 管理板块，查看与编辑各 AI 功能 prompt 模板

### Modified Capabilities

- `project-settings-page`: 新增"AI Skill"导航项

## Impact

- `pm-ai-app/src/PMPlatform.jsx`:
  - 新增 `AI_SKILLS` 常量：各功能的默认 prompt 模板（带 `{{var}}` 占位符）
  - 新增 `DEFAULT_PROJECT_CONFIG.skills` 字段
  - 更新 `loadProjectConfig` / `saveProjectConfig`（向后兼容）
  - 新增 `resolveSkillPrompt(skillId, card, config)` helper：用 card 字段替换占位符，优先使用自定义模板
  - `callAIReview` 和 `callAIDoc` 改为读取 `resolveSkillPrompt` 的结果
  - `ProjectSettingsPage` 新增 SKILL 板块 UI

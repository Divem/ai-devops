## Why

当前项目关联配置仅支持单选，无法覆盖一个项目同时关联多个空间、子系统和应用的真实场景，导致配置需要反复切换且容易遗漏。随着跨团队协作需求增加，需要一次性配置多项关联并稳定保存。

## What Changes

- 将项目配置中的空间、子系统、应用选择从单选升级为多选。
- 增加多选下的层级联动规则：空间集合决定可选子系统，子系统集合决定可选应用。
- 保存与回填逻辑升级为数组结构，支持刷新后恢复已选多项。
- 调整项目配置区块的展示与摘要文案，清晰展示多项已选结果。

## Capabilities

### New Capabilities
- `project-association-multi-select`: 定义项目关联配置的多选行为、联动约束、保存恢复与展示规范。

### Modified Capabilities
- `project-settings-page`: 项目配置页面入口后的默认配置体验需兼容多选交互与多值展示。

## Impact

- 受影响代码：`pm-ai-app/src/PMPlatform.jsx`（ProjectSettingsPage 状态、联动逻辑、保存回填、UI 展示）。
- 受影响数据：`projectConfig.project` 从单值字段升级为多值数组字段（需向后兼容旧数据）。
- 外部依赖：无新增后端依赖，继续使用本地配置持久化。

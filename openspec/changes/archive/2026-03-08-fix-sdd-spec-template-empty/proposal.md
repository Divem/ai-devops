## Why

项目配置页的 SDD 框架模板编辑器中，切换到 `spec` 文档类型时内容为空，无法给用户提供起始模板参考。根因：`DEFAULT_PROJECT_CONFIG.sdd.templates` 为所有文档类型预设了空字符串 `''`，初始化 `sddTemplates` 状态时这些空字符串覆盖了 `SDD_FRAMEWORKS[fw].defaultTemplates` 中非空的默认模板；而 textarea 的 `??` 运算符不能处理空字符串，导致始终显示为空。

## What Changes

- 修复 `sddTemplates` 初始化逻辑：合并时跳过空字符串，仅使用用户保存过的非空模板值覆盖默认模板
- `spec`（及其他文档类型）的 OpenSpec 默认模板将在用户首次进入模板编辑器时正确显示
- 不改动 `SDD_FRAMEWORKS` 的默认模板内容（已足够完整）

## Capabilities

### New Capabilities

（无新能力，本次为 bug 修复）

### Modified Capabilities

- `sdd-framework-config`: 模板初始化逻辑变更，空字符串不再覆盖 framework 默认模板

## Impact

- `pm-ai-app/src/PMPlatform.jsx`：`ProjectSettings` 组件内 `sddTemplates` useState 初始化表达式（约 1-2 行）
- 不影响已保存非空模板的用户（其值仍正常覆盖默认模板）

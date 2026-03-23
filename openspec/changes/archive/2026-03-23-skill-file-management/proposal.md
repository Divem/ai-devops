# Proposal: Skill File Management

## Why

当前 Skill 管理系统仅支持导出 Skill，但用户无法导入已有的 Skill JSON 文件。此外，在 Skill 编辑页面（内联编辑器）中，用户只能编辑已有的 SKILL.md、references 和 scripts 文件，无法添加新文件或删除不再需要的文件。这限制了用户对 Skill 结构的灵活管理能力。

## What Changes

- **新增**: Skill 管理列表页面支持导入/上传 Skill JSON 文件
- **新增**: Skill 编辑页面支持上传/添加新文件（references 和 scripts）
- **新增**: Skill 编辑页面支持删除已有文件，SKILL.md 除外

## Capabilities

### New Capabilities
- `skill-import`: 从 JSON 文件导入 Skill 配置到 localStorage
- `skill-file-upload`: 在 Skill 编辑器中添加新文件
- `skill-file-delete`: 在 Skill 编辑器中删除已有文件（SKILL.md 不可删除）

### Modified Capabilities
- 无

## Impact

**代码影响**:
- `PMPlatform.jsx` — `SkillManagementPage` 组件：新增导入按钮和文件上传处理逻辑（约 40 行）
- `PMPlatform.jsx` — Skill 编辑器文件树区域：新增添加文件按钮和删除按钮（约 60 行）

## ADDED Requirements

### Requirement: SKILL 标准目录结构
系统 SHALL 在项目管理页的 AI Skill 管理中提供标准化目录结构，至少包含 `SKILL.md`、`references/`、`scripts/` 三部分，并以文件树形式展示。

#### Scenario: 新建 Skill 时生成标准结构
- **WHEN** 用户创建或首次打开某个 Skill 配置且无历史结构化数据
- **THEN** 系统自动生成 `SKILL.md`、`references/req-clarification.md`、`references/git-sync-checklist.md`、`references/field-mapping.md`、`scripts/scriptname.ts`

#### Scenario: 文件树展示标准结构
- **WHEN** 用户进入 AI Skill 管理页面并选中某个 Skill
- **THEN** 系统在文件树中展示上述结构并允许逐文件切换编辑

### Requirement: 目录与路径规范校验
系统 SHALL 在保存 Skill 结构化配置时执行路径规范校验，仅允许 `SKILL.md`、`references/*`、`scripts/*` 路径，并对 `scrips/*` 自动纠正为 `scripts/*`。

#### Scenario: 输入错误目录名自动纠正
- **WHEN** 用户或迁移数据中存在 `scrips/xxx` 路径
- **THEN** 系统在保存前自动修正为 `scripts/xxx` 并保留文件内容

#### Scenario: 非法路径拦截
- **WHEN** 用户尝试保存不在白名单内的路径
- **THEN** 系统阻止保存并提示路径不符合 Skill 结构规范

### Requirement: 示例内容模板
系统 SHALL 为标准结构中的示例文件提供默认内容模板，便于用户直接修改复用。

#### Scenario: 查看示例文件内容
- **WHEN** 用户打开 `references/req-clarification.md` 或 `references/git-sync-checklist.md`
- **THEN** 编辑器显示可直接使用的项目管理示例内容

#### Scenario: 查看示例脚本内容
- **WHEN** 用户打开 `scripts/scriptname.ts`
- **THEN** 编辑器显示可运行的示例脚本骨架与注释说明

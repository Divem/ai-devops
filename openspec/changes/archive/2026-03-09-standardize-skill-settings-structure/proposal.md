## Why

当前项目管理页的 SKILL 设置以“单段 prompt 文本编辑”为主，缺少标准化 SKILL 包结构，难以沉淀可复用的参考资料和脚本能力。为对齐 Anthropic Skills 的组织方式，需要将 SKILL 设置升级为结构化资产管理（`SKILL.md` + `references/` + `scripts/`）并内置示例内容。

## What Changes

- 将 SKILL 设置页从“纯 prompt 编辑”升级为“结构化 SKILL 包编辑与展示”，包含 `SKILL.md`、`references/*`、`scripts/*`。
- 增加内置示例包模板：
  - `references/req-clarification.md`
  - `references/git-sync-checklist.md`
  - `scripts/scriptname.ts`
  - `references/field-mapping.md`
- 增加路径规范与校验：目录名固定为 `references`、`scripts`（兼容用户输入 `scrips` 的自动纠正）。
- 保留现有自定义 prompt 能力，迁移到 `SKILL.md` 的正文中，确保历史配置可回填。

## Capabilities

### New Capabilities
- `skill-package-structure`: 定义项目管理页中 SKILL 包的标准目录结构、示例文件内容和校验规则。

### Modified Capabilities
- `ai-skill-management`: 将 SKILL 管理从 prompt 单文件编辑扩展为多文件结构化编辑与预览。
- `project-settings-page`: 项目配置页中的 AI Skill 区块交互升级为文件树 + 编辑器的结构化体验。

## Impact

- 受影响代码：`pm-ai-app/src/PMPlatform.jsx`（AI Skill 板块状态模型、UI、保存/加载逻辑）。
- 受影响数据：`projectConfig.skills` 从按 skillId 的字符串映射升级为结构化对象（需兼容旧字符串配置）。
- 受影响文档：新增并维护 SKILL 示例内容模板，供新建技能时快速填充。

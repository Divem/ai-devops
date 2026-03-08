## 1. Skill 配置模型升级

- [x] 1.1 在配置层新增 `normalizeSkillConfig`，将旧版 `projectConfig.skills[skillId]=string` 迁移为结构化 `files` 对象
- [x] 1.2 定义标准文件键集合：`SKILL.md`、`references/req-clarification.md`、`references/git-sync-checklist.md`、`references/field-mapping.md`、`scripts/scriptname.ts`
- [x] 1.3 在保存前接入路径白名单校验与拼写纠正逻辑（`scrips/*` 自动修正为 `scripts/*`）

## 2. AI Skill 页面结构化改造

- [x] 2.1 将 AI Skill 板块改造为三栏布局：Skill 列表、文件树、编辑器（或窄屏等效布局）
- [x] 2.2 实现文件树切换交互，支持按文件类型渲染编辑内容（Markdown/TypeScript）
- [x] 2.3 新增“恢复默认结构”能力，重建标准目录及示例内容
- [x] 2.4 保留并接入“保存 Skill”反馈态，确保结构化内容持久化

## 3. 示例内容与兼容逻辑

- [x] 3.1 编写并接入 `references/req-clarification.md` 与 `references/git-sync-checklist.md` 示例模板
- [x] 3.2 编写并接入 `references/field-mapping.md` 与 `scripts/scriptname.ts` 示例模板
- [x] 3.3 将 AI 调用读取逻辑改为优先读取结构化 `SKILL.md`，无结构化配置时 fallback 到旧值/默认值

## 4. 验证与文档

- [x] 4.1 回归验证旧数据兼容：旧字符串配置刷新后自动映射到 `SKILL.md`
- [x] 4.2 回归验证目录规范：错误路径拦截、`scrips` 自动纠正、刷新后结构稳定
- [x] 4.3 更新项目文档，补充 Skill 标准结构与示例文件说明

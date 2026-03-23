# Design: Skill File Management

## Context

**当前状态**:
- `SkillManagementPage` 支持导出单个或全部 Skill 为 JSON
- Skill 编辑器支持编辑 SKILL.md、references/ 下的文件、scripts/ 下的文件
- 文件结构在 `buildDefaultSkillFiles()` 中定义，存储在 `localStorage['ai_skill_prompts']`

## Goals / Non-Goals

**Goals:**
- 用户可以从本地 JSON 文件导入 Skill 配置
- 用户可以在 Skill 编辑器中添加新的 reference 或 script 文件
- 用户可以在 Skill 编辑器中删除已有文件（SKILL.md 除外）
- 上传的文件路径自动规范化到 `references/` 或 `scripts/` 下

**Non-Goals:**
- 不支持文件夹嵌套（只支持一级路径如 `references/filename.md`）
- SKILL.md 始终存在，不可删除
- 不实现拖拽上传，使用原生文件选择

## Decisions

### 1. Skill 导入位置

**决策**: 在 Skill 管理列表页面的 "导出全部" 按钮旁新增 "导入" 按钮，使用隐藏的 `<input type="file">` 触发文件选择。

**理由**: 与导出功能对称，用户容易发现。

### 2. 文件添加方式

**决策**: 在文件树区域底部添加 "+ 添加文件" 按钮，点击弹出输入框让用户输入文件名，自动添加 `references/` 或 `scripts/` 前缀。

**替代方案**: 直接上传本地文件 — 更复杂，需要处理文件名冲突。先实现简单的空文件创建。

### 3. 文件删除限制

**决策**: SKILL.md 文件旁边不显示删除按钮，其他文件在 hover 时显示删除按钮（×）。

**理由**: SKILL.md 是核心文件，必须存在；其他文件是可选的。

### 4. 导入数据验证

**决策**: 导入时验证 JSON 结构，必须包含 `files` 对象且 `files['SKILL.md']` 存在。验证失败时显示错误提示。

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| 导入的 Skill ID 与现有冲突 | 导入时覆盖同名 Skill，或提示用户确认 |
| 文件名包含非法字符 | 添加前验证路径格式，只允许字母数字和中划线 |

## ADDED Requirements

### Requirement: 更新 .gitignore 忽略系统文件
项目 `.gitignore` SHALL 包含 `.DS_Store` 的忽略规则，防止 macOS 系统文件再次被提交。

#### Scenario: .DS_Store 被忽略
- **WHEN** 在项目任意目录下生成 `.DS_Store` 文件
- **THEN** `git status` 不显示该文件

### Requirement: 更新 .gitignore 忽略 Vite 缓存
项目 `.gitignore` SHALL 包含 `.vite/` 的忽略规则。

#### Scenario: Vite 缓存目录被忽略
- **WHEN** 项目中存在 `.vite/` 目录
- **THEN** `git status` 不显示该目录

### Requirement: 更新 CLAUDE.md 文档引用
`CLAUDE.md` 中关于旧快照文件（`pm-ai-platform_sdd.jsx`、`pm-ai-platform_sdd2.jsx`、`pm-ai-platform_vibe.jsx`）的引用 SHALL 被移除或更新，确保文档准确反映当前项目结构。

#### Scenario: CLAUDE.md 不引用已删除文件
- **WHEN** 读取 CLAUDE.md 内容
- **THEN** 不包含 `pm-ai-platform_sdd.jsx`、`pm-ai-platform_sdd2.jsx`、`pm-ai-platform_vibe.jsx` 的路径引用

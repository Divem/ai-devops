## Context

项目经历了 Vibe → SDD → SDD2 三个设计阶段的演进，每个阶段曾各自维护一个独立的 React 应用（`preview-apps/vibe-app`、`preview-apps/sdd2-app`）和根目录快照文件。当前所有功能已收敛到 `pm-ai-app/src/PMPlatform.jsx` 单一文件中，旧版本已停止维护。

仓库中还存留一些根目录级别的 HTML 预览页面（用于直接浏览器打开 JSX 快照）、系统生成文件（`.DS_Store`）和 IDE 缓存目录，增加了不必要的仓库体积和认知负担。

## Goals / Non-Goals

**Goals:**
- 删除所有已确认不再使用的文件和目录
- 更新文档引用，确保 CLAUDE.md 不再指向已删除文件
- 完善 `.gitignore` 防止系统文件再次入库
- 保持所有功能代码完整无损

**Non-Goals:**
- 不重构 `PMPlatform.jsx`（9800+ 行的单文件拆分是另一个独立议题）
- 不清理 `openspec/changes/archive/`（93 个归档变更是有价值的历史记录）
- 不删除 `md/` 文档目录
- 不删除 `ai-client.js`（仍被 main.jsx 引用）

## Decisions

### D1: 按风险等级分批删除，而非一次性全删

**选择**: 分为"确定删除"和"可选删除"两批

**理由**: 根目录快照、HTML 文件、`preview-apps/` 100% 确认无引用，可安全删除。IDE 缓存（`.qoder/`、`.opencode/`）属于个人偏好，标记为可选。

**替代方案**: 一次性全删 — 风险更高，且 IDE 缓存可能有人仍在使用。

### D2: 更新 CLAUDE.md 而非删除相关段落

**选择**: 保留 CLAUDE.md 的"Core Files"段落结构，仅移除对已删除快照的引用

**理由**: CLAUDE.md 作为项目指引文档，需准确反映当前文件状态。完全删除段落会丢失有用的架构说明上下文。

### D3: .gitignore 新增规则使用追加模式

**选择**: 在现有 `.gitignore` 末尾追加新规则，不重组文件

**理由**: 避免 diff 噪音，保持变更最小化。

## Risks / Trade-offs

- **[风险] 误删仍在使用的文件** → 已通过全局引用搜索确认所有待删文件无代码引用；`ai-client.js` 虽在根目录但有明确引用，已排除在删除列表外
- **[风险] preview-apps 中有未合并的改动** → 这些应用标记为"快照，不再更新"，功能已全部迁移到 pm-ai-app
- **[权衡] 删除后无法直接对比旧设计** → Git 历史仍保留所有文件内容，可随时通过 `git show` 恢复查看

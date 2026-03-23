## Why

项目在多次迭代中积累了大量历史快照文件和废弃的预览应用，当前仓库体积约 215+ MB 可回收。旧的 SDD/SDD2/Vibe 设计变体已全部合并到 `pm-ai-app/src/PMPlatform.jsx`，对应的根目录 `.jsx` 快照、HTML 预览页和 `preview-apps/` 子项目已无引用价值。清理这些冗余文件可以降低新成员上手成本、加快 clone/checkout 速度、减少维护噪音。

## What Changes

- **删除** 根目录 3 个旧设计快照：`pm-ai-platform_sdd.jsx`、`pm-ai-platform_sdd2.jsx`、`pm-ai-platform_vibe.jsx`（共 272 KB）
- **删除** 根目录 4 个过时 HTML 文件：`index.html`、`index-sdd2.html`、`preview-sdd2.html`、`test-simple.html`
- **删除** `preview-apps/` 整个目录，包含 `sdd2-app/` 和 `vibe-app/` 两个废弃子项目（含 node_modules 共 ~142 MB）
- **删除** `start-all.sh` 启动脚本（用于同时启动三个预览版本，已无意义）
- **删除** 系统生成文件：`.DS_Store`、`md/.DS_Store`
- **删除** 根目录构建缓存 `.vite/`（Vite 会自动重建）
- **更新** `CLAUDE.md` 移除对已删除快照文件的引用说明
- **更新** `.gitignore` 添加 `.DS_Store` 和 IDE 缓存目录的忽略规则

## Capabilities

### New Capabilities
- `file-cleanup`: 识别并删除项目中不再使用的文件和目录
- `gitignore-hygiene`: 更新 .gitignore 防止系统/IDE 生成文件再次入库

### Modified Capabilities
（无现有 spec 级别的行为变更）

## Impact

- **代码**：无功能影响，所有活跃代码均在 `pm-ai-app/src/` 中，不受删除影响
- **依赖**：`ai-client.js` 被 `pm-ai-app/src/main.jsx` 引用，需保留
- **文档**：`CLAUDE.md` 中关于旧快照文件的描述段落需同步更新
- **存储**：预计回收 ~215 MB 仓库空间（主要来自 `preview-apps/node_modules`）
- **CI/CD**：无影响（当前无 CI 配置）

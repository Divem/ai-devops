## ADDED Requirements

### Requirement: 删除旧设计快照文件
系统 SHALL 删除根目录下 3 个已废弃的设计快照 JSX 文件：`pm-ai-platform_sdd.jsx`、`pm-ai-platform_sdd2.jsx`、`pm-ai-platform_vibe.jsx`。

#### Scenario: 快照文件不再存在
- **WHEN** 瘦身完成后检查根目录
- **THEN** 上述 3 个 `.jsx` 文件不存在

### Requirement: 删除旧 HTML 预览页面
系统 SHALL 删除根目录下 4 个过时的 HTML 文件：`index.html`、`index-sdd2.html`、`preview-sdd2.html`、`test-simple.html`。

#### Scenario: HTML 预览文件不再存在
- **WHEN** 瘦身完成后检查根目录
- **THEN** 上述 4 个 `.html` 文件不存在

### Requirement: 删除废弃预览应用
系统 SHALL 删除整个 `preview-apps/` 目录（含 `sdd2-app/`、`vibe-app/` 及其 `node_modules`）。

#### Scenario: preview-apps 目录不再存在
- **WHEN** 瘦身完成后检查根目录
- **THEN** `preview-apps/` 目录不存在

### Requirement: 删除废弃启动脚本
系统 SHALL 删除根目录下的 `start-all.sh` 脚本。

#### Scenario: start-all.sh 不再存在
- **WHEN** 瘦身完成后检查根目录
- **THEN** `start-all.sh` 文件不存在

### Requirement: 删除系统生成文件
系统 SHALL 删除所有 `.DS_Store` 文件和根目录 `.vite/` 缓存目录。

#### Scenario: 系统生成文件被清理
- **WHEN** 瘦身完成后搜索项目目录
- **THEN** 不存在 `.DS_Store` 文件，不存在根目录级 `.vite/` 目录

### Requirement: 保留活跃代码完整
瘦身过程 MUST NOT 删除或修改以下目录/文件的功能代码：`pm-ai-app/`、`ai-client.js`、`openspec/`、`md/`。

#### Scenario: 主应用正常运行
- **WHEN** 瘦身完成后执行 `cd pm-ai-app && npm run dev`
- **THEN** 应用正常启动，无导入错误或缺失模块

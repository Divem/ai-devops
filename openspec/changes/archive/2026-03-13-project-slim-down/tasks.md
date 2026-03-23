## 1. 删除旧设计快照文件

- [x] 1.1 删除 `pm-ai-platform_sdd.jsx`（104 KB，SDD 设计快照）
- [x] 1.2 删除 `pm-ai-platform_sdd2.jsx`（100 KB，SDD2 设计快照）
- [x] 1.3 删除 `pm-ai-platform_vibe.jsx`（68 KB，Vibe 设计快照）

## 2. 删除旧 HTML 预览页面

- [x] 2.1 删除 `index.html`（根目录旧索引，已被 pm-ai-app/index.html 替代）
- [x] 2.2 删除 `index-sdd2.html`（SDD2 版本索引）
- [x] 2.3 删除 `preview-sdd2.html`（SDD2 预览页面）
- [x] 2.4 删除 `test-simple.html`（测试用 HTML）

## 3. 删除废弃预览应用和脚本

- [x] 3.1 删除 `preview-apps/` 整个目录（含 sdd2-app、vibe-app 及 node_modules，共 ~142 MB）
- [x] 3.2 删除 `start-all.sh` 启动脚本

## 4. 清理系统生成文件和缓存

- [x] 4.1 删除所有 `.DS_Store` 文件
- [x] 4.2 删除根目录 `.vite/` 缓存目录

## 5. 更新 .gitignore

- [x] 5.1 追加 `.DS_Store` 忽略规则
- [x] 5.2 追加 `.vite/` 缓存忽略规则

## 6. 更新 CLAUDE.md 文档

- [x] 6.1 移除 Core Files 段落中对 `pm-ai-platform_sdd2.jsx`、`pm-ai-platform_sdd.jsx`、`pm-ai-platform_vibe.jsx` 的引用

## 7. 验证

- [x] 7.1 确认 `pm-ai-app` 应用可正常启动（`npm run dev`）
- [x] 7.2 确认 `ai-client.js` 未被误删，引用正常

## 1. 新增 DEMO_DOCS 常量

- [x] 1.1 在 `PMPlatform.jsx` 顶部新增 `DEMO_DOCS` 常量，覆盖 prd / proposal / design / spec / tasks 五种类型
- [x] 1.2 `prd` 示例：从 `PM_AI_Plagform_PRD.md` 提炼功能概述、用户旅程、核心模块
- [x] 1.3 `proposal` 示例：Why / What Changes / Capabilities / Impact 结构
- [x] 1.4 `design` 示例：Context / Goals / Decisions / Risks 结构
- [x] 1.5 `spec` 示例：ADDED Requirements + Scenarios 结构
- [x] 1.6 `tasks` 示例：分组任务列表含 checkbox
- [x] 1.7 每种示例顶部加免责标注：`> ⚠️ 以下为示例内容，非 AI 实时生成`

## 2. 错误状态下渲染「查看示例」按钮

- [x] 2.1 找到 `DocEditor` 中渲染 AI 错误提示的区域
- [x] 2.2 在错误文字下方追加「📄 查看示例内容」按钮（`C.accent` 蓝色边框样式）
- [x] 2.3 按钮仅在 `error` 状态存在时显示

## 3. 按钮点击逻辑

- [x] 3.1 onClick：从当前 `selectedKey` 解析 `docType`
- [x] 3.2 调用 `setError(null)` 清除错误提示
- [x] 3.3 将 `DEMO_DOCS[docType]` 写入文档内容并同步到 `card.docs`

## 4. 验证

- [x] 4.1 使用错误 API Key 点击"AI 生成 PRD"，确认出现「查看示例内容」按钮
- [x] 4.2 点击后确认错误消失、免责标注显示、Markdown 内容正确渲染
- [x] 4.3 对 proposal / design / spec / tasks 四种类型分别验证

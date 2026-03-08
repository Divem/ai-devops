## Why

当前 AI 文档生成失败（429 余额不足、网络超时等）时，页面只显示红色错误提示，文档区域空白，产品演示无法继续。需要在报错后提供一个「查看示例」入口，让用户主动加载预置 Demo 内容，兼顾演示体验与用户感知透明度。

## What Changes

- AI 文档生成（callAIDoc）在捕获到 429 / 网络错误后，在错误提示下方新增「📄 查看示例内容」按钮
- 点击按钮后，从 `DEMO_DOCS` 常量加载该文档类型的预置 Markdown，渲染到中间文档区域
- `DEMO_DOCS` 从 `PM_AI_Plagform_PRD.md` 拆解，覆盖 prd / proposal / design / spec / tasks 五种类型
- 错误提示保留（不自动消失），按钮点击后错误提示收起，文档区域正常渲染

## Capabilities

### New Capabilities

- `ai-error-demo-fallback`: AI 文档生成错误时显示「查看示例」按钮，点击后展示对应文档类型的预置 Demo 内容

### Modified Capabilities

（无现有规格变更）

## Impact

- `pm-ai-app/src/PMPlatform.jsx`：
  - 新增 `DEMO_DOCS` 常量（五种文档类型的示例 Markdown）
  - `DocEditor` 或调用 `callAIDoc` 的区域增加错误状态下的按钮渲染逻辑
  - 按钮点击 → `setDocContent(DEMO_DOCS[docType])`

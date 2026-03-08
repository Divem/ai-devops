## Context

`DocEditor` 组件在点击"AI 生成"后调用 `callAIDoc(type, card)`，当前 catch 块设置 `setError(errMsg)` 并在文档区域顶部渲染红色文字。文档内容区域保持空白。

## Goals / Non-Goals

**Goals:**
- 报错后在错误提示下方追加「📄 查看示例内容」按钮
- 点击按钮后隐藏错误提示，加载 `DEMO_DOCS[type]` 到文档内容区
- `DEMO_DOCS` 覆盖全部 5 种文档类型，内容从 PRD 文档拆解

**Non-Goals:**
- 不自动加载 Demo（需用户主动点击）
- 不做网络重试
- 不为看板卡片预填数据

## Decisions

**D1：DEMO_DOCS 存放位置**

在 `PMPlatform.jsx` 顶部定义 `DEMO_DOCS` 常量对象：

```js
const DEMO_DOCS = {
  prd:      "# 产品需求 SPEC\n\n...",   // 从 PM_AI_Plagform_PRD.md 的功能概述+用户旅程提炼
  proposal: "# OpenSpec 提案\n\n...",   // 技术提案示例
  design:   "# 技术设计\n\n...",         // 技术方案示例
  spec:     "# Delta Spec\n\n...",       // 变更规格示例
  tasks:    "# 任务清单\n\n...",          // 开发任务示例
};
```

**D2：按钮渲染逻辑**

在 `DocEditor` 的错误展示区追加：

```jsx
{error && (
  <div>
    <div style={{color: C.danger}}>❌ {error}</div>
    <button onClick={() => { setError(null); setContent(DEMO_DOCS[docType]); }}>
      📄 查看示例内容
    </button>
  </div>
)}
```

`docType` 从 `selectedKey` 解析（已有逻辑）。

**D3：状态管理**

点击按钮后调用 `setError(null)` + `updateCard` 将 demo 内容写入 card.docs，与正常生成流程保持一致。

## Risks / Trade-offs

- [Demo 内容硬编码] 内容不随 PRD 自动更新 → 可接受，维护成本低
- [误导用户] 用户可能误以为是真实生成的内容 → 在 Demo 内容顶部加免责标注 `> ⚠️ 以下为示例内容，非 AI 实时生成`

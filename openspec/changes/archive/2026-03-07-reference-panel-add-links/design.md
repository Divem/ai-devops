## Context

`ReferencePanel` 当前接收 `{ currentCard, allCards }` 两个 props，读取 `currentCard.references` 数组展示链接。`RightPanel` 包裹它并透传 `currentCard`。`DetailPage` 通过 `onUpdateDocs` 回调更新文档，根组件有 `updateCard(id, patch)` 可更新卡片任意字段。

## Goals / Non-Goals

**Goals:**
- 在 `ReferencePanel` 内添加链接表单（折叠式，默认收起）
- 通过回调链将新/删除的 references 写回根组件 `cards` state
- 不依赖外部状态库，复用现有 `updateCard` 机制

**Non-Goals:**
- 不持久化到 localStorage 或后端（随 cards state 生命周期，刷新后重置）
- 不支持编辑已有链接（只能添加/删除）
- 不做 URL 有效性校验（只校验非空）

## Decisions

**D1 — 回调链设计**

新增 `onUpdateRefs(cardId, newRefs)` 回调，逐层透传：

```
PMPlatform (根)
  └── DetailPage  props: onUpdateRefs
        └── RightPanel  props: onUpdateRefs
              └── ReferencePanel  props: onUpdateRefs
```

`PMPlatform` 中的实现：`(cardId, refs) => updateCard(cardId, { references: refs })`

**D2 — 表单 UI 结构（折叠式）**

```
参考文档
  [已有链接列表，每项右侧有 ✕ 删除按钮]
  [+ 添加链接]   ← 默认收起
    URL: [____________________]
    标题: [____________________]
    类型: [select: 飞书/PRD/SPEC/其他]
    [取消] [添加]
```

`showAddForm` state 控制表单显示。点击"添加"后关闭表单、清空输入。

**D3 — 数据结构**

references 数组元素保持现有格式：`{ url, title, type }` - type 可为 `'feishu' | 'prd' | 'spec' | 'other'`

删除用 `index` 过滤，新增 `push` 到数组末尾（不可变操作）。

## Risks / Trade-offs

- **刷新后丢失**：手动添加的链接随 cards state，刷新页面后重置 → 可接受，后续如需持久化可接入 localStorage
- **currentCard 为 null**：`onUpdateRefs` 调用前检查 `currentCard`，为 null 时不渲染表单

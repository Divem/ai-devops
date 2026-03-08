## Context

`ReferencePanel` 当前结构：Header + 相似需求列表（基于 tag 匹配）。空状态时面板近乎全白。需要增加一个"参考文档"分组，优先展示与当前需求挂钩的结构化文档链接。

## Goals / Non-Goals

**Goals:**
- 面板布局改为两个分组：**参考文档**（上）+ **相似需求**（下）
- 参考文档分组：渲染 `currentCard.references` 数组；无数据时显示占位引导卡片
- 文档类型图标：飞书 🪶 / PRD 📋 / SPEC 📝，点击在新标签页打开
- 相似需求分组：保留现有逻辑，移至下方，增加分组标题

**Non-Goals:**
- 不实现 references 的在线编辑 UI
- 不修改相似度算法

## Decisions

### 数据结构

```javascript
// 卡片 references 字段
references: [
  { type: "feishu", title: "飞书需求文档 - 登录态优化", url: "https://..." },
  { type: "prd",    title: "PRD v1.2 - 认证模块",       url: "https://..." },
  { type: "spec",   title: "OpenAPI Spec - Auth",        url: "https://..." },
]
```

### 文档类型渲染映射

```javascript
const REF_TYPE_META = {
  feishu: { icon: "🪶", label: "飞书文档", color: "#00B96B" },
  prd:    { icon: "📋", label: "PRD",      color: C.accent },
  spec:   { icon: "📝", label: "SPEC",     color: C.purple },
};
```

### 空状态处理

无 references 时显示一个淡色虚线卡片：
> 📎 暂无参考文档
> 可在卡片数据中添加 `references` 字段配置文档链接

### 面板布局

```
┌─────────────────────────┐
│ 参考文档                 │  ← 新分组标题
│ 🪶 飞书需求文档 - xxx  → │
│ 📋 PRD v1.2           → │
│ 📝 OpenAPI Spec       → │
├─────────────────────────┤
│ 相似需求                 │  ← 原有逻辑，移到下方
│ [卡片...]               │
└─────────────────────────┘
```

## Risks / Trade-offs

- [references 缺失] → 显示占位引导卡片，不报错
- [url 为空] → 不渲染该条目，避免点击后跳转空链接

## Context

`DetailDrawer` 是从看板卡片进入的右侧抽屉（`position:fixed, right:0, width:60vw`）。当前结构：
- Header：卡片基本信息
- Body（单滚动区）：需求描述 → 用户故事 → 验收标准 → AI 评审报告
- Footer：AI 智能评审 / AI 设计 / 通过 / 拒绝

`card.rawRequirement` 字段在数据模型中已定义，REQ-001 等示例卡片已有值，其他卡片为 `null`/`undefined`。

Meego 同步：当前项目没有真实 Meego API 对接，使用 `projectConfig.meego.apiUrl + token` 做 mock 调用，失败时提示配置入口。

## Goals / Non-Goals

**Goals:**
- Header 下方增加 Tab 切换栏（"原始需求" / "评审报告"），body 区域按 Tab 切换内容
- 「原始需求」Tab：展示 + 编辑 `rawRequirement`，"同步到 Meego" 按钮
- 「评审报告」Tab：原 body 内容，结构不变
- 「原始需求」编辑保存后同步到本地 card 状态（通过 `onUpdateCard` prop）
- Meego 同步有加载态、成功 toast、失败提示（含配置入口）

**Non-Goals:**
- 不改动 Footer 操作区（AI 评审 / 通过 / 拒绝）
- 不对接真实 Meego API（使用配置化 webhook 做演示）
- 不新增 Meego 配置 UI（复用项目配置页扩展接口）

## Decisions

### 决策 1：Tab bar 放在 Header 下方、Body 上方
- 方案：Header 和 Body 之间插入 tab bar（`height: 40px, borderBottom`）
- 原因：视觉上分区清晰，Tab 标签不占 Body 滚动空间
- 备选：将 Tab 嵌入 Header 区域
- 未选原因：Header 已较拥挤

### 决策 2：原始需求编辑用 textarea，点击"编辑"进入，点击"保存"写回
- 方案：预览态显示文本，顶部有"✎ 编辑"按钮，保存调用 `onUpdateCard(card.id, { rawRequirement: newText })`
- 原因：与 DocEditor 编辑模式保持一致
- 备选：直接 contentEditable
- 未选原因：样式难以控制

### 决策 3：Meego 同步使用 projectConfig.meego 配置
- 方案：读取 `projectConfig?.meego?.apiUrl` 和 `projectConfig?.meego?.token`，缺失时提示"未配置 Meego，请前往项目配置"
- 原因：与 Git 集成保持一致的配置模式
- 备选：硬编码 mock
- 未选原因：演示价值更高

### 决策 4：新增 `onUpdateCard` prop 到 DetailDrawer
- 方案：`DetailDrawer` 新增 `onUpdateCard(cardId, partialCard)` prop，PMPlatform 提供实现（与 `updateCard` 复用）
- 原因：最小改动，不引入全局状态
- 备选：通过 context 传递
- 未选原因：组件树扁平，prop 传递足够

## Risks / Trade-offs

- [风险] `rawRequirement` 为空的卡片较多，需空态 UX
  → 缓解：显示友好提示 + 引导用户填写

- [取舍] Meego 同步 mock，无法真实验证 API
  → 缓解：配置化设计为后期真实对接预留接口

## Migration Plan

1. `DetailDrawer` 签名新增 `onUpdateCard`、`projectConfig` props
2. 内部新增 `activeTab` state（默认 `"review"`）
3. 新增 Tab bar 渲染
4. 「原始需求」Tab 内容：预览/编辑态切换 + Meego 同步按钮
5. 「评审报告」Tab 内容：原 body 内容搬移，无修改
6. PMPlatform 中 `DetailDrawer` 调用处补充新 props

## Open Questions

- 「原始需求」是否需要 Markdown 渲染，还是纯文本展示？（当前按纯文本处理，保留换行）
- Meego 同步接口字段格式（暂按 `PUT /requirements/{id}` + `{ rawContent }` 处理）

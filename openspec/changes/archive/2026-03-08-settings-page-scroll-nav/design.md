## Context

`ProjectSettingsPage` 是单组件，包含 AI、Git、SDD、Skills 四个配置区块。目前用 `activeSection` 状态控制条件渲染（只显示一个区块）。左侧 nav 点击 → setActiveSection。

## Goals / Non-Goals

**Goals**
- 四个配置区块同时渲染，垂直排列，右侧内容区可滚动
- 滚动时左侧 nav 自动高亮当前所在区块（scroll spy）
- 点击左侧 nav 项平滑滚动到对应区块（`scrollIntoView({ behavior: 'smooth' })`）

**Non-Goals**
- 不改变各区块内部表单逻辑、保存逻辑
- 不引入外部滚动库（用原生 IntersectionObserver）

## Decisions

**D1: IntersectionObserver 实现 scroll spy**
- 为每个区块创建 `ref`（`useRef`），传给对应 section 的容器 `div`
- 在 `useEffect` 中创建 `IntersectionObserver`，`threshold: 0`，`rootMargin: '-40% 0px -55% 0px'`
  - 该 margin 让区块中心到达视口中部时触发高亮切换，体验更准确
- 观察所有 section ref，`intersecting=true` 时更新 `activeNav`
- 替代方案：`scroll` 事件 + `offsetTop` 计算——精度差，性能差

**D2: 状态重命名**
- 删除 `activeSection`（控制 Tab 显示）
- 新增 `activeNav`（仅控制左侧高亮，不影响渲染）

**D3: 点击导航平滑滚动**
- 点击导航按钮 → `sectionRefs[item.id].current?.scrollIntoView({ behavior:'smooth', block:'start' })`
- 滚动容器需要 `overflow-y: auto`，区块 ref 挂到各区块最外层 `div`

**D4: 区块顶部间距**
- 各区块顶部增加 `paddingTop: 8`，首个区块不需要，视觉分隔用 `marginBottom: 48`

## Risks / Trade-offs

- [IntersectionObserver rootMargin 调参] → 先用 `-40% 0px -55% 0px`，效果不佳可微调
- [快速点击多个导航项] → scrollIntoView 动画中途再次点击会中断，属正常浏览器行为，无需处理
- [组件卸载时清理] → useEffect 返回 `observer.disconnect()` 防止内存泄漏

## Migration Plan

纯前端改动，热更新生效，无数据迁移。

## Context

`ProjectSettingsPage` 目前是一个单列垂直滚动页面，包含两个配置板块（AI 模型配置、Git 仓库配置）。随着产品演进，预期会增加更多配置板块（通知、权限、CI 集成等）。当前布局不具备可扩展性，需要重构为带左侧导航的双栏布局。

## Goals / Non-Goals

**Goals:**
- 将 `ProjectSettingsPage` 改为左右双栏布局（nav sidebar + content area）
- 用 `activeSection` state 控制右侧内容区渲染哪个板块
- 导航菜单支持后续追加新条目，无需改动布局代码

**Non-Goals:**
- 不引入 React Router 或其他路由库（保持当前单文件无路由架构）
- 不改变配置项的存储方式（localStorage 结构不变）
- 不添加新的配置功能（功能扩展留给后续 change）

## Decisions

**D1 — 使用组件内 state 控制 activeSection**

`ProjectSettingsPage` 内部维护 `const [activeSection, setActiveSection] = useState('ai')` 。点击导航项更新 state，右侧用条件渲染 `{activeSection === 'ai' && <AISection />}` 显示对应内容。

备选方案：URL hash（`#git`）。但项目目前没有路由，引入 hash 路由会增加复杂度，组件内 state 更轻量。

**D2 — 导航配置数组驱动**

```js
const NAV_ITEMS = [
  { id: 'ai',  label: 'AI 模型配置', icon: '🤖' },
  { id: 'git', label: 'Git 仓库配置', icon: '📁' },
];
```

后续新增板块只需往数组追加一项，无需修改渲染逻辑。

**D3 — 布局结构**

```
ProjectSettingsPage
├── Header（标题 + 返回按钮）
└── Body（flex row）
    ├── NavSidebar（固定宽度 ~180px，深色背景复用 C.sb）
    └── ContentArea（flex-grow，白色背景）
```

NavSidebar 复用项目现有的侧边栏色彩 token（`C.sb`, `C.sbHover`, `C.sbActive`, `C.sbText`），保持视觉一致性。

## Risks / Trade-offs

- **小屏幕适配**：双栏布局在窄屏下可能拥挤 → 暂不处理响应式，配置页面主要在桌面使用
- **滚动位置**：切换 section 时右侧滚动位置不会保留 → 可接受，各 section 内容较短

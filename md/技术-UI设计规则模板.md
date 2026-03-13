# UI Design Rules Skill Template

本文档提供可直接复制到 `SKILL.md` 的 UI 设计规则模板，面向 PM AI Platform 项目。

---

## Template (EN)

```md
# PM AI Platform UI Design Rules (Mandatory)

When generating or modifying frontend UI in this project, follow all rules below. If any rule conflicts with existing pages, keep visual consistency with existing pages first.

## 1) Color
- Use existing tokens from `C` only (e.g. `ink/paper/cream/white/muted/border/accent/success/warn/danger/purple/teal/sb*`).
- Primary action uses `C.accent` (or `C.purple` for AI-centric actions).
- Error/risk state must use `C.danger` family only.
- Do not introduce new semantic colors for existing states.
- Keep `COLUMNS`, `priorityColor`, `scoreColor/scoreBg` semantics unchanged unless explicitly required.

## 2) Typography
- Body/content: `'Noto Sans SC', sans-serif`.
- IDs/status/meta numbers: `'DM Mono', monospace`.
- Typical scale:
  - Page title: 20-26, weight 600-800
  - Section title: 14-16, weight 600-700
  - Body: 13-14, weight 400-500
  - Meta: 10-12
- Body line-height: 1.6-1.75.

## 3) Spacing & Layout
- Use 8pt-like spacing set: 4/8/12/16/24/32.
- Card padding: 12-16.
- Modal padding: 20-24.
- Drawer width: 52-60vw, min 520px.
- Preferred shell: top nav + main content + optional sidebar/drawer.

## 4) Radius, Border, Shadow
- Radius scale: 4/6/8/10/12.
- Border: `1px solid C.border`.
- Shadow presets:
  - Dropdown: `0 4px 20px rgba(0,0,0,0.1~0.15)`
  - Drawer: `-12px 0 48px rgba(0,0,0,0.14~0.18)`
  - Modal: `0 20px 60px rgba(0,0,0,0.2~0.25)`
- Avoid heavy shadows in normal content areas.

## 5) Interaction & Motion
- Hover: subtle color/background change; optional `translateY(-1px)`.
- Active: slight press feedback (`scale(0.98~0.99)`).
- Transition duration: 0.15s-0.3s, easing `ease`.
- Focus ring: `0 0 0 2px ${C.accent}55`.
- Motion must support comprehension, not decoration.

## 6) Accessibility
- All clickable items must provide visible hover/focus states.
- Never encode status by color alone; pair with text/icon.
- Improve text contrast first when readability is insufficient.
- Form validation must provide field-level error messages.

## 7) Component Baseline
- Card: status indicator + title + meta + status badges.
- Drawer: header actions + scrollable body + sticky bottom actions.
- Modal: title/content/actions with explicit close path.
- Tree: clear indentation + badge counts + active/hover distinction.
- Tag/Badge: for short state/count labels only.

## 8) Prohibitions
- Do not add a third primary font family.
- Do not add new color systems parallel to `C`.
- Do not use large distracting animations.
- Do not break responsive readability by forcing multi-column narrow layouts.
```

---

## 模板（中文）

```md
# PM AI Platform UI 设计规则（强制）

在本项目生成或修改前端 UI 时，必须遵循以下规则；若与现有页面有冲突，优先保持现有风格一致。

## 1）色彩
- 仅使用现有 `C` token（`ink/paper/cream/white/muted/border/accent/success/warn/danger/purple/teal/sb*`）。
- 主操作优先 `C.accent`；AI 主动作可用 `C.purple`。
- 错误/风险状态只用 `C.danger` 语义色系。
- 不得为同一状态新增平行色系。
- `COLUMNS`、`priorityColor`、`scoreColor/scoreBg` 语义不得随意修改。

## 2）字体
- 正文：`'Noto Sans SC', sans-serif`。
- 编号/状态/元信息：`'DM Mono', monospace`。
- 建议层级：页面标题 20-26（600-800），区块标题 14-16（600-700），正文 13-14，辅助 10-12。
- 正文行高建议 1.6-1.75。

## 3）间距与布局
- 统一间距档位：4/8/12/16/24/32。
- 卡片内边距 12-16；弹窗内边距 20-24。
- 抽屉宽度 52-60vw，最小 520px。
- 页面结构优先：顶部导航 + 主内容 + 侧栏/抽屉。

## 4）圆角、边框、阴影
- 圆角档位：4/6/8/10/12。
- 边框统一 `1px solid C.border`。
- 阴影建议：
  - 下拉：`0 4px 20px rgba(0,0,0,0.1~0.15)`
  - 抽屉：`-12px 0 48px rgba(0,0,0,0.14~0.18)`
  - 弹窗：`0 20px 60px rgba(0,0,0,0.2~0.25)`
- 常规内容区避免重阴影。

## 5）交互与动效
- Hover 仅做轻量变化，可选 `translateY(-1px)`。
- Active 提供轻压感（`scale(0.98~0.99)`）。
- 过渡时长 0.15s-0.3s，缓动 `ease`。
- 焦点环统一 `0 0 0 2px ${C.accent}55`。
- 动效应服务信息理解，不做装饰性炫技。

## 6）可访问性
- 可点击元素必须有可见 hover/focus 状态。
- 状态不可仅靠颜色表达，必须搭配文案或图标。
- 对比度不足时优先提升文字对比度。
- 表单错误需字段级提示。

## 7）组件基线
- Card：状态标识 + 标题 + 元信息 + 状态标签。
- Drawer：头部操作区 + 可滚动内容区 + sticky 底部操作区。
- Modal：标题/内容/操作三段结构，必须可关闭。
- Tree：层级缩进、计数 badge、active/hover 清晰。
- Tag/Badge：仅承载短文本状态与计数。

## 8）禁止项
- 禁止新增第三套主字体。
- 禁止绕过 `C` 新建平行颜色体系。
- 禁止高频闪烁或大幅位移动画。
- 禁止在窄屏强行多列导致不可读。
```

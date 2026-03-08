## Why

当前项目配置页采用 Tab 切换式导航（点击左侧导航项 → 右侧只显示对应区块），用户每次只能看到一个配置区块，操作割裂、不直观，且无法纵览全部配置内容。改为连续滚动页 + 滚动索引高亮，符合长表单配置页的主流交互范式，提升浏览效率。

## What Changes

- **页面布局**：右侧内容区从"条件渲染单区块"改为"所有区块垂直排列，可连续滚动"
- **左侧导航**：从"点击切换 Tab"改为"滚动索引"——点击导航项平滑滚动到对应区块，滚动时自动高亮当前所在区块
- **移除 `activeSection` 状态**：不再用于控制显示/隐藏，改为仅标识当前高亮 nav 项
- **新增 `useEffect` + IntersectionObserver**：监听各区块进入视口，驱动左侧导航高亮同步

## Capabilities

### New Capabilities

- `settings-scroll-spy`: 配置页滚动索引交互——全区块连续展示、左侧导航随滚动高亮、点击导航平滑定位

### Modified Capabilities

- `settings-page-nav`: 左侧导航从 Tab 切换改为滚动锚点索引（行为变更，非仅实现细节）

## Impact

- `pm-ai-app/src/PMPlatform.jsx` — `ProjectSettingsPage` 组件
  - 移除 `activeSection` Tab 逻辑
  - 新增区块 `ref`、`IntersectionObserver`、`activeNav` 状态
  - 所有 `{activeSection === 'xxx' && (...)}` 条件改为无条件渲染

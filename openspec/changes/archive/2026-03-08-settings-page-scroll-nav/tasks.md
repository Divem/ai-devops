## 1. 状态与 Ref 改造

- [x] 1.1 在 `ProjectSettingsPage` 中新增 `activeNav` state（初始值 `'ai'`），删除 `activeSection` state
- [x] 1.2 新增 `sectionRefs` 对象：`const sectionRefs = { ai: useRef(), git: useRef(), sdd: useRef(), skills: useRef() }`（用 `useRef` 分别创建四个）

## 2. IntersectionObserver 实现 Scroll Spy

- [x] 2.1 新增 `useEffect`，在其中创建 `IntersectionObserver`，`rootMargin: '-40% 0px -55% 0px'`，`threshold: 0`
- [x] 2.2 在 observer callback 中，遍历 `entries`，找到 `isIntersecting=true` 的条目，根据其 ref 对应关系更新 `setActiveNav`
- [x] 2.3 将四个 section ref 的 DOM 节点都加入 observer 观察（`observer.observe(ref.current)`）
- [x] 2.4 在 `useEffect` 返回清理函数中调用 `observer.disconnect()`

## 3. 内容区改为全量渲染

- [x] 3.1 右侧内容区最外层 `div` 添加 `ref` 作为滚动容器（`overflowY: 'auto'`，已有）
- [x] 3.2 将原来四个 `{activeSection === 'xxx' && (...)}` 条件渲染改为无条件渲染，各区块最外层 `div` 添加对应的 `ref={sectionRefs.xxx}`
- [x] 3.3 各区块间增加 `marginBottom: 48`，保证区块间有明显间隔，提升滚动时的辨识度

## 4. 左侧导航改为滚动锚点

- [x] 4.1 导航按钮的 `onClick` 从 `setActiveSection(item.id)` 改为 `sectionRefs[item.id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })`
- [x] 4.2 导航高亮判断从 `activeSection === item.id` 改为 `activeNav === item.id`

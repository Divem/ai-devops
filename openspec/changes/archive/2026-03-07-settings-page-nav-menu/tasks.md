## 1. 定义导航配置

- [x] 1.1 在 `ProjectSettingsPage` 组件内定义 `NAV_ITEMS` 数组，包含 `{ id, label, icon }` 条目（AI 模型配置、Git 仓库配置）
- [x] 1.2 添加 `activeSection` state，默认值为 `'ai'`

## 2. 重构页面布局

- [x] 2.1 将页面 body 改为 flex row 双栏布局（左侧 nav + 右侧 content）
- [x] 2.2 左侧 NavSidebar：固定宽度约 180px，使用 `C.sb` 深色背景，渲染 NAV_ITEMS 列表
- [x] 2.3 实现导航项样式：激活项使用 `C.sbActive` 背景 + `C.sbText` 文字，未激活项 hover 使用 `C.sbHover`
- [x] 2.4 右侧 ContentArea：flex-grow，白色背景，按 `activeSection` 条件渲染对应板块

## 3. 拆分配置板块为子组件/区块

- [x] 3.1 将原 AI 模型配置区块代码提取，封装为独立渲染块（条件 `activeSection === 'ai'`）
- [x] 3.2 将原 Git 仓库配置区块代码提取，封装为独立渲染块（条件 `activeSection === 'git'`）
- [x] 3.3 保留 Danger Zone（账号退出）在 content 区底部，对所有 section 始终显示（或作为独立 nav 项）

## 4. 验证

- [x] 4.1 打开配置页，确认左侧导航渲染正确，默认高亮 AI 模型配置
- [x] 4.2 点击 Git 仓库配置，确认右侧切换，AI 板块隐藏
- [x] 4.3 确认配置保存/读取功能不受布局改动影响

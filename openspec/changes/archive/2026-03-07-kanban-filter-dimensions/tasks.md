## 1. 新增预设数据常量

- [x] 1.1 在 `PMPlatform.jsx` 顶层定义 `KANBAN_SPACES` 数组：`['马上消费', '中科金得助', '枭龙云国内', '枭龙云国际', '集团']`
- [x] 1.2 定义 `KANBAN_SUBSYSTEMS` 数组：`['消费金融', '企业服务', '云平台', '集团中台']`
- [x] 1.3 定义 `KANBAN_APPS` 对象，key 为子系统名，value 为该子系统下的应用数组（消费金融: 马上消费App/白条/风控平台；企业服务: 金得助/供应链/报表中心；云平台: 枭龙云控制台/枭龙云API/云监控；集团中台: 统一认证/消息中心/数据湖）
- [x] 1.4 定义 `KANBAN_ITERATIONS` 数组（从新到旧）：`['迭代-20260301','迭代-20260215','迭代-20260201','迭代-20260115','迭代-20260101','迭代-20251215']`

## 2. 更新 availableSpaces / availableIterations 计算逻辑

- [x] 2.1 `availableSpaces` 改为优先使用 `KANBAN_SPACES`，再 union 卡片中的动态 space 值，去重排序
- [x] 2.2 `availableIterations` 改为优先使用 `KANBAN_ITERATIONS`，再 union 当前空间过滤后的卡片迭代值，去重

## 3. 根组件新增子系统/应用 state 与 handler

- [x] 3.1 新增 `selectedSubsystems` state（`useState([])`）和 `subsystemDropdownOpen` state
- [x] 3.2 新增 `selectedApps` state（`useState([])`）和 `appDropdownOpen` state
- [x] 3.3 实现 `availableApps` useMemo：未选子系统时展示所有应用（KANBAN_APPS 所有 value 合并去重）；已选子系统时仅展示对应应用
- [x] 3.4 实现 `handleSubsystemToggle`：切换子系统选中状态，同时过滤掉不再属于已选子系统的 selectedApps
- [x] 3.5 实现 `handleAppToggle`：切换应用选中状态
- [x] 3.6 更新 `handleClearAllFilters`：同时清空 `selectedSubsystems` 和 `selectedApps`

## 4. 扩展 filteredCards 四维过滤逻辑

- [x] 4.1 在 `filteredCards` useMemo 中补充：`selectedSubsystems.length > 0 && !selectedSubsystems.includes(c.subsystem)` → return false
- [x] 4.2 补充：`selectedApps.length > 0 && !selectedApps.includes(c.app)` → return false
- [x] 4.3 更新 `filteredCards` 的依赖数组：加入 `selectedSubsystems`、`selectedApps`

## 5. 扩展 localStorage 持久化

- [x] 5.1 读取时从 `kanban-filter-state` 解构 `subsystems`、`apps` 字段并恢复 state（缺少时默认 `[]`）
- [x] 5.2 写入时在 JSON 中加入 `subsystems: selectedSubsystems`、`apps: selectedApps`
- [x] 5.3 更新写入 useEffect 的依赖数组：加入 `selectedSubsystems`、`selectedApps`

## 6. 更新 FilterBar 组件

- [x] 6.1 `FilterBar` 新增 props：`availableSubsystems`、`selectedSubsystems`、`onSubsystemToggle`、`subsystemOpen`、`onSubsystemOpen`、`availableApps`、`selectedApps`、`onAppToggle`、`appOpen`、`onAppOpen`
- [x] 6.2 在空间 dropdown 和迭代 dropdown 之间插入「子系统」dropdown（样式与空间 dropdown 一致，选中颜色用 `C.purple`）
- [x] 6.3 在子系统 dropdown 之后插入「应用」dropdown（选中颜色用 `C.warn`/`C.warnLight`）
- [x] 6.4 四个 dropdown 互斥：每个 dropdown 打开时其余三个调用 `onXxxOpen(false)` 关闭
- [x] 6.5 tag 行：已选子系统渲染为 purple badge，已选应用渲染为 warn badge（插入在空间 tag 和迭代 tag 之间）
- [x] 6.6 `hasFilters` 判断扩展：加入 `selectedSubsystems.length > 0 || selectedApps.length > 0`

## 7. 更新 FilterBar 调用处传参

- [x] 7.1 在 `PMPlatform` 根组件中找到 `<FilterBar ... />` 调用，补传所有新增 props

## 8. 验证

- [x] 8.1 空间下拉展示五个预设空间
- [x] 8.2 迭代下拉展示六个预设迭代
- [x] 8.3 子系统下拉正常展示并可多选
- [x] 8.4 选中子系统后，应用下拉只展示对应选项
- [x] 8.5 四维 AND 过滤逻辑正确
- [x] 8.6 清除筛选清空全部四个维度
- [x] 8.7 刷新页面后筛选状态恢复

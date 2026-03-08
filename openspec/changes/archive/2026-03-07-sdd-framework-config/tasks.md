## 1. 扩展数据结构

- [x] 1.1 定义 `SDD_FRAMEWORKS` 常量，包含 openspec / spec-kit / custom 三个框架的 label、desc 和 defaultTemplates（四种文档类型的内置模板文本）
- [x] 1.2 在 `DEFAULT_PROJECT_CONFIG` 新增 `sdd: { framework: 'openspec', templates: { proposal: '', design: '', spec: '', tasks: '' } }`
- [x] 1.3 更新 `loadProjectConfig`：合并时添加 `sdd: { ...DEFAULT_PROJECT_CONFIG.sdd, ...(base.sdd || {}) }` 兜底
- [x] 1.4 `saveProjectConfig` 无需改动（已整体序列化 config）

## 2. 导航入口

- [x] 2.1 在 `ProjectSettingsPage` 的 `NAV_ITEMS` 数组末尾追加 `{ id: 'sdd', label: 'SDD 框架', icon: '📐' }`

## 3. SDD 板块 State

- [x] 3.1 添加 `sddFramework` state，初始值为 `projectConfig.sdd?.framework || 'openspec'`
- [x] 3.2 添加 `sddTemplates` state，初始值为 `{ ...SDD_FRAMEWORKS[framework].defaultTemplates, ...projectConfig.sdd?.templates }`
- [x] 3.3 添加 `activeTemplate` state，初始值为 `'proposal'`（当前编辑的模板类型）
- [x] 3.4 添加 `savedSdd` state（保存成功提示），结构同 `savedAI` / `savedGit`

## 4. 实现 SDD 板块 UI

- [x] 4.1 在 content area 添加 `{activeSection === 'sdd' && (...)}` 条件渲染块
- [x] 4.2 板块 header：标题"SDD 框架配置" + 描述文字
- [x] 4.3 框架选择 section：`<select>` 渲染 SDD_FRAMEWORKS 各项，onChange 时更新 `sddFramework` 并刷新模板 textarea 内容为对应框架默认值（不自动覆盖已保存的自定义模板）
- [x] 4.4 框架说明文字：小字显示当前框架的 `desc`
- [x] 4.5 模板编辑 section：
  - 模板类型 tab 按钮组（Proposal / Design / Spec / Tasks），点击更新 `activeTemplate`
  - `<textarea>` 显示 `sddTemplates[activeTemplate]`，onChange 更新 `sddTemplates`，height: 280px，font-family: DM Mono
  - "恢复默认"按钮：将 `sddTemplates[activeTemplate]` 重置为 `SDD_FRAMEWORKS[sddFramework].defaultTemplates[activeTemplate]`
- [x] 4.6 底部操作行："保存 SDD 配置"按钮调用 `handleSaveSdd`，保存成功显示"✓ 已保存"

## 5. 实现 handleSaveSdd

- [x] 5.1 构建新 config：`{ ...projectConfig, sdd: { framework: sddFramework, templates: sddTemplates } }`
- [x] 5.2 调用 `saveProjectConfig(config)` 和 `onSave(config)`
- [x] 5.3 触发 `savedSdd` 短暂显示逻辑（setTimeout 2s）

## 6. 验证

- [x] 6.1 打开项目配置页，确认左侧导航出现"SDD 框架"条目
- [x] 6.2 点击"SDD 框架"，确认右侧展示框架选择和模板编辑器
- [x] 6.3 切换框架，确认说明文字变化
- [x] 6.4 切换模板类型 tab，确认 textarea 内容切换
- [x] 6.5 编辑模板并保存，刷新页面后确认内容持久化
- [x] 6.6 点击"恢复默认"，确认 textarea 重置为内置模板
- [x] 6.7 老数据（无 sdd 字段）加载时不报错

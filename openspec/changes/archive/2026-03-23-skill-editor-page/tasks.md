# Tasks: Skill Editor Page

## 1. 编辑状态管理

- [x] 1.1 在 `SkillManagementPage` 新增 `editingSkillId` / `activeSkillFile` / `skillConfigs` state
- [x] 1.2 点击"编辑"按钮时设置 `editingSkillId` 而非调用 `onNavigateToSkillEditor`

## 2. 编辑面板 UI

- [x] 2.1 创建编辑面板布局（左侧文件树 + 右侧编辑器），当 `editingSkillId` 有值时替代卡片列表
- [x] 2.2 左侧文件结构树：SKILL.md + references/ + scripts/ 文件列表，点击切换文件
- [x] 2.3 右侧文件编辑器：textarea 显示当前文件内容，支持编辑
- [x] 2.4 编辑器上方显示可用占位符标签（点击复制）
- [x] 2.5 编辑面板顶部显示 Skill 名称 + 返回列表按钮

## 3. 保存与恢复

- [x] 3.1 实现保存按钮：调用 `normalizeSkillConfig` 验证后写入 localStorage
- [x] 3.2 实现恢复默认按钮：重置当前 Skill 为内置模板
- [x] 3.3 保存成功后显示成功提示

## 4. 清理

- [x] 4.1 移除 `SkillManagementPage` 的 `onNavigateToSkillEditor` prop
- [x] 4.2 移除 `PMPlatform` 中传递给 `SkillManagementPage` 的 `onNavigateToSkillEditor` 回调

## 5. 验证

- [x] 5.1 验证点击编辑进入编辑面板（不跳转到 settings）
- [x] 5.2 验证文件切换、编辑、保存流程
- [x] 5.3 验证返回列表保留筛选状态
- [x] 5.4 验证恢复默认功能

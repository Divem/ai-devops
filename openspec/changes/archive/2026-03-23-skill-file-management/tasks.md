# Tasks: Skill File Management

## 1. Skill 导入功能

- [x] 1.1 在 Skill 管理列表页面添加 "导入" 按钮（位于"导出全部"旁边）
- [x] 1.2 实现隐藏的文件 input 和点击触发
- [x] 1.3 实现文件读取和 JSON 解析
- [x] 1.4 实现导入数据验证（必须含 files 和 SKILL.md）
- [x] 1.5 实现导入保存到 localStorage 并刷新列表

## 2. Skill 编辑器添加文件功能

- [x] 2.1 在文件树底部添加 "+ 添加文件" 按钮
- [x] 2.2 实现添加文件对话框/输入框（文件名 + 位置选择）
- [x] 2.3 实现文件名验证（仅字母数字、中划线、点）
- [x] 2.4 实现添加空文件到 skillConfigs state

## 3. Skill 编辑器删除文件功能

- [x] 3.1 在 reference/script 文件项上添加 hover 删除按钮（×）
- [x] 3.2 确保 SKILL.md 不显示删除按钮
- [x] 3.3 实现删除文件逻辑（从 state 移除）
- [x] 3.4 删除当前活跃文件时自动切换到 SKILL.md

## 4. 验证

- [x] 4.1 验证导入有效 JSON 成功
- [x] 4.2 验证导入无效文件显示错误
- [x] 4.3 验证添加 references 文件成功
- [x] 4.4 验证添加 scripts 文件成功
- [x] 4.5 验证删除文件成功且保存后生效
- [x] 4.6 验证 SKILL.md 不可删除

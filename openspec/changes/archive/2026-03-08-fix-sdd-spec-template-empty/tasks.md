## 1. 修复初始化逻辑

- [x] 1.1 在 `ProjectSettings` 组件的 `sddTemplates` useState 初始化中，过滤 `projectConfig.sdd.templates` 里的空字符串，仅用非空值覆盖 framework 默认模板
- [x] 1.2 确认修改后 `sddTemplates` 的初始值在 openspec 框架下包含正确的 spec 默认模板

## 2. 验证

- [x] 2.1 打开项目配置 → SDD 框架 → 切换到 spec 文档类型，确认 textarea 显示 OpenSpec 格式默认模板内容
- [x] 2.2 输入自定义内容并保存，刷新后确认自定义内容正常保留
- [x] 2.3 点击"恢复默认"，确认 spec 模板恢复为 OpenSpec 默认内容

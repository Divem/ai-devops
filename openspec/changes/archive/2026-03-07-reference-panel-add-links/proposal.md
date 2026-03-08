## Why

参考资料面板目前只展示卡片数据中预置的 `references` 字段，用户无法在界面上临时或永久添加新的参考链接。产品经理在评审需求时常常需要关联飞书文档、PRD 链接、竞品分析等外部资料，每次都要改数据结构效率极低。支持手动添加链接可显著提升评审效率。

## What Changes

- 参考资料面板底部新增"添加链接"入口（折叠按钮展开表单）
- 表单包含：URL 输入框、标题输入框、类型选择（飞书/PRD/SPEC/其他）
- 提交后将新链接写入当前卡片的 `references` 数组，通过 `onUpdateRefs` 回调持久化到 cards 状态
- 新增的链接显示在参考文档列表中，支持删除
- 数据链路：`ReferencePanel` → `RightPanel` → `DetailPage` → `updateCard`（根组件）

## Capabilities

### New Capabilities

- `reference-panel-add-links`: 参考资料面板手动添加/删除链接功能

### Modified Capabilities

- （无 spec 级别的行为变更）

## Impact

- `pm-ai-app/src/PMPlatform.jsx` — `ReferencePanel` 新增表单和 props；`RightPanel` 透传 `onUpdateRefs`；`DetailPage` 新增 `onUpdateRefs` prop 并生成对应回调；`PMPlatform` 根组件传入 `updateCard` 衍生的 refs 更新函数

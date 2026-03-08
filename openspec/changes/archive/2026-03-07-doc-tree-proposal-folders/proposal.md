## Why

当前需求详情页的文档树不支持多提案场景。一个产品需求（PRD）可能需要拆解成多个 OpenSpec 提案，但现有 UI 只能平铺显示所有文档类型，无法按提案分组展示。这导致用户难以区分哪些文档属于哪个提案。

## What Changes

- **数据结构变更**: 将 `docs` 对象从 `{ prd, spec, proposal, design, tasks }` 改为 `{ prd, proposals: [...] }`
- **新增提案文件夹结构**: 每个提案包含 `id`, `name`, `proposal`, `design`, `spec`, `tasks` 字段
- **UI 组件改造**: `DocTreeSidebar` 支持文件夹展开/收起，每个提案显示为独立文件夹
- **兼容性处理**: 保持对旧数据结构（`docs.{spec,proposal,design,tasks}` 直接访问）的兼容

## Capabilities

### New Capabilities
- `multi-proposal-doc-tree`: 支持多提案文件夹结构的文档树显示
  - 提案文件夹可展开/收起
  - 支持按创建时间或名称排序
  - 单提案场景下自动降级为平铺显示

### Modified Capabilities
- 无

## Impact

- **修改文件**: `pm-ai-app/src/PMPlatform.jsx` 中的 `DocTreeSidebar` 组件和相关数据结构
- **数据迁移**: 现有卡片数据需要迁移到新结构
- **无 API 变更**
- **向后兼容**: 保持对旧数据结构的支持，确保现有卡片正常显示

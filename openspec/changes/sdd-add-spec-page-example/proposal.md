## Why

SDD 版本的 PM AI Platform 缺少 `spec`（需求规格说明）文档类型，而 SDD2 版本已经包含此类型。为了保持两个版本的特性和演示内容一致性，需要在 SDD 中添加 `spec` 文档类型及其示例内容。

## What Changes

- 在 `DOC_TYPES` 数组中添加 `spec` 类型定义（需求规格说明）
- 添加 `DEMO_SPEC_*` 示例内容常量，至少包含一个完整的 spec 文档示例
- 更新 `INITIAL_CARDS` 中至少一个需求卡片，使其 `docs.spec` 字段包含示例内容

## Capabilities

### New Capabilities
- `spec-document-type`: 添加需求规格说明（Spec）文档类型支持，包括 DOC_TYPES 定义和示例内容

### Modified Capabilities
- 无

## Impact

- **修改文件**: `pm-ai-platform_sdd.jsx`
- **无 API 变更**
- **无依赖变更**
- **向后兼容**: 不影响现有功能，仅添加新文档类型

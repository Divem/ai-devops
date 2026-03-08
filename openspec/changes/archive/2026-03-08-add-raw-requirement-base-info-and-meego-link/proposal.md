## Why

看板抽屉中的「原始需求」目前以正文为主，缺少需求来源与管理上下文，产品和研发在评审时无法快速确认需求归属、责任人和时间线。补齐基础字段与 Meego 链接可降低沟通成本，并确保需求追踪链路完整。

## What Changes

- 在 `DetailDrawer` 的「原始需求」区域新增基础信息展示：需求方、产品经理、提报时间、所属模块
- 新增 Meego 链接展示与跳转入口（无链接时显示空态提示）
- 统一原始需求信息的数据结构，支持从卡片数据读取并在缺失时降级展示
- 保持现有原始需求正文编辑与同步能力不变，仅增强信息维度与可追踪性

## Capabilities

### New Capabilities
- （无）

### Modified Capabilities
- `raw-requirement-meego-sync`: 扩展原始需求上下文信息，新增基础字段与 Meego 链接展示要求
- `review-drawer-tabs`: 约束「原始需求」Tab 的信息分区，新增基础信息区与链接区

## Impact

- `pm-ai-app/src/PMPlatform.jsx`：`DetailDrawer` 原始需求 Tab UI 与字段映射逻辑调整
- 卡片数据结构：补充/使用 `rawRequirementMeta`（或等效字段）与 `meegoUrl` 映射
- 示例数据与回退逻辑：缺失字段时使用 `-` 或 `暂无`，避免渲染异常

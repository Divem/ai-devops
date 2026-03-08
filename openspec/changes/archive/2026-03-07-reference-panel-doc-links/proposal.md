## Why

当前"参考资料"面板（`ReferencePanel`）仅显示基于标签匹配的相似需求卡片。当没有 tag 重叠时，面板只显示一行"暂无相关历史需求"，整个面板几乎全空白（页面变白），体验很差。

此外，该面板缺少对当前需求最直接有用的参考材料：飞书文档（原始需求来源）、PRD 文档、SPEC 文档等结构化的参考链接。

## What Changes

- **新增参考文档区块**：在面板顶部增加"参考文档"分组，展示与当前需求关联的：
  - 飞书文档（原始需求来源）
  - 产品需求文档（PRD 链接）
  - SPEC 文档链接
- **卡片数据新增 `references` 字段**：数组格式，每项包含 `type`（`feishu`/`prd`/`spec`）、`title`、`url`
- **空状态优化**：无 references 时显示友好的占位卡片（引导用户配置）；相似需求区块保留但移到下方
- **示例数据**：在 `INITIAL_CARDS` 中为若干卡片添加 `references` 示例数据

## Capabilities

### Modified Capabilities
- `reference-panel`（已存在）：从"仅相似需求列表"升级为"参考文档 + 相似需求"双分组面板

## Impact

- **修改文件**：`pm-ai-app/src/PMPlatform.jsx`
  - `ReferencePanel` 组件重构
  - `INITIAL_CARDS` 部分卡片添加 `references` 字段
- **数据结构**：卡片新增可选字段 `references: Array<{type, title, url}>`
- **无 API 变更**，**向后兼容**

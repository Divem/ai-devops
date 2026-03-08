## Why

在 SDD2 设计工作台中，产品经理需要参考原始需求文档来完善设计。当前副标题仅显示需求名称，无法快速跳转到原始飞书需求文档，导致需要手动复制链接或搜索，降低工作效率。

## What Changes

- 在需求卡片数据结构中新增 `feishuUrl` 字段，存储飞书文档链接
- 在右侧内容面板的副标题区域，将需求名称改为可点击的链接样式
- 点击后在新标签页打开飞书文档
- 当 `feishuUrl` 存在时显示链接样式，不存在时保持普通文本

## Capabilities

### New Capabilities
- `requirement-link`: 需求名称可点击跳转飞书文档

### Modified Capabilities
- 无

## Impact

- `pm-ai-platform_sdd2.jsx` - 主应用文件
  - 需求数据结构定义 (`INITIAL_CARDS`)
  - 右侧内容面板副标题渲染逻辑 (第 1118-1119 行)
- 数据模型扩展需兼容现有数据（可选字段）

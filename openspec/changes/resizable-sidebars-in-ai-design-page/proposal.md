## Why

AI 设计页面当前三栏布局宽度固定，左侧导航与右侧对话/参考区域在不同屏幕下经常出现空间浪费或内容拥挤，影响阅读与编辑效率。为了提升演示与日常使用体验，需要支持用户按需拖拽调整两侧宽度，并让中间编辑区自适应剩余空间。

## What Changes

- 为 AI 设计页新增左右分栏拖拽能力：左侧文档树与右侧面板支持鼠标拖拽调整宽度。
- 中间 DocEditor 区域改为基于容器剩余空间自适应伸缩。
- 新增最小/最大宽度约束与拖拽视觉反馈，避免布局被拖到不可用。
- 新增宽度持久化（localStorage），用户再次进入详情页可恢复上次布局。
- 保持现有 Chatbot、Reference、DocTree 交互逻辑不变，仅调整布局层能力。

## Capabilities

### New Capabilities
- `detail-page-resizable-panels`: AI 设计页面三栏布局支持左右拖拽改宽与中间区域自适应。

### Modified Capabilities
- （无）

## Impact

- 主要影响文件：`pm-ai-app/src/PMPlatform.jsx`（`DetailPage` 布局容器、`DocTreeSidebar`/`DocEditor`/`RightPanel` 宽度控制与拖拽句柄）。
- 可能新增少量布局辅助函数（宽度 clamp、持久化 key 管理）。
- 不引入后端接口变更，不改动现有 AI 调用链路与数据结构。

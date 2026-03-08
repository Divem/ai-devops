## Why

当前 AI 评审在 API 报错时只显示失败提示，后续人工确认与通过流程无法继续演示，影响产品联调、汇报和培训。需要在失败场景下提供可控的示例评审结果，保证全流程可演示。

## What Changes

- 在 AI 评审 API 失败时，新增“使用示例评审结果”兜底入口
- 提供结构化评审示例数据（score/completeness/logic/risk/summary/risks/suggestions/passed）
- 点击兜底入口后，系统将示例结果写入当前需求并推进到人工确认阶段
- 保留现有错误 toast，不改变真实接口调用和异常处理链路
- 示例内容显式标注“非 AI 实时生成”，避免误解为真实评审

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `ai-error-demo-fallback`: 将 Demo 兜底能力从“文档生成失败”扩展到“AI 评审失败”，支持用示例评审数据继续完整流程演示

## Impact

- 主要影响：`pm-ai-app/src/PMPlatform.jsx` 的 `handleAIReview` 错误分支与详情抽屉评审操作区
- API 影响：无新增后端接口，仅前端兜底展示与本地状态写入
- 依赖影响：无新增第三方依赖
- 演示链路：AI 失败后仍可进入“人工确认/通过”路径，保障全流程演示

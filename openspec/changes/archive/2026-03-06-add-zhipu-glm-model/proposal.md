# Proposal: Add Zhipu GLM-4.7 Model Support

## Why

当前平台仅支持 Anthropic Claude API，限制了用户对 AI 模型的选择。添加智谱 GLM-4.7 模型支持可以为用户提供：
1. 更多 AI 模型选择，满足不同场景需求
2. 国内 API 访问更稳定，延迟更低
3. 成本优化选项

## What Changes

- **新增**: 智谱 GLM-4.7 模型 API 集成
- **新增**: 模型选择器 UI 组件，允许用户在 Claude 和 GLM 之间切换
- **新增**: 智谱 API Key 配置支持（环境变量 + localStorage）
- **修改**: API 调用层抽象为统一接口，支持多模型
- **新增**: 模型配置面板，支持 API Key 管理和模型切换

## Capabilities

### New Capabilities
- `zhipu-glm-integration`: 智谱 GLM 模型 API 集成，包括 API 调用、错误处理、流式输出支持

### Modified Capabilities
- 无

## Impact

**代码影响**:
- `pm-ai-platform_*.jsx`: API 调用函数重构为多模型支持
- 新增 `ai-client.js`: 统一的 AI 客户端抽象层
- 环境变量新增 `VITE_ZHIPU_API_KEY`

**API 影响**:
- 无公开 API 变化

**依赖影响**:
- 无新增外部依赖（使用原生 fetch）

**用户体验影响**:
- 用户可选择使用 Claude 或 GLM 模型
- 配置页面新增模型选择和 API Key 管理

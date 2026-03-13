## Why

自定义模型（Custom）的 Base URL 目前是纯文本输入框，用户需手动输入完整地址。其他四个模型（Claude/GLM/ARK/Kimi）已改为下拉选择器 + 自定义输入的模式。为保持一致性并减少输入错误，Custom 也应采用同样的交互模式，提供常用厂商预设选项。

## What Changes

- 将 Custom 模型的 Base URL `<input>` 替换为 `<select>` 下拉选择器
- 提供常用 OpenAI-Compatible 厂商的预设选项（OpenAI、DeepSeek、Groq、Together AI 等）
- 选择"自定义..."时展开输入框，保留原有的动态路径拼接提示
- 下拉选项根据 API 格式（OpenAI / Anthropic）动态切换

## Capabilities

### New Capabilities
- `custom-model-baseurl-presets`: 自定义模型 Base URL 下拉预设选项，根据 API 格式动态显示对应厂商列表

### Modified Capabilities
- `ai-custom-model`: Base URL 字段从纯输入框改为下拉选择器 + 条件输入框

## Impact

- 文件：`pm-ai-app/src/PMPlatform.jsx` — Custom 模型配置区块（~行 8182-8193）
- 无 API 变更，仅前端 UI 交互变更
- `customBaseUrl` state 值语义不变，存储的仍然是 Base URL 字符串

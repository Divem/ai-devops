## Why

用户在模型配置页面设置 Base URL 时，需要手动输入代理路径或完整 API 地址，操作繁琐且容易出错。同时 Model Name 输入框缺少可选值提示，且当前提示的模型名称已过时。需要将 Base URL 改为下拉选择模式（显示 `厂商名: 完整请求路径`），并更新 Model Name 可选提示为最新模型。

## What Changes

- 每个内置模型（Claude / GLM / ARK / Kimi）的 Base URL 输入框改为 **下拉选择器**，选项格式为 `厂商名: 完整请求路径`
- 下拉选项包含默认端点和本地代理两个选项，另保留"自定义"选项允许用户手动输入
- 自定义模型（Custom）的 Base URL 在用户填写后，根据 API 格式拼接显示完整路径
- 更新各模型的 Model Name 可选提示为最新模型名称：
  - Claude: `claude-sonnet-4-6, claude-opus-4-6, claude-haiku-4-5-20251001`
  - GLM: `glm-4-plus, glm-4-long, glm-4-flash, glm-4.7-flash,glm-5`
  - ARK: `ark-code-latest,doubao-seed-2.0-code, doubao-seed-2.0-pro, doubao-seed-2.0-lite`
  - Kimi: `kimi-k2.5, kimi-k2-instruct`

## Capabilities

### New Capabilities

### Modified Capabilities
- `ai-model-baseurl-config`: Base URL 改为下拉选择模式，更新 Model Name 可选提示为最新模型

## Impact

- 仅影响 `pm-ai-app/src/PMPlatform.jsx` 中 ProjectSettingsPage 的模型配置 UI 区块
- Base URL 状态变量类型不变（仍为字符串），下拉选择器的 value 直接映射到原有 state
- 纯展示层改动，不影响 API 调用逻辑和数据结构

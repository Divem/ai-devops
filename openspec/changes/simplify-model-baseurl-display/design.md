## Context

ProjectSettingsPage 中 AI 配置区块为每个内置模型（Claude / GLM / ARK / Kimi）和自定义模型提供 Base URL 与 Model Name 配置。当前 Base URL 是自由输入框，用户需要知道代理路径或完整 API 地址。改为下拉选择器可以减少输入错误，同时直观展示每个选项对应的真实请求路径。

改动范围仅限 `pm-ai-app/src/PMPlatform.jsx` 中 ProjectSettingsPage 的 JSX 渲染逻辑。

## Goals / Non-Goals

**Goals:**
- Base URL 改为下拉选择器，选项格式为 `厂商名: 完整请求路径`
- 每个内置模型提供"默认端点"和"本地代理"两个预设选项 + "自定义"选项
- 选择"自定义"时展开输入框供手动填写
- 更新 Model Name 可选提示为各厂商最新模型名称
- 降低用户配置门槛

**Non-Goals:**
- 不修改 API 调用逻辑
- 不将 Model Name 改为下拉选择器（保持输入框灵活性）
- 不增加 URL 合法性校验

## Decisions

1. **下拉选择器方案**：使用 `<select>` 组件替换 `<input>`，每个选项的 `value` 为实际 URL 值，`label` 显示为 `厂商名: URL`。选择 "自定义" 时 value 设为 `__custom__`，展开一个输入框。

2. **预设选项**（以 Claude 为例）：
   - `Claude 默认: https://api.anthropic.com/v1/messages`（value = 空字符串，走默认逻辑）
   - `本地代理: /api/anthropic/v1/messages`（value = `/api/anthropic/v1/messages`）
   - `自定义...`（value = `__custom__`，展开输入框）

3. **状态兼容**：下拉选择器的 value 直接映射到原有 `anthropicBaseUrl` 等 state 变量。当用户从预设选项切换时直接设置对应值；选择"自定义"时保留当前输入框值不变。

4. **Model Name 提示更新为最新模型**（静态文本，不做远程拉取）。

## Risks / Trade-offs

- [下拉选项固定] → 新增代理路径需要改代码。缓解："自定义"选项保证灵活性。
- [模型名称过时] → 硬编码名称可能随厂商更新而过时。缓解：名称仅作参考提示，用户仍可自由输入任意值。

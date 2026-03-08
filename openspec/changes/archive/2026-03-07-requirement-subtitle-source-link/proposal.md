## Why

需求详情页右侧面板（CHATBOT / 参考资料）的各模块 Header 副标题目前显示的是写死的通用文字（如"帮你分析、优化和完善需求"），没有任何实际信息量，也无法与需求来源系统联动。

用户希望：
1. 副标题直接显示该需求的原始描述文字（`card.desc`），让上下文更清晰
2. 鼠标移入时副标题显示可点击状态（pointer cursor + 下划线/颜色变化）
3. 点击后在新标签页跳转到需求来源链接（`card.sourceUrl`，默认为 `https://www.github.com`）

## What Changes

- **新增字段**：卡片数据新增可选字段 `sourceUrl`（需求来源链接，如 Jira ticket、飞书文档等）
- **修改 ChatbotPanel 副标题**：从写死文本改为渲染 `card.desc`，支持 hover 高亮和点击跳转
- **修改 ReferencePanel 副标题**：同样改为显示 `card.desc` + 可点击链接
- **默认值**：`sourceUrl` 未配置时使用 `https://www.github.com` 作为占位跳转地址

## Capabilities

### New Capabilities
- `requirement-source-link`：需求副标题可点击，跳转至需求来源页面

## Impact

- **修改文件**：`pm-ai-app/src/PMPlatform.jsx` 中 `ChatbotPanel` 和 `ReferencePanel` 的 Header 区域
- **数据结构**：卡片新增可选字段 `sourceUrl: string`，无 `sourceUrl` 时降级为默认链接
- **无 API 变更**，**向后兼容**（`sourceUrl` 为可选字段）

## Why

AI 设计页面目前在 Chatbot 和参考资料之后没有统一的版本记录区域，用户无法快速查看文档迭代历史，也无法明确将一次提交标记为“新版本”。这导致文档演进可追踪性不足，影响评审和协作效率。

## What Changes

- 在 AI 设计页面右侧面板中，于 Chatbot/参考资料后新增“版本记录”模块。
- 版本记录模块展示当前需求文档的版本日志（版本号、时间、提交说明、提交人、关联文档类型等核心信息）。
- 提供“提交为新版本”交互，将当前文档内容提交到 GitHub，并在版本记录中新增一条版本项。
- 统一提交成功后的状态反馈，确保用户能立即看到新版本已生成并可追溯。

## Capabilities

### New Capabilities
- `doc-version-history`: 在 AI 设计页面提供版本日志查看与“提交为新版本”能力，支持文档版本可追踪管理。

### Modified Capabilities
- None.

## Impact

- Affected code: AI 设计页右侧面板（Chatbot/参考资料区域后的新模块）、文档提交流程、版本日志数据读写逻辑。
- APIs: 使用现有 GitHub 提交通道，无新增外部 API。
- Dependencies: 无新增第三方依赖。
- Systems: 前端页面与现有 Git 集成能力联动。

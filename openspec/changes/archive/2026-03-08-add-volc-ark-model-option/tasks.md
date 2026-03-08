## 1. 配置模型选项与本地存储

- [x] 1.1 在 `pm-ai-app/src/PMPlatform.jsx` 的 AI 模型下拉中新增 `ark` 选项（展示文案包含 ARK Code Latest）
- [x] 1.2 扩展 `DEFAULT_PROJECT_CONFIG.ai`、`loadProjectConfig()`、`saveProjectConfig()`，新增 ARK Key 字段与 `ai_model_ark_key` 持久化
- [x] 1.3 在项目配置页 AI 区块中新增 ARK API Key 输入区域（仅在 `aiModel === 'ark'` 时显示）

## 2. 扩展统一 AI 客户端

- [x] 2.1 在 `ai-client.js` 中为 `AIClient._createProvider()` 增加 `ark` 分支
- [x] 2.2 新增 `ArkProvider`：读取 `ai_model_ark_key`，调用 `https://ark.cn-beijing.volces.com/api/coding/v3`，使用 OpenAI Completions 兼容请求体
- [x] 2.3 规范化 ARK 响应与错误映射，确保 `chat()` 返回字符串并复用现有错误处理机制
- [x] 2.4 更新 `ModelRegistry`，注册 `ark` 模型元数据

## 3. 回归验证

- [x] 3.1 手动验证三模型切换：`claude`、`glm`、`ark` 的配置保存与刷新恢复
- [x] 3.2 手动验证 ARK 成功调用与缺失 Key/错误 Key 场景提示
- [x] 3.3 运行 `npm run lint`（在 `pm-ai-app`）并记录与本次改动相关的问题

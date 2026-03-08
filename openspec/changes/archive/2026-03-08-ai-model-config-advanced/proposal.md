## Why

当前 AI 模型配置页只支持固定的三个内置模型（Claude / GLM-4 / ARK），API 端点硬编码在 Provider 类中，用户无法查看或修改；API Key 输入框固定为 password 类型，无法确认已输入内容；也不支持接入任意兼容 OpenAI 接口的第三方模型服务。以上三点限制了平台的灵活性，对开发调试和定制化使用场景不友好。

## What Changes

- **BaseURL 可见 + 可配置**：在 AI 配置表单中，每个内置模型展示其 API 端点 URL，支持用户覆盖（用于代理、私有部署等场景）；内置默认值在输入框中以 placeholder 形式提示
- **Model Name 可覆盖**：在每个内置模型下显示当前使用的模型名称，支持用户填写覆盖值（如将 `claude-sonnet-4-20250514` 改为 `claude-opus-4-20250514`）
- **自定义模型**：新增 `custom` 模型选项，用户可配置：显示名称、Base URL、Model Name、API Key、鉴权方式（`Bearer` / `x-api-key`）；使用 OpenAI Chat Completions 兼容格式发起请求
- **密钥显示/隐藏切换**：所有 API Key 输入框添加眼睛图标按钮，点击切换 `type="password"` ↔ `type="text"`
- **AIClient 读取覆盖配置**：各 Provider 在实例化时从 localStorage 读取用户自定义的 baseUrl / modelName，覆盖硬编码默认值；新增 `CustomProvider` 处理自定义模型

## Capabilities

### New Capabilities

- `ai-model-baseurl-config`: 内置模型 API 端点和模型名称可查看、可覆盖配置
- `ai-custom-model`: 自定义 OpenAI-compatible 模型配置能力（Base URL + Model + Key + Auth）
- `ai-key-visibility-toggle`: API Key 输入框的显示/隐藏切换功能

### Modified Capabilities

- `ai-model-config`: 内置模型配置数据结构扩展，新增 `baseUrl`、`modelName` 覆盖字段；支持 `custom` 模型 ID

## Impact

- `pm-ai-app/src/PMPlatform.jsx`
  - `DEFAULT_PROJECT_CONFIG.ai` — 新增字段
  - `loadProjectConfig` / `saveProjectConfig` — 新增字段的持久化
  - `ProjectSettingsPage` — UI 增强（BaseURL 输入、Model Name 输入、眼睛按钮、Custom 表单）
  - `handleSaveAI` — 扩展保存逻辑
- `ai-client.js`
  - `ClaudeProvider` / `GLMProvider` / `ArkProvider` — 读取 localStorage 覆盖值
  - 新增 `CustomProvider` — OpenAI-compatible 格式
  - `AIClient._createProvider` — 新增 `'custom'` 分支
  - `ModelRegistry` — 新增 custom 条目

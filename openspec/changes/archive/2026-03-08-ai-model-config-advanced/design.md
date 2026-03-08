## Context

`AIClient` 通过 `_createProvider(model)` 工厂方法实例化各 Provider。每个 Provider 硬编码了 `apiEndpoint`（或 `apiBaseUrl`）和 `model`。配置页 `ProjectSettingsPage` 只存储 key，不存储 endpoint/modelName 覆盖。

## Goals / Non-Goals

**Goals**
- 内置模型（claude/glm/ark）支持端点 URL 和模型名称覆盖，存于 localStorage
- 自定义模型（custom）支持完整配置：名称/baseUrl/modelName/apiKey/authStyle
- 所有 API Key 输入框支持显示/隐藏
- AIClient 实例化时优先读取用户覆盖配置

**Non-Goals**
- 不支持多个自定义模型（只支持一个 custom 槽位）
- 不验证 custom 模型的连通性（留给用户自行测试）
- 不迁移现有已保存的配置数据（字段扩展兼容旧数据）

## Decisions

**D1: 配置数据结构扩展**

`DEFAULT_PROJECT_CONFIG.ai` 新增字段：
```javascript
{
  model: 'claude',
  // 内置模型覆盖（空字符串 = 使用 Provider 内置默认值）
  anthropicKey: '', anthropicBaseUrl: '', anthropicModel: '',
  glmKey: '',      glmBaseUrl: '',       glmModel: '',
  arkKey: '',      arkBaseUrl: '',       arkModel: '',
  // 自定义模型
  customName: '',      // 显示名称（选项列表用）
  customBaseUrl: '',   // 完整 endpoint URL（不含路径，如 https://api.openai.com）
  customModel: '',     // model name
  customKey: '',       // API Key
  customAuthStyle: 'Bearer',  // 'Bearer' | 'x-api-key'
}
```

**D2: localStorage key 命名**
- `ai_model_claude_baseurl` / `ai_model_claude_modelname`（对应 anthropicBaseUrl/anthropicModel）
- `ai_model_glm_baseurl` / `ai_model_glm_modelname`
- `ai_model_ark_baseurl` / `ai_model_ark_modelname`
- `ai_model_custom_*`：key/baseurl/model/name/authstyle

**D3: Provider 覆盖逻辑**

```javascript
// 示例：ClaudeProvider
constructor() {
  this.apiKey = this._getApiKey();
  this.apiEndpoint = localStorage.getItem('ai_model_claude_baseurl') || '/api/anthropic/v1/messages';
  this.model = localStorage.getItem('ai_model_claude_modelname') || 'claude-sonnet-4-20250514';
}
```

**D4: CustomProvider 接口**

使用 OpenAI Chat Completions 格式（GLM/ARK 已兼容）：
```javascript
class CustomProvider {
  constructor() {
    this.apiKey     = localStorage.getItem('ai_model_custom_key') || '';
    this.baseUrl    = localStorage.getItem('ai_model_custom_baseurl') || '';
    this.model      = localStorage.getItem('ai_model_custom_model') || '';
    this.authStyle  = localStorage.getItem('ai_model_custom_authstyle') || 'Bearer';
  }
  // POST ${baseUrl}/chat/completions，Authorization: Bearer <key> 或 x-api-key: <key>
}
```

**D5: 显示/隐藏切换**

每个 key 输入框使用独立 boolean state（`showAnthropicKey`, `showGlmKey`, etc.）控制 `type`。
按钮：👁 / 🙈 图标，absolute 定位于 input 右侧，用 `position: relative` 包裹。

**D6: UI 展示 BaseURL 和 ModelName**

在每个内置模型的 API Key 输入框之后增加两个可选字段（折叠区域或直接展示）：
- API Base URL（placeholder 为实际默认值）
- Model Name（placeholder 为实际默认值）
选择 直接展示，因为配置页已是高级用户的领域。

## Risks / Trade-offs

- [custom 模型 baseUrl 格式多样] → 统一追加 `/chat/completions` 路径，UI 注明格式（如 `https://api.openai.com`）
- [旧配置兼容] → 新字段 spread 到 DEFAULT 上，旧配置不含新字段时用默认空字符串

## Migration Plan

无数据迁移需求，空字符串 fallback 到原有硬编码默认值，完全向后兼容。

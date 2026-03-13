## Context

当前自定义模型（Custom）的 Base URL 配置是一个纯文本输入框，用户需手动输入完整地址（如 `https://api.openai.com`）。其他四个内置模型（Claude/GLM/ARK/Kimi）已在 `simplify-model-baseurl-display` 变更中改为 `<select>` 下拉选择器 + 自定义输入的交互模式。Custom 模型需要采用同样的模式保持一致性。

Custom 模型的特殊性：支持 OpenAI 和 Anthropic 两种 API 格式，系统会自动追加路径后缀（`/chat/completions` 或 `/v1/messages`）。预设选项需根据当前 API 格式动态切换。

## Goals / Non-Goals

**Goals:**
- Custom 模型 Base URL 改为下拉选择器，与其他模型保持一致
- 提供常用 OpenAI-Compatible 和 Anthropic 格式厂商预设
- 选择"自定义..."时展开输入框，保留动态路径拼接提示

**Non-Goals:**
- 不改变 `customBaseUrl` state 的存储语义
- 不修改 API 调用逻辑或路径拼接规则
- 不改动其他四个模型的配置区块

## Decisions

### 1. 预设选项按 API 格式分组

**决定**：根据 `customFormat` 状态动态渲染不同的 `<option>` 列表。

- **OpenAI 格式预设**：OpenAI (`https://api.openai.com`)、DeepSeek (`https://api.deepseek.com`)、Groq (`https://api.groq.com/openai`)、Together AI (`https://api.together.xyz`)
- **Anthropic 格式预设**：Anthropic (`https://api.anthropic.com`)

**理由**：不同格式对应不同厂商生态，混合显示会造成困惑。切换格式时自动切换预设列表最直观。

### 2. 格式切换时重置 Base URL

**决定**：当用户切换 `customFormat` 时，如果当前 `customBaseUrl` 匹配旧格式的预设值，则重置为空字符串（选中新格式的默认选项）。如果是自定义值则保留。

**理由**：避免切到 Anthropic 格式后 Base URL 仍指向 OpenAI 端点这种错误配置。

### 3. 保留动态路径拼接提示

**决定**：在下拉和自定义输入下方保留原有的 `customFormat === 'anthropic' ? '/v1/messages' : '/chat/completions'` 路径提示。

**理由**：Custom 模型的 Base URL 不含路径后缀，提示用户实际请求地址很重要。

## Risks / Trade-offs

- **预设列表维护**：新增厂商需手动更新代码 → 可接受，厂商变化不频繁
- **格式切换重置逻辑**：如果用户填了自定义 URL 然后切格式，URL 保留可能不兼容 → 仅重置预设值，自定义值保留由用户自行判断

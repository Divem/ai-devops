/* ═══════════════════════════════ AI CLIENT ABSTRACTION ════════════════════════════════════
 *
 * 统一的 AI 客户端抽象层，支持多个 AI 模型提供商
 *
 * 使用方式:
 *   const client = new AIClient('claude'); // 或 'glm'
 *   const response = await client.chat('你好', 1500);
 *
 * 配置 API Key:
 *   localStorage.setItem('ai_model_claude_key', 'sk-ant-xxx');
 *   localStorage.setItem('ai_model_glm_key', 'your-glm-key');
 * ───────────────────────────────────────────────────────────────────────────────────────── */

/**
 * AI 客户端基类
 * @abstract
 */
class AIClient {
  /**
   * @param {string} model - 模型标识: 'claude' 或 'glm'
   */
  constructor(model) {
    this.model = model;
    this.provider = this._createProvider(model);
  }

  /**
   * 发送聊天请求
   * @param {string} prompt - 用户提示
   * @param {number} maxTokens - 最大 token 数
   * @returns {Promise<string>} AI 响应内容
   */
  async chat(prompt, maxTokens = 1800) {
    return this.provider.chat(prompt, maxTokens);
  }

  /**
   * 获取当前模型
   * @returns {string} 模型标识
   */
  getModel() {
    return this.model;
  }

  /**
   * 创建对应的 Provider 实例
   * @private
   */
  _createProvider(model) {
    switch (model) {
      case 'claude':
        return new ClaudeProvider();
      case 'glm':
        return new GLMProvider();
      default:
        console.warn(`Unknown model: ${model}, falling back to Claude`);
        return new ClaudeProvider();
    }
  }
}

/**
 * Anthropic Claude Provider
 */
class ClaudeProvider {
  constructor() {
    this.apiKey = this._getApiKey();
    this.apiEndpoint = 'https://api.anthropic.com/v1/messages';
    this.model = 'claude-sonnet-4-20250514';
  }

  /**
   * 获取 API Key（优先级：localStorage > env var > 代码常量）
   * @private
   */
  _getApiKey() {
    // 1. localStorage
    const localKey = localStorage.getItem('ai_model_claude_key');
    if (localKey) return localKey;

    // 2. 环境变量（Vite 应用）
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ANTHROPIC_API_KEY) {
      return import.meta.env.VITE_ANTHROPIC_API_KEY;
    }

    // 3. 代码常量（兜底，返回空字符串）
    return typeof CLAUDE_API_KEY !== 'undefined' ? CLAUDE_API_KEY : '';
  }

  /**
   * 发送聊天请求
   * @param {string} prompt - 用户提示
   * @param {number} maxTokens - 最大 token 数
   * @returns {Promise<string>} AI 响应内容
   */
  async chat(prompt, maxTokens = 1800) {
    if (!this.apiKey) {
      return this._error('未配置 API Key。请在代码顶部设置 CLAUDE_API_KEY，或在浏览器控制台运行：\n' +
        'localStorage.setItem(\'ai_model_claude_key\', \'your-key-here\')');
    }

    try {
      const res = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await res.json();

      if (data.error) {
        console.error('Claude API Error:', data.error);
        return this._error(`API 错误: ${data.error.message}`);
      }

      return data.content?.map(b => b.text || '').join('') || '';
    } catch (e) {
      console.error('Claude Request Error:', e);
      return this._error(`网络错误: ${e.message}`);
    }
  }

  /**
   * 格式化错误消息
   * @private
   */
  _error(msg) {
    return `❌ ${msg}`;
  }
}

/**
 * Zhipu GLM Provider
 */
class GLMProvider {
  constructor() {
    this.apiKey = this._getApiKey();
    this.apiEndpoint = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    this.model = 'glm-4';
  }

  /**
   * 获取 API Key（优先级：localStorage > env var > 代码常量）
   * @private
   */
  _getApiKey() {
    // 1. localStorage
    const localKey = localStorage.getItem('ai_model_glm_key');
    if (localKey) return localKey;

    // 2. 环境变量（Vite 应用）
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ZHIPU_API_KEY) {
      return import.meta.env.VITE_ZHIPU_API_KEY;
    }

    // 3. 代码常量（兜底，返回空字符串）
    return typeof ZHIPU_API_KEY !== 'undefined' ? ZHIPU_API_KEY : '';
  }

  /**
   * 发送聊天请求
   * @param {string} prompt - 用户提示
   * @param {number} maxTokens - 最大 token 数
   * @returns {Promise<string>} AI 响应内容
   */
  async chat(prompt, maxTokens = 1800) {
    if (!this.apiKey) {
      return this._error('未配置 API Key。请在浏览器控制台运行：\n' +
        'localStorage.setItem(\'ai_model_glm_key\', \'your-key-here\')');
    }

    try {
      const res = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: maxTokens,
          temperature: 0.7
        })
      });

      const data = await res.json();

      if (data.error) {
        console.error('GLM API Error:', data.error);
        return this._error(`API 错误: ${data.error.message || data.error.type}`);
      }

      // GLM 响应格式: { choices: [{ message: { content: "..." } }] }
      return data.choices?.[0]?.message?.content || '';
    } catch (e) {
      console.error('GLM Request Error:', e);
      return this._error(`网络错误: ${e.message}`);
    }
  }

  /**
   * 格式化错误消息
   * @private
   */
  _error(msg) {
    return `❌ ${msg}`;
  }
}

/**
 * 模型注册表 - 管理可用的 AI 模型
 */
const ModelRegistry = {
  models: {
    claude: { id: 'claude', name: 'Claude (Anthropic)', provider: 'anthropic' },
    glm: { id: 'glm', name: 'GLM-4 (Zhipu)', provider: 'zhipu' }
  },

  /**
   * 获取所有可用模型
   * @returns {Array} 模型列表
   */
  getAll() {
    return Object.values(this.models);
  },

  /**
   * 根据 ID 获取模型
   * @param {string} id - 模型 ID
   * @returns {Object|null} 模型信息
   */
  get(id) {
    return this.models[id] || null;
  },

  /**
   * 验证模型 ID 是否有效
   * @param {string} id - 模型 ID
   * @returns {boolean} 是否有效
   */
  isValid(id) {
    return id in this.models;
  }
};

// ES 模块导出（用于 Vite 等现代构建工具）
export { AIClient, ClaudeProvider, GLMProvider, ModelRegistry };

// CommonJS 导出（用于 Node.js 兼容）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AIClient, ClaudeProvider, GLMProvider, ModelRegistry };
}

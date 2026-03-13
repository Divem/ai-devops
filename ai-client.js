/* ═══════════════════════════════ AI CLIENT ABSTRACTION ════════════════════════════════════
 *
 * 统一的 AI 客户端抽象层，支持多个 AI 模型提供商
 *
 * 使用方式:
 *   const client = new AIClient('claude'); // 或 'glm' / 'ark'
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
   * @param {string} model - 模型标识: 'claude' / 'glm' / 'ark'
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
      case 'ark':
        return new ArkProvider();
      case 'kimi':
        return new KimiProvider();
      case 'custom':
        return new CustomProvider();
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
    this.apiEndpoint = localStorage.getItem('ai_model_claude_baseurl') || '/api/anthropic/v1/messages';
    this.model = localStorage.getItem('ai_model_claude_modelname') || 'claude-sonnet-4-20250514';
  }

  /**
   * 获取 API Key（优先级：localStorage > env var > 代码常量）
   * @private
   */
  _getApiKey() {
    // 1. localStorage
    const localKey = localStorage.getItem('ai_model_claude_key');
    if (localKey) return localKey;

    // 2. window 对象（CDN 模式）
    if (window.CLAUDE_API_KEY) {
      return window.CLAUDE_API_KEY;
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
      const err = new Error('未配置 API Key');
      err.errorType = 'no_api_key';
      err.errorMessage = '未配置 API Key';
      throw err;
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
        const err = new Error(data.error.message);
        err.errorType = data.error.type;
        err.errorMessage = data.error.message;
        throw err;
      }

      return data.content?.map(b => b.text || '').join('') || '';
    } catch (e) {
      if (e.errorType) throw e;
      console.error('Claude Request Error:', e);
      const err = new Error(e.message);
      err.errorType = 'network_error';
      err.errorMessage = e.message;
      throw err;
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
    this.apiEndpoint = localStorage.getItem('ai_model_glm_baseurl') || '/api/glm/api/paas/v4/chat/completions';
    this.model = localStorage.getItem('ai_model_glm_modelname') || 'glm-4';
  }

  /**
   * 获取 API Key（优先级：localStorage > env var > 代码常量）
   * @private
   */
  _getApiKey() {
    // 1. localStorage
    const localKey = localStorage.getItem('ai_model_glm_key');
    if (localKey) return localKey;

    // 2. window 对象（CDN 模式）
    if (window.ZHIPU_API_KEY) {
      return window.ZHIPU_API_KEY;
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
      const err = new Error('未配置 API Key');
      err.errorType = 'no_api_key';
      err.errorMessage = '未配置 API Key';
      throw err;
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
        const err = new Error(data.error.message || data.error.type);
        err.errorType = data.error.type || 'api_error';
        err.errorMessage = data.error.message || data.error.type;
        throw err;
      }

      // GLM 响应格式: { choices: [{ message: { content: "..." } }] }
      return data.choices?.[0]?.message?.content || '';
    } catch (e) {
      if (e.errorType) throw e;
      console.error('GLM Request Error:', e);
      const err = new Error(e.message);
      err.errorType = 'network_error';
      err.errorMessage = e.message;
      throw err;
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
 * Volcengine ARK Provider
 */
class ArkProvider {
  constructor() {
    this.apiKey = this._getApiKey();
    this.apiBaseUrl = localStorage.getItem('ai_model_ark_baseurl') || '/api/ark/api/coding/v3';
    this.model = localStorage.getItem('ai_model_ark_modelname') || 'ark-code-latest';
  }

  /**
   * 获取 API Key（优先级：localStorage > window 变量 > 代码常量）
   * @private
   */
  _getApiKey() {
    const localKey = localStorage.getItem('ai_model_ark_key');
    if (localKey) return localKey;

    if (window.ARK_API_KEY) {
      return window.ARK_API_KEY;
    }

    return typeof ARK_API_KEY !== 'undefined' ? ARK_API_KEY : '';
  }

  /**
   * 发送聊天请求
   * @param {string} prompt - 用户提示
   * @param {number} maxTokens - 最大 token 数
   * @returns {Promise<string>} AI 响应内容
   */
  async chat(prompt, maxTokens = 1800) {
    if (!this.apiKey) {
      const err = new Error('未配置 API Key');
      err.errorType = 'no_api_key';
      err.errorMessage = '未配置 API Key';
      throw err;
    }

    try {
      const res = await fetch(`${this.apiBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: maxTokens
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        const message = data?.error?.message || data?.message || `HTTP ${res.status}`;
        const type = data?.error?.type || (res.status === 401 ? 'authentication_error' : 'api_error');
        console.error('ARK API Error:', data?.error || data || message);
        const err = new Error(message);
        err.errorType = type;
        err.errorMessage = message;
        throw err;
      }

      return data?.choices?.[0]?.message?.content || '';
    } catch (e) {
      if (e.errorType) throw e;
      console.error('ARK Request Error:', e);
      const err = new Error(e.message);
      err.errorType = 'network_error';
      err.errorMessage = e.message;
      throw err;
    }
  }
}

/**
 * Kimi Provider (Anthropic-compatible)
 */
class KimiProvider {
  constructor() {
    this.apiKey = localStorage.getItem('ai_model_kimi_key') || '';
    this.apiEndpoint = localStorage.getItem('ai_model_kimi_baseurl') || '/api/kimi/v1/messages';
    this.model = localStorage.getItem('ai_model_kimi_modelname') || 'kimi-latest';
  }

  async chat(prompt, maxTokens = 1800) {
    if (!this.apiKey) {
      const err = new Error('未配置 Kimi API Key');
      err.errorType = 'no_api_key';
      err.errorMessage = '未配置 Kimi API Key';
      throw err;
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

      if (!res.ok || data.error) {
        const message = data?.error?.message || `HTTP ${res.status}`;
        console.error('Kimi API Error:', data?.error || data);
        const err = new Error(message);
        err.errorType = data?.error?.type || 'api_error';
        err.errorMessage = message;
        throw err;
      }

      return data.content?.map(b => b.text || '').join('') || '';
    } catch (e) {
      if (e.errorType) throw e;
      console.error('Kimi Request Error:', e);
      const err = new Error(e.message);
      err.errorType = 'network_error';
      err.errorMessage = e.message;
      throw err;
    }
  }
}

/**
 * Custom OpenAI-Compatible Provider
 */
class CustomProvider {
  constructor() {
    this.apiKey    = localStorage.getItem('ai_model_custom_key')       || '';
    this.baseUrl   = (localStorage.getItem('ai_model_custom_baseurl')   || '').replace(/\/+$/, '');
    this.model     = localStorage.getItem('ai_model_custom_model')     || '';
    this.authStyle = localStorage.getItem('ai_model_custom_authstyle') || 'Bearer';
    this.format    = localStorage.getItem('ai_model_custom_format')    || 'openai';
  }

  async chat(prompt, maxTokens = 1800) {
    if (!this.apiKey || !this.baseUrl || !this.model) {
      const err = new Error('自定义模型未配置完整（需要 Base URL、Model Name 和 API Key）');
      err.errorType = 'no_api_key';
      err.errorMessage = err.message;
      throw err;
    }

    try {
      let res, data;
      if (this.format === 'anthropic') {
        res = await fetch(`${this.baseUrl}/v1/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({ model: this.model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] })
        });
        data = await res.json();
        if (!res.ok || data.error) {
          const message = data?.error?.message || `HTTP ${res.status}`;
          const err = new Error(message);
          err.errorType = data?.error?.type || 'api_error';
          err.errorMessage = message;
          throw err;
        }
        return data.content?.map(b => b.text || '').join('') || '';
      } else {
        const headers = { 'Content-Type': 'application/json' };
        if (this.authStyle === 'x-api-key') headers['x-api-key'] = this.apiKey;
        else headers['Authorization'] = `Bearer ${this.apiKey}`;
        res = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ model: this.model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] })
        });
        data = await res.json();
        if (!res.ok || data.error) {
          const message = data?.error?.message || `HTTP ${res.status}`;
          const err = new Error(message);
          err.errorType = data?.error?.type || 'api_error';
          err.errorMessage = message;
          throw err;
        }
        return data?.choices?.[0]?.message?.content || '';
      }
    } catch (e) {
      if (e.errorType) throw e;
      const err = new Error(e.message);
      err.errorType = 'network_error';
      err.errorMessage = e.message;
      throw err;
    }
  }
}

/**
 * 模型注册表 - 管理可用的 AI 模型
 */
const ModelRegistry = {
  models: {
    claude: { id: 'claude', name: 'Claude (Anthropic)', provider: 'anthropic' },
    glm: { id: 'glm', name: 'GLM-4 (Zhipu)', provider: 'zhipu' },
    ark: { id: 'ark', name: 'ARK Code Latest (Volcengine)', provider: 'volc-ark' },
    kimi: { id: 'kimi', name: 'Kimi (Moonshot)', provider: 'kimi' },
    custom: { id: 'custom', name: '自定义模型 (OpenAI / Anthropic Compatible)', provider: 'custom' },
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
export { AIClient, ClaudeProvider, GLMProvider, ArkProvider, KimiProvider, ModelRegistry };

// CommonJS 导出（用于 Node.js 兼容）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AIClient, ClaudeProvider, GLMProvider, ArkProvider, KimiProvider, ModelRegistry };
}

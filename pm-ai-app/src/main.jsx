import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AIClient, ClaudeProvider, GLMProvider, ModelRegistry } from '../../ai-client.js'

// 将 AIClient 挂载到 window 对象，以便在 JSX 组件中使用
if (typeof window !== 'undefined') {
  window.AIClient = AIClient;
  window.ClaudeProvider = ClaudeProvider;
  window.GLMProvider = GLMProvider;
  window.ModelRegistry = ModelRegistry;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

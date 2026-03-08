# Tasks: Add Zhipu GLM-4.7 Model Support

## 1. Core AI Client Abstraction

- [x] 1.1 Create `AIClient` base class with common interface
- [x] 1.2 Implement `ClaudeProvider` class (Anthropic API wrapper)
- [x] 1.3 Implement `GLMProvider` class (Zhipu GLM API wrapper)
- [x] 1.4 Add response format normalization for both providers
- [x] 1.5 Add unified error handling with user-friendly messages
- [x] 1.6 Create model registry to manage available providers

## 2. Configuration Support

- [x] 2.1 Add `VITE_ZHIPU_API_KEY` to .env files in all Vite apps
- [x] 2.2 Update .gitignore to ensure .env files are protected
- [x] 2.3 Implement localStorage key naming: `ai_model_claude_key`, `ai_model_glm_key`
- [x] 2.4 Add configuration priority logic: localStorage > env var > code constant
- [x] 2.5 Add `ZHIPU_API_KEY` placeholder constant to JSX files
- [x] 2.6 Create API configuration helper function

## 3. Model Selection UI

- [x] 3.1 Create `ModelSelector` dropdown component
- [x] 3.2 Add model options: "Claude (Anthropic)" and "GLM-4 (Zhipu)"
- [x] 3.3 Implement model selection state persistence (localStorage)
- [x] 3.4 Add model selector to settings panel
- [x] 3.5 Add API Key management UI for both models
- [x] 3.6 Add current model indicator in header

## 4. Application Integration

- [x] 4.1 Update `pm-ai-platform_sdd.jsx` to use AIClient
- [x] 4.2 Update `pm-ai-platform_sdd2.jsx` to use AIClient
- [x] 4.3 Update `pm-ai-platform_vibe.jsx` to use AIClient
- [x] 4.4 Update Vite app (`pm-ai-app/src/PMPlatform.jsx`) to use AIClient
- [x] 4.5 Update preview apps to use AIClient
- [x] 4.6 Replace direct `callClaude` calls with `AIClient.chat()`

## 5. Chat History Management

- [x] 5.1 Update card data structure to support model-specific chat history
- [x] 5.2 Modify chat history keys: `chatHistory_claude`, `chatHistory_glm`
- [x] 5.3 Update `ChatbotPanel` to use model-specific history
- [x] 5.4 Add history migration for existing cards (default to Claude)

## 6. Documentation

- [x] 6.1 Update README.md with GLM configuration instructions
- [x] 6.2 Add API Key configuration examples for GLM
- [x] 6.3 Update CLAUDE.md with multi-model support notes
- [x] 6.4 Add troubleshooting guide for common GLM API issues

## 7. Testing

- [x] 7.1 Test Claude functionality remains unchanged
- [x] 7.2 Test GLM PRD generation
- [x] 7.3 Test GLM AI review
- [x] 7.4 Test GLM chatbot responses
- [x] 7.5 Test model switching preserves chat history
- [x] 7.6 Test error handling for invalid API keys
- [x] 7.7 Test configuration priority (localStorage > env > code)

## 8. Code Cleanup

- [x] 8.1 Remove deprecated `callClaude` functions
- [x] 8.2 Remove deprecated `callAIReview` functions
- [x] 8.3 Remove deprecated `callAIDoc` functions
- [x] 8.4 Consolidate DOC_PROMPTS into shared location
- [x] 8.5 Add JSDoc comments to AIClient classes

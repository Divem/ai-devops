# AGENTS.md

本文件为在此代码库中工作的 AI 代理提供开发指南。

## 项目结构

```
agentic_coding_platform/
├── pm-ai-app/                    # 主应用 (Vite + React 19)
├── preview-apps/
│   ├── vibe-app/                 # Vibe 设计系统变体
│   └── sdd2-app/                 # SDD2 设计系统变体
├── pm-ai-platform_sdd.jsx        # SDD 设计系统主应用
├── pm-ai-platform_sdd2.jsx       # SDD2 设计系统主应用
├── pm-ai-platform_vibe.jsx       # Vibe 设计系统主应用
└── openspec/                     # OpenSpec 变更管理
```

## 构建与运行命令

### pm-ai-app (主应用)

```bash
cd pm-ai-app
npm install
npm run dev      # 开发模式
npm run build    # 构建生产版本
npm run lint     # 代码检查
npm run preview  # 预览构建结果
```

### preview-apps 子应用

```bash
cd preview-apps/vibe-app   # 或 sdd2-app
npm install && npm run dev
```

### 重要说明

- **无测试框架**: 项目未配置 Jest/Vitest
- **单文件应用**: 主要业务逻辑在大型 JSX 文件中，约 2000+ 行
- **ESLint**: 使用 ESLint 9.x flat config 格式

## 代码风格指南

### 语言与框架

- **React 19**: 使用最新 React hooks (useState, useCallback, useRef, useEffect)
- **无外部状态管理**: 所有状态为组件本地状态，不使用 Redux/Zustand
- **JavaScript (JSX)**: 主要使用 JSX，无 TypeScript

### 导入规范

```javascript
import React, { useState, useCallback, useRef, useEffect } from 'react'

// 样式使用内联对象
const styles = {
  container: { padding: '16px' },
  button: { background: '#1a6cf6' }
}
```

### 命名约定

- **组件**: PascalCase (如 `KanbanCard`, `DetailPage`)
- **函数/变量**: camelCase (如 `handleClick`, `cardData`)
- **常量**: UPPER_SNAKE_CASE (如 `API_BASE_URL`, `COLUMNS`)

### 组件结构

```jsx
function MyComponent({ title, onSubmit }) {
  const [state, setState] = useState(null)
  
  const handleAction = useCallback(() => {
    // 业务逻辑
  }, [dependencies])
  
  return (
    <div style={styles.container}>
      <h1>{title}</h1>
    </div>
  )
}

const styles = {
  container: { padding: '16px' }
}
```

### 颜色与设计系统

```javascript
const C = {
  ink: "#0d0e12", paper: "#f5f3ee", cream: "#faf8f3", white: "#ffffff",
  muted: "#9b9b8a", border: "#e2ddd5",
  accent: "#1a6cf6", accentLight: "#e8f0fe",
  success: "#0d7a4e", successLight: "#e6f4ef",
  warn: "#b45309", warnLight: "#fef3c7",
  danger: "#c0392b", dangerLight: "#fdecea",
  purple: "#5b4fcf", purpleLight: "#ede9fc",
  teal: "#0891b2", tealLight: "#e0f2fe",
  sb: "#1e1e2e", sbHover: "#2a2a3e", sbActive: "#313150",
  sbText: "#cdd6f4", sbMuted: "#6c7086",
}

const PRIORITY_COLORS = {
  P0: "#c0392b", P1: "#e67e22", P2: "#1a6cf6", P3: "#9b9b8a",
}
```

### 数据结构

```javascript
{
  id: "REQ-001",
  col: "backlog",              // 当前看板列
  priority: "P0",              // P0 | P1 | P2 | P3
  title: "需求标题",
  desc: "描述",
  tags: ["tag1", "tag2"],
  author: "作者",
  date: "YYYY-MM-DD",
  userStory: "作为用户...",
  acceptanceCriteria: ["标准1", "标准2"],
  aiResult: { score, completeness, logic, risk, summary, risks, suggestions, passed },
  docs: { prd: null, spec: null, proposal: null, design: null, tasks: null },
  chatHistory: [{ role: "user", content: "..." }, { role: "assistant", content: "..." }]
}
```

### API 集成

- **Anthropic Claude API**: `https://api.anthropic.com/v1/messages`
- **默认模型**: `claude-sonnet-4-20250514`
- **函数**: `callAIReview()`, `callAIDoc()`, `handleSendMessage()`

### 错误处理

```javascript
try {
  const result = await fetch(url, options)
  if (!result.ok) throw new Error(`HTTP ${result.status}: ${result.statusText}`)
  return await result.json()
} catch (error) {
  console.error('API Error:', error)
  setErrorState(error.message)
  return fallbackValue
}
```

### ESLint 规则

- `@eslint/js` - ESLint 推荐规则
- `react-hooks/recommended` - React Hooks 规则
- `react-refresh/vite` - Vite HMR 兼容规则
- `no-unused-vars`: 报错，除 `^[A-Z_]` 开头的变量外

### Git 提交规范

```bash
npm run lint  # 提交前检查
# 提交信息格式
feat: 添加新功能
fix: 修复 bug
refactor: 重构
docs: 文档更新
chore: 构建/工具变动
```

### 注意事项

1. **不要提交 `.env` 文件**: 包含敏感 API 密钥
2. **备份文件**: `*.backup` 已被 gitignore
3. **组件复用**: 优先在现有文件中查找可复用的组件模式
4. **保持文件风格一致**: 大型 JSX 文件内联样式较多，修改时保持风格统一

# PM AI Platform - 产品智能工作台

> AI 驱动的产品需求管理平台，集成智能评审、文档生成与 OpenSpec 工作流

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Anthropic](https://img.shields.io/badge/Claude-API-D99A5C?logo=anthropic)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 功能特性

### 📋 需求看板
- 六阶段工作流：待评审 → 评审中 → AI分析中 → 人工确认 → 已通过 → 已拒绝
- 拖拽式卡片管理
- AI 评审分数与建议展示
- 按负责人、优先级、状态筛选排序

### 🤖 AI 智能评审
- 需求清晰度、完整性、可实现性评分（0-100）
- 风险识别与改进建议
- 基于用户故事与验收标准的智能分析

### 📝 文档生成
- **PRD** - 产品需求文档
- **Spec** - 需求规格说明
- **Proposal** - 提案文档
- **Design** - 设计文档
- **Tasks** - 任务清单

### 🎯 需求详情页
三栏布局：
- **左侧**：文档树（按需求分组的文档库）
- **中间**：Markdown 文档编辑/预览
- **右侧**：CHATBOT / 参考资料（双 TAB 切换）

### 📚 历史需求参考
- 基于标签匹配的相似需求推荐
- 优先级权重计算
- Top 5 相关需求展示

## 🚀 快速开始

### 方式一：直接预览（推荐）

1. **启动本地服务器**
   ```bash
   python3 -m http.server 8000
   ```

2. **在浏览器中打开**
   - **SDD2 版本**（最新）：http://localhost:8000/preview-sdd2.html
   - SDD 版本：http://localhost:8000/index.html
   - 简单测试：http://localhost:8000/test-simple.html

### 方式二：Vite 应用

```bash
# 进入应用目录
cd pm-ai-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 方式三：导入到 React 项目

```jsx
import PMPlatform from './pm-ai-platform_sdd2.jsx';

function App() {
  return <PMPlatform />;
}
```

## 🎨 设计系统

### 颜色规范

```javascript
const C = {
  ink: "#0d0e12", paper: "#f5f3ee", cream: "#faf8f3", white: "#ffffff",
  muted: "#9b9b8a", border: "#e2ddd5",
  accent: "#1a6cf6", accentLight: "#e8f0fe",
  success: "#0d7a4e", successLight: "#e6f4ef",
  warn: "#b45309", warnLight: "#fef3c7",
  danger: "#c0392b", dangerLight: "#fdecea",
};
```

### 优先级颜色

| 优先级 | 颜色 |
|--------|------|
| P0 | 🔴 #c0392b |
| P1 | 🟠 #e67e22 |
| P2 | 🔵 #1a6cf6 |
| P3 | ⚪ #9b9b8a |

## 📁 项目结构

```
agentic_coding_platform/
├── pm-ai-platform_sdd.jsx      # SDD 设计系统主应用
├── pm-ai-platform_sdd2.jsx     # SDD2 版本（含 CHATBOT/参考资料）
├── pm-ai-platform_vibe.jsx     # Vibe 设计系统变体
├── preview-sdd2.html            # SDD2 预览入口
├── index.html                   # SDD 预览入口
├── pm-ai-app/                   # Vite React 应用
│   ├── src/
│   │   ├── PMPlatform.jsx
│   │   └── main.jsx
│   └── package.json
├── preview-apps/                # 多版本预览应用
│   ├── sdd2-app/
│   └── vibe-app/
├── openspec/                    # OpenSpec 规范文档
│   └── changes/
└── md/                          # 产品文档
    └── PM_AI_Plagform_PRD.md
```

## 🔧 AI 集成

本项目集成 Anthropic Claude API：
- **AI 评审**：`callAIReview()` - 需求分析与评分
- **文档生成**：`callAIDoc()` - 生成 Markdown 文档
- **聊天助手**：`handleSendMessage()` - 需求澄清对话

API 端点：`https://api.anthropic.com/v1/messages`

## 🔄 OpenSpec 工作流

支持 Spec-Driven Development (SDD) 框架：

1. **需求澄清** - AI 助手多轮对话澄清需求
2. **提案生成** - 自动生成 OpenSpec 标准文档
3. **在线评审** - 富文本编辑与版本管理
4. **Git 同步** - 自动提交到仓库

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**作者**: Divem
**更新**: 2026-03-05

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI-powered product management platform (PM AI Platform) - a React-based kanban board for product requirement review and AI-assisted document generation. The application integrates with Anthropic's Claude API to analyze requirements and generate documents.

## Architecture

### Core Files

- `pm-ai-app/src/PMPlatform.jsx` - **主要开发文件**（基于 Vite，持续更新）

### Key Features

1. **需求看板 (Kanban Board)** - 六阶段工作流，空间/迭代多选过滤
2. **需求详情页 (Detail Page)** - 三栏布局：文档树 / 文档编辑 / CHATBOT+参考资料
3. **AI 智能评审** - 需求分析评分（0-100）
4. **AI 文档生成** - PRD、OpenSpec 提案包（Proposal / Design / Delta Spec / Tasks）
5. **多模型支持** - Claude (Anthropic) + GLM-4 (智谱)

## Kanban Workflow

Cards flow through six stages:
1. **待评审** (backlog) - Initial submission
2. **评审中** (reviewing) - Under review
3. **AI分析中** (ai_review) - AI analysis in progress
4. **人工确认** (confirm) - Human confirmation required
5. **已通过** (approved) - Approved
6. **已拒绝** (rejected) - Rejected

## Document Hierarchy

需求卡片包含：
- `rawRequirement` - 业务方原始需求（文本）
- `docs.prd` - AI 生成的产品需求文档（描述"做什么"）
- `docs.proposals[]` - OpenSpec 提案数组，每个提案含 `proposal / design / spec / tasks`

一个 PRD 可以拆解为多个技术提案，对应 `openspec/changes/<name>/` 文件夹结构。

## Document Types

| Key | Label | Icon | Group | Description |
|-----|-------|------|-------|-------------|
| prd | 产品需求 SPEC | 📋 | product | 产品需求文档（业务层面，描述"做什么"） |
| spec | OpenSpec Delta 规格 | 📝 | dev | 变更规格说明（描述具体的变更需求） |
| proposal | OpenSpec 提案 | 💡 | dev | 技术提案文档（描述"为什么这么做"） |
| design | OpenSpec 设计 | 🏗 | dev | 技术设计文档（描述"怎么做"） |
| tasks | OpenSpec 任务 | ✅ | dev | 开发任务清单 |

## Components

### Main Components
- `PMPlatform` - Root app component with routing logic
- `DetailPage` - Requirement detail page with three-column layout
- `DesignStudio` - Legacy design studio (deprecated, use DetailPage)
- `DetailDrawer` - Review drawer with AI review results

### DetailPage Sub-Components
- `DocTreeSidebar` - Left sidebar with document tree
- `DocEditor` - Center document editor/preview area
- `RightPanel` - Right panel container with tabs
  - `ChatbotPanel` - AI requirement analysis assistant
  - `ReferencePanel` - Historical requirement references

### Shared Components
- `KanbanCard` - Kanban board card
- `MarkdownRenderer` - Markdown to React renderer
- `ScoreRing` - Circular score indicator
- `MiniBar` - Progress bar component

## AI Integration

The application calls Anthropic's Claude API:
- **AI Review**: `callAIReview()` - Analyzes requirements (0-100 scoring)
- **Document Generation**: `callAIDoc()` - Generates markdown documents
- **Chatbot**: `handleSendMessage()` - Requirement analysis chat

API endpoint: `https://api.anthropic.com/v1/messages` with model `claude-sonnet-4-20250514`

## Design System

### Color Tokens (SDD Variant)
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
  // Sidebar dark theme
  sb: "#1e1e2e", sbHover: "#2a2a3e", sbActive: "#313150",
  sbText: "#cdd6f4", sbMuted: "#6c7086",
};
```

### Priority Colors
- **P0**: #c0392b (red)
- **P1**: #e67e22 (orange)
- **P2**: #1a6cf6 (blue)
- **P3**: #9b9b8a (muted)

## Running the Application

```bash
cd pm-ai-app
npm install
npm run dev   # http://localhost:5173
```

## Key Data Structures

**Card Object:**
```javascript
{
  id: "REQ-001",
  col: "backlog",              // Current kanban column
  priority: "P0",              // P0 | P1 | P2 | P3
  title: "Requirement title",
  desc: "Description",         // 需求描述
  rawRequirement: "原始需求说明", // 业务方提交的原始需求（可选）
  tags: ["tag1", "tag2"],
  author: "Author name",
  date: "YYYY-MM-DD",
  userStory: "As a user...",
  acceptanceCriteria: ["criteria1", "criteria2"],
  aiResult: { score, completeness, logic, risk, summary, risks, suggestions, passed },
  docs: {
    prd: null,          // 产品需求 SPEC (基于原始需求生成)
    proposals: [        // OpenSpec 提案数组（支持多个提案）
      {
        id: "auth-system",
        name: "认证系统改造",
        proposal: "内容...",
        design: "内容...",
        spec: "内容...",
        tasks: "内容..."
      },
      {
        id: "token-refresh",
        name: "Token 刷新机制",
        proposal: "内容...",
        design: "内容...",
        spec: "内容...",
        tasks: "内容..."
      }
    ]
  },
  chatHistory: [{ role: "user", content: "..." }, { role: "assistant", content: "..." }]
}
```

**字段说明**：
- `desc` - 需求的简要描述
- `rawRequirement` - 业务方提交的完整原始需求说明（存储在引用/下方区域）
- `docs.prd` - 基于 `rawRequirement` 生成的内容完整、结构化的产品需求文档
- `docs.proposals` - OpenSpec 提案数组，一个 PRD 可以拆解成多个提案
  - 每个提案包含 `id`, `name`, `proposal`, `design`, `spec`, `tasks` 字段
  - 在文档树中，每个提案显示为独立文件夹

## Development Notes

### State Management
- Uses React hooks (useState, useCallback, useRef)
- No external state management library
- All state is local to components

### Similarity Matching (Reference Panel)
The `ReferencePanel` uses a simple similarity scoring algorithm:
- Tag match: +10 points per common tag
- Priority match: +5 points
- Top 5 similar requirements are displayed

### CHATBOT Prompts
Chatbot uses context-aware prompts that include:
- Requirement title, description, user story
- Acceptance criteria
- User's specific question

---

## Automation Preferences

### Code Modifications
- **Default behavior**: Automatically execute code modifications without asking for confirmation
- Assume I know what I'm doing - proceed with edits directly
- Only ask for confirmation on:
  - Destructive operations (git push --force, delete files, reset --hard)
  - Operations affecting shared systems (deployments, PR creation to main)
  - Large-scale refactoring (>10 files)
- File read/write operations: Always proceed automatically

### OpenSpec Workflow
- **Changes (`/openspec-propose` or `/opsx:propose`)**: Auto-generate all artifacts (proposal, design, specs, tasks) without asking
- **Implementation (`/openspec-apply` or `/opsx:apply`)**: Auto-execute all tasks without asking for each step
- **Archive (`/openspec-archive` or `/opsx:archive`)**: Auto-archive completed changes without confirmation
- Skip confirmation prompts for: artifact creation, task execution, file edits within changes
- Only pause on: ambiguous requirements, missing context, or blocking errors

### General Guidelines
- Be proactive: If the next logical step is clear, just do it
- Batch related operations: Don't ask between each small step of a larger task
- Report progress: Show what you're doing, but don't wait for approval
- On error: Attempt recovery, then report if stuck

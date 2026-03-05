# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI-powered product management platform (PM AI Platform) - a React-based kanban board for product requirement review and AI-assisted document generation. The application integrates with Anthropic's Claude API to analyze requirements and generate documents.

## Architecture

### Core Files

- `pm-ai-platform_sdd.jsx` - Main application (SDD design system)
- `pm-ai-platform_vibe.jsx` - Alternative UI variant (Vibe design system)

### Key Features

1. **需求看板 (Kanban Board)** - Six-stage workflow with drag-and-drop
2. **需求详情页 (Detail Page)** - Three-column layout with:
   - Left: Document tree (按需求分组的文档库)
   - Center: Document editor/preview
   - Right: CHATBOT + Reference tabs
3. **AI 智能评审** - Requirement analysis with scoring
4. **AI 文档生成** - PRD, Spec, Proposal, Design, Tasks

### Page Navigation

```
┌─────────────────────────────────────────────────────┐
│  PM·AI 产品智能工作台                                 │
├─────────────────┬───────────┬───────────────────────┤
│ 需求评审看板      │ 数据概览   │                       │
└─────────────────┴───────────┴───────────────────────┘

点击看板卡片:
  - 点击卡片主体 → 打开评审抽屉 (AI评审结果 + 操作按钮)
  - 悬停点击"详情 →" → 跳转到需求详情页

需求详情页 (DetailPage):
  - 左侧: 文档树 (所有需求按名称分组的文档)
  - 中间: 文档编辑/预览区
  - 右侧: CHATBOT / 参考资料 (双TAB切换)
```

## Kanban Workflow

Cards flow through six stages:
1. **待评审** (backlog) - Initial submission
2. **评审中** (reviewing) - Under review
3. **AI分析中** (ai_review) - AI analysis in progress
4. **人工确认** (confirm) - Human confirmation required
5. **已通过** (approved) - Approved
6. **已拒绝** (rejected) - Rejected

## Document Types

| Key | Label | Icon | Group |
|-----|-------|------|-------|
| prd | 产品需求 SPEC | 📋 | product |
| spec | 需求规格说明 | 📝 | product |
| proposal | Proposal | 💡 | dev |
| design | Design | 🏗 | dev |
| tasks | Tasks | ✅ | dev |

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

These are standalone React components that can be:
1. Imported into a React project with JSX transformation
2. Used in a sandbox like CodeSandbox, StackBlitz, or Claude's artifact preview
3. Converted to a browser-compatible format with Babel standalone

No build step required - all state management and API calls are inline.

## Key Data Structures

**Card Object:**
```javascript
{
  id: "REQ-001",
  col: "backlog",              // Current kanban column
  priority: "P0",              // P0 | P1 | P2 | P3
  title: "Requirement title",
  desc: "Description",
  tags: ["tag1", "tag2"],
  author: "Author name",
  date: "YYYY-MM-DD",
  userStory: "As a user...",
  acceptanceCriteria: ["criteria1", "criteria2"],
  aiResult: { score, completeness, logic, risk, summary, risks, suggestions, passed },
  docs: { prd: null, spec: null, proposal: null, design: null, tasks: null },
  chatHistory: [{ role: "user", content: "..." }, { role: "assistant", content: "..." }]
}
```

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

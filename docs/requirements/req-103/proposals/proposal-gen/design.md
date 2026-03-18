# Design: 提案生成模块

## 1. Architecture

### Components
- GenerationOrchestrator: 生成编排器
- PromptBuilder: Prompt 构建器
- ContentGenerator: 内容生成器
- DocumentAssembler: 文档组装器

### Data Model
- GenerationJob: 任务 ID、状态、文档内容
- DocumentVersion: 版本、编辑者、时间戳

## 2. API

- POST /api/v1/generation/start
- GET /api/v1/generation/{job_id}/stream
- PUT /api/v1/generation/{job_id}/documents/{doc_type}

## 3. Tech Stack

- Backend: Python 3.12 + FastAPI
- LLM: Claude Code API
- Editor: Monaco Editor
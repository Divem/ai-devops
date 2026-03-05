import React, { useState, useCallback, useRef } from "react";

/* ════════════════════════════════ API CONFIG ════════════════════════════════════
 *
 * 请在此处配置你的 Anthropic API Key
 * 获取地址: https://console.anthropic.com/settings/keys
 *
 * 配置方式:
 * 1. 直接替换下面的字符串（仅本地开发，不要上传到 Git）
 * 2. 或在浏览器控制台运行: localStorage.setItem('anthropic_api_key', 'your-key')
 * ───────────────────────────────────────────────────────────────────────────────────────── */
const API_KEY = ""; // 👈 在这里填入你的 API Key

/* ═══════════════════════════════════ TOKENS ═══════════════════════════════════ */
const C = {
  ink:"#0d0e12", paper:"#f5f3ee", cream:"#faf8f3", white:"#ffffff",
  muted:"#9b9b8a", border:"#e2ddd5",
  accent:"#1a6cf6", accentLight:"#e8f0fe", accentDark:"#1254c4",
  success:"#0d7a4e", successLight:"#e6f4ef",
  warn:"#b45309", warnLight:"#fef3c7",
  danger:"#c0392b", dangerLight:"#fdecea",
  purple:"#5b4fcf", purpleLight:"#ede9fc",
  teal:"#0891b2", tealLight:"#e0f2fe",
  sb:"#1e1e2e", sbHover:"#2a2a3e", sbActive:"#313150", sbText:"#cdd6f4", sbMuted:"#6c7086",
};

const COLUMNS = [
  {id:"backlog",   label:"待评审",  color:C.muted,  bg:"#f0ede8"},
  {id:"reviewing", label:"评审中",  color:C.accent, bg:C.accentLight},
  {id:"ai_review", label:"AI分析中",color:C.purple, bg:C.purpleLight},
  {id:"confirm",   label:"人工确认",color:C.warn,   bg:C.warnLight},
  {id:"approved",  label:"已通过",  color:C.success,bg:C.successLight},
  {id:"rejected",  label:"已拒绝",  color:C.danger, bg:C.dangerLight},
];

const DOC_TYPES = [
  { key:"prd",      label:"产品需求 SPEC",  icon:"📋", color:"#7c6af7", group:"product" },
  { key:"proposal", label:"Proposal",       icon:"💡", color:"#f59e0b", group:"dev" },
  { key:"design",   label:"Design",         icon:"🏗",  color:"#3b82f6", group:"dev" },
  { key:"tasks",    label:"Tasks",          icon:"✅", color:"#10b981", group:"dev" },
];

const priorityColor = p => ({P0:"#c0392b",P1:"#e67e22",P2:"#1a6cf6",P3:C.muted}[p]||C.muted);
const scoreColor    = s => s>=80?C.success:s>=60?C.warn:C.danger;
const scoreBg       = s => s>=80?C.successLight:s>=60?C.warnLight:C.dangerLight;

/* ═══════════════════════════ DEMO CONTENT ═══════════════════════════════════ */

const DEMO_PRD_KANBAN = `# 需求列表页面（看板视图）

**版本**: V1.0 | **作者**: AI生成 | **日期**: 2026/3/3

## 1. 概述

### 1.1 背景与目标

**背景**: 产品经理团队每日处理大量业务需求，来源分散于 Meego、邮件和即时通讯等渠道，缺乏统一可视化管理工具。需求状态流转依赖人工更新，信息同步滞后，导致评审效率低下。

**目标**:
- **短期目标（3 个月）**: 上线需求看板 V1.0，实现 Meego 需求自动同步、多阶段可视化看板和拖拽式状态流转，将需求流转效率提升 50%。
- **长期目标（6-12 个月）**: 集成 AI 评审评分和多维数据统计，构建端到端的智能需求管理工作台。

### 1.2 产品愿景

打造产品团队一站式需求管理看板，以直观的可视化形式呈现需求全生命周期，让每一条需求都有据可查、有迹可循。

## 2. 用户与场景

### 2.1 目标用户

- **产品经理**: 需要全局掌握需求进度，快速筛选和流转需求。
- **项目管理者**: 需要监控各阶段需求分布，识别瓶颈。
- **业务方**: 可只读查看自己提交的需求处理状态。

### 2.2 用户故事

> 作为一个 产品经理，我希望 在看板上直观看到所有需求的处理阶段，以便 快速了解哪些需求在等待评审、哪些在 AI 分析中。

> 作为一个 产品经理，我希望 通过拖拽操作快速变更需求状态，以便 减少手动更新的操作步骤。

> 作为一个 项目管理者，我希望 按优先级和负责人筛选需求，以便 识别关键需求的进展和潜在瓶颈。

## 3. 功能需求

### 3.1 核心功能

**功能点 1**: 多列看板视图
- **描述**: 采用 6 列看板形式，包括"待评审""评审中""AI分析中""人工确认""已通过""已拒绝"。
- **业务逻辑**: 需求卡片在列之间可拖拽流转，状态自动更新并记录变更时间。
- **输入**: 用户拖拽操作。
- **输出**: 需求状态实时更新。

**功能点 2**: 需求卡片展示
- **描述**: 每张卡片展示需求编号、优先级、标题、标签、日期、负责人、AI 评审分数等关键信息。

**功能点 3**: Meego 数据同步
- **描述**: 定时（每 15 分钟）从 Meego 平台拉取新增和变更的业务需求，自动映射到看板中。

### 3.2 扩展功能（可选）

- 支持自定义看板列和状态名称。
- 需求分组视图（按负责人、标签、优先级分组）。
- 看板 WIP 限制（在制品数量限制）。

## 4. 非功能性需求

### 4.1 性能要求
- 看板页面加载时间 ≤ 1 秒（含 50 张卡片）。
- 拖拽操作响应时间 ≤ 200ms。

### 4.2 安全性要求
- 仅授权用户可修改需求状态。

### 4.3 可用性要求
- 支持 Chrome 90+ 和 Edge 90+。

## 5. 风险与挑战

- **Meego 接口变更**: 同步机制强依赖 Meego API 稳定性。应对措施：增加重试和告警机制。
- **看板性能**: 需求数量过多时渲染可能卡顿。应对措施：虚拟滚动和分页加载。`;

const DEMO_PRD_AI = `# AI 需求澄清模块

**版本**: V1.0 | **作者**: AI生成 | **日期**: 2026/3/3

## 1. 概述

### 1.1 背景与目标

**背景**: 产品经理在需求评审中面临两大难题——需求描述不完整导致来回沟通成本高，人工评审受主观因素影响导致一致性差。当前从需求提出到评审通过平均耗时 5 个工作日，其中 60% 时间花在需求澄清上。

**目标**:
- **短期目标**: 通过 AI 助手实现智能化需求澄清，将澄清周期从 3 天缩短至 30 分钟以内。
- **长期目标**: 构建持续学习的 AI 评审引擎，评审准确度对标高级产品经理水平。

### 1.2 产品愿景

让 AI 成为产品经理的智能搭档，通过多轮对话自动挖掘需求盲点、评估需求质量，让每一条需求都经过严格且高效的"体检"。

## 2. 用户与场景

### 2.1 目标用户

- **产品经理**: 与 AI 对话澄清需求细节，获取 AI 评审结果和改进建议。
- **需求提交者**: 通过 AI 引导补充必要信息，提升需求质量。

### 2.2 用户故事

> 作为一个 产品经理，我希望 AI 助手能主动发现我的需求中缺失的关键信息，以便 我能快速补全需求、减少后续返工。

> 作为一个 产品经理，我希望 AI 能对需求的完整性和可实现性给出量化评分，以便 我能客观判断是否可以进入开发阶段。

## 3. 功能需求

### 3.1 核心功能

**功能点 1**: AI 多轮对话澄清
- **描述**: 集成在需求详情页的聊天界面，AI 主动提出关键问题，如"目标用户是谁？""核心业务流程是什么？""有哪些异常情况？"
- **业务逻辑**: AI 根据已有需求内容分析缺失维度 → 生成针对性问题 → 用户回答后更新结构化草案 → 持续迭代直至需求完整度达标。
- **输入**: 用户自然语言回答、需求上下文。
- **输出**: 结构化需求草案、完整度评分。

**功能点 2**: AI 评审与评分
- **描述**: 从完整性、逻辑性、风险三个维度对需求进行 0-100 评分，并给出"建议通过"或"建议修改"的结论。
- **业务逻辑**: AI 读取需求全文 → 多维评估 → 输出评审报告（含评分、风险点、改进建议）。

**功能点 3**: UI 弹框确认
- **描述**: 当 AI 需要产品经理做关键决策时，通过 Modal 弹框呈现（如"是否需要支持多语言？"），确保重要信息不被对话流淹没。

## 4. 非功能性需求

### 4.1 性能要求
- AI 首轮回复延迟 ≤ 3 秒。
- 支持至少 50 路并发对话。

### 4.2 安全性要求
- 对话内容不泄露至外部系统。
- 支持对话记录审计。

## 5. 风险与挑战

- **AI 评审准确度**: 初期模型可能存在评估偏差。应对措施：引入人工复核反馈环。
- **对话体验**: 过多追问可能导致用户厌烦。应对措施：限制单次对话最多 8 轮，未完成项汇总提示。`;

const DEMO_PROPOSAL_SPEC = `# Proposal: 规范框架扩展模块

**提案 ID**: PROPOSAL-REQ-003 | **版本**: 1.0 | **日期**: 2026/3/3

## 1. Intent（意图）

### 1.1 Problem Statement（问题陈述）

**背景**: 当前团队在需求到设计的转化过程中，设计文档格式不统一——有的团队使用 OpenSpec 规范，有的沿用内部 RFC 模板，还有的直接用飞书文档。这导致文档结构混乱、规范难以维持、知识传承困难。同时，随着 Spec-Driven Development（SDD）理念的推广，市场上涌现了多种 SDD 框架（如 OpenSpec、Open-Kit），团队需要灵活适配不同规范以满足不同项目的需求。

**影响**: 
- 设计文档质量参差不齐，开发理解成本增加 40%。
- 新人上手时间延长，平均需 2 周才能掌握文档规范。
- 跨团队协作因格式不一致产生大量沟通摩擦。

### 1.2 Goal（目标）

**业务目标**: 
- 上线后 3 个月内，90% 的设计文档通过规范化模板生成，减少格式问题相关沟通 60%。
- 支持至少 2 种 SDD 框架的一键切换。

**用户目标**: 
- 产品经理可一键选择目标规范框架，无需手动调整文档格式。
- 新增规范框架通过插件化接入，无需修改核心代码。

## 2. Scope（范围）

### 2.1 In Scope（包含范围）

- 规范框架管理后台（框架列表、模板配置、版本管理）。
- 插件化框架接入机制设计与实现。
- OpenSpec 框架适配器实现（含 proposal.md / design.md / specs/delta.md / tasks.md）。
- 规范适配器接口定义，将 AI 结构化输出转换为特定框架格式。

### 2.2 Out of Scope（不包含范围）

- Open-Kit 等其他 SDD 框架的具体适配——V2.0 迭代。
- 自定义框架的在线可视化编辑器——后续迭代。
- 框架间的自动转换（如 OpenSpec → Open-Kit）。

## 3. Approach（方法）

### 3.1 High-Level Solution（高层解决方案）

采用"适配器模式 + 模板引擎"的架构设计：

1. **框架注册中心**: 管理所有已接入的 SDD 框架元数据，包括名称、版本、模板列表、渲染规则。
2. **规范适配器接口**: 定义统一的 \`SpecAdapter\` 接口，每种框架实现自己的适配器，负责将通用结构化需求数据转换为框架特定格式。
3. **模板引擎**: 基于 Handlebars/Mustache 的模板渲染引擎，根据框架模板和填充数据生成最终文档。
4. **Prompt 库集成**: 为每种框架维护专属的 Prompt 模板，指导 AI 生成符合该框架规范的内容。

### 3.2 Alternatives（备选方案）

- **方案 B**: 硬编码所有框架逻辑
  - 优点：实现简单，首版快。
  - 缺点：扩展性差，新增框架需修改大量核心代码。

## 4. Dependencies（依赖）

- AI 引擎层：Claude Code API，用于根据不同框架 Prompt 生成对应格式内容。
- 前端团队：OpenSpec Markdown 渲染组件开发。
- 架构组：插件化框架的技术选型评审。

## 5. Risks（风险）

- **适配器复杂度**: 不同框架差异较大，适配器维护成本可能超预期。应对策略：先聚焦 OpenSpec，总结通用模式后再拓展。
- **Prompt 工程不稳定**: 不同框架的 Prompt 效果差异大。应对策略：建立评测集，定期回归。

## 6. Metrics（度量指标）

- 框架切换成功率 ≥ 99%。
- 生成文档格式合规率 ≥ 95%（基于人工抽检）。
- 新框架接入平均周期 ≤ 3 个工作日。

## 7. Open Questions（开放问题）

- Q1：是否需要支持自定义模板的在线编辑和热更新？
- Q2：不同框架间的字段映射关系如何维护？是否需要一个映射管理界面？`;

const DEMO_DESIGN_PROPOSAL = `# Design: 提案生成模块

**设计 ID**: DESIGN-REQ-004 | **关联提案**: PROPOSAL-REQ-004 | **版本**: 1.0 | **日期**: 2026/3/3

## 1. Overview（概述）

本设计文档描述"提案生成模块"的技术方案，该模块负责将 AI 澄清后的结构化需求数据，结合选定的 SDD 规范框架，一键生成完整的提案文档包（proposal.md、design.md、specs/delta.md、tasks.md）。

## 2. Architecture Design（架构设计）

### 2.1 System Context（系统上下文）

提案生成模块处于 AI 引擎层与展现层之间：
- **上游**: AI 需求澄清模块输出的结构化需求草案。
- **下游**: 提案评审界面（在线预览和编辑）、Git 同步服务。
- **依赖**: 规范框架扩展模块（提供模板和适配器）、Claude Code API（生成内容）。

### 2.2 Component Diagram（组件图）

- **GenerationOrchestrator（生成编排器）**: 协调整个文档生成流程，管理生成状态和并发。
- **PromptBuilder（Prompt 构建器）**: 根据结构化需求数据和规范模板，组装最终发送给 LLM 的 Prompt。
- **ContentGenerator（内容生成器）**: 调用 Claude Code API 生成文档内容，支持流式输出。
- **DocumentAssembler（文档组装器）**: 将 AI 生成的原始内容按规范模板结构组装为最终 Markdown 文件。
- **PreviewRenderer（预览渲染器）**: 将 Markdown 渲染为可预览的 HTML，嵌入在线编辑器。

### 2.3 Data Model（数据模型）

- **GenerationJob（生成任务）**:
  - \`id\` (string, PK): 任务唯一标识
  - \`requirement_id\` (string, FK): 关联需求 ID
  - \`framework\` (string): 使用的规范框架名称
  - \`status\` (enum): PENDING / GENERATING / COMPLETED / FAILED
  - \`documents\` (JSON): 生成的文档内容 map
  - \`created_at\` / \`completed_at\` (timestamp)

- **DocumentVersion（文档版本）**:
  - \`id\` (string, PK)
  - \`job_id\` (string, FK)
  - \`doc_type\` (enum): proposal / design / spec / tasks
  - \`content\` (text): Markdown 内容
  - \`version\` (int)
  - \`edited_by\` (string)
  - \`created_at\` (timestamp)

## 3. Technical Solution（技术方案）

### 3.1 Key Technologies（关键技术选型）

- **后端**: Python 3.12 + FastAPI（与 AI 引擎层保持一致）
- **LLM**: Claude Code API（Sonnet 模型，平衡速度与质量）
- **模板引擎**: Jinja2（构建 Prompt 模板）
- **Markdown 解析**: remark + rehype（前端渲染）
- **实时通信**: Server-Sent Events（SSE）用于流式输出进度

选型理由：FastAPI 原生支持异步和 SSE，适合长时间 LLM 调用场景；Jinja2 与 Python 深度集成，模板维护便捷。

### 3.2 API Definitions（接口定义）

- \`POST /api/v1/generation/start\` — 启动文档生成
  - Request: \`{ "requirement_id": "string", "framework": "openspec", "doc_types": ["proposal", "design"] }\`
  - Response: \`{ "job_id": "string", "status": "PENDING" }\`

- \`GET /api/v1/generation/{job_id}/stream\` — SSE 流式获取生成进度
  - Event: \`{ "doc_type": "proposal", "status": "generating|completed", "content_chunk": "..." }\`

- \`PUT /api/v1/generation/{job_id}/documents/{doc_type}\` — 保存编辑后的文档
  - Request: \`{ "content": "markdown string" }\`

### 3.3 Business Logic（业务逻辑）

生成流程：
1. 用户点击"生成提案" → 创建 GenerationJob（状态 PENDING）。
2. GenerationOrchestrator 读取结构化需求草案 + 规范模板。
3. PromptBuilder 按文档类型组装 Prompt（每种文档独立 Prompt）。
4. ContentGenerator 按顺序调用 Claude API：proposal → design → spec → tasks。
5. 每完成一个文档，通过 SSE 推送至前端渲染。
6. 全部完成后状态变为 COMPLETED，用户可进入编辑模式。

### 3.4 Error Handling（错误处理）

- LLM 调用超时（30s）：自动重试 1 次，仍失败则标记该文档为 FAILED，其他文档继续生成。
- 内容格式异常：后处理模块校验 Markdown 结构，补充缺失的标题层级。
- 并发保护：同一需求同时只允许一个生成任务。

## 4. Deployment（部署）

- 与 AI Engine Service 同集群部署，共享 GPU 推理节点。
- 生成任务通过 Redis Queue 进行排队和调度。
- 日志接入 ELK，监控生成耗时和成功率。

## 5. Security Considerations（安全考量）

- 生成内容不持久化用户敏感信息（需求中的敏感词在 Prompt 组装时脱敏）。
- 仅需求负责人和管理员可触发生成操作。

## 6. Performance Considerations（性能考量）

- 4 个文档串行生成预计总耗时 20-40 秒，通过 SSE 流式输出让用户逐步看到结果。
- Prompt 模板预编译并缓存，避免每次重新解析。

## 7. Test Strategy（测试策略）

- 单元测试：覆盖 PromptBuilder 的模板组装逻辑和 DocumentAssembler 的格式校验。
- 集成测试：Mock Claude API，验证端到端生成流程。
- 质量评测：构建 50 组需求样本，人工评审生成文档的专业度和完整度。

## 8. Open Questions（开放问题）

- OQ-1：是否需要支持用户选择性生成（如只生成 proposal 不生成 design）？
- OQ-2：生成文档的版本历史保留多少个版本？建议最多 10 个。`;

const DEMO_TASKS_GIT = `# Tasks: Git 同步与版本管理模块

**任务清单 ID**: TASKS-REQ-006 | **关联提案**: PROPOSAL-REQ-006 | **版本**: 1.0 | **日期**: 2026/3/3

## 1. Overview（概述）

本任务清单将 Git 同步与版本管理模块的设计方案分解为可执行的原子开发任务，覆盖后端 Git 操作封装、前端同步界面、数据库适配和 DevOps 配置。目标是实现产品经理确认提案后一键同步至 Git 仓库的完整流程。

## 2. Development Tasks（开发任务）

### 2.1 Backend Tasks（后端任务）

- **TASK-BE-001**: Git 操作封装层开发
  - **描述**: 基于 go-git 库封装 Git 操作能力，包括 clone/pull/commit/push/branch 管理。支持 GitHub、GitLab、Gitee 三种平台的 HTTPS 和 SSH 认证方式。
  - **关联需求**: REQ-006
  - **预期工时**: 24h
  - **状态**: 待开始

- **TASK-BE-002**: 文件同步服务开发
  - **描述**: 实现提案文件到 Git 仓库的同步逻辑——将 proposal.md、design.md、specs/delta.md、tasks.md 写入 \`openspec/changes/<change-name>/\` 目录，生成标准化 Commit Message（格式：\`feat(openspec): add <requirement-id> proposal\`），并执行 push。
  - **关联需求**: REQ-006
  - **预期工时**: 16h
  - **状态**: 待开始

- **TASK-BE-003**: PR/MR 自动创建服务
  - **描述**: 对接 GitHub API (v3) / GitLab API (v4) / Gitee API，实现同步后自动创建 Pull Request 或 Merge Request。PR 内容包含需求摘要、变更文件列表和 AI 评审评分。
  - **关联需求**: REQ-006
  - **预期工时**: 20h
  - **状态**: 待开始

- **TASK-BE-004**: Git 配置管理 API
  - **描述**: 开发仓库配置的 CRUD API，包括仓库地址、认证信息（加密存储）、默认分支、提交者信息等。支持连接测试（验证 clone 权限）。
  - **关联需求**: REQ-006
  - **预期工时**: 12h
  - **状态**: 待开始

- **TASK-BE-005**: 状态回写与冲突检测
  - **描述**: Git 操作完成后，将 Commit SHA 和 PR/MR 链接回写到需求记录中。在 push 前检测远程分支是否有冲突，有冲突时返回预警信息而非直接失败。
  - **关联需求**: REQ-006
  - **预期工时**: 12h
  - **状态**: 待开始

### 2.2 Frontend Tasks（前端任务）

- **TASK-FE-001**: Git 同步操作界面
  - **描述**: 在提案确认页面新增"同步至 Git"按钮和进度弹窗，展示同步状态（准备中 → 提交中 → 推送中 → 创建 PR → 完成）。完成后展示 Commit 链接和 PR 链接。
  - **预期工时**: 12h
  - **状态**: 待开始

- **TASK-FE-002**: Git 仓库配置页面
  - **描述**: 开发管理后台中的 Git 仓库配置页面，包含仓库地址输入、认证方式选择（HTTPS Token / SSH Key）、默认分支设置、连接测试按钮。使用表单校验确保配置完整性。
  - **预期工时**: 10h
  - **状态**: 待开始

- **TASK-FE-003**: 需求详情中的 Git 信息展示
  - **描述**: 在需求详情页新增 Git 同步状态卡片，展示最近一次同步的 Commit SHA（可点击跳转）、PR 状态（Open/Merged/Closed）、同步时间。
  - **预期工时**: 6h
  - **状态**: 待开始

### 2.3 Data/DB Tasks（数据/数据库任务）

- **TASK-DB-001**: Git 配置与同步记录表设计
  - **描述**: 设计 git_configs 表（仓库配置）和 git_sync_records 表（同步历史记录），包含仓库 URL、认证加密凭据、关联需求 ID、Commit SHA、PR URL、同步状态和时间戳。编写迁移脚本。
  - **预期工时**: 6h
  - **状态**: 待开始

### 2.4 Other Tasks（其他任务）

- **TASK-OT-001**: Git 集成端到端测试环境搭建
  - **描述**: 搭建 GitLab CE 测试实例（Docker 部署），配置测试仓库和测试用户。编写 E2E 测试用例覆盖：配置 → 同步 → PR 创建 → 状态回写全流程。
  - **预期工时**: 8h
  - **状态**: 待开始

- **TASK-OT-002**: 安全审计 — 凭据管理方案评审
  - **描述**: 与安全团队协作，评审 Git 认证凭据的加密存储方案（建议使用 Vault），确保 Token/SSH Key 不以明文存储，访问日志完整可审计。
  - **预期工时**: 4h
  - **状态**: 待开始

## 3. Open Questions（开放问题）

- OQ-T1：是否需要支持 Git 仓库的 SSH 方式连接？初步建议 V1.0 仅支持 HTTPS + Token，SSH 在 V1.5 支持。
- OQ-T2：PR/MR 模板是否需要支持自定义？建议 V1.0 使用固定模板，后续迭代支持配置化。
- OQ-T3：并发同步场景下是否需要加锁？建议同一需求同时只允许一个同步任务。`;

/* ═══════════════════════════════ API ══════════════════════════════════════ */
async function callClaude(prompt, maxTokens=1800) {
  const apiKey = API_KEY || localStorage.getItem('anthropic_api_key') || "";
  if (!apiKey) {
    console.error("请先配置 API Key");
    return "错误：未配置 API Key。请在代码顶部设置 API_KEY，或在浏览器控制台运行：\nlocalStorage.setItem('anthropic_api_key', 'your-key-here')";
  }
  const res = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,messages:[{role:"user",content:prompt}]}),
  });
  const data = await res.json();
  if (data.error) {
    console.error("API Error:", data.error);
    return `错误：${data.error.message}`;
  }
  return data.content?.map(b=>b.text||"").join("")||"";
}

async function callAIReview(card) {
  const text = await callClaude(`你是资深产品经理评审专家。请对以下需求评审，从完整性、逻辑性、风险三个维度打分（0-100）。
需求ID: ${card.id} | 标题: ${card.title} | 描述: ${card.desc} | 用户故事: ${card.userStory} | 验收标准: ${card.acceptanceCriteria.join("；")}
严格按JSON返回：{"score":<0-100>,"completeness":<0-100>,"logic":<0-100>,"risk":<0-100>,"summary":"<2-3句>","risks":["<r1>","<r2>","<r3>"],"suggestions":["<s1>","<s2>","<s3>"],"passed":<bool,>=70为true>}`);
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

const DOC_PROMPTS = {
  prd: (card) => `你是资深产品经理。根据以下需求信息，生成标准PRD文档内容（Markdown格式）。

需求标题: ${card.title}
需求描述: ${card.desc}
用户故事: ${card.userStory}
验收标准: ${card.acceptanceCriteria.join("；")}
标签: ${card.tags.join("、")}

请生成完整的Markdown格式PRD，包含以下章节，内容丰富专业：

# ${card.title}

**版本**: V1.0 | **作者**: AI生成 | **日期**: ${new Date().toLocaleDateString("zh-CN")}

## 1. 概述

### 1.1 背景与目标

**背景**: ${card.desc}

**目标**: [详细描述短期和长期目标]

### 1.2 产品愿景

[一句话愿景]

## 2. 用户与场景

### 2.1 目标用户

[用户画像描述]

### 2.2 用户故事

${card.userStory}

### 2.3 使用场景

[描述典型使用场景]

## 3. 功能需求

### 3.1 核心功能

- **功能1**: [功能名称]
  - **描述**: [详细描述]
  - **优先级**: P0/P1/P2

### 3.2 非功能需求

- **性能**: [性能要求]
- **安全**: [安全要求]
- **兼容性**: [兼容性要求]

## 4. 验收标准

${card.acceptanceCriteria.map((c, i) => `${i + 1}. ${c}`).join("\n")}

## 5. 限制与约束

[技术、业务、时间等约束]

请直接输出Markdown内容，内容要具体、专业，不要使用占位符。`,

  proposal: (card) => `你是技术提案专家。根据以下需求生成 OpenSpec 格式的 Proposal 文档。

需求: ${card.title} - ${card.desc}

生成 proposal.md，包含：

# Proposal: ${card.title}

## Intent (意图)

[我们想要达成什么目标？]

## Scope (范围)

- **In Scope**: [包含的内容]
- **Out of Scope**: [明确不包含的内容]

## Approach (方法)

[我们计划如何实现？]

## Alternatives Considered (备选方案)

- **方案A**: [描述]
- **方案B**: [描述]

## Risks & Mitigation (风险与缓解)

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| ... | ... | ... |

请直接输出Markdown内容。`,

  design: (card) => `你是技术设计专家。根据以下需求生成 Design 文档。

需求: ${card.title} - ${card.desc}

生成 design.md，包含：

# Design: ${card.title}

## Overview (概览)

[系统架构概览]

## Technical Solution (技术方案)

### 前端架构

### 后端架构

### 数据模型

## API Definitions (接口定义)

\`\`\`typescript
// API 接口定义
\`\`\`

## Data Flow (数据流)

[描述关键数据流]

## Security & Privacy (安全与隐私)

[安全考虑]

请直接输出Markdown内容。`,

  tasks: (card) => `你是项目管理专家。根据以下需求生成任务清单。

需求: ${card.title} - ${card.desc}

生成 tasks.md，包含：

# Tasks: ${card.title}

## Backend Tasks（后端任务）

- **TASK-BE-001**: [任务名称]
  - **描述**: [详细描述]
  - **预期工时**: [Xh]
  - **状态**: 待开始

## Frontend Tasks（前端任务）

- **TASK-FE-001**: [任务名称]
  - **描述**: [详细描述]
  - **预期工时**: [Xh]
  - **状态**: 待开始

## Testing Tasks（测试任务）

- **TASK-T-001**: [测试任务]
  - **描述**: [测试场景]
  - **预期工时**: [Xh]
  - **状态**: 待开始

请直接输出Markdown内容，工时和任务标题请根据需求合理填写。`
};

async function callAIDoc(card, docType) {
  const prompt = DOC_PROMPTS[docType](card);
  return await callClaude(prompt, 2000);
}

/* ═══════════════════════════ INITIAL DATA ═══════════════════════════════════ */
const mkDocs = () => ({ prd:null, proposal:null, design:null, tasks:null });
const INITIAL_CARDS = [
  {id:"REQ-001",col:"confirm",priority:"P0",title:"需求列表页面（看板视图）",desc:"提供直观的多列看板视图，展示从 Meego 同步过来的业务需求，支持拖拽流转、筛选排序和 AI 评审分数展示，作为整个智能需求管理工作台的核心入口。",tags:["看板","基础能力","Meego"],author:"张晓薇",date:"2026-02-24",userStory:"作为产品经理，我希望在看板上直观看到所有需求的处理阶段，以便快速了解哪些需求在等待评审。",acceptanceCriteria:["6列看板：待评审/评审中/AI分析中/人工确认/已通过/已拒绝","支持拖拽需求卡片改变阶段","需求卡片展示编号、优先级、标题、AI评审分数","Meego数据每15分钟自动同步"],aiResult:{score:88,completeness:92,logic:86,risk:84,summary:"需求描述清晰，看板交互定义完整，Meego同步机制考虑周到。建议补充看板性能要求和WIP限制策略。",risks:["Meego API 变更可能导致同步中断","大量需求卡片可能影响渲染性能","拖拽操作在移动端适配困难"],suggestions:["增加看板虚拟滚动方案","明确单列WIP上限","考虑移动端替代交互方案"],passed:true},docs:{prd:DEMO_PRD_KANBAN,proposal:null,design:null,tasks:null},chatHistory:[]},
  {id:"REQ-002",col:"approved",priority:"P0",title:"AI 需求澄清模块",desc:"集成在需求详情页的对话界面，产品经理与 AI 助手多轮对话澄清需求。AI 主动提问、实时结构化输出、支持 UI 弹框确认，并持续评估需求的完整性、逻辑性和风险。",tags:["AI","对话","核心能力"],author:"李明",date:"2026-02-24",userStory:"作为产品经理，我希望 AI 助手能主动发现需求中缺失的关键信息，以便快速补全需求、减少返工。",acceptanceCriteria:["AI首轮回复延迟≤3秒","支持上下文多轮对话，最多10轮历史","关键确认通过Modal弹框呈现","实时输出结构化需求草案","从完整性/逻辑性/风险三维度评分"],aiResult:{score:91,completeness:94,logic:90,risk:88,summary:"需求定义完整，AI交互流程设计合理，弹框确认机制是亮点。技术可行性评估充分。",risks:["AI 评审准确度需持续校准","过多追问可能导致用户体验下降"],suggestions:["增加对话轮次上限配置","建立AI评审反馈闭环"],passed:true},docs:{prd:DEMO_PRD_AI,proposal:null,design:null,tasks:null},chatHistory:[]},
  {id:"REQ-003",col:"reviewing",priority:"P1",title:"规范框架扩展模块",desc:"支持集成和管理多种 SDD 规范框架（如 OpenSpec、Open-Kit），提供插件化接入机制和规范适配器，将 AI 通用输出转换为特定框架文档格式。",tags:["SDD","插件化","架构"],author:"王芳",date:"2026-02-24",userStory:"作为产品经理，我希望根据项目需求选择合适的规范框架，以便生成的文档符合团队标准。",acceptanceCriteria:["插件化框架接入机制，新框架≤3天接入","V1.0完成OpenSpec适配器","模板可配置，支持版本管理","规范适配器转换准确率≥95%"],aiResult:null,docs:{prd:null,proposal:DEMO_PROPOSAL_SPEC,design:null,tasks:null},chatHistory:[]},
  {id:"REQ-004",col:"ai_review",priority:"P1",title:"提案生成模块",desc:"基于 AI 澄清后的结构化需求，结合选定的规范框架，一键生成 proposal.md、design.md、specs/delta.md、tasks.md 等完整提案文档包。支持流式输出和在线预览编辑。",tags:["AI生成","OpenSpec","核心能力"],author:"陈刚",date:"2026-02-24",userStory:"作为产品经理，我希望一键生成完整的OpenSpec提案包，以便快速进入评审和开发流程。",acceptanceCriteria:["一键生成4类文档（proposal/design/spec/tasks）","支持SSE流式输出，用户可实时看到生成进度","生成完成后支持在线预览和Markdown编辑","生成文档格式合规率≥95%"],aiResult:null,docs:{prd:null,proposal:null,design:DEMO_DESIGN_PROPOSAL,tasks:null},chatHistory:[]},
  {id:"REQ-005",col:"backlog",priority:"P2",title:"提案评审与修改模块",desc:"提供友好的界面供产品经理对 AI 生成的提案进行在线评审、修改和版本管理。支持分屏对比、评论批注和版本历史回溯。",tags:["评审","协作","编辑器"],author:"刘洋",date:"2026-02-24",userStory:"作为产品经理，我希望在平台内直接对AI生成的提案进行修改和批注，以便和团队高效协作。",acceptanceCriteria:["分屏对比：AI草稿 vs 修改版","支持段落级评论批注","版本历史可回溯和恢复","提案状态：草稿→待评审→已确认"],aiResult:null,docs:mkDocs(),chatHistory:[]},
  {id:"REQ-006",col:"confirm",priority:"P1",title:"Git 同步与版本管理模块",desc:"实现 OpenSpec 提案与 Git 仓库的自动化同步。产品经理确认提案后系统自动生成 Git Commit，将文件提交到指定目录下，并可选创建 PR/MR。",tags:["Git","DevOps","集成"],author:"陈刚",date:"2026-02-24",userStory:"作为产品经理，我希望确认提案后一键同步至Git仓库，以便开发人员直接拉取最新设计文档。",acceptanceCriteria:["支持GitHub/GitLab/Gitee三大平台","自动提交至openspec/changes/<name>/目录","可选创建PR/MR并回写链接","Git提交成功率≥99.5%"],aiResult:{score:82,completeness:85,logic:84,risk:76,summary:"需求整体清晰，Git集成方案可行。建议补充凭据安全管理方案和并发同步冲突策略。",risks:["Git凭据安全存储需专门方案","多人同时同步可能产生冲突","网络不稳定导致push失败"],suggestions:["引入Vault管理Git凭据","实现同步任务排队机制","增加push失败重试和告警"],passed:true},docs:{prd:null,proposal:null,design:null,tasks:DEMO_TASKS_GIT},chatHistory:[]},
];

/* ═══════════════════════════════ MARKDOWN RENDERER ═════════════════════════════ */
function MarkdownRenderer({ content }) {
  if (!content) return null;
  const lines = content.split("\n");
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("# ") && !line.startsWith("## ")) {
      elements.push(<h1 key={i} style={{fontSize:26,fontWeight:800,color:C.ink,margin:"0 0 20px",lineHeight:1.3,borderBottom:`2px solid ${C.border}`,paddingBottom:12}}>{renderInline(line.slice(2))}</h1>);
    }
    else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} style={{fontSize:18,fontWeight:700,color:C.ink,margin:"32px 0 12px",borderLeft:`3px solid ${C.accent}`,paddingLeft:12}}>{renderInline(line.slice(3))}</h2>);
    }
    else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} style={{fontSize:15,fontWeight:700,color:"#2d3748",margin:"20px 0 8px"}}>{renderInline(line.slice(4))}</h3>);
    }
    else if (line.startsWith("#### ")) {
      elements.push(<h4 key={i} style={{fontSize:13,fontWeight:700,color:C.muted,margin:"12px 0 6px",letterSpacing:0.5,textTransform:"uppercase",fontFamily:"'DM Mono',monospace"}}>{line.slice(5)}</h4>);
    }
    else if (line.startsWith("> ")) {
      elements.push(<blockquote key={i} style={{margin:"12px 0",padding:"10px 16px",background:C.accentLight,borderLeft:`3px solid ${C.accent}`,borderRadius:"0 6px 6px 0",fontSize:13,color:C.ink,lineHeight:1.6,fontStyle:"italic"}}>{renderInline(line.slice(2))}</blockquote>);
    }
    else if (line.trim()==="---" || line.trim()==="***") {
      elements.push(<hr key={i} style={{border:"none",borderTop:`1px solid ${C.border}`,margin:"20px 0"}}/>);
    }
    else if (line.startsWith("```")) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) { codeLines.push(lines[i]); i++; }
      elements.push(
        <pre key={i} style={{background:"#1e1e2e",color:"#cdd6f4",padding:"14px 18px",borderRadius:8,fontSize:12,overflowX:"auto",margin:"12px 0",fontFamily:"'DM Mono',monospace",lineHeight:1.7}}>
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
    }
    else if (/^(\s*)[*\-]\s/.test(line)) {
      const indent = line.match(/^(\s*)/)[1].length;
      const text = line.replace(/^\s*[*\-]\s/, "");
      const isTask = text.startsWith("**TASK-");
      elements.push(
        <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,margin:"4px 0",paddingLeft:indent*12}}>
          <span style={{color:isTask?C.accent:C.muted,marginTop:3,flexShrink:0,fontSize:12}}>{isTask?"▸":"•"}</span>
          <span style={{fontSize:13,color:C.ink,lineHeight:1.6}}>{renderInline(text)}</span>
        </div>
      );
    }
    else if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\./)[1];
      const text = line.replace(/^\d+\.\s/, "");
      elements.push(
        <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,margin:"5px 0"}}>
          <span style={{color:C.accent,fontWeight:700,fontSize:12,fontFamily:"'DM Mono',monospace",flexShrink:0,minWidth:18}}>{num}.</span>
          <span style={{fontSize:13,color:C.ink,lineHeight:1.6}}>{renderInline(text)}</span>
        </div>
      );
    }
    else if (line.startsWith("**") && line.includes("**:")) {
      elements.push(<p key={i} style={{fontSize:13,color:C.ink,lineHeight:1.7,margin:"4px 0"}}>{renderInline(line)}</p>);
    }
    else if (line.trim()==="") {
      if (elements.length > 0) elements.push(<div key={i} style={{height:6}}/>);
    }
    else if (line.trim()) {
      elements.push(<p key={i} style={{fontSize:13,color:C.ink,lineHeight:1.75,margin:"6px 0"}}>{renderInline(line)}</p>);
    }
    i++;
  }
  return <>{elements}</>;
}

function renderInline(text) {
  const parts = [];
  let remaining = text;
  let idx = 0;
  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const codeMatch = remaining.match(/`(.+?)`/);
    const first = [boldMatch, codeMatch].filter(Boolean).sort((a,b) => a.index - b.index)[0];
    if (!first) { parts.push(<span key={idx++}>{remaining}</span>); break; }
    if (first.index > 0) parts.push(<span key={idx++}>{remaining.slice(0, first.index)}</span>);
    if (first === boldMatch) {
      parts.push(<strong key={idx++} style={{fontWeight:700,color:C.ink}}>{first[1]}</strong>);
    } else {
      parts.push(<code key={idx++} style={{background:"#f0ede8",color:"#c0392b",padding:"1px 5px",borderRadius:3,fontSize:"0.88em",fontFamily:"'DM Mono',monospace"}}>{first[1]}</code>);
    }
    remaining = remaining.slice(first.index + first[0].length);
  }
  return <>{parts}</>;
}

/* ═══════════════════════════════ SHARED UI ═══════════════════════════════════ */
function ScoreRing({value,size=56}) {
  const r=(size-8)/2,circ=2*Math.PI*r,color=scoreColor(value);
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={5}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={circ-(value/100)*circ} strokeLinecap="round"
        style={{transition:"stroke-dashoffset 0.8s ease"}}/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle" fill={color}
        fontSize={size>50?13:11} fontWeight={700}
        style={{transform:`rotate(90deg)`,transformOrigin:`${size/2}px ${size/2}px`,fontFamily:"'DM Mono',monospace"}}>
        {value}
      </text>
    </svg>
  );
}
function MiniBar({label,value,color}) {
  return (
    <div style={{marginBottom:6}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <span style={{fontSize:11,color:C.muted}}>{label}</span>
        <span style={{fontSize:11,color,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{value}</span>
      </div>
      <div style={{height:4,background:C.border,borderRadius:2}}>
        <div style={{height:"100%",width:`${value}%`,background:color,borderRadius:2,transition:"width 0.8s ease"}}/>
      </div>
    </div>
  );
}
const Tag = ({children,color=C.accent,bg=C.accentLight}) =>
  <span style={{fontSize:10,padding:"2px 8px",background:bg,color,borderRadius:3,flexShrink:0}}>{children}</span>;
const Lbl = ({children}) =>
  <div style={{fontSize:10,fontWeight:700,color:C.muted,letterSpacing:1.5,textTransform:"uppercase",fontFamily:"'DM Mono',monospace",marginBottom:6}}>{children}</div>;

/* ═══════════════════════════ KANBAN CARD ════════════════════════════════════ */
function KanbanCard({card,onClick,dragHandlers,isDragging}) {
  const col=COLUMNS.find(c=>c.id===card.col);
  const docCount = Object.values(card.docs||{}).filter(Boolean).length;
  return (
    <div onClick={()=>onClick(card)} {...dragHandlers}
      style={{background:C.white,border:`1px solid ${C.border}`,borderLeft:`3px solid ${col.color}`,borderRadius:8,padding:"13px 15px",marginBottom:10,cursor:"pointer",opacity:isDragging?0.4:1,userSelect:"none",transition:"box-shadow 0.18s,transform 0.15s",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 18px rgba(0,0,0,0.11)";e.currentTarget.style.transform="translateY(-1px)"}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.05)";e.currentTarget.style.transform="translateY(0)"}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:7}}>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:C.muted}}>{card.id}</span>
        <span style={{fontSize:10,fontWeight:700,color:"#fff",background:priorityColor(card.priority),padding:"1px 6px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>{card.priority}</span>
        {docCount>0&&<span style={{fontSize:9,padding:"1px 6px",background:C.purpleLight,color:C.purple,borderRadius:3,fontWeight:600}}>📄 {docCount}</span>}
        <span style={{marginLeft:"auto",fontSize:11,color:C.muted}}>{card.date}</span>
      </div>
      <div style={{fontSize:13,fontWeight:600,color:C.ink,lineHeight:1.4,marginBottom:8}}>{card.title}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>{card.tags.map(t=><Tag key={t}>{t}</Tag>)}</div>
      {card.aiResult&&(
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:scoreBg(card.aiResult.score),borderRadius:6}}>
          <ScoreRing value={card.aiResult.score} size={34}/>
          <div>
            <div style={{fontSize:10,color:C.muted}}>AI评审</div>
            <div style={{fontSize:11,color:scoreColor(card.aiResult.score),fontWeight:600}}>{card.aiResult.passed?"✓ 建议通过":"✗ 建议修改"}</div>
          </div>
        </div>
      )}
      <div style={{marginTop:8,fontSize:11,color:C.muted}}>👤 {card.author}</div>
    </div>
  );
}

/* ═══════════════════════════ DETAIL DRAWER ══════════════════════════════════ */
function DetailDrawer({card,onClose,onAIDesign,onMoveCard}) {
  if(!card) return null;
  const r=card.aiResult;
  return (
    <div style={{position:"fixed",right:0,top:0,bottom:0,width:"60vw",minWidth:560,background:C.white,borderLeft:`1px solid ${C.border}`,zIndex:100,boxShadow:"-12px 0 48px rgba(0,0,0,0.14)",display:"flex",flexDirection:"column",animation:"slideIn 0.22s ease"}}>
      <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
      <div style={{padding:"20px 28px 16px",borderBottom:`1px solid ${C.border}`,flexShrink:0,background:C.cream}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:C.muted}}>{card.id}</span>
              <span style={{fontSize:11,fontWeight:700,color:"#fff",background:priorityColor(card.priority),padding:"2px 8px",borderRadius:4}}>{card.priority}</span>
              {Object.values(card.docs||{}).filter(Boolean).length > 0 &&
                <span style={{fontSize:10,padding:"2px 8px",background:C.purpleLight,color:C.purple,borderRadius:4,fontWeight:600}}>📄 {Object.values(card.docs||{}).filter(Boolean).length} 文档</span>}
              <span style={{marginLeft:"auto",fontSize:11,color:C.muted}}>by {card.author} · {card.date}</span>
            </div>
            <h2 style={{fontSize:18,fontWeight:700,color:C.ink,lineHeight:1.3,margin:0}}>{card.title}</h2>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:C.muted,padding:"0 4px",lineHeight:1,marginTop:-2,flexShrink:0}}>×</button>
        </div>
      </div>
      <div style={{padding:"24px 28px",flex:1,overflowY:"auto",paddingBottom:100}}>
        <div style={{marginBottom:22}}>
          <Lbl>需求描述</Lbl>
          <p style={{fontSize:14,color:C.ink,lineHeight:1.75,margin:0,background:C.cream,padding:"12px 16px",borderRadius:7,border:`1px solid ${C.border}`}}>{card.desc}</p>
        </div>
        <div style={{marginBottom:22}}>
          <Lbl>用户故事</Lbl>
          <div style={{padding:"12px 16px",background:C.accentLight,borderRadius:7,fontSize:13,color:C.ink,lineHeight:1.65,borderLeft:`3px solid ${C.accent}`}}>{card.userStory}</div>
        </div>
        <div style={{marginBottom:22}}>
          <Lbl>验收标准</Lbl>
          <div style={{background:C.cream,border:`1px solid ${C.border}`,borderRadius:7,padding:"10px 16px"}}>
            {card.acceptanceCriteria.map((c,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:9,marginBottom:i<card.acceptanceCriteria.length-1?8:0}}>
                <span style={{fontSize:13,color:C.success,marginTop:1,flexShrink:0}}>✓</span>
                <span style={{fontSize:13,color:C.ink,lineHeight:1.5}}>{c}</span>
              </div>
            ))}
          </div>
        </div>
        {r&&(
          <div style={{border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
            <div style={{padding:"13px 18px",background:C.ink,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontWeight:700,fontSize:13,color:"#fff"}}>✦ AI 评审报告</span>
              <span style={{marginLeft:"auto",fontFamily:"'DM Mono',monospace",fontSize:12,padding:"2px 9px",borderRadius:4,background:scoreBg(r.score),color:scoreColor(r.score),fontWeight:700}}>{r.score}/100</span>
            </div>
            <div style={{padding:"18px 20px"}}>
              <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:14,padding:14,background:scoreBg(r.score),borderRadius:8}}>
                <ScoreRing value={r.score} size={68}/>
                <div style={{flex:1}}>
                  <MiniBar label="完整性" value={r.completeness} color={scoreColor(r.completeness)}/>
                  <MiniBar label="逻辑性" value={r.logic} color={scoreColor(r.logic)}/>
                  <MiniBar label="风险可控" value={r.risk} color={scoreColor(r.risk)}/>
                </div>
              </div>
              <div style={{padding:"9px 13px",background:r.passed?C.successLight:C.dangerLight,borderRadius:6,marginBottom:14,display:"flex",alignItems:"center",gap:9}}>
                <span style={{fontSize:16}}>{r.passed?"✅":"❌"}</span>
                <span style={{fontSize:13,fontWeight:600,color:r.passed?C.success:C.danger}}>{r.passed?"AI建议：通过评审":"AI建议：需修改后重新提交"}</span>
              </div>
              <p style={{fontSize:13,color:C.ink,lineHeight:1.75,marginBottom:16}}>{r.summary}</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:C.danger,letterSpacing:1.5,marginBottom:7,fontFamily:"'DM Mono',monospace"}}>RISKS</div>
                  {r.risks.map((x,i)=><div key={i} style={{fontSize:12,color:C.ink,padding:"4px 0 4px 10px",borderLeft:`2px solid ${C.danger}`,marginBottom:5,lineHeight:1.5}}>{x}</div>)}
                </div>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:C.accent,letterSpacing:1.5,marginBottom:7,fontFamily:"'DM Mono',monospace"}}>SUGGESTIONS</div>
                  {r.suggestions.map((x,i)=><div key={i} style={{fontSize:12,color:C.ink,padding:"4px 0 4px 10px",borderLeft:`2px solid ${C.accent}`,marginBottom:5,lineHeight:1.5}}>{x}</div>)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={{position:"sticky",bottom:0,padding:"14px 28px",background:C.white,borderTop:`1px solid ${C.border}`,display:"flex",gap:10,alignItems:"center",flexShrink:0,boxShadow:"0 -4px 20px rgba(0,0,0,0.07)"}}>
        <button onClick={()=>onAIDesign(card)}
          style={{flex:2,padding:"11px 0",borderRadius:8,border:"none",cursor:"pointer",background:C.purple,color:"#fff",fontWeight:600,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:7,boxShadow:`0 2px 8px ${C.purple}44`}}>
          <span>✐</span> AI 设计工作台
        </button>
        {card.col!=="approved"&&card.aiResult?.passed&&(
          <button onClick={()=>onMoveCard(card.id,"approved")}
            style={{flex:1,padding:"11px 0",borderRadius:8,border:`1.5px solid ${C.success}`,cursor:"pointer",background:C.successLight,color:C.success,fontWeight:600,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
            ✓ 通过
          </button>
        )}
        <button onClick={()=>onMoveCard(card.id,"rejected")} disabled={card.col==="rejected"}
          style={{flex:1,padding:"11px 0",borderRadius:8,border:`1.5px solid ${card.col==="rejected"?C.border:C.danger}`,cursor:card.col==="rejected"?"default":"pointer",background:card.col==="rejected"?C.border:C.dangerLight,color:card.col==="rejected"?C.muted:C.danger,fontWeight:600,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
          ✗ 拒绝
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════ DESIGN STUDIO ══════════════════════════════════ */
function DesignStudio({ cards, focusCardId, onBack, onUpdateDocs, onUpdateCard }) {
  const [selectedKey, setSelectedKey] = useState(`${focusCardId}:prd`);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const [rightTab, setRightTab] = useState("chatbot");
  const [expanded, setExpanded] = useState(() => {
    const init = {};
    cards.forEach(c => { init[c.id] = true; });
    return init;
  });
  const [devExpanded, setDevExpanded] = useState(() => {
    const init = {};
    cards.forEach(c => { init[c.id] = true; });
    return init;
  });

  const [selCardId, selDocType] = selectedKey.split(":");
  const selCard = cards.find(c => c.id === selCardId);
  const selDocMeta = DOC_TYPES.find(d => d.key === selDocType);
  const selContent = selCard?.docs?.[selDocType] || null;

  const handleSaveEdit = () => {
    const newDocs = { ...selCard.docs, [selDocType]: editText };
    onUpdateDocs(selCard.id, newDocs);
    setEditMode(false);
  };

  const enterEdit = () => {
    setEditText(selContent || "");
    setEditMode(true);
  };

  const handleSendMessage = useCallback(async(message, panel) => {
    const card = cards.find(c => c.id === selCardId);
    if(!card) return;

    const chatHistory = card.chatHistory || [];
    const newMessage = { role: "user", content: message };
    const updatedHistory = [...chatHistory, newMessage];

    try {
      const response = await callClaude(
        `你是产品需求分析专家。针对以下需求回答用户的问题。

需求标题: ${card.title}
需求描述: ${card.desc}
用户故事: ${card.userStory}
验收标准: ${card.acceptanceCriteria.join("；")}

用户问题: ${message}

请以专业、友好的语气回复，帮助用户理解和优化需求。回复要具体、有建设性。`,
        1500
      );

      onUpdateCard(card.id, { chatHistory: [...updatedHistory, { role: "assistant", content: response }] });
    } catch(e) {
      console.error(e);
    }
  }, [cards, selCardId, onUpdateCard]);

  const TreeItem = ({ label, icon, active, onClick, indent=0, badge, color="#cdd6f4", hasDoc }) => (
    <div onClick={onClick}
      style={{display:"flex",alignItems:"center",gap:6,padding:`5px ${8+indent*16}px`,cursor:"pointer",background:active?C.sbActive:"transparent",borderRadius:4,margin:"1px 4px",transition:"background 0.15s",userSelect:"none"}}
      onMouseEnter={e=>{ if(!active) e.currentTarget.style.background=C.sbHover; }}
      onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent"; }}>
      <span style={{fontSize:12,flexShrink:0}}>{icon}</span>
      <span style={{fontSize:12,color:active?C.white:C.sbText,flex:1,lineHeight:1.3}}>{label}</span>
      {hasDoc && <span style={{width:6,height:6,borderRadius:"50%",background:"#a6e3a1",flexShrink:0}}/>}
      {badge && <span style={{fontSize:9,padding:"1px 5px",background:"#313150",color:C.sbMuted,borderRadius:3,fontFamily:"'DM Mono',monospace"}}>{badge}</span>}
    </div>
  );

  const FolderItem = ({ label, open, onToggle, indent=0, count }) => (
    <div onClick={onToggle}
      style={{display:"flex",alignItems:"center",gap:6,padding:`5px ${8+indent*16}px`,cursor:"pointer",userSelect:"none",margin:"1px 4px",borderRadius:4,transition:"background 0.15s"}}
      onMouseEnter={e=>e.currentTarget.style.background=C.sbHover}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <span style={{fontSize:10,color:C.sbMuted,transition:"transform 0.15s",display:"inline-block",transform:open?"rotate(90deg)":"rotate(0deg)"}}>▶</span>
      <span style={{fontSize:12,color:open?"#f5a97f":"#f9e2af",flex:1}}>{open?"📂":"📁"} {label}</span>
      {count>0&&<span style={{fontSize:9,padding:"1px 5px",background:"#313150",color:C.sbMuted,borderRadius:3}}>{count}</span>}
    </div>
  );

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:C.paper}}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        .doc-content *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#3a3a5c;border-radius:3px}
      `}</style>

      {/* Top bar */}
      <div style={{background:C.ink,borderBottom:"1px solid #252535",padding:"0 0 0 0",display:"flex",alignItems:"center",gap:0,flexShrink:0,height:44}}>
        <button onClick={onBack} style={{padding:"0 18px",height:"100%",background:"none",border:"none",borderRight:"1px solid #252535",cursor:"pointer",color:"#888",fontSize:12,display:"flex",alignItems:"center",gap:7,transition:"color 0.15s"}}
          onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="#888"}>
          ← 返回看板
        </button>
        <div style={{padding:"0 18px",display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:12,color:"#888"}}>设计工作台</span>
          <span style={{color:"#444"}}>/</span>
          {selCard && <span style={{fontSize:12,color:C.sbText,fontWeight:500}}>{selCard.id}</span>}
          {selCard && <span style={{color:"#444"}}>/</span>}
          {selDocMeta && <span style={{fontSize:12,color:selDocMeta.color,fontWeight:600}}>{selDocMeta.label}</span>}
        </div>
        <div style={{marginLeft:"auto",padding:"0 16px",display:"flex",gap:8,alignItems:"center"}}>
          {selContent && !editMode && (
            <button onClick={enterEdit}
              style={{padding:"5px 14px",background:"#313150",border:"1px solid #3d3d60",borderRadius:5,cursor:"pointer",fontSize:12,color:C.sbText,display:"flex",alignItems:"center",gap:6}}>
              ✎ 编辑
            </button>
          )}
          {editMode && (
            <>
              <button onClick={()=>setEditMode(false)} style={{padding:"5px 14px",background:"transparent",border:"1px solid #3d3d60",borderRadius:5,cursor:"pointer",fontSize:12,color:"#888"}}>取消</button>
              <button onClick={handleSaveEdit} style={{padding:"5px 14px",background:C.accent,border:"none",borderRadius:5,cursor:"pointer",fontSize:12,color:"#fff",fontWeight:600}}>保存</button>
            </>
          )}
        </div>
      </div>

      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* ── Left sidebar tree ── */}
        <div style={{width:240,background:C.sb,borderRight:"1px solid #252535",overflowY:"auto",flexShrink:0,padding:"12px 0"}}>
          <div style={{padding:"0 12px 8px",fontSize:10,color:C.sbMuted,letterSpacing:2,fontFamily:"'DM Mono',monospace",textTransform:"uppercase"}}>
            需求文档树
          </div>
          {cards.map(card => {
            const isExpanded = expanded[card.id];
            const isDevExpanded = devExpanded[card.id];
            const docs = card.docs || {};
            const devDocCount = ["proposal","design","tasks"].filter(k=>docs[k]).length;
            return (
              <div key={card.id}>
                <FolderItem
                  label={<span><span style={{fontSize:9,padding:"1px 4px",background:`${priorityColor(card.priority)}22`,color:priorityColor(card.priority),borderRadius:2,marginRight:5,fontFamily:"'DM Mono',monospace"}}>{card.priority}</span>{card.id}</span>}
                  open={isExpanded}
                  onToggle={()=>setExpanded(e=>({...e,[card.id]:!e[card.id]}))}
                  indent={0}
                  count={Object.values(docs).filter(Boolean).length}
                />
                {isExpanded && (
                  <div>
                    <div style={{padding:"2px 8px 4px 24px"}}>
                      <div style={{fontSize:11,color:C.sbMuted,lineHeight:1.3,paddingLeft:8,borderLeft:`2px solid #313150`}}>
                        {card.title.length>28?card.title.slice(0,28)+"…":card.title}
                      </div>
                    </div>
                    <TreeItem label="产品需求 SPEC" icon="📋" indent={1}
                      active={selectedKey===`${card.id}:prd`}
                      onClick={()=>{setSelectedKey(`${card.id}:prd`);setEditMode(false);}}
                      hasDoc={!!docs.prd} color="#a6e3a1"/>
                    <FolderItem label="开发需求 SPEC" open={isDevExpanded}
                      onToggle={()=>setDevExpanded(e=>({...e,[card.id]:!e[card.id]}))}
                      indent={1} count={devDocCount}/>
                    {isDevExpanded && (
                      <>
                        {[
                          {key:"proposal",label:"Proposal",icon:"💡"},
                          {key:"design",  label:"Design",  icon:"🏗"},
                          {key:"tasks",   label:"Tasks",   icon:"✅"},
                        ].map(d=>(
                          <TreeItem key={d.key} label={d.label} icon={d.icon} indent={2}
                            active={selectedKey===`${card.id}:${d.key}`}
                            onClick={()=>{setSelectedKey(`${card.id}:${d.key}`);setEditMode(false);}}
                            hasDoc={!!docs[d.key]}/>
                        ))}
                      </>
                    )}
                    <div style={{height:6}}/>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Right content panel ── */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"#fff",minWidth:400}}>
          <div style={{borderBottom:`1px solid ${C.border}`,padding:"0 28px",display:"flex",alignItems:"center",gap:0,background:C.cream,flexShrink:0,height:40}}>
            {selDocMeta && (
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"0 16px 0 0",borderRight:`1px solid ${C.border}`,height:"100%"}}>
                <span style={{fontSize:14}}>{selDocMeta.icon}</span>
                <span style={{fontSize:13,fontWeight:600,color:C.ink}}>{selDocMeta.label}</span>
                {selContent && <span style={{width:6,height:6,borderRadius:"50%",background:"#a6e3a1",marginLeft:4}}/>}
              </div>
            )}
            <div style={{padding:"0 16px",fontSize:12,color:C.muted}}>
              {selCard?.id} · {selCard?.title?.slice(0,30)}{selCard?.title?.length>30?"…":""}
            </div>
          </div>

          <div style={{flex:1,overflowY:"auto"}}>
            {!selCard ? (
              <EmptyState icon="📂" title="请从左侧选择文档" desc="选择一个需求和文档类型开始查看"/>
            ) : editMode ? (
              <div style={{padding:"24px 36px",height:"100%",boxSizing:"border-box"}}>
                <textarea
                  value={editText}
                  onChange={e=>setEditText(e.target.value)}
                  style={{width:"100%",height:"calc(100vh - 180px)",padding:"16px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,color:C.ink,background:C.cream,outline:"none",resize:"none",lineHeight:1.75,fontFamily:"'DM Mono',monospace",boxSizing:"borderBox"}}
                  onFocus={e=>{e.target.style.borderColor=C.accent;e.target.style.boxShadow=`0 0 0 3px ${C.accentLight}`}}
                  onBlur={e=>{e.target.style.borderColor=C.border;e.target.style.boxShadow="none"}}
                />
              </div>
            ) : selContent ? (
              <div className="doc-content" style={{padding:"36px 52px",maxWidth:860,animation:"fadeIn 0.3s ease"}}>
                <MarkdownRenderer content={selContent}/>
              </div>
            ) : (
              <EmptyState icon={selDocMeta?.icon || "📄"} title={`${selDocMeta?.label || "文档"} 尚未生成`}
                desc={`需求：${selCard?.title}  —  可通过 AI 设计功能自动生成此文档`}/>
            )}
          </div>
        </div>

        {/* ── Right Panel (Chatbot / Reference) ── */}
        <RightPanel
          currentCard={selCard}
          allCards={cards}
          activeTab={rightTab}
          onTabChange={setRightTab}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

function EmptyState({icon,title,desc}) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",color:C.muted,gap:12,padding:48}}>
      <div style={{fontSize:48}}>{icon}</div>
      <div style={{fontSize:16,fontWeight:600,color:C.ink}}>{title}</div>
      <div style={{fontSize:13}}>{desc}</div>
    </div>
  );
}

/* ═══════════════════════════ NEW COMPONENTS ═══════════════════════════════════ */

// ── ChatbotPanel ──
function ChatbotPanel({ card, onSendMessage }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    await onSendMessage(input, "chatbot");
    setInput("");
    setLoading(false);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Header */}
      <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:C.cream}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:16}}>🤖</span>
          <span style={{fontSize:13,fontWeight:600,color:C.ink}}>需求分析助手</span>
        </div>
        <div style={{fontSize:11,color:C.muted,marginTop:4}}>帮你分析、优化和完善需求</div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"12px"}}>
        <div style={{background:C.accentLight,padding:"10px 12px",borderRadius:8,marginBottom:12,fontSize:12,color:C.ink,lineHeight:1.5}}>
          👋 你好！我是需求分析助手。针对需求「{card?.title}」，我可以帮你：
          <ul style={{margin:"8px 0 0 16px",padding:0}}>
            <li>分析需求完整性</li>
            <li>识别潜在风险</li>
            <li>提供改进建议</li>
            <li>解答疑问</li>
          </ul>
        </div>

        {card?.chatHistory?.map((msg, i) => (
          <div key={i} style={{marginBottom:10}}>
            {msg.role === "user" ? (
              <div style={{display:"flex",justifyContent:"flex-end"}}>
                <div style={{background:C.accent,color:"#fff",padding:"8px 12px",borderRadius:12,fontSize:12,maxWidth:"85%",lineHeight:1.5}}>
                  {msg.content}
                </div>
              </div>
            ) : (
              <div style={{background:C.cream,border:`1px solid ${C.border}`,padding:"10px 12px",borderRadius:8,fontSize:12,color:C.ink,lineHeight:1.6}}>
                {msg.content}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{background:C.cream,padding:"10px 12px",borderRadius:8,fontSize:12,color:C.muted}}>
            <span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>⟳</span> 思考中…
          </div>
        )}
        <div ref={messagesEndRef}/>
      </div>

      {/* Input */}
      <div style={{padding:"12px",borderTop:`1px solid ${C.border}`}}>
        <div style={{display:"flex",gap:8}}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === "Enter" && handleSend()}
            placeholder="输入你的问题..."
            disabled={loading}
            style={{flex:1,padding:"8px 12px",border:`1px solid ${C.border}`,borderRadius:6,fontSize:12,background:C.white,outline:"none"}}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{padding:"8px 14px",background:C.accent,color:"#fff",border:"none",borderRadius:6,cursor:loading || !input.trim() ? "default" : "pointer",fontSize:12,fontWeight:600}}>
            发送
          </button>
        </div>
        <div style={{fontSize:10,color:C.muted,marginTop:6}}>按 Enter 发送</div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── ReferencePanel ──
function ReferencePanel({ currentCard, allCards }) {
  const similarCards = React.useMemo(() => {
    if (!currentCard) return [];
    return allCards
      .filter(c => c.id !== currentCard.id)
      .map(card => {
        let score = 0;
        const commonTags = card.tags ? card.tags.filter(t => currentCard.tags?.includes(t)) : [];
        score += commonTags.length * 10;
        if (card.priority === currentCard.priority) score += 5;
        return { card, score };
      })
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => ({...s.card, similarityScore: s.score}));
  }, [currentCard, allCards]);

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Header */}
      <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:C.cream}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:16}}>📚</span>
          <span style={{fontSize:13,fontWeight:600,color:C.ink}}>历史需求参考</span>
        </div>
        <div style={{fontSize:11,color:C.muted,marginTop:4}}>相似的需求参考</div>
      </div>

      {/* List */}
      <div style={{flex:1,overflowY:"auto",padding:"12px"}}>
        {similarCards.length === 0 ? (
          <div style={{textAlign:"center",color:C.muted,padding:40,fontSize:12}}>
            暂无相关历史需求
          </div>
        ) : (
          similarCards.map(card => (
            <div key={card.id} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:8,padding:"12px",marginBottom:10,cursor:"pointer",transition:"all 0.15s"}}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.boxShadow = `0 2px 8px ${C.accent}33`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:C.muted}}>{card.id}</span>
                <span style={{fontSize:10,padding:"1px 5px",background:priorityColor(card.priority),color:"#fff",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>{card.priority}</span>
                {card.col === "approved" && <span style={{fontSize:9,padding:"1px 5px",background:C.successLight,color:C.success,borderRadius:3}}>已通过</span>}
                <span style={{marginLeft:"auto",fontSize:10,color:C.teal,fontWeight:600,fontFamily:"'DM Mono',monospace"}}>{card.similarityScore}% 相似</span>
              </div>
              <div style={{fontSize:12,fontWeight:600,color:C.ink,lineHeight:1.4,marginBottom:6}}>{card.title}</div>
              <div style={{fontSize:11,color:C.muted,lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
                {card.desc}
              </div>
              <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>
                {card.tags.map(t => <span key={t} style={{fontSize:9,padding:"2px 6px",background:C.cream,color:C.muted,borderRadius:3}}>{t}</span>)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── RightPanel ──
function RightPanel({ currentCard, allCards, activeTab, onTabChange, onSendMessage }) {
  return (
    <div style={{width:320,background:C.white,borderLeft:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:C.cream}}>
        <button
          onClick={() => onTabChange("chatbot")}
          style={{flex:1,padding:"10px 0",background:"none",border:"none",borderBottom:`2px solid ${activeTab === "chatbot" ? C.accent : "transparent"}`,cursor:"pointer",fontSize:12,color:activeTab === "chatbot" ? C.ink : C.muted,fontWeight:activeTab === "chatbot" ? 600 : 400}}
        >
          🤖 CHATBOT
        </button>
        <button
          onClick={() => onTabChange("reference")}
          style={{flex:1,padding:"10px 0",background:"none",border:"none",borderBottom:`2px solid ${activeTab === "reference" ? C.accent : "transparent"}`,cursor:"pointer",fontSize:12,color:activeTab === "reference" ? C.ink : C.muted,fontWeight:activeTab === "reference" ? 600 : 400}}
        >
          📚 参考资料
        </button>
      </div>

      {/* Content */}
      <div style={{flex:1,overflow:"hidden"}}>
        {activeTab === "chatbot" ? (
          <ChatbotPanel card={currentCard} onSendMessage={onSendMessage}/>
        ) : (
          <ReferencePanel currentCard={currentCard} allCards={allCards}/>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════ ADD CARD MODAL ════════════════════════════════════ */
function AddCardModal({onAdd,onClose}) {
  const [form,setForm]=useState({title:"",desc:"",userStory:"",priority:"P1",tags:"",criteria:"",author:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const sty={width:"100%",padding:"9px 12px",border:`1px solid ${C.border}`,borderRadius:6,fontSize:13,background:C.cream,outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"'Noto Sans SC',sans-serif"};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:C.white,borderRadius:12,width:520,maxHeight:"85vh",overflowY:"auto",padding:"24px 28px",boxShadow:"0 24px 64px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:20}}>
          <h3 style={{margin:0,fontSize:16,fontWeight:700,color:C.ink}}>新建需求</h3>
          <button onClick={onClose} style={{marginLeft:"auto",background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.muted}}>×</button>
        </div>
        {[["需求标题 *","title","input"],["需求描述","desc","ta"],["用户故事","userStory","ta"],["验收标准（每行一条）","criteria","ta"],["标签（中文逗号分隔）","tags","input"],["提交人","author","input"]].map(([lbl,key,t])=>(
          <div key={key} style={{marginBottom:13}}>
            <Lbl>{lbl}</Lbl>
            {t==="input"?<input value={form[key]} onChange={e=>set(key,e.target.value)} style={sty}/>:<textarea value={form[key]} onChange={e=>set(key,e.target.value)} rows={3} style={sty}/>}
          </div>
        ))}
        <div style={{marginBottom:20}}>
          <Lbl>优先级</Lbl>
          <div style={{display:"flex",gap:8}}>
            {["P0","P1","P2","P3"].map(p=>(
              <button key={p} onClick={()=>set("priority",p)}
                style={{flex:1,padding:"8px 0",borderRadius:6,border:`1.5px solid ${form.priority===p?priorityColor(p):C.border}`,background:form.priority===p?priorityColor(p):C.white,color:form.priority===p?"#fff":C.muted,fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"'DM Mono',monospace"}}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:"10px 0",borderRadius:8,border:`1px solid ${C.border}`,background:C.white,color:C.muted,cursor:"pointer",fontSize:14}}>取消</button>
          <button onClick={()=>{if(!form.title.trim())return;onAdd({id:`REQ-${String(Date.now()).slice(-3)}`,col:"backlog",priority:form.priority,title:form.title,desc:form.desc,tags:form.tags.split("，").map(t=>t.trim()).filter(Boolean),author:form.author||"我",date:new Date().toISOString().slice(0,10),userStory:form.userStory,acceptanceCriteria:form.criteria.split("\n").map(c=>c.trim()).filter(Boolean),aiResult:null,docs:mkDocs(),chatHistory:[]});onClose();}}
            style={{flex:2,padding:"10px 0",borderRadius:8,border:"none",background:C.accent,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14}}>
            创建需求
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ MAIN APP ═══════════════════════════════════════ */
export default function PMPlatform() {
  const [cards,setCards]           = useState(INITIAL_CARDS);
  const [selected,setSelected]     = useState(null);
  const [studioCardId,setStudioId] = useState(null);
  const [showAdd,setShowAdd]        = useState(false);
  const [dragCard,setDragCard]      = useState(null);
  const [activeTab,setActiveTab]    = useState("kanban");
  const [toast,setToast]            = useState(null);

  const notify=(msg,ok=true)=>{setToast({msg,ok});setTimeout(()=>setToast(null),3000);};

  const updateCard=(id,patch)=>{
    setCards(cs=>cs.map(c=>c.id===id?{...c,...patch}:c));
    setSelected(s=>s&&s.id===id?{...s,...patch}:s);
  };

  const stats = {
    total:cards.length,
    approved:cards.filter(c=>c.col==="approved").length,
    rejected:cards.filter(c=>c.col==="rejected").length,
    pending:cards.filter(c=>!["approved","rejected"].includes(c.col)).length,
    withDocs:cards.filter(c=>Object.values(c.docs||{}).some(Boolean)).length,
  };

  const handleAIDesign=(card)=>{
    setSelected(null);
    setStudioId(card.id);
  };

  const handleUpdateDocs=(cardId, docs)=>{
    updateCard(cardId,{docs});
    notify("✓ 文档已保存");
  };

  const handleMoveCard=(id,col)=>{
    updateCard(id,{col});
    notify(`已移至 · ${COLUMNS.find(c=>c.id===col)?.label}`);
  };

  const handleDragStart=(e,card)=>{setDragCard(card);e.dataTransfer.effectAllowed="move";};
  const handleDrop=(e,colId)=>{e.preventDefault();if(dragCard&&dragCard.col!==colId)handleMoveCard(dragCard.id,colId);setDragCard(null);};

  if(studioCardId) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
        {toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:toast.ok?C.ink:C.danger,color:"#fff",padding:"10px 20px",borderRadius:8,fontSize:13,zIndex:999,boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>{toast.msg}</div>}
        <DesignStudio
          cards={cards}
          focusCardId={studioCardId}
          onBack={()=>setStudioId(null)}
          onUpdateDocs={handleUpdateDocs}
          onUpdateCard={updateCard}
        />
      </>
    );
  }

  return (
    <div style={{fontFamily:"'Noto Sans SC',sans-serif",background:C.paper,minHeight:"100vh"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      {toast&&(
        <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:toast.ok?C.ink:C.danger,color:"#fff",padding:"10px 20px",borderRadius:8,fontSize:13,zIndex:999,boxShadow:"0 4px 20px rgba(0,0,0,0.3)",animation:"fadeIn 0.2s ease"}}>
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateX(-50%) translateY(-8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
          {toast.msg}
        </div>
      )}

      {/* Nav */}
      <div style={{background:C.ink,padding:"0 24px",display:"flex",alignItems:"center",gap:0,borderBottom:"1px solid #1a1a1a"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,paddingRight:24,borderRight:"1px solid #2a2a2a",marginRight:8}}>
          <div style={{width:28,height:28,background:C.accent,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff"}}>P</div>
          <span style={{color:"#fff",fontWeight:700,fontSize:14}}>PM·AI</span>
          <span style={{color:"#444",fontSize:11,fontFamily:"'DM Mono',monospace"}}>智能需求工作台</span>
        </div>
        {[{id:"kanban",label:"需求评审看板"},{id:"stats",label:"数据概览"}].map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            style={{padding:"14px 18px",background:"none",border:"none",color:activeTab===t.id?"#fff":"#555",fontSize:13,cursor:"pointer",borderBottom:`2px solid ${activeTab===t.id?C.accent:"transparent"}`,fontWeight:activeTab===t.id?600:400}}>
            {t.label}
          </button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:10,alignItems:"center"}}>
          {[{label:"总需求",val:stats.total,c:"#fff"},{label:"已通过",val:stats.approved,c:"#4ade80"},{label:"含文档",val:stats.withDocs,c:"#c4b5fd"}].map(s=>(
            <div key={s.label} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",background:"#1a1a1a",borderRadius:5}}>
              <span style={{fontSize:15,fontWeight:700,color:s.c,fontFamily:"'DM Mono',monospace"}}>{s.val}</span>
              <span style={{fontSize:10,color:"#555"}}>{s.label}</span>
            </div>
          ))}
          <button onClick={()=>setShowAdd(true)} style={{padding:"8px 16px",background:C.accent,color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:600}}>
            + 新建需求
          </button>
        </div>
      </div>

      {/* Stats */}
      {activeTab==="stats"&&(
        <div style={{padding:36,maxWidth:900,margin:"0 auto"}}>
          <h2 style={{fontWeight:700,fontSize:22,color:C.ink,marginBottom:24}}>数据概览</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:32}}>
            {[{label:"需求总数",val:stats.total,sub:"Total",c:C.accent},{label:"待处理",val:stats.pending,sub:"In Progress",c:C.warn},{label:"已通过",val:stats.approved,sub:"Approved",c:C.success},{label:"含文档",val:stats.withDocs,sub:"With Docs",c:C.purple}].map(s=>(
              <div key={s.label} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:"20px 22px",borderTop:`3px solid ${s.c}`}}>
                <div style={{fontSize:28,fontWeight:800,color:C.ink,fontFamily:"'DM Mono',monospace",marginBottom:4}}>{s.val}</div>
                <div style={{fontSize:13,color:C.ink,marginBottom:2}}>{s.label}</div>
                <div style={{fontSize:10,color:C.muted,fontFamily:"'DM Mono',monospace"}}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:"20px 24px"}}>
            <div style={{fontWeight:700,fontSize:14,color:C.ink,marginBottom:16}}>各阶段分布</div>
            {COLUMNS.map(col=>{
              const count=cards.filter(c=>c.col===col.id).length,pct=Math.round((count/Math.max(1,cards.length))*100);
              return (
                <div key={col.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                  <div style={{width:70,fontSize:12,color:C.ink}}>{col.label}</div>
                  <div style={{flex:1,height:8,background:C.border,borderRadius:4}}>
                    <div style={{height:"100%",width:`${pct}%`,background:col.color,borderRadius:4,minWidth:pct>0?8:0}}/>
                  </div>
                  <div style={{width:24,fontSize:12,color:C.ink,fontFamily:"'DM Mono',monospace",textAlign:"right"}}>{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Kanban */}
      {activeTab==="kanban"&&(
        <div style={{display:"flex",gap:0,overflowX:"auto",padding:"20px 16px",minHeight:"calc(100vh - 56px)"}}>
          {COLUMNS.map(col=>{
            const colCards=cards.filter(c=>c.col===col.id);
            return (
              <div key={col.id} onDragOver={e=>e.preventDefault()} onDrop={e=>handleDrop(e,col.id)}
                style={{flex:"0 0 252px",marginRight:12,display:"flex",flexDirection:"column"}}>
                <div style={{padding:"10px 14px",background:col.bg,borderRadius:"8px 8px 0 0",border:`1px solid ${C.border}`,borderBottom:"none",display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:col.color}}/>
                  <span style={{fontWeight:700,fontSize:13,color:col.color}}>{col.label}</span>
                  <span style={{marginLeft:"auto",fontSize:12,fontWeight:700,color:col.color,fontFamily:"'DM Mono',monospace",background:C.white,padding:"1px 7px",borderRadius:8}}>{colCards.length}</span>
                </div>
                <div style={{flex:1,background:col.bg+"88",border:`1px solid ${C.border}`,borderRadius:"0 0 8px 8px",padding:10,minHeight:100}}>
                  {colCards.map(card=>(
                    <KanbanCard key={card.id} card={card} onClick={c=>setSelected(c)} isDragging={dragCard?.id===card.id}
                      dragHandlers={{draggable:true,onDragStart:e=>handleDragStart(e,card),onDragEnd:()=>setDragCard(null)}}/>
                  ))}
                  {colCards.length===0&&<div style={{textAlign:"center",color:C.muted,fontSize:12,padding:"20px 0"}}>拖拽需求到此处</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected&&(
        <>
          <div onClick={()=>setSelected(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.22)",zIndex:99}}/>
          <DetailDrawer card={selected} onClose={()=>setSelected(null)}
            onAIDesign={handleAIDesign} onMoveCard={handleMoveCard}/>
        </>
      )}
      {showAdd&&<AddCardModal onAdd={card=>{setCards(cs=>[card,...cs]);notify("需求已创建");}} onClose={()=>setShowAdd(false)}/>}
    </div>
  );
}
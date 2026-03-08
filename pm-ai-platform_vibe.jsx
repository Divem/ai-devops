
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
  // sidebar (dark like VS Code)
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

/* ═══════════════════════════ INITIAL DATA ═══════════════════════════════════ */
const mkDocs = () => ({ prd:null, proposal:null, design:null, tasks:null });
const INITIAL_CARDS = [
  // 1. 需求列表页面（看板视图）
  {
    id: "REQ-100",
    col: "backlog",
    priority: "P0",
    space: "需求管理",
    iteration: "2026Q1-Sprint1",
    title: "需求列表页面（看板视图）",
    desc: "提供直观的多列看板视图，展示从 Meego 同步过来的业务需求，支持拖拽流转、筛选排序和 AI 评审分数展示，作为整个智能需求管理工作台的核心入口。",
    tags: ["看板", "基础能力", "Meego"],
    author: "张晓薇",
    date: "2026-02-24",
    userStory: "作为一个 产品经理，我希望 在看板上直观看到所有需求的处理阶段，以便 快速了解哪些需求在等待评审、哪些在 AI 分析中。",
    acceptanceCriteria: [
      "6列看板：待评审/评审中/AI分析中/人工确认/已通过/已拒绝",
      "支持拖拽需求卡片改变阶段",
      "需求卡片展示编号、优先级、标题、AI评审分数",
      "Meego数据每15分钟自动同步"
    ],
    aiResult: {
      score: 88,
      completeness: 92,
      logic: 86,
      risk: 84,
      summary: "需求描述清晰，看板交互定义完整，Meego同步机制考虑周到。建议补充看板性能要求和WIP限制策略。",
      risks: ["Meego API 变更可能导致同步中断", "大量需求卡片可能影响渲染性能", "拖拽操作在移动端适配困难"],
      suggestions: ["增加看板虚拟滚动方案", "明确单列WIP上限", "考虑移动端替代交互方案"],
      passed: true
    },
    docs: mkDocs()
  },

  // 2. AI 需求澄清模块
  {
    id: "REQ-101",
    col: "reviewing",
    priority: "P0",
    title: "AI 需求澄清模块",
    desc: "集成在需求详情页的对话界面，产品经理与 AI 助手多轮对话澄清需求。AI 主动提问、实时结构化输出、支持 UI 弹框确认，并持续评估需求的完整性、逻辑性和风险。",
    tags: ["AI", "对话", "核心能力"],
    author: "李明",
    date: "2026-02-24",
    userStory: "作为一个 产品经理，我希望 AI 助手能主动发现需求中缺失的关键信息，以便 快速补全需求、减少返工。",
    acceptanceCriteria: [
      "AI首轮回复延迟≤3秒",
      "支持上下文多轮对话，最多10轮历史",
      "关键确认通过Modal弹框呈现",
      "实时输出结构化需求草案",
      "从完整性/逻辑性/风险三维度评分"
    ],
    aiResult: {
      score: 91,
      completeness: 94,
      logic: 90,
      risk: 88,
      summary: "需求定义完整，AI交互流程设计合理，弹框确认机制是亮点。技术可行性评估充分。",
      risks: ["AI 评审准确度需持续校准", "过多追问可能导致用户体验下降"],
      suggestions: ["增加对话轮次上限配置", "建立AI评审反馈闭环"],
      passed: true
    },
    docs: mkDocs()
  },

  // 3. 规范框架扩展模块
  {
    id: "REQ-102",
    col: "ai_review",
    priority: "P1",
    title: "规范框架扩展模块",
    desc: "支持集成和管理多种 SDD 规范框架（如 OpenSpec、Open-Kit），提供插件化接入机制和规范适配器，将 AI 通用输出转换为特定框架文档格式。",
    tags: ["SDD", "插件化", "架构"],
    author: "王芳",
    date: "2026-02-24",
    userStory: "作为一个 产品经理，我希望 根据项目需求选择合适的规范框架，以便 生成的文档符合团队标准。",
    acceptanceCriteria: [
      "插件化框架接入机制，新框架≤3天接入",
      "V1.0完成OpenSpec适配器",
      "模板可配置，支持版本管理",
      "规范适配器转换准确率≥95%"
    ],
    aiResult: null,
    docs: mkDocs()
  },

  // 4. 提案生成模块
  {
    id: "REQ-103",
    col: "ai_review",
    priority: "P1",
    title: "提案生成模块",
    desc: "基于 AI 澄清后的结构化需求，结合选定的规范框架，一键生成 proposal.md、design.md、specs/delta.md、tasks.md 等完整提案文档包。支持流式输出和在线预览编辑。",
    tags: ["AI生成", "OpenSpec", "核心能力"],
    author: "陈刚",
    date: "2026-02-24",
    userStory: "作为一个 产品经理，我希望 一键生成完整的OpenSpec提案包，以便 快速进入评审和开发流程。",
    acceptanceCriteria: [
      "一键生成4类文档（proposal/design/spec/tasks）",
      "支持SSE流式输出，用户可实时看到生成进度",
      "生成完成后支持在线预览和Markdown编辑",
      "生成文档格式合规率≥95%"
    ],
    aiResult: null,
    docs: mkDocs()
  },

  // 5. 提案评审与修改模块
  {
    id: "REQ-104",
    col: "backlog",
    priority: "P2",
    title: "提案评审与修改模块",
    desc: "提供友好的界面供产品经理对 AI 生成的提案进行在线评审、修改和版本管理。支持分屏对比、评论批注和版本历史回溯。",
    tags: ["评审", "协作", "编辑器"],
    author: "刘洋",
    date: "2026-02-24",
    userStory: "作为一个 产品经理，我希望 在平台内直接对AI生成的提案进行修改和批注，以便 和团队高效协作。",
    acceptanceCriteria: [
      "分屏对比：AI草稿 vs 修改版",
      "支持段落级评论批注",
      "版本历史可回溯和恢复",
      "提案状态：草稿→待评审→已确认"
    ],
    aiResult: null,
    docs: mkDocs()
  },

  // 6. Git 同步与版本管理模块
  {
    id: "REQ-105",
    col: "confirm",
    priority: "P1",
    title: "Git 同步与版本管理模块",
    desc: "实现 OpenSpec 提案与 Git 仓库的自动化同步。产品经理确认提案后系统自动生成 Git Commit，将文件提交到指定目录下，并可选创建 PR/MR。",
    tags: ["Git", "DevOps", "集成"],
    author: "陈刚",
    date: "2026-02-24",
    userStory: "作为一个 产品经理，我希望 确认提案后一键同步至Git仓库，以便 开发人员直接拉取最新设计文档。",
    acceptanceCriteria: [
      "支持GitHub/GitLab/Gitee三大平台",
      "自动提交至openspec/changes/<name>/目录",
      "可选创建PR/MR并回写链接",
      "Git提交成功率≥99.5%"
    ],
    aiResult: {
      score: 82,
      completeness: 85,
      logic: 84,
      risk: 76,
      summary: "需求整体清晰，Git集成方案可行。建议补充凭据安全管理方案和并发同步冲突策略。",
      risks: ["Git凭据安全存储需专门方案", "多人同时同步可能产生冲突", "网络不稳定导致push失败"],
      suggestions: ["引入Vault管理Git凭据", "实现同步任务排队机制", "增加push失败重试和告警"],
      passed: true
    },
    docs: {
      prd: null,
      proposals: [
        {
          id: "git-sync",
          name: "Git 同步机制设计",
          proposal: null,
          design: `# Design: Git 同步与版本管理模块

## 1. 技术方案

### 1.1 核心架构

采用分层设计，将 Git 操作与业务逻辑解耦：

\`\`\`
┌─────────────────────────────────┐
│   需求管理平台（UI层）       │
└──────────┬──────────────────────┘
           │
           │ HTTP API
           │
┌──────────▼──────────────────────┐
│   Git 同步服务（业务逻辑层）    │
│   - 提案确认监听              │
│   - 同步任务队列               │
│   - 状态回写                  │
└──────────┬──────────────────────┘
           │
           │ 调用
           │
┌──────────▼──────────────────────┐
│   Git 适配器层                 │
│   - GitHub API                │
│   - GitLab API               │
│   - Gitee API                │
└───────────────────────────────────┘
\`\`\`

### 1.2 关键组件

**SyncService**: 同步服务核心
- 监听提案确认事件
- 创建同步任务
- 管理任务队列（避免并发冲突）
- 回写 Git 状态到需求卡片

**GitAdapter**: Git 操作抽象接口
- createBranch(): 创建特性分支
- commitFiles(): 提交文件到仓库
- createPullRequest(): 创建 PR/MR
- getStatus(): 获取提交/PR 状态

**CredentialManager**: 凭据管理
- 加密存储 Git Token
- 支持多平台凭据
- Token 过期提醒

## 2. API 设计

### 2.1 同步提案

POST /api/proposals/:id/sync

### 2.2 获取同步状态

GET /api/proposals/:id/sync-status

## 3. 数据模型

### 3.1 git_configs 表
- id, user_id, platform, repo_url, access_token_encrypted, default_branch

### 3.2 git_sync_records 表
- id, proposal_id, user_id, platform, repo_url, branch, commit_sha, pr_url, status

## 4. 并发控制

- 同一提案同一时间只允许一个同步任务
- FIFO 队列，最多 10 个并发任务

## 5. 安全性

- Git Token 使用 AES-256 加密存储
- 凭据仅对授权用户可见`,
          spec: null,
          tasks: `## 1. Setup
- [ ] 1.1 创建 git_configs 数据表
- [ ] 1.2 创建 git_sync_records 数据表
- [ ] 1.3 安装依赖

## 2. Backend
- [ ] 2.1 实现 SyncService 类
- [ ] 2.2 实现 GitAdapter 接口
- [ ] 2.3 实现 CredentialManager
- [ ] 2.4 实现同步 API 端点

## 3. Frontend
- [ ] 3.1 添加 Git 同步配置
- [ ] 3.2 添加同步状态显示
- [ ] 3.3 回写 PR 链接

## 4. Testing
- [ ] 4.1 单元测试
- [ ] 4.2 集成测试`
        }
      ]
    }
  }
];

/* ═══════════════════════════════ API ══════════════════════════════════════
 * 支持 Claude (Anthropic) 和 GLM-4 (Zhipu)
 * 使用 AIClient 统一接口
 * 模型选择: localStorage.getItem('ai_model_selected') || 'claude'
 * localStorage 配置:
 *   Claude: localStorage.setItem('ai_model_claude_key', 'your-key')
 *   GLM: localStorage.setItem('ai_model_glm_key', 'your-key')
 * ───────────────────────────────────────────────────────────────────────────────────────── */
const CLAUDE_API_KEY = ""; // 👈 配置你的 Anthropic API Key
const ZHIPU_API_KEY = "";  // 👈 配置你的 Zhipu GLM API Key

function getSelectedModel() {
  return localStorage.getItem('ai_model_selected') || 'claude';
}

async function callAI(prompt, maxTokens=1800) {
  const model = getSelectedModel();
  const client = new AIClient(model);
  return await client.chat(prompt, maxTokens);
}

async function callAIReview(card) {
  const text = await callAI(`你是资深产品经理评审专家。请对以下需求评审，从完整性、逻辑性、风险三个维度打分（0-100）。
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

**背景**: [详细描述]

**目标**: [详细描述短期和长期目标]

### 1.2 产品愿景

[一句话愿景]

## 2. 用户与场景

### 2.1 目标用户

[用户画像描述]

### 2.2 用户故事

> 作为一个 [角色]，我希望 [功能]，以便 [价值]。

[列举2-3个用户故事]

## 3. 功能需求

### 3.1 核心功能

[详细描述每个核心功能点]

### 3.2 扩展功能（可选）

[未来迭代方向]

## 4. 非功能性需求

### 4.1 性能要求
### 4.2 安全性要求
### 4.3 可用性要求

## 5. 风险与挑战

[识别风险并提出应对措施]

请直接输出Markdown内容，不要任何额外说明。`,

  proposal: (card) => `你是技术提案专家。根据以下需求生成完整的Proposal文档（Markdown格式）。

需求标题: ${card.title}
需求描述: ${card.desc}
验收标准: ${card.acceptanceCriteria.join("；")}

生成格式：
# Proposal: ${card.title}

**提案 ID**: PROPOSAL-${card.id} | **版本**: 1.0 | **日期**: ${new Date().toLocaleDateString("zh-CN")}

## 1. Intent（意图）

### 1.1 Problem Statement（问题陈述）

**背景**: [描述业务问题、用户痛点]

**影响**: [说明问题对业务的影响]

### 1.2 Goal（目标）

**业务目标**: [SMART原则描述业务价值]

**用户目标**: [用户改进和便利]

## 2. Scope（范围）

### 2.1 In Scope（包含范围）
[本次涵盖的功能和边界]

### 2.2 Out of Scope（不包含范围）
[不涉及的功能，避免误解]

## 3. Approach（方法）

### 3.1 High-Level Solution（高层解决方案）
[核心思路和技术方向]

### 3.2 Alternatives（备选方案）
[其他可能方案及优缺点分析]

## 4. Dependencies（依赖）
[外部系统、团队或资源依赖]

## 5. Risks（风险）
[风险识别和应对策略]

## 6. Metrics（度量指标）
[关键业务指标和技术指标]

## 7. Open Questions（开放问题）
[尚未明确需进一步讨论的问题]

请直接输出Markdown内容。`,

  design: (card) => `你是系统架构师。根据以下需求生成完整的技术设计文档（Markdown格式）。

需求标题: ${card.title}
需求描述: ${card.desc}

生成格式：
# Design: ${card.title}

**设计 ID**: DESIGN-${card.id} | **关联提案**: PROPOSAL-${card.id} | **版本**: 1.0 | **日期**: ${new Date().toLocaleDateString("zh-CN")}

## 1. Overview（概述）
[设计目标、范围与关联提案关系]

## 2. Architecture Design（架构设计）

### 2.1 System Context（系统上下文）
[系统在整体架构中的位置，上下游关系]

### 2.2 Component Diagram（组件图）
[系统内部各组件、模块及相互关系]

### 2.3 Data Model（数据模型）
[核心业务实体数据结构，字段、类型、关系]

## 3. Technical Solution（技术方案）

### 3.1 Key Technologies（关键技术选型）
[主要技术栈、框架和工具及选型理由]

### 3.2 API Definitions（接口定义）
[对外API接口，请求/响应格式、参数]

### 3.3 Business Logic（业务逻辑）
[核心业务流程实现逻辑、状态机]

### 3.4 Error Handling（错误处理）
[错误码、异常捕获、日志记录]

## 4. Deployment（部署）
[部署方式、环境要求、扩缩容策略]

## 5. Security Considerations（安全考量）
[数据加密、权限控制、输入校验]

## 6. Performance Considerations（性能考量）
[缓存策略、并发处理、数据库优化]

## 7. Test Strategy（测试策略）
[单元测试、集成测试、端到端测试]

## 8. Open Questions（开放问题）
[当前设计中尚未明确的问题]

请直接输出Markdown内容。`,

  tasks: (card) => `你是项目管理专家。根据以下需求生成完整的开发任务清单（Markdown格式）。

需求标题: ${card.title}
需求描述: ${card.desc}
验收标准: ${card.acceptanceCriteria.join("；")}

生成格式：
# Tasks: ${card.title}

**任务清单 ID**: TASKS-${card.id} | **关联提案**: PROPOSAL-${card.id} | **版本**: 1.0 | **日期**: ${new Date().toLocaleDateString("zh-CN")}

## 1. Overview（概述）
[任务清单目标和范围，与提案/设计/规范文档的关系]

## 2. Development Tasks（开发任务）

### 2.1 Backend Tasks（后端任务）

- **TASK-BE-001**: [后端任务标题]
  - **描述**: [详细描述]
  - **关联需求**: [REQ-ID]
  - **预期工时**: [Xh]
  - **状态**: 待开始

- **TASK-BE-002**: [后端任务标题]
  - **描述**: [详细描述]
  - **预期工时**: [Xh]
  - **状态**: 待开始

### 2.2 Frontend Tasks（前端任务）

- **TASK-FE-001**: [前端任务标题]
  - **描述**: [UI界面、交互逻辑或数据展示]
  - **预期工时**: [Xh]
  - **状态**: 待开始

- **TASK-FE-002**: [前端任务标题]
  - **描述**: [详细描述]
  - **预期工时**: [Xh]
  - **状态**: 待开始

### 2.3 Data/DB Tasks（数据/数据库任务）

- **TASK-DB-001**: [数据库任务标题]
  - **描述**: [数据库结构变更或数据迁移]
  - **预期工时**: [Xh]
  - **状态**: 待开始

### 2.4 Other Tasks（其他任务）

- **TASK-OT-001**: [其他任务]
  - **描述**: [配置部署、文档更新等]
  - **预期工时**: [Xh]
  - **状态**: 待开始

## 3. Open Questions（开放问题）
[任务中尚未明确的问题]

请直接输出Markdown内容，工时和任务标题请根据需求合理填写真实内容，不要使用占位符。`,
};

async function callAIDoc(card, docType) {
  const prompt = DOC_PROMPTS[docType](card);
  return await callAI(prompt, 2000);
}

/* ═══════════════════════════ MARKDOWN RENDERER ═════════════════════════════ */
function MarkdownRenderer({ content }) {
  if (!content) return null;
  const lines = content.split("\n");
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // H1
    if (line.startsWith("# ") && !line.startsWith("## ")) {
      elements.push(<h1 key={i} style={{fontSize:26,fontWeight:800,color:C.ink,margin:"0 0 20px",lineHeight:1.3,borderBottom:`2px solid ${C.border}`,paddingBottom:12}}>{renderInline(line.slice(2))}</h1>);
    }
    // H2
    else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} style={{fontSize:18,fontWeight:700,color:C.ink,margin:"32px 0 12px",borderLeft:`3px solid ${C.accent}`,paddingLeft:12}}>{renderInline(line.slice(3))}</h2>);
    }
    // H3
    else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} style={{fontSize:15,fontWeight:700,color:"#2d3748",margin:"20px 0 8px"}}>{renderInline(line.slice(4))}</h3>);
    }
    // H4
    else if (line.startsWith("#### ")) {
      elements.push(<h4 key={i} style={{fontSize:13,fontWeight:700,color:C.muted,margin:"12px 0 6px",letterSpacing:0.5,textTransform:"uppercase",fontFamily:"'DM Mono',monospace"}}>{line.slice(5)}</h4>);
    }
    // Blockquote
    else if (line.startsWith("> ")) {
      elements.push(<blockquote key={i} style={{margin:"12px 0",padding:"10px 16px",background:C.accentLight,borderLeft:`3px solid ${C.accent}`,borderRadius:"0 6px 6px 0",fontSize:13,color:C.ink,lineHeight:1.6,fontStyle:"italic"}}>{renderInline(line.slice(2))}</blockquote>);
    }
    // HR
    else if (line.trim()==="---" || line.trim()==="***") {
      elements.push(<hr key={i} style={{border:"none",borderTop:`1px solid ${C.border}`,margin:"20px 0"}}/>);
    }
    // Code block
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
    // Bullet list item (- or *)
    else if (/^(\s*)[*\-]\s/.test(line)) {
      const indent = line.match(/^(\s*)/)[1].length;
      const text = line.replace(/^\s*[*\-]\s/, "");
      const isTask = text.startsWith("**TASK-");
      elements.push(
        <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,margin:"4px 0",paddingLeft:indent*12}}>
          <span style={{color:isTask?C.accent:C.muted,marginTop:3,flexShrink:0,fontSize:12}}>
            {isTask?"▸":"•"}
          </span>
          <span style={{fontSize:13,color:C.ink,lineHeight:1.6}}>{renderInline(text)}</span>
        </div>
      );
    }
    // Numbered list
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
    // Meta line (bold key: value)
    else if (line.startsWith("**") && line.includes("**:")) {
      elements.push(<p key={i} style={{fontSize:13,color:C.ink,lineHeight:1.7,margin:"4px 0"}}>{renderInline(line)}</p>);
    }
    // Empty line
    else if (line.trim()==="") {
      if (elements.length > 0) elements.push(<div key={i} style={{height:6}}/>);
    }
    // Normal paragraph
    else if (line.trim()) {
      elements.push(<p key={i} style={{fontSize:13,color:C.ink,lineHeight:1.75,margin:"6px 0"}}>{renderInline(line)}</p>);
    }
    i++;
  }
  return <>{elements}</>;
}

function renderInline(text) {
  // Parse **bold**, `code`, and key: value patterns
  const parts = [];
  let remaining = text;
  let idx = 0;
  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const codeMatch = remaining.match(/`(.+?)`/);
    const first = [boldMatch, codeMatch]
      .filter(Boolean)
      .sort((a,b) => a.index - b.index)[0];
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
function DetailDrawer({card,onClose,onAIReview,onAIDesign,reviewing,onMoveCard}) {
  if(!card) return null;
  const r=card.aiResult;
  return (
    <div style={{position:"fixed",right:0,top:0,bottom:0,width:"60vw",minWidth:560,background:C.white,borderLeft:`1px solid ${C.border}`,zIndex:100,boxShadow:"-12px 0 48px rgba(0,0,0,0.14)",display:"flex",flexDirection:"column",animation:"slideIn 0.22s ease"}}>
      <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
      {/* Header */}
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
      {/* Body */}
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
      {/* Fixed bottom bar */}
      <div style={{position:"sticky",bottom:0,padding:"14px 28px",background:C.white,borderTop:`1px solid ${C.border}`,display:"flex",gap:10,alignItems:"center",flexShrink:0,boxShadow:"0 -4px 20px rgba(0,0,0,0.07)"}}>
        <button onClick={()=>onAIReview(card)} disabled={reviewing}
          style={{flex:2,padding:"11px 0",borderRadius:8,border:"none",cursor:reviewing?"wait":"pointer",background:reviewing?C.border:C.accent,color:reviewing?C.muted:"#fff",fontWeight:600,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:7,boxShadow:reviewing?"none":`0 2px 8px ${C.accent}44`}}>
          <span>{reviewing?"⟳":"✦"}</span>{reviewing?"AI 分析中…":"AI 智能评审"}
        </button>
        <button onClick={()=>onAIDesign(card)}
          style={{flex:2,padding:"11px 0",borderRadius:8,border:"none",cursor:"pointer",background:C.purple,color:"#fff",fontWeight:600,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:7,boxShadow:`0 2px 8px ${C.purple}44`}}>
          <span>✐</span> AI 设计
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
function DesignStudio({ cards, focusCardId, onBack, onUpdateDocs, onSave }) {
  const [selectedKey, setSelectedKey] = useState(`${focusCardId}:prd`);
  const [generating, setGenerating] = useState(null); // "REQ-001:prd"
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");
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

  const handleGenerate = async () => {
    if (!selCard || !selDocType) return;
    const genKey = `${selCard.id}:${selDocType}`;
    setGenerating(genKey);
    try {
      const content = await callAIDoc(selCard, selDocType);
      const newDocs = { ...selCard.docs, [selDocType]: content };
      onUpdateDocs(selCard.id, newDocs);
    } catch (e) {
      console.error(e);
    }
    setGenerating(null);
  };

  const handleSaveEdit = () => {
    const newDocs = { ...selCard.docs, [selDocType]: editText };
    onUpdateDocs(selCard.id, newDocs);
    setEditMode(false);
  };

  const enterEdit = () => {
    setEditText(selContent || "");
    setEditMode(true);
  };

  const isGenerating = generating === `${selCardId}:${selDocType}`;

  // Sidebar tree item
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
            const isActiveCard = card.id === selCardId;
            return (
              <div key={card.id}>
                {/* Card root */}
                <FolderItem
                  label={<span><span style={{fontSize:9,padding:"1px 4px",background:`${priorityColor(card.priority)}22`,color:priorityColor(card.priority),borderRadius:2,marginRight:5,fontFamily:"'DM Mono',monospace"}}>{card.priority}</span>{card.id}</span>}
                  open={isExpanded}
                  onToggle={()=>setExpanded(e=>({...e,[card.id]:!e[card.id]}))}
                  indent={0}
                  count={Object.values(docs).filter(Boolean).length}
                />
                {isExpanded && (
                  <div>
                    {/* Card title hint */}
                    <div style={{padding:"2px 8px 4px 24px"}}>
                      <div style={{fontSize:11,color:C.sbMuted,lineHeight:1.3,paddingLeft:8,borderLeft:`2px solid #313150`}}>
                        {card.title.length>28?card.title.slice(0,28)+"…":card.title}
                      </div>
                    </div>
                    {/* 产品需求 SPEC */}
                    <TreeItem
                      label="产品需求 SPEC"
                      icon="📋"
                      indent={1}
                      active={selectedKey===`${card.id}:prd`}
                      onClick={()=>{setSelectedKey(`${card.id}:prd`);setEditMode(false);}}
                      hasDoc={!!docs.prd}
                      color="#a6e3a1"
                    />
                    {/* 开发需求 SPEC folder */}
                    <FolderItem
                      label="开发需求 SPEC"
                      open={isDevExpanded}
                      onToggle={()=>setDevExpanded(e=>({...e,[card.id]:!e[card.id]}))}
                      indent={1}
                      count={devDocCount}
                    />
                    {isDevExpanded && (
                      <>
                        {[
                          {key:"proposal",label:"Proposal",icon:"💡"},
                          {key:"design",  label:"Design",  icon:"🏗"},
                          {key:"tasks",   label:"Tasks",   icon:"✅"},
                        ].map(d=>(
                          <TreeItem
                            key={d.key}
                            label={d.label}
                            icon={d.icon}
                            indent={2}
                            active={selectedKey===`${card.id}:${d.key}`}
                            onClick={()=>{setSelectedKey(`${card.id}:${d.key}`);setEditMode(false);}}
                            hasDoc={!!docs[d.key]}
                          />
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
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"#fff"}}>

          {/* Doc header tab bar */}
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

          {/* Content area */}
          <div style={{flex:1,overflowY:"auto"}}>
            {!selCard ? (
              <EmptyState icon="📂" title="请从左侧选择文档" desc="选择一个需求和文档类型开始编辑"/>
            ) : editMode ? (
              /* Edit mode: full textarea */
              <div style={{padding:"24px 36px",height:"100%",boxSizing:"border-box"}}>
                <textarea
                  value={editText}
                  onChange={e=>setEditText(e.target.value)}
                  style={{width:"100%",height:"calc(100vh - 180px)",padding:"16px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,color:C.ink,background:C.cream,outline:"none",resize:"none",lineHeight:1.75,fontFamily:"'DM Mono',monospace",boxSizing:"border-box"}}
                  onFocus={e=>{e.target.style.borderColor=C.accent;e.target.style.boxShadow=`0 0 0 3px ${C.accentLight}`}}
                  onBlur={e=>{e.target.style.borderColor=C.border;e.target.style.boxShadow="none"}}
                />
              </div>
            ) : selContent ? (
              /* Rendered markdown view */
              <div className="doc-content" style={{padding:"36px 52px",maxWidth:860,animation:"fadeIn 0.3s ease"}}>
                <MarkdownRenderer content={selContent}/>
              </div>
            ) : (
              /* Empty: show generate prompt */
              <GeneratePrompt
                card={selCard}
                docMeta={selDocMeta}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            )}
          </div>
        </div>
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

function GeneratePrompt({card, docMeta, onGenerate, isGenerating}) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",padding:60,textAlign:"center"}}>
      <div style={{fontSize:56,marginBottom:20}}>{docMeta?.icon}</div>
      <div style={{fontSize:20,fontWeight:700,color:C.ink,marginBottom:8}}>{docMeta?.label}</div>
      <div style={{fontSize:14,color:C.muted,marginBottom:6,maxWidth:420}}>该文档尚未生成</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:32,maxWidth:480,lineHeight:1.6,padding:"12px 20px",background:C.cream,borderRadius:8,border:`1px solid ${C.border}`}}>
        <strong style={{color:C.ink}}>需求：</strong>{card?.title}<br/>
        <span style={{color:C.muted,fontSize:12}}>AI 将根据需求信息自动生成完整的 {docMeta?.label} 文档</span>
      </div>
      <button onClick={onGenerate} disabled={isGenerating}
        style={{padding:"13px 36px",borderRadius:10,border:"none",cursor:isGenerating?"wait":"pointer",background:isGenerating?C.border:C.purple,color:isGenerating?C.muted:"#fff",fontWeight:700,fontSize:15,display:"flex",alignItems:"center",gap:10,boxShadow:isGenerating?"none":`0 4px 20px ${C.purple}44`,transition:"all 0.2s"}}>
        {isGenerating
          ? <><span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>⟳</span> AI 生成中…</>
          : <><span style={{fontSize:18}}>✦</span> AI 生成 {docMeta?.label}</>}
      </button>
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
          <button onClick={()=>{if(!form.title.trim())return;onAdd({id:`REQ-${String(Date.now()).slice(-3)}`,col:"backlog",priority:form.priority,title:form.title,desc:form.desc,tags:form.tags.split("，").map(t=>t.trim()).filter(Boolean),author:form.author||"我",date:new Date().toISOString().slice(0,10),userStory:form.userStory,acceptanceCriteria:form.criteria.split("\n").map(c=>c.trim()).filter(Boolean),aiResult:null,docs:mkDocs()});onClose();}}
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
  const [reviewing,setReviewing]   = useState(false);
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

  const handleAIReview=useCallback(async(card)=>{
    setReviewing(true);
    updateCard(card.id,{col:"ai_review"});
    try {
      const result=await callAIReview(card);
      updateCard(card.id,{col:"confirm",aiResult:result});
      notify(`✦ AI评审完成 · ${result.score}分`);
    } catch {
      updateCard(card.id,{col:"reviewing"});
      notify("AI评审失败，请重试",false);
    }
    setReviewing(false);
  },[]);

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

  // ── Design Studio full page ──
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
        />
      </>
    );
  }

  // ── Kanban / Stats ──
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
          <span style={{color:"#444",fontSize:11,fontFamily:"'DM Mono',monospace"}}>产品智能工作台</span>
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
            onAIReview={handleAIReview} onAIDesign={handleAIDesign}
            reviewing={reviewing} onMoveCard={handleMoveCard}/>
        </>
      )}
      {showAdd&&<AddCardModal onAdd={card=>{setCards(cs=>[card,...cs]);notify("需求已创建");}} onClose={()=>setShowAdd(false)}/>}
    </div>
  );
}

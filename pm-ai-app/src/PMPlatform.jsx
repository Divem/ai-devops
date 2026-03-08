import { useState, useCallback, useRef, useMemo, useEffect } from "react";

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
  {id:"submitted", label:"已提交（git commit）",  color:C.muted,  bg:"#f0ede8"},
];

const DONE_COLS = ["approved", "submitted", "rejected"];

const DOC_TYPES = [
  { key:"raw",      label:"原始需求",       icon:"🧾", color:"#6b7280", group:"product" },
  { key:"prd",      label:"产品需求 SPEC",  icon:"📋", color:"#7c6af7", group:"product" },
  { key:"spec",     label:"需求规格说明",    icon:"📝", color:"#8b5cf6", group:"product" },
  { key:"proposal", label:"Proposal",       icon:"💡", color:"#f59e0b", group:"dev" },
  { key:"design",   label:"Design",         icon:"🏗",  color:"#3b82f6", group:"dev" },
  { key:"tasks",    label:"Tasks",          icon:"✅", color:"#10b981", group:"dev" },
];

const priorityColor = p => ({P0:"#c0392b",P1:"#e67e22",P2:"#1a6cf6",P3:C.muted}[p]||C.muted);
const scoreColor    = s => s>=80?C.success:s>=60?C.warn:C.danger;
const scoreBg       = s => s>=80?C.successLight:s>=60?C.warnLight:C.dangerLight;

const REQUIRED_REVIEW_FIELDS = ["title", "desc", "priority", "userStory", "acceptanceCriteria"];
const OVERVIEW_DIMENSIONS = [
  { key: "priority", label: "优先级" },
  { key: "author", label: "负责人" },
  { key: "space", label: "空间" },
  { key: "iteration", label: "迭代" },
];
const DRILLDOWN_LABELS = {
  priority: "优先级",
  author: "负责人",
  space: "空间",
  iteration: "迭代",
  stage: "阶段",
  dateRange: "时间区间",
};

const DEMO_AI_REVIEW_RESULT = {
  score: 83,
  completeness: 85,
  logic: 82,
  risk: 80,
  summary: "这是用于演示流程的示例评审结果。当前需求信息已具备基础完整度，建议在进入研发前补充边界条件和异常路径说明。",
  risks: [
    "关键异常场景描述不足，可能导致测试覆盖不全",
    "跨角色协同边界不明确，可能造成流程扯皮",
    "上线后缺少效果观测指标，难以快速评估收益",
  ],
  suggestions: [
    "补充至少 2 条失败/回退路径验收标准",
    "明确产品、研发、测试在流程中的责任边界",
    "在 PRD 中增加核心指标与验收口径",
  ],
  passed: true,
};

const PRD_EXAMPLE_SOURCE = `# 智能需求分析与设计功能产品设计文档

## 1. 功能概述

本功能旨在将需求管理平台与先进的 AI 辅助设计能力（基于 Claude Code）及标准化设计规范（OpenSpec）深度融合，构建一个从业务需求提出、多轮对话澄清、自动化提案生成、在线评审到 Git 仓库同步的端到端智能需求分析与设计工作流。

## 2. 用户旅程

| 步骤 | 角色 | 动作 | 系统响应 | 产出物 |
| :--- | :--- | :--- | :--- | :--- |
| **1. 触发需求分析** | 业务方/产品经理 | 在需求管理平台创建或选择一个业务需求，点击“AI 辅助分析”按钮。 | 系统启动 AI 助手，加载业务需求上下文。 | 业务需求 ID |
| **2. 多轮对话澄清** | 产品经理 & AI 助手 | 产品经理与 AI 助手进行多轮对话，澄清需求细节、边界、用户场景等。 | AI 助手根据对话内容逐步完善对需求的理解，并实时更新结构化需求草案。 | 结构化需求草案 |
| **3. OpenSpec 提案生成** | 产品经理 | 对话结束后，产品经理指示 AI 助手生成 OpenSpec 提案。 | AI 助手根据结构化需求草案自动生成 proposal/design/specs/tasks。 | OpenSpec 提案包 (草稿) |

### 3.0 需求列表页面 (看板视图)

*   **核心功能**: 提供直观看板视图，支持需求状态流转和管理。
*   **页面布局**: 待评审、评审中、AI 分析中、人工确认、已通过、已拒绝。
*   **需求卡片**: 展示需求编号、优先级、标题、标签、提交日期、负责人、AI 评审分数与建议。
*   **交互操作**: 支持拖拽流转、点击详情、筛选与排序。

### 3.1 AI 需求澄清模块

*   **核心功能**: 产品经理与 AI 助手进行自然语言交互。
*   **AI 助手能力**: 主动提问、AI 评审评分、上下文理解、结构化输出。
*   **关键交互**: 对于关键信息补充，采用 UI 弹框进行确认，以提升信息聚焦。`;

const PRD_EXAMPLE_FALLBACK_TEXT = "示例暂不可用，请按真实业务场景补充原始需求";

function extractPrdExampleSnippet(source) {
  try {
    const text = String(source || "").trim();
    if (!text) {
      return { text: PRD_EXAMPLE_FALLBACK_TEXT, fallback: true };
    }

    const markers = ["## 1. 功能概述", "## 2. 用户旅程", "### 3.0 需求列表页面 (看板视图)", "### 3.1 AI 需求澄清模块"];
    const snippets = markers
      .map((marker) => {
        const start = text.indexOf(marker);
        if (start < 0) return "";
        const next = text.indexOf("\n## ", start + marker.length);
        const end = next > start ? next : text.length;
        return text.slice(start, end).trim();
      })
      .filter(Boolean);

    if (snippets.length === 0) {
      return { text: PRD_EXAMPLE_FALLBACK_TEXT, fallback: true };
    }

    return {
      text: snippets.join("\n\n"),
      fallback: false,
    };
  } catch (error) {
    console.warn("[PRD Example] failed to build snippet:", error);
    return { text: PRD_EXAMPLE_FALLBACK_TEXT, fallback: true };
  }
}

const PRD_EXAMPLE_SNIPPET = extractPrdExampleSnippet(PRD_EXAMPLE_SOURCE);

const RAW_REQUIREMENT_SAMPLE_FROM_PRD = {
  baseInfo: {
    demander: "业务方/产品经理（示例）",
    productManager: "产品经理（示例）",
    reportedAt: "2026-02-24",
    moduleName: "智能需求分析与设计",
    meegoUrl: "",
  },
  content: PRD_EXAMPLE_SNIPPET.fallback
    ? "本示例用于演示原始需求结构。请在接入真实数据后替换为 Meego 同步内容。"
    : PRD_EXAMPLE_SNIPPET.text,
};

const normalizeAcceptanceCriteria = (criteria) => {
  if (Array.isArray(criteria)) return criteria.map(x => String(x || "").trim()).filter(Boolean);
  if (typeof criteria === "string") return criteria.split("\n").map(x => x.trim()).filter(Boolean);
  return [];
};

const safeParseDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const dayDiffFromNow = (value) => {
  const d = safeParseDate(value);
  if (!d) return 0;
  const diff = Date.now() - d.getTime();
  return Math.max(0, Math.round(diff / 86400000));
};

const toPercent = (num, den) => (den > 0 ? Math.round((num / den) * 100) : 0);

function getPeriodKey(date, granularity) {
  const d = safeParseDate(date);
  if (!d) return null;
  if (granularity === "month") {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }
  const copy = new Date(d);
  const day = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - day);
  return `${copy.getFullYear()}-W${String(Math.floor((copy.getDate() - 1) / 7) + 1).padStart(2, "0")}-${String(copy.getMonth() + 1).padStart(2, "0")}`;
}

function periodSortValue(key, granularity) {
  if (!key) return 0;
  if (granularity === "month") {
    const [year, month] = key.split("-").map(Number);
    return year * 100 + month;
  }
  const [year, week, month] = key.split("-");
  return Number(year) * 10000 + Number(month) * 100 + Number((week || "W0").replace("W", ""));
}

function formatPeriodLabel(key, granularity) {
  if (!key) return "未知";
  if (granularity === "month") {
    const [y, m] = key.split("-");
    return `${y}/${m}`;
  }
  const [y, w, m] = key.split("-");
  return `${y}/${m} ${w}`;
}

function checkRequirementCompleteness(card) {
  if (!card) return { isComplete: false, missingFields: [...REQUIRED_REVIEW_FIELDS] };

  const missingFields = [];
  if (!String(card.title || "").trim()) missingFields.push("title");
  if (!String(card.desc || "").trim()) missingFields.push("desc");
  if (!["P0", "P1", "P2", "P3"].includes(card.priority)) missingFields.push("priority");
  if (!String(card.userStory || "").trim()) missingFields.push("userStory");
  if (normalizeAcceptanceCriteria(card.acceptanceCriteria).length === 0) missingFields.push("acceptanceCriteria");

  return {
    isComplete: missingFields.length === 0,
    missingFields,
  };
}

function buildReviewQuestions(missingFields) {
  const questionMap = {
    title: {
      field: "title",
      label: "请补充需求标题",
      placeholder: "例如：需求列表支持高级筛选",
      multiline: false,
      options: null,
    },
    desc: {
      field: "desc",
      label: "请补充需求描述",
      placeholder: "请描述业务背景、目标和核心功能",
      multiline: true,
      options: [
        { label: "看板/列表管理", value: "面向产品团队的需求管理场景，支持查看、筛选、流转与状态追踪。" },
        { label: "评审与协作", value: "面向评审流程，支持自动分析、人工确认和协同反馈闭环。" },
        { label: "其他（填写）", value: "__other__" },
      ],
    },
    priority: {
      field: "priority",
      label: "请选择需求优先级",
      placeholder: "",
      multiline: false,
      options: [
        { label: "P0（紧急）", value: "P0" },
        { label: "P1（高）", value: "P1" },
        { label: "P2（中）", value: "P2" },
        { label: "P3（低）", value: "P3" },
      ],
    },
    userStory: {
      field: "userStory",
      label: "请补充用户故事",
      placeholder: "例如：作为产品经理，我希望...，以便...",
      multiline: true,
      options: [
        { label: "产品经理视角", value: "作为产品经理，我希望系统能自动识别需求信息缺失项并引导补充，以便提升评审质量。" },
        { label: "研发协作视角", value: "作为研发负责人，我希望需求在评审前具备完整上下文，以便减少返工和沟通成本。" },
        { label: "其他（填写）", value: "__other__" },
      ],
    },
    acceptanceCriteria: {
      field: "acceptanceCriteria",
      label: "请补充验收标准",
      placeholder: "每行一条验收标准",
      multiline: true,
      options: [
        { label: "标准模板 A", value: "点击 AI 智能评审时，缺失字段会触发补充弹窗\n支持选择题和填空题补充信息\n补充完成后自动生成评审报告" },
        { label: "标准模板 B", value: "问题面板支持关闭与再次触发\n必填项未填写时阻止提交并提示\n补充内容会同步更新到当前需求" },
        { label: "其他（填写）", value: "__other__" },
      ],
    },
  };

  return missingFields.map((field) => questionMap[field]).filter(Boolean);
}

/* ═══════════════════════════ INITIAL DATA ═══════════════════════════════════ */

// Spec 示例内容：提案评审与修改模块
const DEMO_SPEC_REVIEW = "# 提案评审与修改模块规格说明\n\n**规格 ID**: SPEC-REQ-005 | **版本**: 1.0 | **日期**: 2026/3/5\n\n## 1. 概述\n\n### 1.1 背景与目标\n\n**背景**: AI 生成的 OpenSpec 提案需要产品经理进行人工评审和修改。当前缺乏统一的在线评审界面，产品经理需要在本地编辑 Markdown 文件，导致版本管理困难、协作效率低下。\n\n**目标**: 提供友好的在线评审与修改界面，支持分屏对比、评论批注、版本历史和实时预览，将提案修改效率提升 50%%。\n\n### 1.2 功能定位\n\n本模块是智能需求分析与设计工作流的第四阶段，位于\"提案生成\"之后、\"Git 同步\"之前。\n\n## 2. 功能规格\n\n### 2.1 评审视图\n\n**分屏对比模式**\n- 左侧：AI 生成的原始提案草稿（只读）\n- 右侧：产品经理编辑后的版本（可编辑）\n- 差异高亮：自动标记已修改的段落\n- 同步滚动：两侧内容联动滚动\n\n**评论批注系统**\n- 支持段落级评论：选中任意文本添加批注\n- 批注状态：待解决 / 已解决\n- @ 提醒：可 @ 相关人员参与讨论\n- 批注导出：支持导出批注为 Markdown\n\n**版本历史管理**\n- 自动保存：每次编辑自动生成版本快照\n- 版本对比：任意两个版本间的差异对比\n- 版本恢复：一键恢复到历史版本\n- 版本标签：支持为重要版本添加标签\n\n### 2.2 修改工具\n\n**富文本编辑器**\n- 工具栏：加粗、斜体、标题、列表、引用、代码块\n- 快捷键：支持 Markdown 快捷键输入\n- 表格编辑：可视化表格编辑器\n- 图片粘贴：支持直接粘贴截图\n\n**Markdown 实时预览**\n- 分屏预览：编辑区与预览区并排显示\n- 语法高亮：代码块自动语法高亮\n- 数学公式：支持 LaTeX 公式渲染\n- Mermaid 图表：支持流程图、时序图渲染\n\n**OpenSpec 格式验证**\n- 实时校验：自动检查 OpenSpec 格式规范\n- 错误提示：标出不规范的章节和格式\n- 格式修复：一键修复常见格式问题\n\n### 2.3 状态管理\n\n| 状态 | 描述 | 可执行操作 |\n|------|------|-----------|\n| 草稿 | AI 生成后初始状态 | 编辑、预览、删除 |\n| 待评审 | 提交评审申请 | 评论、批准、退回 |\n| 已确认 | 产品经理确认通过 | 同步至 Git |\n\n## 3. UI 规格\n\n### 3.1 页面布局\n\n```\n+-------------------------------------------------------------+\n|  提案评审: 提案评审与修改模块                    [保存][提交] |\n+---------------------+---------------------------------------+\n| ◆ AI 草稿           | ◆ 编辑版本                             |\n| +-----------------+ | +-----------------------------------+ |\n| | proposal.md     | | | [B] I [H] v 插入表格           | |\n| | (只读)          | | +-----------------------------------+ |\n| |                 | | | # 提案评审与修改模块            | |\n| | ...内容...      | | |                                 | |\n| |                 | | | ...内容...                      | |\n| +-----------------+ | |                                 | |\n+---------------------+ |                                 | |\n| [版本历史] [评论]    | |                                 | |\n+---------------------+-+-----------------------------------+-+\n+-------------------------------------------------------------+\n| 💬 批注 (3)                                     [添加批注]   |\n| • @张三: 这里的验收标准需要补充...  [待解决]  [回复]         |\n| • @李四: 同意，建议修改为...        [已解决]                 |\n+-------------------------------------------------------------+\n```\n\n### 3.2 交互设计\n\n- **拖拽调整**: 分屏比例可拖拽调整\n- **快捷键**: Cmd+S 保存、Cmd+K 提交、Cmd+P 预览\n- **状态指示**: 顶部实时显示\"已保存\"或\"未保存\"状态\n\n## 4. 数据规格\n\n### 4.1 数据模型\n\n```typescript\ninterface ProposalVersion {\n  id: string;\n  proposalId: string;\n  content: {\n    proposal: string;\n    design: string;\n    specs: string;\n    tasks: string;\n  };\n  createdAt: Date;\n  createdBy: string;\n  comment?: string;\n}\n\ninterface ProposalComment {\n  id: string;\n  proposalId: string;\n  targetDoc: \"proposal\" | \"design\" | \"specs\" | \"tasks\";\n  targetLine: number;\n  content: string;\n  author: string;\n  status: \"pending\" | \"resolved\";\n  mentions: string[];\n  createdAt: Date;\n}\n```\n\n### 4.2 API 接口\n\n| 接口 | 方法 | 描述 |\n|------|------|------|\n| /api/proposals/{id}/versions | GET | 获取版本历史 |\n| /api/proposals/{id}/versions/{vid} | GET | 获取指定版本内容 |\n| /api/proposals/{id}/diff | GET | 对比两个版本差异 |\n| /api/proposals/{id}/comments | GET | 获取批注列表 |\n| /api/proposals/{id}/comments | POST | 添加批注 |\n| /api/proposals/{id}/status | PUT | 更新提案状态 |\n\n### 4.3 存储策略\n\n- **版本存储**: 增量存储，仅保存变更部分\n- **批注存储**: 独立存储，关联提案 ID\n- **缓存策略**: 编辑中内容本地缓存，5 分钟自动上传\n";

const mkDocs = () => ({ prd:null, proposals:[] });

// AI Fallback 示例内容
const FALLBACK_TRENDS = (() => {
  const now = new Date();
  const newCounts = [4, 6, 8, 7, 9, 10];
  const approvedCounts = [2, 3, 5, 5, 7, 8];
  const backlogs = [2, 5, 8, 10, 12, 14];
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    return { key: `${y}-${m}`, label: `${y}/${m}`, newCount: newCounts[i], approved: approvedCounts[i], rejected: 0, backlog: backlogs[i] };
  });
})();

const FALLBACK_DOCS = {
  prd: `> ⚠️ 以下为示例内容，非 AI 实时生成

# 产品需求 SPEC：智能需求分析与设计工作台

**版本**: 1.0 | **日期**: 2026-03

## 1. 功能概述

本功能将需求管理平台与 AI 辅助设计能力（Claude API）及标准化设计规范（OpenSpec）深度融合，构建从业务需求提出、多轮对话澄清、自动化提案生成、在线评审到 Git 仓库同步的端到端智能需求分析与设计工作流。

## 2. 用户旅程

| 步骤 | 角色 | 动作 | 产出物 |
|------|------|------|--------|
| 1. 触发需求分析 | 产品经理 | 选择需求，点击"AI 辅助分析" | 需求 ID |
| 2. 多轮对话澄清 | 产品经理 & AI | 对话澄清需求细节、边界、场景 | 结构化需求草案 |
| 3. 提案生成 | 产品经理 | 指示 AI 生成 OpenSpec 提案 | 提案包（草稿） |
| 4. 提案评审 | 产品经理 | 查看并修改 AI 生成内容 | 提案包（待确认） |
| 5. Git 同步 | 产品经理 | 确认后同步至 Git 仓库 | Commit / PR |

## 3. 核心功能模块

### 3.1 需求看板（Kanban）
- **列阶段**：待评审 → 评审中 → AI 分析中 → 人工确认 → 已通过 / 已拒绝
- **卡片信息**：需求编号、优先级（P0-P3）、标题、标签、AI 评审分数
- **交互**：拖拽流转、点击详情、空间/迭代多选过滤

### 3.2 AI 需求澄清
- 多轮对话，AI 主动提问澄清边界和场景
- 实时结构化输出：用户故事、功能列表、非功能性需求

### 3.3 OpenSpec 提案生成
- 一键生成：proposal.md / design.md / specs/delta.md / tasks.md
- 在线预览与编辑，版本管理

## 4. 验收标准

- [ ] 看板 6 列正常显示，支持拖拽流转
- [ ] AI 评审分数展示（0-100）
- [ ] 文档树支持多提案文件夹结构
- [ ] AI 生成文档在 API 失败时提供示例内容入口`,

  proposal: `> ⚠️ 以下为示例内容，非 AI 实时生成

## Why

当前需求管理平台缺乏统一的在线评审界面，产品经理需在本地编辑 Markdown 文件，导致版本管理困难、协作效率低下。

## What Changes

- 新增需求详情页三栏布局（文档树 / 文档编辑 / CHATBOT）
- AI 自动生成 PRD 和 OpenSpec 提案包（Proposal / Design / Delta Spec / Tasks）
- 文档树支持多提案文件夹展开/收起
- 支持 Claude 和 GLM-4 双模型切换

## Capabilities

### New Capabilities
- \`requirement-detail-page\`: 需求详情三栏页面
- \`multi-proposal-doc-tree\`: 文档树支持多提案文件夹
- \`ai-doc-generation\`: AI 一键生成各类文档

### Modified Capabilities
（无）

## Impact

- \`pm-ai-app/src/PMPlatform.jsx\`：DetailPage 组件新增，DocTreeSidebar 重构
- AI 客户端：统一 AIClient 接口，支持多模型`,

  design: `> ⚠️ 以下为示例内容，非 AI 实时生成

## Context

需求详情页需要同时展示文档树、文档编辑区、AI 对话三个区域，且支持多提案文件夹结构。当前平铺结构无法扩展到多提案场景。

## Goals / Non-Goals

**Goals:**
- 三栏布局：左侧文档树 / 中间编辑 / 右侧 CHATBOT+参考资料
- 数据结构从 \`{prd, spec, proposal, design, tasks}\` 升级为 \`{prd, proposals: [...]}\`
- normalizeDocs() 兼容旧数据结构

**Non-Goals:**
- 不做 Git 同步功能
- 不做多人协作/实时编辑

## Decisions

**D1：数据结构迁移**
新增 \`normalizeDocs()\` 函数，将旧平铺格式自动转换为新 proposals 数组格式，确保向后兼容。

**D2：文档树渲染**
- proposals.length >= 2：文件夹模式，每个提案为可展开文件夹
- proposals.length === 1：平铺模式，向后兼容

**D3：selectedKey 格式扩展**
从 \`cardId:docType\` 扩展到 \`cardId:p:proposalId:docType\`，区分 PRD 和提案文档。

## Risks / Trade-offs

- [selectedKey 格式变更] 影响所有依赖 selectedKey 的逻辑 → 通过 parts[1]==="p" 条件分支处理`,

  spec: `> ⚠️ 以下为示例内容，非 AI 实时生成

## ADDED Requirements

### Requirement: 多提案文件夹结构
文档树 SHALL 支持将一个 PRD 拆解为多个 OpenSpec 提案，每个提案以独立文件夹展示。

#### Scenario: 多提案时渲染文件夹
- **WHEN** 需求 docs.proposals 数组长度 >= 2
- **THEN** 每个提案以 📁 文件夹形式显示，支持点击展开/收起

#### Scenario: 单提案时向后兼容
- **WHEN** 需求 docs.proposals 数组长度为 1
- **THEN** 文档项平铺显示，不显示文件夹层级

### Requirement: PRD 始终置顶
产品需求 SPEC (PRD) SHALL 始终显示在文档树顶层，不归属于任何提案文件夹。

#### Scenario: PRD 显示位置
- **WHEN** 用户打开需求详情页
- **THEN** 📋 产品需求 SPEC 显示在文档树第一项`,

  tasks: `> ⚠️ 以下为示例内容，非 AI 实时生成

## 1. 数据结构迁移

- [ ] 1.1 新增 \`normalizeDocs()\` 兼容函数
- [ ] 1.2 更新 \`mkDocs()\` 返回新格式 \`{ prd: null, proposals: [] }\`
- [ ] 1.3 更新 INITIAL_CARDS 中 REQ-005 为多提案示例数据

## 2. DocTreeSidebar 重构

- [ ] 2.1 新增 \`ProposalFolder\` 子组件
- [ ] 2.2 多提案模式：渲染可展开文件夹
- [ ] 2.3 单提案模式：平铺渲染（向后兼容）

## 3. selectedKey 格式扩展

- [ ] 3.1 新增格式 \`cardId:p:proposalId:docType\` 用于提案文档
- [ ] 3.2 DetailPage 中解析新格式，提取 proposalId 和 docType
- [ ] 3.3 updateDocContent() 支持 proposalId 参数

## 4. DocEditor 更新

- [ ] 4.1 新增 \`proposalName\` prop，头部显示提案名 / 文档类型
- [ ] 4.2 PROPOSAL_DOC_TYPES 常量覆盖 proposal / design / spec / tasks

## 5. 验证

- [ ] 5.1 REQ-005 多提案文件夹展开/收起正常
- [ ] 5.2 PRD 文档始终显示在文档树顶层
- [ ] 5.3 各文档类型内容正确渲染`
};

/**
 * 将旧版平铺 docs 结构迁移到新版 proposals 数组结构
 * 旧: { prd, spec, proposal, design, tasks }
 * 新: { prd, proposals: [{ id, name, proposal, design, spec, tasks }] }
 */
function normalizeDocs(docs) {
  if (!docs) return { prd: null, proposals: [] };
  if (Array.isArray(docs.proposals)) return docs; // 已是新格式
  // 旧格式迁移
  const { prd, spec, proposal, design, tasks } = docs;
  const hasContent = spec || proposal || design || tasks;
  return {
    prd: prd || null,
    proposals: hasContent ? [{ id:"default", name:"OpenSpec 提案", proposal:proposal||null, design:design||null, spec:spec||null, tasks:tasks||null }] : [],
  };
}

function firstNonEmptyValue(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function toSafeHttpUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const parsed = new URL(value.trim());
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : '';
  } catch {
    return '';
  }
}

function getRawRequirementBaseInfo(card) {
  const rawRequirementMeta = card?.rawRequirementMeta || {};
  return {
    demander: firstNonEmptyValue(
      rawRequirementMeta.demander,
      rawRequirementMeta.requester,
      rawRequirementMeta.requirementFrom,
      rawRequirementMeta.requirementOwner,
      card?.demander,
      card?.requester,
      card?.requirementFrom,
      card?.requirementOwner,
    ),
    productManager: firstNonEmptyValue(
      rawRequirementMeta.productManager,
      rawRequirementMeta.pm,
      rawRequirementMeta.pmName,
      rawRequirementMeta.ownerPm,
      card?.productManager,
      card?.pm,
      card?.pmName,
      card?.ownerPm,
    ),
    reportedAt: firstNonEmptyValue(
      rawRequirementMeta.reportedAt,
      rawRequirementMeta.reportTime,
      rawRequirementMeta.submittedAt,
      rawRequirementMeta.submitTime,
      rawRequirementMeta.createdAt,
      card?.reportedAt,
      card?.reportTime,
      card?.submittedAt,
      card?.submitTime,
      card?.createdAt,
      card?.date,
    ),
    moduleName: firstNonEmptyValue(
      rawRequirementMeta.module,
      rawRequirementMeta.moduleName,
      rawRequirementMeta.bizModule,
      rawRequirementMeta.subsystem,
      card?.module,
      card?.moduleName,
      card?.bizModule,
      card?.subsystem,
    ),
    meegoUrl: toSafeHttpUrl(firstNonEmptyValue(
      rawRequirementMeta.meegoUrl,
      rawRequirementMeta.meegoLink,
      rawRequirementMeta.meego,
      rawRequirementMeta.link,
      card?.meegoUrl,
      card?.meegoLink,
      card?.meego,
      card?.meegoRequirementUrl,
    )),
  };
}

function getDisplayRawRequirement(card) {
  const rawRequirement = typeof card?.rawRequirement === 'string' ? card.rawRequirement : '';
  const rawBaseInfo = getRawRequirementBaseInfo(card);
  const hasRealRaw = Boolean(rawRequirement.trim());

  return {
    content: hasRealRaw ? rawRequirement : RAW_REQUIREMENT_SAMPLE_FROM_PRD.content,
    baseInfo: {
      demander: firstNonEmptyValue(rawBaseInfo.demander, RAW_REQUIREMENT_SAMPLE_FROM_PRD.baseInfo.demander),
      productManager: firstNonEmptyValue(rawBaseInfo.productManager, RAW_REQUIREMENT_SAMPLE_FROM_PRD.baseInfo.productManager),
      reportedAt: firstNonEmptyValue(rawBaseInfo.reportedAt, RAW_REQUIREMENT_SAMPLE_FROM_PRD.baseInfo.reportedAt),
      moduleName: firstNonEmptyValue(rawBaseInfo.moduleName, RAW_REQUIREMENT_SAMPLE_FROM_PRD.baseInfo.moduleName),
      meegoUrl: rawBaseInfo.meegoUrl,
    },
    isSample: !hasRealRaw,
  };
}
const KANBAN_SPACES = ['马上消费', '中科金得助', '枭龙云国内', '枭龙云国际', '集团'];

const KANBAN_SUBSYSTEMS = ['消费金融', '企业服务', '云平台', '集团中台'];

const KANBAN_APPS = {
  '消费金融': ['马上消费App', '白条', '风控平台'],
  '企业服务': ['金得助', '供应链', '报表中心'],
  '云平台': ['枭龙云控制台', '枭龙云API', '云监控'],
  '集团中台': ['统一认证', '消息中心', '数据湖'],
};

const KANBAN_ITERATIONS = [
  '迭代-20260301', '迭代-20260215', '迭代-20260201',
  '迭代-20260115', '迭代-20260101', '迭代-20251215',
];

const BASE_INITIAL_CARDS = [
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
    docs: {
      prd: `# PRD: 需求列表页面（看板视图）

## 1. 产品概述

### 1.1 核心价值
提供一个直观的多列看板视图，展示从 Meego 同步过来的业务需求，支持拖拽流转、筛选排序和 AI 评审分数展示，作为整个智能需求管理工作台的核心入口。

### 1.2 目标用户
- 产品经理：管理需求、处理评审流程
- 开发人员：查看需求、领取任务
- 业务方：提交和跟踪需求

## 2. 功能需求

### 2.1 看板展示
- **列定义**：待评审、评审中、AI 分析中、人工确认、已通过、已拒绝
- **卡片信息**：需求编号、优先级、标题、标签、AI 评分、负责人、提交日期
- **筛选功能**：按负责人、优先级、状态、标签筛选
- **排序功能**：按日期、优先级、AI 评分排序

### 2.2 交互操作
- **拖拽流转**：拖动卡片改变需求状态
- **点击详情**：点击卡片进入需求详情页
- **快速操作**：右键菜单支持复制、移动、归档

### 2.3 数据同步
- **Meego 同步**：定时从 Meego 拉取新需求（每 15 分钟）
- **状态映射**：Meego 状态 → 看板列
- **双向同步**：支持将处理状态回写至 Meego（可选）

## 3. 验收标准

- [ ] 6 列看板正常显示
- [ ] 支持拖拽改变需求阶段
- [ ] 需求卡片展示完整信息
- [ ] 筛选和排序功能正常
- [ ] Meego 数据同步正常
- [ ] 移动端适配完成`,
      proposals: [
        {
          id: "checkout-flow",
          name: "购买流程优化",
          proposal: `# Proposal: 购买流程优化

## 1. Intent

### Problem Statement
当前用户购买流程步骤过多，导致转化率下降。

### Goal
- 简化购买流程
- 提升转化率 20%

## 2. Scope

### In Scope
- 购买流程重构
- 支付方式集成

### Out of Scope
- 订单管理系统

## 3. Approach

采用分步引导模式，减少页面跳转

## 4. Metrics

- 转化率提升 ≥ 20%
- 购买完成时间减少 ≥ 30%`,
          design: `# Design: 购买流程优化

## 1. Architecture

### Components
- PurchaseFlow: 购买流程主组件
- ProductSelector: 产品选择器
- PaymentForm: 支付表单
- OrderConfirmation: 订单确认

### User Flow
1. 选择产品 → 2. 填写信息 → 3. 支付 → 4. 确认

## 2. Technical Solution

### Frontend
- React 组件化
- 状态管理：React Context

### API
- POST /api/orders
- GET /api/products`,
          spec: `# Spec: 购买流程优化

## 1. Overview
购买流程优化是提升用户体验的关键功能。

## 2. Functional Requirements
- FR-01: 产品选择
- FR-02: 信息填写
- FR-03: 支付处理
- FR-04: 订单确认`,
          tasks: `# Tasks: 购买流程优化

## Frontend Tasks
- TASK-FE-001: 购买流程组件开发 (16h)
- TASK-FE-002: 支付表单开发 (12h)

## Backend Tasks
- TASK-BE-001: 订单 API 开发 (8h)
- TASK-BE-002: 支付集成 (16h)

**Total**: 52h`
        }
      ]
    },
    references: [
      { type: "feishu", title: "飞书需求文档 - 看板视图规划", url: "https://www.github.com" },
      { type: "prd",    title: "PRD v1.0 - 需求列表与看板", url: "https://www.github.com" },
      { type: "spec",   title: "OpenSpec: kanban-filter",    url: "https://www.github.com" },
    ]
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
    docs: {
      prd: `# PRD: AI 需求澄清模块

## 1. 产品概述

### 1.1 核心价值
集成在需求详情页的对话界面，产品经理与 AI 助手多轮对话澄清需求。AI 主动提问、实时结构化输出、支持 UI 弹框确认，并持续评估需求的完整性、逻辑性和风险。

### 1.2 目标用户
- 产品经理：与 AI 对话澄清需求细节
- AI 助手：主动提问、评估需求质量

## 2. 功能需求

### 2.1 AI 助手能力
- **主动提问**：根据需求内容，AI 主动提出关键问题
- **AI 评审与评分**：从完整性、逻辑性、风险三维度评分
- **上下文理解**：持续理解对话上下文，避免重复提问
- **结构化输出**：实时将对话内容提炼为结构化需求

### 2.2 交互界面
- **聊天窗口**：支持 Markdown 格式输入输出
- **关键确认弹框**：关键决策通过 Modal 弹框确认
- **结构化视图**：右侧实时展示结构化需求草案

### 2.3 评分展示
- **AI 评审分数**：0-100 分
- **AI 建议**：建议通过 / 建议修改 / 建议拒绝
- **风险提示**：列出识别的潜在风险

## 3. 验收标准

- [ ] AI 首轮回复延迟 ≤ 3 秒
- [ ] 支持上下文多轮对话（最多 10 轮历史）
- [ ] 关键确认通过 Modal 弹框呈现
- [ ] 实时输出结构化需求草案
- [ ] 从完整性 / 逻辑性 / 风险三维度评分`,
      proposals: []
    },
    references: [
      { type: "feishu", title: "飞书需求文档 - AI 需求澄清设计", url: "https://www.github.com" },
      { type: "prd",    title: "PRD v0.9 - AI 对话模块",         url: "https://www.github.com" },
    ]
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
    docs: {
      prd: null,
      proposals: [
        {
          id: "spec-framework",
          name: "规范框架扩展模块",
          proposal: `# Proposal: 规范框架扩展模块

## 1. Intent

### Problem Statement
当前团队设计文档格式不统一，需要支持多种 SDD 框架。

### Goal
- 支持至少 2 种 SDD 框架的一键切换
- 新框架接入周期 ≤ 3 天

## 2. Scope

### In Scope
- 规范框架管理后台
- 插件化框架接入机制
- OpenSpec 适配器实现
- 规范适配器接口定义

### Out of Scope
- 其他 SDD 框架具体适配（V2.0）
- 自定义框架可视化编辑器

## 3. Approach

采用"适配器模式 + 模板引擎"架构

## 4. Metrics

- 框架切换成功率 ≥ 99%
- 生成文档格式合规率 ≥ 95%`,
          design: null,
          spec: null,
          tasks: null
        }
      ]
    }
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
    docs: {
      prd: null,
      proposals: [
        {
          id: "proposal-gen",
          name: "提案生成模块",
          proposal: `# Proposal: 提案生成模块

## 1. Intent

### Problem Statement
产品经理手动撰写提案文档效率低下，质量参差不齐。

### Goal
- 生成时间从 3 小时降至 15 分钟
- 格式合规率从 60% 提升至 95%

## 2. Scope

### In Scope
- 提案生成引擎
- 模板管理
- 流式输出
- 预览编辑

### Out of Scope
- 文档版本管理
- Git 同步功能

## 3. Approach

AI 生成 + 模板填充的混合架构

## 4. Metrics

- 文档生成成功率 ≥ 98%
- 用户满意度 ≥ 4.0/5.0`,
          design: `# Design: 提案生成模块

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
- Editor: Monaco Editor`,
          spec: null,
          tasks: `# Tasks: 提案生成模块

## Backend Tasks
- TASK-BE-001: 生成编排器开发 (16h)
- TASK-BE-002: Prompt 构建器开发 (20h)
- TASK-BE-003: 内容生成器开发 (16h)
- TASK-BE-004: 文档组装器开发 (12h)
- TASK-BE-005: 模板管理 API 开发 (10h)

## Frontend Tasks
- TASK-FE-001: 生成入口与进度展示 (12h)
- TASK-FE-002: Markdown 编辑器集成 (16h)
- TASK-FE-003: 实时预览组件 (10h)
- TASK-FE-004: 文档包概览与导航 (8h)

## Data Tasks
- TASK-DB-001: 生成任务表设计 (6h)
- TASK-DB-002: 模板存储表设计 (4h)

**Total**: 130h`
        }
      ]
    }
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
    docs: {
      prd: null,
      proposals: [
        {
          id: "proposal-review",
          name: "提案评审与修改模块",
          proposal: `# Proposal: 提案评审与修改模块

## 1. Intent

### Problem Statement
AI 生成的提案需要评审和修改，当前需要复制到外部工具。

### Goal
- 评审效率提升 50%
- 团队协作评审覆盖率达到 80%

## 2. Scope

### In Scope
- 分屏对比视图
- 评论批注功能
- 版本历史管理
- 提案状态流转

### Out of Scope
- 多人实时协同编辑

## 3. Approach

在线编辑器 + 版本快照架构

## 4. Metrics

- 评审完成率 ≥ 90%
- 版本回溯使用率 ≥ 20%`,
          design: `# Design: 提案评审与修改模块

## Components
- ReviewEditor: 在线 Markdown 编辑器
- VersionManager: 版本快照管理
- DiffEngine: 分屏对比引擎
- CommentService: 评论批注服务

## Data Model
- ProposalVersion: id, proposal_id, version, content, created_by
- Comment: id, proposal_id, line_start, line_end, content, author

## API
- GET /api/v1/proposals/:id/versions
- POST /api/v1/proposals/:id/versions
- GET /api/v1/proposals/:id/versions/:v1/diff/:v2`,
          spec: `# Delta Spec: 评审编辑器核心功能

## ADDED Requirements

### Requirement: split-view-editor
分屏对比模式：左侧 AI 草稿（只读），右侧编辑版本（可编辑），支持同步滚动和差异高亮。

### Requirement: version-snapshot
版本历史快照：每次保存自动生成版本记录，支持任意版本回溯和对比差异。`,
          tasks: `# Tasks: 提案评审与修改模块

## Backend Tasks
- TASK-BE-001: 版本管理 API (8h)
- TASK-BE-002: 评论 CRUD API (10h)
- TASK-BE-003: Diff 计算服务 (12h)

## Frontend Tasks
- TASK-FE-001: Monaco Editor 集成 (16h)
- TASK-FE-002: 分屏对比视图 (12h)
- TASK-FE-003: 评论批注 UI (10h)
- TASK-FE-004: 版本历史面板 (8h)

## Data Tasks
- TASK-DB-001: 版本表和评论表设计 (6h)

**Total**: 82h`
        },
        {
          id: "comment-annotation",
          name: "评论批注系统",
          proposal: `# Proposal: 评论批注系统

## 1. Intent

### Problem Statement
产品经理和团队成员在评审 AI 生成提案时，无法在文档中直接留下评论和批注，导致反馈意见分散在即时通讯工具中，难以追踪和管理。

### Goal
- 提案批注覆盖率达到 80%（所有提案至少有 1 条批注）
- 批注解决效率提升 60%（从分散工具收归到平台内）

## 2. Scope

### In Scope
- 段落级评论批注（选中文本 → 添加批注）
- 批注状态管理：待解决 / 已解决
- @ 提醒相关人员
- 批注导出为 Markdown

### Out of Scope
- 实时协同编辑（另立需求）
- 邮件通知集成

## 3. Approach

独立的批注服务，与提案版本管理解耦。批注以 JSON 存储，关联提案 ID 和文档行号。

## 4. Metrics
- 批注响应时间 < 200ms
- 批注数据不丢失率 ≥ 99.9%`,
          design: `# Design: 评论批注系统

## 组件设计

### CommentOverlay
- 叠加在文档编辑器右侧
- 每条批注以卡片形式显示
- 与文档段落对齐（基于行号）

### CommentThread
- 支持多级回复（最多 3 级）
- 显示作者头像、时间、状态
- 状态切换：待解决 ↔ 已解决

## 数据模型

\`\`\`typescript
interface Comment {
  id: string;
  proposalId: string;
  docType: "proposal" | "design" | "spec" | "tasks";
  lineStart: number;
  lineEnd: number;
  content: string;
  author: string;
  status: "pending" | "resolved";
  replies: Reply[];
  createdAt: string;
}
\`\`\`

## API

- GET /api/proposals/:id/comments
- POST /api/proposals/:id/comments
- PATCH /api/comments/:id/status`,
          spec: `# Delta Spec: 评论批注系统

## ADDED Requirements

### Requirement: paragraph-comment
段落级批注：用户可选中任意段落文本，点击"添加批注"后输入评论内容，批注以卡片形式显示在文档右侧对应位置。

### Requirement: comment-status
批注状态管理：每条批注有"待解决"和"已解决"两种状态，支持手动切换，已解决的批注折叠显示。

### Requirement: at-mention
@ 提醒：批注内容中输入 @ 触发人员选择器，被 @ 的用户收到站内通知。`,
          tasks: `# Tasks: 评论批注系统

## Backend Tasks
- TASK-BE-010: 批注数据模型与 CRUD API (8h)
- TASK-BE-011: @ 提醒通知服务 (6h)
- TASK-BE-012: 批注导出接口 (4h)

## Frontend Tasks
- TASK-FE-010: CommentOverlay 组件开发 (12h)
- TASK-FE-011: 文本选中 → 批注触发交互 (8h)
- TASK-FE-012: 批注状态切换 UI (4h)
- TASK-FE-013: @ 提醒人员选择器 (6h)

**Total**: 48h`
        }
      ]
    }
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
- \`createBranch()\`: 创建特性分支
- \`commitFiles()\`: 提交文件到仓库
- \`createPullRequest()\`: 创建 PR/MR
- \`getStatus()\`: 获取提交/PR 状态

**CredentialManager**: 凭据管理
- 加密存储 Git Token
- 支持多平台凭据
- Token 过期提醒

## 2. API 设计

### 2.1 同步提案

\`\`\`http
POST /api/proposals/:id/sync
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "proposalId": "prop-001",
  "targetRepo": "https://github.com/org/repo",
  "branch": "feature/proposal-prop-001",
  "autoCreatePR": true,
  "prTitle": "feat: Add Git sync module"
}

Response:
{
  "success": true,
  "commitSha": "abc123def456",
  "branch": "feature/proposal-prop-001",
  "prUrl": "https://github.com/org/repo/pull/123"
}
\`\`\`

### 2.2 获取同步状态

\`\`\`http
GET /api/proposals/:id/sync-status
Authorization: Bearer <token>

Response:
{
  "status": "in_progress", // queued | in_progress | completed | failed
  "progress": 60,
  "message": "Creating pull request...",
  "commitSha": "abc123",
  "prUrl": null
}
\`\`\`

## 3. 数据模型

### 3.1 git_configs 表

\`\`\`sql
CREATE TABLE git_configs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  platform VARCHAR(20) NOT NULL, -- github | gitlab | gitee
  repo_url TEXT NOT NULL,
  access_token_encrypted TEXT NOT NULL,
  default_branch VARCHAR(50) DEFAULT 'main',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### 3.2 git_sync_records 表

\`\`\`sql
CREATE TABLE git_sync_records (
  id SERIAL PRIMARY KEY,
  proposal_id VARCHAR(50) NOT NULL,
  user_id INTEGER NOT NULL,
  platform VARCHAR(20) NOT NULL,
  repo_url TEXT NOT NULL,
  branch VARCHAR(100),
  commit_sha VARCHAR(40),
  pr_url TEXT,
  status VARCHAR(20), -- queued | in_progress | completed | failed
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

## 4. 并发控制

### 4.1 任务队列

- 同一提案同一时间只允许一个同步任务
- 新同步请求会排队等待
- FIFO 队列，最多 10 个并发任务

### 4.2 冲突处理

- Push 前检测远程分支更新
- 有冲突时返回错误提示
- 提供 git pull --rebase 操作指引

## 5. 安全性

- Git Token 使用 AES-256 加密存储
- 凭据仅对授权用户可见
- 操作日志记录所有 Git 操作

## 6. 监控与告警

- 同步失败率监控（阈值: >5%）
- 平均同步时间监控（阈值: >30s）
- 失败告警（邮件 + 站内信）`,
          spec: null,
          tasks: `## 1. Setup

- [ ] 1.1 创建 git_configs 数据表
- [ ] 1.2 创建 git_sync_records 数据表
- [ ] 1.3 安装 octokit (GitHub), @gitbeaker/node (GitLab) 依赖

## 2. Backend Implementation

- [ ] 2.1 实现 SyncService 类
  - [ ] 2.1.1 创建同步任务队列
  - [ ] 2.1.2 实现并发控制逻辑
- [ ] 2.2 实现 GitAdapter 接口
  - [ ] 2.2.1 GitHub 适配器
  - [ ] 2.2.2 GitLab 适配器
  - [ ] 2.2.3 Gitee 适配器
- [ ] 2.3 实现 CredentialManager
  - [ ] 2.3.1 Token 加密/解密
  - [ ] 2.3.2 Token 过期检测
- [ ] 2.4 实现同步 API 端点
  - [ ] 2.4.1 POST /api/proposals/:id/sync
  - [ ] 2.4.2 GET /api/proposals/:id/sync-status

## 3. Frontend Integration

- [ ] 3.1 在提案确认按钮添加 Git 同步配置
- [ ] 3.2 添加同步状态实时显示
- [ ] 3.3 实现凭据配置界面
- [ ] 3.4 回写 PR/MR 链接到需求卡片

## 4. Testing

- [ ] 4.1 单元测试（同步服务、适配器）
- [ ] 4.2 集成测试（GitHub API 调用）
- [ ] 4.3 并发场景测试
- [ ] 4.4 冲突处理测试

## 5. Deployment

- [ ] 5.1 配置 Git API 密钥
- [ ] 5.2 设置数据库迁移脚本
- [ ] 5.3 配置监控告警规则
- [ ] 5.4 准备回滚方案`
        }
      ]
    }
  }
];

// 来源：md/PM_AI_Plagform_PRD.md 功能模块（3.0~3.7）
const PRD_SEEDED_SAMPLE_CARDS = [
  {
    id: "REQ-106",
    col: "backlog",
    priority: "P1",
    title: "需求卡片多维筛选与快速过滤",
    desc: "基于空间、子系统、应用、迭代四个维度提供联动筛选，并支持点击卡片 badge 快速触发对应维度过滤。",
    tags: ["看板", "筛选", "体验优化"],
    author: "王芳",
    date: "2026-03-02",
    userStory: "作为产品经理，我希望用多维筛选快速定位目标需求，以便在演示中高效聚焦。",
    acceptanceCriteria: [
      "支持空间/子系统/应用/迭代四维 AND 过滤",
      "点击卡片维度 badge 可触发快速筛选",
      "清除筛选后恢复全部需求",
    ],
    aiResult: null,
    docs: { prd: null, proposals: [] },
    space: "马上消费",
    subsystem: "消费金融",
    app: "马上消费App",
    iteration: "迭代-20260301",
  },
  {
    id: "REQ-107",
    col: "reviewing",
    priority: "P1",
    title: "Meego 需求同步与字段映射",
    desc: "定时同步 Meego 需求并完成字段映射，支持状态回写策略与异常告警。",
    tags: ["Meego", "同步", "数据映射"],
    author: "李明",
    date: "2026-03-02",
    userStory: "作为产品经理，我希望系统自动同步需求并正确映射字段，以便减少手工维护。",
    acceptanceCriteria: [
      "支持定时同步与手动触发同步",
      "字段映射完整且可追溯",
      "同步失败有明确错误提示",
    ],
    aiResult: null,
    docs: { prd: null, proposals: [] },
    space: "中科金得助",
    subsystem: "企业服务",
    app: "金得助",
    iteration: "迭代-20260215",
  },
  {
    id: "REQ-108",
    col: "ai_review",
    priority: "P0",
    title: "AI 澄清关键问题弹框确认",
    desc: "在 AI 需求澄清过程中，对关键决策点使用弹框确认，保证需求信息准确。",
    tags: ["AI澄清", "弹框", "需求质量"],
    author: "张晓薇",
    date: "2026-03-03",
    userStory: "作为产品经理，我希望关键问题通过弹框确认，以便避免歧义和遗漏。",
    acceptanceCriteria: [
      "关键问题触发弹框确认",
      "确认结果进入上下文继续对话",
      "支持输入型和选项型确认",
    ],
    aiResult: null,
    docs: { prd: null, proposals: [] },
    space: "枭龙云国内",
    subsystem: "云平台",
    app: "枭龙云控制台",
    iteration: "迭代-20260201",
  },
  {
    id: "REQ-109",
    col: "confirm",
    priority: "P1",
    title: "多模型 AIClient 路由与回退策略",
    desc: "通过统一 AIClient 支持 Claude/GLM/ARK 多模型切换，并在失败时提供演示兜底。",
    tags: ["AI模型", "路由", "兜底"],
    author: "陈刚",
    date: "2026-03-03",
    userStory: "作为产品经理，我希望在不同网络环境下可切换模型，以便保证演示流程不中断。",
    acceptanceCriteria: [
      "支持 Claude/GLM/ARK 统一接入",
      "模型切换配置实时生效",
      "失败时提供示例数据兜底",
    ],
    aiResult: {
      score: 86,
      completeness: 88,
      logic: 85,
      risk: 82,
      summary: "多模型路由方案清晰，可满足演示和容灾要求。",
      risks: ["第三方模型响应差异导致格式不一致", "配置错误会造成请求失败"],
      suggestions: ["统一输出校验器", "增加连接测试预检查"],
      passed: true,
    },
    docs: { prd: null, proposals: [] },
    space: "集团",
    subsystem: "集团中台",
    app: "统一认证",
    iteration: "迭代-20260115",
  },
  {
    id: "REQ-110",
    col: "approved",
    priority: "P2",
    title: "规范框架模板中心与版本管理",
    desc: "为 OpenSpec 等框架提供模板管理能力，支持 proposal/design/spec/tasks 模板配置与版本化。",
    tags: ["SDD", "模板", "配置中心"],
    author: "刘洋",
    date: "2026-03-04",
    userStory: "作为产品经理，我希望统一管理模板版本，以便不同项目按规范快速生成文档。",
    acceptanceCriteria: [
      "支持模板查看、编辑、保存",
      "支持模板版本记录",
      "生成流程按当前模板执行",
    ],
    aiResult: null,
    docs: { prd: null, proposals: [] },
    space: "马上消费",
    subsystem: "消费金融",
    app: "风控平台",
    iteration: "迭代-20260101",
  },
  {
    id: "REQ-111",
    col: "rejected",
    priority: "P2",
    title: "提案评审分屏对比与批注回路",
    desc: "提供 AI 草稿与人工编辑稿分屏对比，支持段落级批注与状态追踪。",
    tags: ["评审", "协作", "批注"],
    author: "王芳",
    date: "2026-03-04",
    userStory: "作为评审人，我希望在平台内完成对比和批注闭环，以便减少外部沟通成本。",
    acceptanceCriteria: [
      "支持分屏对比与高亮差异",
      "支持批注新增、回复、解决",
      "支持版本回溯查看",
    ],
    aiResult: null,
    docs: { prd: null, proposals: [] },
    space: "中科金得助",
    subsystem: "企业服务",
    app: "供应链",
    iteration: "迭代-20251215",
  },
  {
    id: "REQ-112",
    col: "submitted",
    priority: "P1",
    title: "提案确认后 Git 同步与状态回写",
    desc: "确认提案后自动同步到 Git 仓库并回写 commit/PR 链接，驱动状态进入已提交列。",
    tags: ["Git", "状态回写", "提交流程"],
    author: "陈刚",
    date: "2026-03-05",
    userStory: "作为产品经理，我希望一键同步并回写结果，以便开发可直接基于提案开工。",
    acceptanceCriteria: [
      "支持 GitHub/GitLab 提交",
      "提交成功回写链接",
      "卡片状态流转为已提交",
    ],
    aiResult: {
      score: 84,
      completeness: 86,
      logic: 84,
      risk: 80,
      summary: "提交流程定义完整，需持续关注权限与冲突策略。",
      risks: ["Token 失效导致提交失败", "并发提交可能冲突"],
      suggestions: ["增加重试机制", "提供冲突提示与处理指引"],
      passed: true,
    },
    docs: { prd: null, proposals: [] },
    space: "枭龙云国际",
    subsystem: "云平台",
    app: "枭龙云API",
    iteration: "迭代-20260301",
  },
  {
    id: "REQ-113",
    col: "backlog",
    priority: "P2",
    title: "历史需求参考推荐面板",
    desc: "在详情页提供历史需求推荐与外部参考链接管理，辅助需求分析和方案复用。",
    tags: ["参考资料", "推荐", "知识复用"],
    author: "张晓薇",
    date: "2026-03-05",
    userStory: "作为产品经理，我希望快速看到相似历史需求，以便减少重复设计。",
    acceptanceCriteria: [
      "按标签和优先级计算相似度",
      "展示 Top5 历史需求",
      "支持手动维护外部参考链接",
    ],
    aiResult: null,
    docs: { prd: null, proposals: [] },
    space: "集团",
    subsystem: "集团中台",
    app: "数据湖",
    iteration: "迭代-20260215",
  },
  {
    id: "REQ-114",
    col: "reviewing",
    priority: "P1",
    title: "AI Skill 结构化管理与模板恢复",
    desc: "将 Skill 管理从单 prompt 升级为 SKILL.md + references + scripts 的结构化编辑体验，支持恢复默认模板。",
    tags: ["Skill", "配置", "可维护性"],
    author: "李明",
    date: "2026-03-06",
    userStory: "作为产品经理，我希望可视化管理每个 Skill 的结构化内容，以便快速调优 AI 行为。",
    acceptanceCriteria: [
      "支持 Skill 列表与文件结构切换",
      "支持保存与恢复默认结构",
      "支持旧 prompt 自动迁移到 SKILL.md",
    ],
    aiResult: null,
    docs: { prd: null, proposals: [] },
    space: "枭龙云国内",
    subsystem: "云平台",
    app: "云监控",
    iteration: "迭代-20260201",
  },
];

function normalizeSeedCardDimensions(card, index) {
  const safeSpace = KANBAN_SPACES.includes(card.space)
    ? card.space
    : KANBAN_SPACES[index % KANBAN_SPACES.length];
  const safeSubsystem = KANBAN_SUBSYSTEMS.includes(card.subsystem)
    ? card.subsystem
    : KANBAN_SUBSYSTEMS[index % KANBAN_SUBSYSTEMS.length];
  const apps = KANBAN_APPS[safeSubsystem] || [];
  const safeApp = apps.includes(card.app) ? card.app : (apps[0] || '未分配应用');
  const safeIteration = KANBAN_ITERATIONS.includes(card.iteration)
    ? card.iteration
    : KANBAN_ITERATIONS[index % KANBAN_ITERATIONS.length];
  return { ...card, space: safeSpace, subsystem: safeSubsystem, app: safeApp, iteration: safeIteration };
}

const INITIAL_CARDS = [...BASE_INITIAL_CARDS, ...PRD_SEEDED_SAMPLE_CARDS]
  .slice(0, 15)
  .map((card, index) => normalizeSeedCardDimensions(card, index));

/* ═══════════════════════════════ API ══════════════════════════════════════
 * 支持 Claude (Anthropic) 和 GLM-4 (Zhipu)
 * 使用 AIClient 统一接口
 * 模型选择: localStorage.getItem('ai_model_selected') || 'claude'
 * ───────────────────────────────────────────────────────────────────────────────────────── */
function getSelectedModel() {
  return localStorage.getItem('ai_model_selected') || 'claude';
}

async function callAI(prompt, maxTokens=1800) {
  const model = getSelectedModel();
  const client = new AIClient(model);
  return await client.chat(prompt, maxTokens);
}

function getAIErrorMessage(e) {
  const msg = e?.errorMessage || e?.message || '';
  if (msg.includes('credit balance') || msg.includes('too low')) {
    return '⚠️ API 配额不足，请前往 Anthropic 控制台充值';
  }
  if (e?.errorType === 'no_api_key' || msg.includes('未配置 API Key')) {
    return '⚠️ 未配置 API Key，请在设置中填写';
  }
  if (e?.errorType === 'authentication_error' || msg.includes('invalid x-api-key')) {
    return '⚠️ API Key 无效，请检查设置';
  }
  return 'AI 请求失败，请稍后重试';
}

/* ═══════════════════════════ AI SKILL MANAGEMENT ═══════════════════════════
 * 可用变量: {{card.id}} {{card.title}} {{card.desc}} {{card.userStory}}
 *           {{card.tags}} {{card.criteria}} {{message}} {{date}}
 * ─────────────────────────────────────────────────────────────────────────── */
const AI_SKILLS = {
  review: {
    id: 'review', name: '需求评审', icon: '🔍',
    desc: '对需求从完整性、逻辑性、风险三个维度打分评审（0-100），返回结构化评审结果。',
    vars: ['{{card.id}}', '{{card.title}}', '{{card.desc}}', '{{card.userStory}}', '{{card.criteria}}'],
    defaultPrompt: `你是资深产品经理评审专家。请对以下需求评审，从完整性、逻辑性、风险三个维度打分（0-100）。
需求ID: {{card.id}} | 标题: {{card.title}} | 描述: {{card.desc}} | 用户故事: {{card.userStory}} | 验收标准: {{card.criteria}}`,
  },
  prd: {
    id: 'prd', name: 'PRD 生成', icon: '📋',
    desc: '根据需求信息生成标准产品需求文档（PRD），Markdown 格式。',
    vars: ['{{card.title}}', '{{card.desc}}', '{{card.userStory}}', '{{card.tags}}', '{{card.criteria}}', '{{date}}'],
    defaultPrompt: `你是资深产品经理。根据以下需求信息，生成标准PRD文档内容（Markdown格式）。

需求标题: {{card.title}}
需求描述: {{card.desc}}
用户故事: {{card.userStory}}
验收标准: {{card.criteria}}
标签: {{card.tags}}

请生成完整的Markdown格式PRD，包含以下章节，内容丰富专业：

# {{card.title}}

**版本**: V1.0 | **作者**: AI生成 | **日期**: {{date}}

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
  },
  spec: {
    id: 'spec', name: 'SPEC 生成', icon: '📝',
    desc: '生成详细的需求规格说明文档，包含功能需求清单、交互流程、验收标准等。',
    vars: ['{{card.id}}', '{{card.title}}', '{{card.desc}}', '{{card.userStory}}', '{{card.criteria}}', '{{date}}'],
    defaultPrompt: `你是资深产品经理。根据以下需求信息，生成详细的需求规格说明文档（Markdown格式）。

需求标题: {{card.title}}
需求描述: {{card.desc}}
用户故事: {{card.userStory}}
验收标准: {{card.criteria}}

请生成完整的Markdown格式需求规格说明：

# 需求规格说明：{{card.title}}

**文档 ID**: SPEC-{{card.id}} | **版本**: 1.0 | **日期**: {{date}}

## 1. 需求概述

### 1.1 需求背景
[描述需求的业务背景和产生原因]

### 1.2 需求目标
[明确需求要达成的业务目标和用户价值]

### 1.3 适用范围
[界定需求的适用场景和边界]

## 2. 详细需求规格

### 2.1 功能需求清单
| 需求ID | 功能描述 | 优先级 | 验收标准 |
|--------|----------|--------|----------|
| REQ-{{card.id}}-01 | [功能1] | P0 | [验收标准] |
| REQ-{{card.id}}-02 | [功能2] | P1 | 待补充 |

### 2.2 用户交互流程
[描述用户完成目标的操作流程]

### 2.3 数据要求
- **输入数据**: [需要用户提供的数据]
- **输出数据**: [系统展示给用户的数据]

### 2.4 业务规则
[列出相关的业务规则和约束条件]

## 3. 非功能需求

### 3.1 性能要求
- 页面加载时间 ≤ X秒

### 3.2 安全要求
- 用户数据加密

## 4. 验收标准
{{card.criteria}}

请直接输出Markdown内容，内容要具体详实。`,
  },
  proposal: {
    id: 'proposal', name: 'Proposal 生成', icon: '💡',
    desc: '生成技术提案文档，包含问题陈述、解决方案、范围、风险等。',
    vars: ['{{card.id}}', '{{card.title}}', '{{card.desc}}', '{{card.criteria}}', '{{date}}'],
    defaultPrompt: `你是技术提案专家。根据以下需求生成完整的Proposal文档（Markdown格式）。

需求标题: {{card.title}}
需求描述: {{card.desc}}
验收标准: {{card.criteria}}

生成格式：
# Proposal: {{card.title}}

**提案 ID**: PROPOSAL-{{card.id}} | **版本**: 1.0 | **日期**: {{date}}

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
  },
  design: {
    id: 'design', name: 'Design 生成', icon: '🏗',
    desc: '生成系统技术设计文档，包含架构设计、API 定义、部署方案等。',
    vars: ['{{card.id}}', '{{card.title}}', '{{card.desc}}', '{{date}}'],
    defaultPrompt: `你是系统架构师。根据以下需求生成完整的技术设计文档（Markdown格式）。

需求标题: {{card.title}}
需求描述: {{card.desc}}

生成格式：
# Design: {{card.title}}

**设计 ID**: DESIGN-{{card.id}} | **版本**: 1.0 | **日期**: {{date}}

## 1. Overview（概述）
[设计目标、范围与关联提案关系]

## 2. Architecture Design（架构设计）

### 2.1 System Context（系统上下文）
[系统在整体架构中的位置，上下游关系]

### 2.2 Component Diagram（组件图）
[系统内部各组件、模块及相互关系]

### 2.3 Data Model（数据模型）
[核心业务实体数据结构]

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
  },
  tasks: {
    id: 'tasks', name: 'Tasks 生成', icon: '✅',
    desc: '生成开发任务清单，包含前后端、数据库等各类任务，含工时估算。',
    vars: ['{{card.id}}', '{{card.title}}', '{{card.desc}}', '{{card.criteria}}', '{{date}}'],
    defaultPrompt: `你是项目管理专家。根据以下需求生成完整的开发任务清单（Markdown格式）。

需求标题: {{card.title}}
需求描述: {{card.desc}}
验收标准: {{card.criteria}}

生成格式：
# Tasks: {{card.title}}

**任务清单 ID**: TASKS-{{card.id}} | **版本**: 1.0 | **日期**: {{date}}

## 1. Overview（概述）
[任务清单目标和范围]

## 2. Development Tasks（开发任务）

### 2.1 Backend Tasks（后端任务）
- **TASK-BE-001**: [后端任务标题]
  - **描述**: [详细描述]
  - **预期工时**: [Xh]
  - **状态**: 待开始

### 2.2 Frontend Tasks（前端任务）
- **TASK-FE-001**: [前端任务标题]
  - **描述**: [UI界面、交互逻辑或数据展示]
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

请直接输出Markdown内容，工时和任务标题请根据需求合理填写真实内容。`,
  },
  chatbot: {
    id: 'chatbot', name: 'Chatbot', icon: '🤖',
    desc: '需求分析助手的系统 prompt，引导 AI 以专业友好的方式回答需求相关问题。',
    vars: ['{{card.title}}', '{{card.desc}}', '{{card.userStory}}', '{{card.criteria}}', '{{message}}'],
    defaultPrompt: `你是产品需求分析专家。针对以下需求回答用户的问题。

需求标题: {{card.title}}
需求描述: {{card.desc}}
用户故事: {{card.userStory}}
验收标准: {{card.criteria}}

用户问题: {{message}}

请以专业、友好的语气回复，帮助用户理解和优化需求。回复要具体、有建设性。`,
  },
};

const SKILL_STANDARD_FILE_KEYS = [
  'SKILL.md',
  'references/req-clarification.md',
  'references/git-sync-checklist.md',
  'references/field-mapping.md',
  'scripts/scriptname.ts',
];

const SKILL_REFERENCE_TEMPLATES = {
  'references/req-clarification.md': `# 需求澄清参考

## 目标
- 识别需求目标与边界
- 对齐关键业务术语

## 澄清问题清单
1. 本次需求的成功指标是什么？
2. 哪些用户角色会受影响？
3. 有哪些明确的不做范围？
4. 上线后的验证周期与负责人是谁？

## 输出要求
- 输出明确结论
- 标注风险和待确认项
`,
  'references/git-sync-checklist.md': `# Git 同步检查清单

## 提交前
- [ ] 已确认目标仓库与分支
- [ ] 文档路径符合规范
- [ ] Token 权限可写

## 提交后
- [ ] 记录 commit 链接
- [ ] 校验文档内容已更新
- [ ] 回填需求状态与备注
`,
  'references/field-mapping.md': `# 字段映射

| 需求字段 | Skill 变量 | 说明 |
| --- | --- | --- |
| 需求编号 | {{card.id}} | 唯一标识 |
| 标题 | {{card.title}} | 需求标题 |
| 描述 | {{card.desc}} | 详细描述 |
| 用户故事 | {{card.userStory}} | 场景描述 |
| 验收标准 | {{card.criteria}} | 多条标准合并 |
| 标签 | {{card.tags}} | 标签列表 |
| 当前日期 | {{date}} | 生成日期 |
`,
};

const SKILL_SCRIPT_TEMPLATE = `export function normalizeSkillInput(payload: Record<string, unknown>) {
  return {
    id: String(payload.id || ''),
    title: String(payload.title || ''),
    desc: String(payload.desc || ''),
  }
}

export function validateSkillInput(payload: Record<string, unknown>) {
  const errors: string[] = []
  if (!payload.id) errors.push('id 不能为空')
  if (!payload.title) errors.push('title 不能为空')
  return {
    ok: errors.length === 0,
    errors,
  }
}
`;

function buildDefaultSkillMarkdown(skillId) {
  const skill = AI_SKILLS[skillId];
  if (!skill) return '';
  const vars = (skill.vars || []).join('、');
  return `---
name: pm-${skill.id}-skill
description: ${skill.desc}
---

# ${skill.name}

## 使用场景
${skill.desc}

## 可用变量
${vars || '无'}

## Prompt Template
${skill.defaultPrompt}
`;
}

function buildDefaultSkillFiles(skillId) {
  return {
    'SKILL.md': buildDefaultSkillMarkdown(skillId),
    ...SKILL_REFERENCE_TEMPLATES,
    'scripts/scriptname.ts': SKILL_SCRIPT_TEMPLATE,
  };
}

function normalizeSkillFilePath(path) {
  if (typeof path !== 'string') return null;
  const trimmed = path.trim();
  if (!trimmed) return null;
  if (trimmed === 'SKILL.md') return 'SKILL.md';
  const corrected = trimmed.replace(/^scrips\//, 'scripts/');
  if (/^references\/[^/]+\.md$/i.test(corrected)) return corrected;
  if (/^scripts\/[^/]+\.(ts|js|mjs|cjs)$/i.test(corrected)) return corrected;
  return null;
}

function inspectSkillFiles(files) {
  const source = files && typeof files === 'object' ? files : {};
  const nextFiles = {};
  const correctedPaths = [];
  const invalidPaths = [];
  Object.entries(source).forEach(([rawPath, rawContent]) => {
    if (typeof rawContent !== 'string') return;
    const normalizedPath = normalizeSkillFilePath(rawPath);
    if (!normalizedPath) {
      invalidPaths.push(rawPath);
      return;
    }
    if (normalizedPath !== rawPath) correctedPaths.push(`${rawPath} -> ${normalizedPath}`);
    nextFiles[normalizedPath] = rawContent;
  });
  return { files: nextFiles, correctedPaths, invalidPaths };
}

function normalizeSkillConfig(skills) {
  const source = skills && typeof skills === 'object' ? skills : {};
  const normalized = {};
  const correctedPaths = [];
  const invalidPaths = [];

  Object.keys(AI_SKILLS).forEach(skillId => {
    const defaults = buildDefaultSkillFiles(skillId);
    const entry = source[skillId];
    let rawFiles = {};
    if (typeof entry === 'string') {
      rawFiles = { 'SKILL.md': entry };
    } else if (entry && typeof entry === 'object') {
      if (typeof entry['SKILL.md'] === 'string') rawFiles['SKILL.md'] = entry['SKILL.md'];
      if (entry.files && typeof entry.files === 'object') rawFiles = { ...rawFiles, ...entry.files };
    }
    const inspected = inspectSkillFiles(rawFiles);
    correctedPaths.push(...inspected.correctedPaths.map(item => `${skillId}: ${item}`));
    invalidPaths.push(...inspected.invalidPaths.map(item => `${skillId}: ${item}`));
    normalized[skillId] = { files: { ...defaults, ...inspected.files } };
  });

  return { normalized, correctedPaths, invalidPaths };
}

function stripSkillFrontmatter(skillMarkdown) {
  const text = typeof skillMarkdown === 'string' ? skillMarkdown : '';
  const trimmed = text.trim();
  if (!trimmed.startsWith('---')) return trimmed;
  const endIdx = trimmed.indexOf('\n---', 3);
  if (endIdx === -1) return trimmed;
  return trimmed.slice(endIdx + 4).trim();
}

function getSkillPromptTemplate(skills, skillId) {
  const entry = skills?.[skillId];
  if (typeof entry === 'string') return entry;
  const skillMarkdown = entry?.files?.['SKILL.md'] || entry?.['SKILL.md'];
  if (typeof skillMarkdown === 'string' && skillMarkdown.trim()) {
    return stripSkillFrontmatter(skillMarkdown);
  }
  return AI_SKILLS[skillId]?.defaultPrompt || '';
}

function resolveSkillPrompt(skillId, card, extra = {}) {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('ai_skill_prompts') || '{}'); } catch {}
  const normalizedSkills = normalizeSkillConfig(saved).normalized;
  const template = getSkillPromptTemplate(normalizedSkills, skillId);
  const date = new Date().toLocaleDateString('zh-CN');
  const criteria = Array.isArray(card?.acceptanceCriteria) ? card.acceptanceCriteria.join('；') : '';
  const tags = Array.isArray(card?.tags) ? card.tags.join('、') : '';
  return template
    .replace(/\{\{card\.id\}\}/g, card?.id || '')
    .replace(/\{\{card\.title\}\}/g, card?.title || '')
    .replace(/\{\{card\.desc\}\}/g, card?.desc || '')
    .replace(/\{\{card\.userStory\}\}/g, card?.userStory || '')
    .replace(/\{\{card\.tags\}\}/g, tags)
    .replace(/\{\{card\.criteria\}\}/g, criteria)
    .replace(/\{\{date\}\}/g, date)
    .replace(/\{\{message\}\}/g, extra.message || '');
}

async function callAIReview(card) {
  const prompt = resolveSkillPrompt('review', card);
  const text = await callAI(`${prompt}
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

  spec: (card) => `你是资深产品经理。根据以下需求信息，生成详细的需求规格说明文档（Markdown格式）。

需求标题: ${card.title}
需求描述: ${card.desc}
用户故事: ${card.userStory}
验收标准: ${card.acceptanceCriteria.join("；")}
标签: ${card.tags.join("、")}

请生成完整的Markdown格式需求规格说明，包含以下章节：

# 需求规格说明：${card.title}

**文档 ID**: SPEC-${card.id} | **版本**: 1.0 | **日期**: ${new Date().toLocaleDateString("zh-CN")}

## 1. 需求概述

### 1.1 需求背景

[描述需求的业务背景和产生原因]

### 1.2 需求目标

[明确需求要达成的业务目标和用户价值]

### 1.3 适用范围

[界定需求的适用场景和边界]

## 2. 详细需求规格

### 2.1 功能需求清单

| 需求ID | 功能描述 | 优先级 | 验收标准 |
|--------|----------|--------|----------|
| REQ-${card.id}-01 | [功能1] | P0 | ${card.acceptanceCriteria[0]||"待补充"} |
| REQ-${card.id}-02 | [功能2] | P1 | 待补充 |

### 2.2 用户交互流程

\`\`\`
[描述用户完成目标的操作流程]
例如：用户进入页面 -> 点击按钮 -> 完成操作
\`\`\`

### 2.3 界面原型要求

[描述关键界面的布局、元素和交互方式]

### 2.4 数据要求

- **输入数据**: [需要用户提供的数据]
- **输出数据**: [系统展示给用户的数据]
- **数据存储**: [需要持久化的数据]

### 2.5 业务规则

[列出相关的业务规则和约束条件]

## 3. 非功能需求

### 3.1 性能要求
- 页面加载时间 ≤ X秒
- 接口响应时间 ≤ Y毫秒

### 3.2 安全要求
- 用户数据加密
- 权限控制要求

### 3.3 兼容性要求
- 支持的浏览器版本
- 支持的设备类型

## 4. 验收标准

${card.acceptanceCriteria.map((c, i) => `${i + 1}. ${c}`).join("\n")}

## 5. 附录

### 5.1 术语表
| 术语 | 解释 |
|------|------|
| [术语1] | [解释] |

### 5.2 参考文档
- [相关文档链接]

请直接输出Markdown内容，内容要具体详实，不要使用占位符。`,

  proposal: (card) => `你是技术提案专家。根据以下需求生成完整的Proposal文档（Markdown格式）。

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
  const prompt = resolveSkillPrompt(docType, card);
  const result = await callAI(prompt, 2000);
  if (typeof result === "string" && result.startsWith("❌")) {
    throw new Error(result.slice(2).trim());
  }
  return result;
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

function QuestionOption({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: `1px solid ${selected ? C.accent : C.border}`,
        background: selected ? C.accentLight : C.white,
        color: selected ? C.accentDark : C.ink,
        borderRadius: 8,
        padding: "8px 10px",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: selected ? 600 : 500,
        textAlign: "left",
      }}
    >
      {label}
    </button>
  );
}

function TextInput({ value, onChange, placeholder, multiline = false }) {
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        style={{
          width: "100%",
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: 13,
          lineHeight: 1.55,
          resize: "vertical",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    );
  }

  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "10px 12px",
        fontSize: 13,
        outline: "none",
        boxSizing: "border-box",
      }}
    />
  );
}

function ConfirmationDialog({
  visible,
  questions,
  answers,
  customInputs,
  errors,
  prdExample,
  onSelectOption,
  onChangeCustom,
  onClose,
  onSubmit,
}) {
  if (!visible) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(13,14,18,0.45)", zIndex: 130 }} />
      <div style={{ position: "fixed", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "min(780px,92vw)", maxHeight: "82vh", background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, zIndex: 131, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>🧩</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>补充需求信息</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>原始需求信息不足，先补充关键字段再进行 AI 评审</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 22, color: C.muted, lineHeight: 1, padding: 0 }}>×</button>
        </div>

        <div style={{ padding: "16px 20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, background: C.white, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 12px", borderBottom: `1px solid ${C.border}`, background: C.cream }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>原始需求示例（摘录自 PM_AI_Plagform_PRD.md）</div>
              <span style={{ fontSize: 11, color: C.muted }}>仅供参考</span>
            </div>
            <div style={{ maxHeight: 180, overflowY: "auto", padding: "10px 12px", background: prdExample?.fallback ? C.warnLight : "#f8fbff", borderLeft: `3px solid ${prdExample?.fallback ? C.warn : C.accent}` }}>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: 12, lineHeight: 1.6, color: prdExample?.fallback ? "#9a5f03" : C.ink, fontFamily: "'Noto Sans SC',sans-serif" }}>
                {prdExample?.text || PRD_EXAMPLE_FALLBACK_TEXT}
              </pre>
            </div>
          </div>

          {questions.map((q, idx) => {
            const selected = answers[q.field] || "";
            const showCustom = !q.options || selected === "__other__";
            const customValue = customInputs[q.field] || "";

            return (
              <div key={q.field} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", background: C.cream }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 8, fontFamily: "'DM Mono',monospace" }}>Q{idx + 1}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 10 }}>{q.label}</div>

                {Array.isArray(q.options) && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 8, marginBottom: 10 }}>
                    {q.options.map((opt) => (
                      <QuestionOption
                        key={opt.label}
                        label={opt.label}
                        selected={selected === opt.value}
                        onClick={() => onSelectOption(q.field, opt.value)}
                      />
                    ))}
                  </div>
                )}

                {showCustom && (
                  <TextInput
                    value={customValue}
                    onChange={(value) => onChangeCustom(q.field, value)}
                    placeholder={q.placeholder}
                    multiline={q.multiline}
                  />
                )}

                {errors[q.field] && <div style={{ marginTop: 8, fontSize: 12, color: C.danger }}>{errors[q.field]}</div>}
              </div>
            );
          })}
        </div>

        <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.border}`, background: C.white, display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 16px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, color: C.muted, cursor: "pointer", fontSize: 13 }}>稍后补充</button>
          <button onClick={onSubmit} style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: C.accent, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>确认补充并评审</button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════ KANBAN CARD ════════════════════════════════════ */
function KanbanCard({card,onClick,dragHandlers,isDragging,onFilterClick}) {
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
      {(() => {
        const dims = [
          ['space',     '空间',   card.space,     C.accent, C.accentLight],
          ['subsystem', '子系统', card.subsystem, C.purple, C.purpleLight],
          ['app',       '应用',   card.app,       C.warn,   C.warnLight],
          ['iteration', '迭代',   card.iteration, C.teal,   C.tealLight],
        ].filter(([,,val]) => val);
        if (dims.length === 0) return null;
        return (
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:8}}>
            {dims.map(([dim,,val,color,bg]) => (
              <span key={dim} onClick={e => { e.stopPropagation(); onFilterClick && onFilterClick(dim, val); }}
                style={{display:"inline-flex",alignItems:"center",padding:"2px 7px",borderRadius:10,fontSize:11,fontWeight:500,
                  background:bg,color,cursor:"pointer",border:`1px solid ${color}22`,userSelect:"none"}}>
                {val}
              </span>
            ))}
          </div>
        );
      })()}
      <div style={{marginTop:8,fontSize:11,color:C.muted}}>👤 {card.author}</div>
    </div>
  );
}

/* ═══════════════════════════ DETAIL DRAWER ══════════════════════════════════ */
function DetailDrawer({card,onClose,onAIReview,onAIDesign,reviewing,onMoveCard,showDemoReviewTag,onUpdateCard,projectConfig}) {
  const rawRequirement = typeof card?.rawRequirement === 'string' ? card.rawRequirement : '';
  const rawDisplay = getDisplayRawRequirement(card);
  const rawBaseInfo = rawDisplay.baseInfo;

  const [activeTab, setActiveTab] = useState("raw");
  const [rawEditMode, setRawEditMode] = useState(false);
  const [rawEditText, setRawEditText] = useState(rawDisplay.content);
  const [meegoSyncing, setMeegoSyncing] = useState(false);
  const [meegoSyncResult, setMeegoSyncResult] = useState(null);

  useEffect(() => {
    if (!card) return;
    setActiveTab("raw");
    setRawEditMode(false);
    setRawEditText(getDisplayRawRequirement(card).content);
    setMeegoSyncing(false);
    setMeegoSyncResult(null);
  }, [card]);

  if(!card) return null;
  const r=card.aiResult;
  const hasReviewed = Boolean(card.aiResult);
  const aiActions = hasReviewed
    ? [
        { key: "design", label: "AI 辅助设计", icon: "✐", primary: true, onClick: () => onAIDesign(card), disabled: false },
        { key: "review", label: reviewing ? "AI 分析中…" : "AI 智能评审", icon: reviewing ? "⟳" : "✦", primary: false, onClick: () => onAIReview(card), disabled: reviewing },
      ]
    : [
        { key: "review", label: reviewing ? "AI 分析中…" : "AI 智能评审", icon: reviewing ? "⟳" : "✦", primary: true, onClick: () => onAIReview(card), disabled: reviewing },
        { key: "design", label: "AI 辅助设计", icon: "✐", primary: false, onClick: () => onAIDesign(card), disabled: false },
      ];
  const criteriaList = normalizeAcceptanceCriteria(card.acceptanceCriteria);

  const startRawEdit = () => {
    setRawEditText(rawDisplay.content);
    setRawEditMode(true);
    setMeegoSyncResult(null);
  };

  const handleSaveRaw = () => {
    onUpdateCard && onUpdateCard(card.id, { rawRequirement: rawEditText });
    setRawEditMode(false);
  };

  const handleCancelRaw = () => {
    setRawEditText(rawDisplay.content);
    setRawEditMode(false);
  };

  const handleSyncMeego = async () => {
    const apiUrl = projectConfig?.meego?.apiUrl;
    const token = projectConfig?.meego?.token;
    if (!apiUrl || !token) {
      setMeegoSyncResult({ type: "error", msg: "未配置 Meego，请前往项目配置页面完善配置" });
      return;
    }
    setMeegoSyncing(true);
    setMeegoSyncResult(null);
    try {
      const endpoint = `${String(apiUrl).replace(/\/+$/, "")}/requirements/${encodeURIComponent(card.id)}`;
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ rawContent: rawRequirement }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      setMeegoSyncResult({ type: "success", msg: "✓ 已同步到 Meego" });
      setTimeout(() => setMeegoSyncResult(null), 3000);
    } catch (e) {
      setMeegoSyncResult({ type: "error", msg: `同步失败：${e.message}` });
    } finally {
      setMeegoSyncing(false);
    }
  };

  const tabBtnStyle = (active) => ({
    height: 30,
    padding: "0 14px",
    borderRadius: 6,
    border: `1px solid ${active ? C.ink : C.border}`,
    background: active ? C.ink : C.white,
    color: active ? "#fff" : C.muted,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    transition: "all 0.15s",
  });

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
      {/* Tabs */}
      <div style={{padding:"8px 28px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8,background:C.white,flexShrink:0,height:46}}>
        <button onClick={() => setActiveTab("raw")} style={tabBtnStyle(activeTab === "raw")}>原始需求</button>
        <button onClick={() => setActiveTab("review")} style={tabBtnStyle(activeTab === "review")}>评审报告</button>
      </div>
      {/* Body */}
      <div style={{padding:"24px 28px",flex:1,overflowY:"auto",paddingBottom:100}}>
        {meegoSyncResult && (
          <div style={{marginBottom:14,padding:"9px 12px",borderRadius:6,display:"flex",alignItems:"center",gap:8,
            background: meegoSyncResult.type === "success" ? C.successLight : C.dangerLight,
            border: `1px solid ${meegoSyncResult.type === "success" ? C.success : C.danger}44`,
            color: meegoSyncResult.type === "success" ? C.success : C.danger,
            fontSize: 12,fontWeight: 600}}>
            {meegoSyncResult.msg}
          </div>
        )}

        {activeTab === "review" && (
          <>
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
                {criteriaList.length > 0 ? criteriaList.map((c,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:9,marginBottom:i<criteriaList.length-1?8:0}}>
                    <span style={{fontSize:13,color:C.success,marginTop:1,flexShrink:0}}>✓</span>
                    <span style={{fontSize:13,color:C.ink,lineHeight:1.5}}>{c}</span>
                  </div>
                )) : <div style={{fontSize:12,color:C.muted}}>尚未补充验收标准</div>}
              </div>
            </div>
            {r&&(
              <div style={{border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                <div style={{padding:"13px 18px",background:C.ink,display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontWeight:700,fontSize:13,color:"#fff"}}>✦ AI 评审报告</span>
                  {showDemoReviewTag && <span style={{fontSize:11,color:C.warn,background:C.warnLight,padding:"2px 8px",borderRadius:999,fontWeight:600}}>示例数据（非 AI 实时生成）</span>}
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
          </>
        )}

        {activeTab === "raw" && (
          <>
            <div style={{marginBottom:14,padding:"12px 14px",borderRadius:8,border:`1px solid ${C.border}`,background:C.white}}>
              <div style={{fontSize:11,fontWeight:700,color:C.muted,letterSpacing:1,marginBottom:10,fontFamily:"'DM Mono',monospace"}}>基础信息</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[
                  ["需求方", rawBaseInfo.demander],
                  ["产品经理", rawBaseInfo.productManager],
                  ["提报时间", rawBaseInfo.reportedAt],
                  ["所属模块", rawBaseInfo.moduleName],
                ].map(([label, value]) => (
                  <div key={label} style={{background:C.cream,border:`1px solid ${C.border}`,borderRadius:7,padding:"8px 10px"}}>
                    <div style={{fontSize:11,color:C.muted,marginBottom:4}}>{label}</div>
                    <div style={{fontSize:13,color:C.ink,fontWeight:600,lineHeight:1.4}}>{value || "-"}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{marginBottom:14,padding:"10px 12px",borderRadius:8,border:`1px solid ${C.border}`,background:C.white,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:12,color:C.muted,fontWeight:600}}>Meego 链接</span>
              <span style={{marginLeft:"auto"}}>
                {rawBaseInfo.meegoUrl ? (
                  <a
                    href={rawBaseInfo.meegoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{fontSize:12,color:C.teal,textDecoration:"none",fontWeight:700}}
                  >
                    打开原单 ↗
                  </a>
                ) : (
                  <span style={{fontSize:12,color:C.muted}}>未关联 Meego 链接</span>
                )}
              </span>
            </div>

            <div style={{display:"flex",alignItems:"center",marginBottom:12,gap:8}}>
              <Lbl>原始需求（Meego）</Lbl>
              <span style={{marginLeft:"auto"}}>
                {!rawEditMode && (
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <button onClick={startRawEdit}
                      style={{height:30,padding:"0 12px",borderRadius:6,border:`1px solid ${C.border}`,background:C.white,cursor:"pointer",fontSize:12,color:C.ink,fontWeight:600}}>
                      ✎ 编辑
                    </button>
                    <button onClick={handleSyncMeego} disabled={meegoSyncing}
                      style={{height:30,padding:"0 12px",borderRadius:6,border:"none",cursor:meegoSyncing?"wait":"pointer",background:meegoSyncing?C.border:C.teal,color:meegoSyncing?C.muted:"#fff",fontSize:12,fontWeight:600}}>
                      {meegoSyncing ? "同步中…" : "同步到 Meego"}
                    </button>
                  </div>
                )}
              </span>
            </div>

            {!rawEditMode ? (
              <div>
                {rawDisplay.isSample && (
                  <div style={{marginBottom:8,fontSize:11,color:C.muted,fontWeight:600}}>示例内容（来自 PRD 摘录）</div>
                )}
                <div className="doc-content" style={{fontSize:13,color:C.ink,lineHeight:1.75,background:C.cream,padding:"14px 16px",borderRadius:8,border:`1px solid ${C.border}`}}>
                  <MarkdownRenderer content={rawDisplay.content} />
                </div>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:8}}>
                  <button onClick={handleCancelRaw}
                    style={{height:30,padding:"0 12px",borderRadius:6,border:`1px solid ${C.border}`,background:C.white,cursor:"pointer",fontSize:12,color:C.muted,fontWeight:600}}>
                    取消
                  </button>
                  <button onClick={handleSaveRaw}
                    style={{height:30,padding:"0 12px",borderRadius:6,border:"none",background:C.accent,cursor:"pointer",fontSize:12,color:"#fff",fontWeight:600}}>
                    保存
                  </button>
                </div>
                <textarea
                  value={rawEditText}
                  onChange={e => setRawEditText(e.target.value)}
                  style={{width:"100%",minHeight:280,padding:"12px 14px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,color:C.ink,background:C.cream,outline:"none",resize:"vertical",lineHeight:1.7,fontFamily:"'DM Mono',monospace",boxSizing:"border-box"}}
                />
              </div>
            )}

          </>
        )}
      </div>
      {/* Fixed bottom bar */}
      <div style={{position:"sticky",bottom:0,padding:"14px 28px",background:C.white,borderTop:`1px solid ${C.border}`,display:"flex",gap:10,alignItems:"center",flexShrink:0,boxShadow:"0 -4px 20px rgba(0,0,0,0.07)"}}>
        {aiActions.map((action) => {
          const baseColor = action.key === "design" ? C.purple : C.accent;
          const isDisabled = Boolean(action.disabled);
          return (
            <button
              key={action.key}
              onClick={action.onClick}
              disabled={isDisabled}
              style={{
                flex: action.primary ? 2 : 1.45,
                padding:"11px 0",
                borderRadius:8,
                border: action.primary ? "none" : `1.5px solid ${isDisabled ? C.border : baseColor}`,
                cursor: isDisabled ? "wait" : "pointer",
                background: action.primary
                  ? (isDisabled ? C.border : baseColor)
                  : (isDisabled ? C.cream : "transparent"),
                color: action.primary
                  ? (isDisabled ? C.muted : "#fff")
                  : (isDisabled ? C.muted : baseColor),
                fontWeight:600,
                fontSize:14,
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                gap:7,
                boxShadow: action.primary && !isDisabled ? `0 2px 8px ${baseColor}44` : "none",
              }}
            >
              <span>{action.icon}</span>
              {action.label}
            </button>
          );
        })}
        {!DONE_COLS.includes(card.col)&&card.aiResult?.passed&&(
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
      const fallback = FALLBACK_DOCS[selDocType];
      if (fallback) {
        const newDocs = { ...selCard.docs, [selDocType]: fallback };
        onUpdateDocs(selCard.id, newDocs);
      }
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

/* ═══════════════════════ ADD CARD DRAWER ═══════════════════════════════════ */
function AddCardDrawer({onAdd,onClose}) {
  const [form,setForm]=useState({title:"",desc:"",userStory:"",priority:"P1",tags:"",criteria:"",author:""});
  const [aiGenerating, setAIGenerating] = useState(false);
  const [aiError, setAIError] = useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const sty={width:"100%",padding:"9px 12px",border:`1px solid ${C.border}`,borderRadius:6,fontSize:13,background:C.cream,outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"'Noto Sans SC',sans-serif"};
  const handleAIAssistGenerate = async () => {
    setAIError("");
    setAIGenerating(true);
    try {
      const prompt = `你是资深产品经理助手。请根据以下上下文生成一份结构化需求草稿，严格返回 JSON，不要输出任何额外文本。
上下文：
- 标题提示：${form.title || ""}
- 描述提示：${form.desc || ""}
- 用户故事提示：${form.userStory || ""}
- 验收标准提示：${form.criteria || ""}
- 标签提示：${form.tags || ""}
- 提交人提示：${form.author || ""}

返回 JSON 结构：
{"title":"","desc":"","userStory":"","criteria":[""],"tags":[""],"author":""}`;
      const text = await callAI(prompt, 800);
      const cleaned = text.replace(/```json|```/g, "").trim();
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("AI 返回格式无法解析");
        parsed = JSON.parse(jsonMatch[0]);
      }
      setForm(prev => ({
        ...prev,
        title: typeof parsed.title === "string" && parsed.title.trim() ? parsed.title.trim() : prev.title,
        desc: typeof parsed.desc === "string" && parsed.desc.trim() ? parsed.desc.trim() : prev.desc,
        userStory: typeof parsed.userStory === "string" && parsed.userStory.trim() ? parsed.userStory.trim() : prev.userStory,
        criteria: Array.isArray(parsed.criteria)
          ? parsed.criteria.filter(Boolean).map(x => String(x).trim()).filter(Boolean).join("\n") || prev.criteria
          : (typeof parsed.criteria === "string" && parsed.criteria.trim() ? parsed.criteria.trim() : prev.criteria),
        tags: Array.isArray(parsed.tags)
          ? parsed.tags.filter(Boolean).map(x => String(x).trim()).filter(Boolean).join("，") || prev.tags
          : (typeof parsed.tags === "string" && parsed.tags.trim() ? parsed.tags.trim() : prev.tags),
        author: typeof parsed.author === "string" && parsed.author.trim() ? parsed.author.trim() : prev.author,
      }));
    } catch (e) {
      setAIError(getAIErrorMessage(e));
    } finally {
      setAIGenerating(false);
    }
  };
  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.22)",zIndex:149}}/>
      <div style={{position:"fixed",top:0,right:0,bottom:0,width:"60vw",background:C.white,boxShadow:"-4px 0 24px rgba(0,0,0,0.15)",zIndex:150,display:"flex",flexDirection:"column",animation:"slideIn 0.3s ease"}}>
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <h3 style={{margin:0,fontSize:16,fontWeight:700,color:C.ink}}>新建需求</h3>
          <button onClick={onClose} style={{marginLeft:"auto",background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.muted,padding:"0 4px",lineHeight:1}}>×</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"20px"}}>
        <div style={{fontSize:12,color:C.muted,marginBottom:14,padding:"8px 10px",border:`1px solid ${C.border}`,borderRadius:8,background:C.cream}}>
          可在底部点击“AI 辅助生成”，根据当前输入生成需求草稿。
        </div>
        {aiError && <div style={{fontSize:12,color:C.danger,marginBottom:10}}>{aiError}</div>}
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
        </div>
        <div style={{padding:"12px 20px",borderTop:`1px solid ${C.border}`,display:"flex",gap:10,background:C.white,flexShrink:0}}>
          <button onClick={()=>{if(!form.title.trim())return;onAdd({id:`REQ-${String(Date.now()).slice(-3)}`,col:"backlog",priority:form.priority,title:form.title,desc:form.desc,tags:form.tags.split(/[，,]/).map(t=>t.trim()).filter(Boolean),author:form.author||"我",date:new Date().toISOString().slice(0,10),userStory:form.userStory,acceptanceCriteria:form.criteria.split("\n").map(c=>c.trim()).filter(Boolean),aiResult:null,docs:mkDocs()});onClose();}}
            style={{flex:2,padding:"10px 0",borderRadius:8,border:"none",background:C.accent,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14}}>
            创建需求
          </button>
          <button onClick={handleAIAssistGenerate} disabled={aiGenerating}
            style={{flex:1,padding:"10px 0",borderRadius:8,border:"none",cursor:aiGenerating?"wait":"pointer",background:aiGenerating?C.border:C.purple,color:aiGenerating?C.muted:"#fff",fontWeight:700,fontSize:14}}>
            {aiGenerating ? "AI 生成中…" : "AI 辅助生成"}
          </button>
          <button onClick={onClose} style={{flex:1,padding:"10px 0",borderRadius:8,border:`1px solid ${C.border}`,background:C.white,color:C.muted,cursor:"pointer",fontSize:14}}>取消</button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════ IMPORT REQUIREMENT DRAWER ═══════════════════════ */
function ImportDrawer({ visible, onClose }) {
  const [activeTab, setActiveTab] = useState("url"); // "url" | "list"
  const [url, setUrl] = useState("");;
  const [importing, setImporting] = useState(false);
  
  // List import state
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [selectedIteration, setSelectedIteration] = useState(null);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  
  // Mock data
  const mockSpaces = ["空间 A", "空间 B", "空间 C"];
  const mockIterations = {
    "空间 A": ["迭代 1", "迭代 2", "迭代 3"],
    "空间 B": ["迭代 2.1", "迭代 2.2"],
    "空间 C": ["迭代 C1", "迭代 C2", "迭代 C3"],
  };
  const mockRequirements = [
    { id: "MEEGO-001", title: "用户登录功能优化", priority: "P0" },
    { id: "MEEGO-002", title: "数据导出性能提升", priority: "P1" },
    { id: "MEEGO-003", title: "界面国际化支持", priority: "P2" },
    { id: "MEEGO-004", title: "权限管理模块重构", priority: "P1" },
  ];

  const handleUrlImport = async () => {
    if (!url.trim()) return;
    setImporting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setImporting(false);
    alert(`模拟导入：${url}`);
    onClose();
  };

  const handleListImport = () => {
    if (!selectedRequirement) {
      alert("请选择要导入的需求");
      return;
    }
    alert(`模拟导入需求：${selectedRequirement.id} - ${selectedRequirement.title}`);
    onClose();
  };

  useEffect(() => {
    if (!visible) {
      setActiveTab("url");
      setUrl("");
      setSelectedSpace(null);
      setSelectedIteration(null);
      setSelectedRequirement(null);
    }
  }, [visible]);

  if (!visible) return null;

  const tabStyle = (active) => ({
    flex: 1,
    padding: "10px 0",
    background: "none",
    border: "none",
    borderBottom: `2px solid ${active ? C.accent : "transparent"}`,
    cursor: "pointer",
    fontSize: 12,
    color: active ? C.ink : C.muted,
    fontWeight: active ? 600 : 400,
  });

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${C.border}`,
    borderRadius: 6,
    fontSize: 13,
    background: C.cream,
    outline: "none",
    boxSizing: "border-box",
  };

  const buttonStyle = (primary) => ({
    padding: "10px 20px",
    borderRadius: 6,
    border: "none",
    cursor: importing ? "wait" : "pointer",
    fontSize: 13,
    fontWeight: 600,
    background: primary ? C.accent : "transparent",
    color: primary ? "#fff" : C.muted,
    border: primary ? "none" : `1px solid ${C.border}`,
  });

  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.22)",zIndex:149}}/>
      <div style={{position:"fixed",top:0,right:0,bottom:0,width:"60vw",background:C.white,boxShadow:"-4px 0 24px rgba(0,0,0,0.15)",zIndex:150,display:"flex",flexDirection:"column",animation:"slideIn 0.3s ease"}}>
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>
        
        {/* Header */}
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <h2 style={{margin:0,fontSize:16,fontWeight:700,color:C.ink}}>导入需求</h2>
          <button onClick={onClose} style={{marginLeft:"auto",background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.muted,padding:"0 4px",lineHeight:1}}>×</button>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:C.cream,flexShrink:0}}>
          <button onClick={() => setActiveTab("url")} style={tabStyle(activeTab === "url")}>URL 导入</button>
          <button onClick={() => setActiveTab("list")} style={tabStyle(activeTab === "list")}>从列表选择</button>
        </div>

        {/* Content */}
        <div style={{flex:1,overflowY:"auto",padding:"20px"}}>
          {activeTab === "url" ? (
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div>
                <label style={{display:"block",fontSize:12,fontWeight:600,color:C.ink,marginBottom:8}}>Meego 需求 URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://meego.example.com/requirement/12345"
                  style={inputStyle}
                />
                <div style={{fontSize:11,color:C.muted,marginTop:6}}>粘贴完整的 Meego 需求页面 URL</div>
              </div>
              <button onClick={handleUrlImport} disabled={importing || !url.trim()} style={buttonStyle(true)}>
                {importing ? "⟳ 导入中…" : "导入"}
              </button>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {/* Space Selection */}
              <div>
                <label style={{display:"block",fontSize:12,fontWeight:600,color:C.ink,marginBottom:8}}>选择空间</label>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {mockSpaces.map(space => (
                    <button
                      key={space}
                      onClick={() => { setSelectedSpace(space); setSelectedIteration(null); setSelectedRequirement(null); }}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 6,
                        border: selectedSpace === space ? `1.5px solid ${C.accent}` : `1px solid ${C.border}`,
                        background: selectedSpace === space ? C.accentLight : C.white,
                        color: selectedSpace === space ? C.accent : C.muted,
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {space}
                    </button>
                  ))}
                </div>
              </div>

              {/* Iteration Selection */}
              {selectedSpace && (
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:C.ink,marginBottom:8}}>选择迭代</label>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {(mockIterations[selectedSpace] || []).map(iter => (
                      <button
                        key={iter}
                        onClick={() => { setSelectedIteration(iter); setSelectedRequirement(null); }}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 6,
                          border: selectedIteration === iter ? `1.5px solid ${C.teal}` : `1px solid ${C.border}`,
                          background: selectedIteration === iter ? C.tealLight : C.white,
                          color: selectedIteration === iter ? C.teal : C.muted,
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {iter}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirement List */}
              {selectedIteration && (
                <div style={{flex:1}}>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:C.ink,marginBottom:8}}>选择需求</label>
                  <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:300,overflowY:"auto"}}>
                    {mockRequirements.map(req => (
                      <div
                        key={req.id}
                        onClick={() => setSelectedRequirement(req)}
                        style={{
                          padding: "12px",
                          borderRadius: 6,
                          border: selectedRequirement?.id === req.id ? `1.5px solid ${C.accent}` : `1px solid ${C.border}`,
                          background: selectedRequirement?.id === req.id ? C.accentLight : C.white,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                          <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:C.muted}}>{req.id}</span>
                          <span style={{fontSize:10,padding:"1px 5px",background:priorityColor(req.priority),color:"#fff",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>{req.priority}</span>
                        </div>
                        <div style={{fontSize:13,fontWeight:600,color:C.ink,lineHeight:1.4}}>{req.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Import Button */}
              <button onClick={handleListImport} disabled={!selectedRequirement} style={{...buttonStyle(true),opacity:!selectedRequirement?0.5:1}}>
                导入选中需求
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════ NEW COMPONENTS ═════════════════════════════════ */

// ── DocTreeSidebar ──
// 提案文档类型定义（4个固定文档）
const PROPOSAL_DOC_TYPES = [
  { key:"proposal", label:"Proposal",    icon:"💡" },
  { key:"design",   label:"Design",      icon:"🏗" },
  { key:"spec",     label:"Delta Spec",  icon:"📝" },
  { key:"tasks",    label:"Tasks",       icon:"✅" },
];

const FILTER_CHIPS = [
  { id: "focus",       label: "仅本需求" },
  { id: "no-approved", label: "过滤已PR" },
  { id: "no-locked",   label: "过滤已Lock" },
];

function DocTreeSidebar({ cards, selectedKey, onSelectKey, expanded, onToggleExpand, focusCardId, expandedProposals, onToggleProposal }) {
  const [filters, setFilters] = useState(new Set());
  const toggleFilter = (id) => setFilters(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  // 计算 visibleCards（AND 逻辑）
  const visibleCards = cards.filter(card => {
    if (filters.has("focus") && focusCardId && card.id !== focusCardId) return false;
    if (filters.has("no-approved") && ["approved", "submitted"].includes(card.col)) return false;
    if (filters.has("no-locked") && DONE_COLS.includes(card.col)) return false;
    return true;
  });

  const TreeItem = ({ label, icon, active, onClick, indent = 0, hasDoc, isCommitted }) => (
    <div onClick={onClick}
      style={{display:"flex",alignItems:"center",gap:8,padding:`6px ${12 + indent * 16}px`,cursor:"pointer",background:active ? C.sbActive : "transparent",borderRadius:4,margin:"1px 4px",transition:"background 0.15s",userSelect:"none"}}
      onMouseEnter={e => { if(!active) e.currentTarget.style.background = C.sbHover; }}
      onMouseLeave={e => { if(!active) e.currentTarget.style.background = "transparent"; }}>
      <span style={{fontSize:13,flexShrink:0}}>{icon}</span>
      <span style={{fontSize:12,color:active ? C.white : C.sbText,flex:1,lineHeight:1.4}}>{label}</span>
      {isCommitted
        ? <span style={{fontSize:10,color:"#a6e3a1",flexShrink:0,fontWeight:700}}>✓</span>
        : hasDoc && <span style={{width:6,height:6,borderRadius:"50%",background:"#a6e3a1",flexShrink:0}}/>}
    </div>
  );

  const FolderItem = ({ label, open, onToggle, count }) => (
    <div onClick={onToggle}
      style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",cursor:"pointer",userSelect:"none",margin:"2px 4px",borderRadius:4,transition:"background 0.15s"}}
      onMouseEnter={e => e.currentTarget.style.background = C.sbHover}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
      <span style={{fontSize:10,color:C.sbMuted,transition:"transform 0.15s",display:"inline-block",transform:open ? "rotate(90deg)" : "rotate(0deg)"}}>▶</span>
      <span style={{fontSize:12,color:open ? "#f5a97f" : C.sbText,flex:1}}>{open ? "📂" : "📁"} {label}</span>
      {count > 0 && <span style={{fontSize:9,padding:"1px 5px",background:"#313150",color:C.sbMuted,borderRadius:3,fontFamily:"'DM Mono',monospace"}}>{count}</span>}
    </div>
  );

  // ProposalFolder: 单个提案的展开/收起文件夹
  const ProposalFolder = ({ cardId, proposal, indent = 2 }) => {
    const isOpen = expandedProposals?.has(proposal.id) ?? false;
    const completedDocs = PROPOSAL_DOC_TYPES.filter(dt => proposal[dt.key]).length;
    const committedCount = PROPOSAL_DOC_TYPES.filter(dt => proposal[dt.key] && proposal.gitStatus?.[dt.key]).length;
    const allCommitted = completedDocs > 0 && committedCount === completedDocs;
    return (
      <div>
        <div onClick={() => onToggleProposal?.(proposal.id)}
          style={{display:"flex",alignItems:"center",gap:6,padding:`5px ${12 + indent * 16}px`,cursor:"pointer",margin:"1px 4px",borderRadius:4,transition:"background 0.15s",userSelect:"none"}}
          onMouseEnter={e => e.currentTarget.style.background = C.sbHover}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <span style={{fontSize:9,color:C.sbMuted,display:"inline-block",transform:isOpen?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.15s"}}>▶</span>
          <span style={{fontSize:12,color:isOpen?"#cba6f7":C.sbText,flex:1}}>{isOpen?"📂":"📁"} {proposal.name}</span>
          {allCommitted
            ? <span style={{fontSize:9,padding:"1px 5px",background:"#1a3a28",color:"#a6e3a1",borderRadius:3,fontWeight:700}}>✓ Git</span>
            : committedCount > 0
              ? <span style={{fontSize:9,padding:"1px 5px",background:"#313150",color:"#a6e3a1",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>{committedCount}/{completedDocs}</span>
              : completedDocs > 0
                ? <span style={{fontSize:9,padding:"1px 5px",background:"#313150",color:C.sbMuted,borderRadius:3,fontFamily:"'DM Mono',monospace"}}>{completedDocs}</span>
                : null}
        </div>
        {isOpen && PROPOSAL_DOC_TYPES.map(dt => {
          const key = `${cardId}:p:${proposal.id}:${dt.key}`;
          return (
            <TreeItem key={dt.key} label={dt.label} icon={dt.icon} indent={indent + 1}
              active={selectedKey === key}
              onClick={() => onSelectKey(key)}
              hasDoc={!!proposal[dt.key]}
              isCommitted={!!proposal.gitStatus?.[dt.key]}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div style={{width:260,background:C.sb,borderRight:"1px solid #252535",overflowY:"auto",flexShrink:0,padding:"12px 0"}}>
      <div style={{padding:"0 12px 10px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:10,color:C.sbMuted,letterSpacing:2,fontFamily:"'DM Mono',monospace",textTransform:"uppercase"}}>文档库</span>
        <div style={{display:"flex",gap:4}}>
          {FILTER_CHIPS.map(chip => {
            const active = filters.has(chip.id);
            return (
              <button key={chip.id} onClick={() => toggleFilter(chip.id)}
                style={{fontSize:10,padding:"2px 7px",borderRadius:10,border:"none",cursor:"pointer",
                  background: active ? C.accent : C.sbHover,
                  color: active ? "#fff" : C.sbMuted,
                  transition:"all 0.15s"}}>
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>
      {visibleCards.map(card => {
        const isExpanded = expanded[card.id];
        const normDocs = normalizeDocs(card.docs);
        const proposals = normDocs.proposals || [];
        const rawDocCount = (typeof card.rawRequirement === 'string' && card.rawRequirement.trim()) ? 1 : 0;
        const completedCount = rawDocCount + (normDocs.prd ? 1 : 0) + proposals.reduce((sum, p) => sum + PROPOSAL_DOC_TYPES.filter(dt => p[dt.key]).length, 0);

        return (
          <div key={card.id} style={{marginBottom:4}}>
            {/* 需求卡片文件夹 */}
            <FolderItem
              label={<span><span style={{fontSize:9,padding:"1px 4px",background:`${priorityColor(card.priority)}22`,color:priorityColor(card.priority),borderRadius:2,marginRight:5,fontFamily:"'DM Mono',monospace"}}>{card.priority}</span>{card.id}</span>}
              open={isExpanded}
              onToggle={() => onToggleExpand(card.id)}
              count={completedCount}
            />
            {isExpanded && (
              <div>
                <div style={{padding:"2px 8px 6px 20px"}}>
                  <div style={{fontSize:11,color:C.sbMuted,lineHeight:1.3,paddingLeft:8,borderLeft:`2px solid #313150`}}>
                    {card.title.length > 20 ? card.title.slice(0, 20) + "…" : card.title}
                  </div>
                </div>

                <TreeItem label="原始需求" icon="🧾" indent={1}
                  active={selectedKey === `${card.id}:raw`}
                  onClick={() => onSelectKey(`${card.id}:raw`)}
                  hasDoc={typeof card.rawRequirement === 'string' && card.rawRequirement.trim()}
                />

                {/* 📋 产品需求 SPEC (PRD) - 始终显示 */}
                <TreeItem label="产品需求 SPEC" icon="📋" indent={1}
                  active={selectedKey === `${card.id}:prd`}
                  onClick={() => onSelectKey(`${card.id}:prd`)}
                  hasDoc={!!normDocs.prd}
                />

                {proposals.length > 0 && (
                  <div>
                    <div style={{padding:`4px ${12 + 16}px 2px`,fontSize:10,color:C.sbMuted,letterSpacing:1,textTransform:"uppercase",fontFamily:"'DM Mono',monospace"}}>
                      OpenSpec 提案
                    </div>
                    {proposals.map(p => (
                      <ProposalFolder key={p.id} cardId={card.id} proposal={p} indent={1} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── DocEditor ──
function DocEditor({ card, docType, proposalName, content, editMode, editText, onEditMode, onSaveEdit, onCancelEdit, onEditTextChange, onGenerate, isGenerating, projectConfig, onNavigateToSettings, onGenerateProposal, hasProposals, onCommitSuccess, gitStatusUrl }) {
  const docMeta = DOC_TYPES.find(d => d.key === docType) || PROPOSAL_DOC_TYPES.find(d => d.key === docType);
  const isRawDoc = docType === 'raw';
  const rawRequirement = typeof card?.rawRequirement === 'string' ? card.rawRequirement : '';
  const rawDisplay = getDisplayRawRequirement(card);
  const rawBaseInfo = rawDisplay.baseInfo;
  const hasRawContent = Boolean(rawRequirement.trim());
  const hasDocContent = isRawDoc ? hasRawContent : Boolean(content);
  const [committing, setCommitting] = useState(false);
  const tripleClickCount = useRef(0);
  const tripleClickTimer = useRef(null);

  const handlePreviewClick = () => {
    if (editMode || !content || !['proposal', 'spec', 'prd'].includes(docType)) return;
    tripleClickCount.current += 1;
    if (tripleClickTimer.current) clearTimeout(tripleClickTimer.current);
    if (tripleClickCount.current >= 3) {
      tripleClickCount.current = 0;
      onEditMode();
      return;
    }
    tripleClickTimer.current = setTimeout(() => { tripleClickCount.current = 0; }, 500);
  };
  const [commitResult, setCommitResult] = useState(null); // null | { ok, msg, url }

  const handleCommit = async () => {
    if (!content) return;
    const git = projectConfig?.git;
    if (!git?.repoUrl || !git?.token) {
      setCommitResult({ ok: false, msg: '未配置 Git 仓库，请先前往项目配置页面完善配置。', toSettings: true });
      return;
    }
    setCommitting(true);
    setCommitResult(null);
    try {
      const reqId = card.id.toLowerCase();
      let filePath;
      if (docType === 'prd') {
        filePath = `docs/requirements/${reqId}/prd.md`;
      } else {
        const proposalId = proposalName ? proposalName.toLowerCase().replace(/\s+/g, '-') : 'default';
        filePath = `docs/requirements/${reqId}/proposals/${proposalId}/${docType}.md`;
      }
      const url = await commitDocToGit(filePath, content, `docs(${card.id}): update ${docType}`, git);
      setCommitResult({ ok: true, msg: '提交成功', url });
      onCommitSuccess && onCommitSuccess({ docType, url });
    } catch (e) {
      setCommitResult({ ok: false, msg: e.message || '提交失败', toSettings: false });
    }
    setCommitting(false);
  };

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:C.white}}>
      {/* Header */}
      <div style={{borderBottom:`1px solid ${C.border}`,padding:"0 20px",display:"flex",alignItems:"center",gap:0,background:C.cream,flexShrink:0,height:44}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"0 12px 0 0",borderRight:`1px solid ${C.border}`,height:"100%"}}>
          <span style={{fontSize:14}}>{docMeta?.icon}</span>
          {proposalName && (
            <>
              <span style={{fontSize:12,color:C.muted,maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{proposalName}</span>
              <span style={{color:C.border}}>/</span>
            </>
          )}
          <span style={{fontSize:13,fontWeight:600,color:C.ink}}>{docMeta?.label}</span>
          {hasDocContent && <span style={{width:6,height:6,borderRadius:"50%",background:"#a6e3a1",marginLeft:4}}/>}
        </div>
        <div style={{padding:"0 12px",fontSize:12,color:C.muted,flex:1}}>
          {card?.id} · {card?.title?.slice(0,25)}{card?.title?.length > 25 ? "…" : ""}
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {!isRawDoc && content && !editMode && (
            <>
              <button onClick={onEditMode}
                style={{padding:"5px 12px",background:C.white,border:`1px solid ${C.border}`,borderRadius:5,cursor:"pointer",fontSize:12,color:C.ink,display:"flex",alignItems:"center",gap:5}}>
                ✎ 编辑
              </button>
              <button onClick={handleCommit} disabled={committing}
                style={{padding:"5px 12px",background:committing?"#2a2a2a":"#1a1a1a",border:"1px solid #333",borderRadius:5,cursor:committing?"wait":"pointer",fontSize:12,color:committing?"#888":"#aaa",display:"flex",alignItems:"center",gap:5,transition:"all 0.15s"}}
                onMouseEnter={e=>{if(!committing){e.currentTarget.style.background="#2a2a2a";e.currentTarget.style.color="#fff";}}}
                onMouseLeave={e=>{if(!committing){e.currentTarget.style.background="#1a1a1a";e.currentTarget.style.color="#aaa";}}}>
                {committing ? "⟳ 提交中…" : "⬆ 提交到仓库"}
              </button>
              {docType === 'prd' && onGenerateProposal && (
                <button onClick={onGenerateProposal}
                  style={{padding:"5px 12px",background:C.purple,border:"none",borderRadius:5,cursor:"pointer",fontSize:12,color:"#fff",fontWeight:600,display:"flex",alignItems:"center",gap:5,boxShadow:`0 1px 4px ${C.purple}44`,transition:"opacity 0.15s"}}
                  onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                  {hasProposals ? "↺ 更新提案" : "+ 生成提案"}
                </button>
              )}
            </>
          )}
          {editMode && (
            <>
              <button onClick={onCancelEdit} style={{padding:"5px 12px",background:"transparent",border:`1px solid ${C.border}`,borderRadius:5,cursor:"pointer",fontSize:12,color:C.muted}}>取消</button>
              <button onClick={onSaveEdit} style={{padding:"5px 12px",background:C.accent,border:"none",borderRadius:5,cursor:"pointer",fontSize:12,color:"#fff",fontWeight:600}}>保存</button>
            </>
          )}
        </div>
      </div>
      {commitResult && (
        <div style={{padding:"8px 20px",fontSize:12,display:"flex",alignItems:"center",gap:8,
          background:commitResult.ok ? C.successLight : C.dangerLight,
          borderBottom:`1px solid ${commitResult.ok ? C.success : C.danger}33`,
          color:commitResult.ok ? C.success : C.danger}}>
          {commitResult.ok ? "✓" : "✗"} {commitResult.msg}
          {commitResult.ok && commitResult.url && (
            <a href={commitResult.url} target="_blank" rel="noreferrer" style={{color:C.accent,fontSize:11,marginLeft:4}}>查看 Commit →</a>
          )}
          {!commitResult.ok && commitResult.toSettings && onNavigateToSettings && (
            <button onClick={onNavigateToSettings} style={{marginLeft:4,padding:"2px 10px",background:"none",border:`1px solid ${C.accent}`,borderRadius:4,cursor:"pointer",fontSize:11,color:C.accent}}>
              前往配置
            </button>
          )}
          <button onClick={()=>setCommitResult(null)} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",fontSize:14,color:"inherit",opacity:0.6}}>✕</button>
        </div>
      )}

      {/* Persistent git status */}
      {gitStatusUrl && !commitResult && (
        <div style={{padding:"5px 20px",fontSize:11,display:"flex",alignItems:"center",gap:6,background:C.successLight,borderBottom:`1px solid ${C.success}33`,color:C.success}}>
          ✓ 已提交到 Git
          <a href={gitStatusUrl} target="_blank" rel="noreferrer" style={{color:C.accent,fontSize:11,marginLeft:2}}>查看 Commit →</a>
        </div>
      )}

      {/* Content */}
      <div style={{flex:1,overflowY:"auto"}}>
        {isRawDoc ? (
          <div style={{padding:"22px 26px",maxWidth:900}}>
            <div style={{marginBottom:14,padding:"10px 12px",background:C.accentLight,border:`1px solid ${C.accent}33`,borderRadius:8,fontSize:12,color:C.ink,lineHeight:1.6}}>
              原始需求是人类提出并从 Meego 同步过来的需求；产品需求 SPEC 是基于该原始需求转化形成的标准化新文档。
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(180px,1fr))",gap:10,marginBottom:14}}>
              {[
                ["需求方", rawBaseInfo.demander],
                ["产品经理", rawBaseInfo.productManager],
                ["提报时间", rawBaseInfo.reportedAt],
                ["所属模块", rawBaseInfo.moduleName],
              ].map(([label, value]) => (
                <div key={label} style={{background:C.cream,border:`1px solid ${C.border}`,borderRadius:7,padding:"9px 10px"}}>
                  <div style={{fontSize:11,color:C.muted,marginBottom:4}}>{label}</div>
                  <div style={{fontSize:13,color:C.ink,fontWeight:600,lineHeight:1.4}}>{value || '-'}</div>
                </div>
              ))}
            </div>

            <div style={{marginBottom:14,padding:"10px 12px",borderRadius:8,border:`1px solid ${C.border}`,background:C.white,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:12,color:C.muted,fontWeight:600}}>Meego 链接</span>
              <span style={{marginLeft:"auto"}}>
                {rawBaseInfo.meegoUrl ? (
                  <a href={rawBaseInfo.meegoUrl} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:C.teal,textDecoration:"none",fontWeight:700}}>
                    打开原单 ↗
                  </a>
                ) : (
                  <span style={{fontSize:12,color:C.muted}}>未关联 Meego 链接</span>
                )}
              </span>
            </div>

            <div style={{fontSize:12,fontWeight:700,color:C.muted,marginBottom:8}}>原始需求内容（只读）</div>
            {rawDisplay.isSample && (
              <div style={{marginBottom:8,fontSize:11,color:C.muted,fontWeight:600}}>示例内容（来自 PRD 摘录）</div>
            )}
            <div style={{fontSize:13,color:C.ink,lineHeight:1.75,whiteSpace:"pre-wrap",background:C.cream,padding:"14px 16px",borderRadius:8,border:`1px solid ${C.border}`}}>{rawDisplay.content}</div>
          </div>
        ) : !content ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100%",padding:60,textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:16}}>{docMeta?.icon}</div>
            <div style={{fontSize:18,fontWeight:700,color:C.ink,marginBottom:8}}>{docMeta?.label}</div>
            <div style={{fontSize:13,color:C.muted,marginBottom:6}}>该文档尚未生成</div>
            <div style={{fontSize:12,color:C.muted,marginBottom:24,maxWidth:400,lineHeight:1.5}}>
              AI 将根据需求信息自动生成完整的 {docMeta?.label} 文档
            </div>
            <>
                <button onClick={onGenerate} disabled={isGenerating}
                  style={{padding:"12px 28px",borderRadius:8,border:"none",cursor:isGenerating ? "wait" : "pointer",background:isGenerating ? C.border : C.purple,color:isGenerating ? C.muted : "#fff",fontWeight:600,fontSize:14,display:"flex",alignItems:"center",gap:8}}>
                  {isGenerating
                    ? <><span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>⟳</span> AI 生成中…</>
                    : <><span style={{fontSize:16}}>✦</span> AI 生成 {docMeta?.label}</>}
                </button>
                {docType === 'prd' && onGenerateProposal && (
                  <button disabled
                    style={{marginTop:10,padding:"8px 20px",borderRadius:8,border:`1px solid ${C.border}`,cursor:"not-allowed",background:C.cream,color:C.muted,fontWeight:500,fontSize:12,display:"flex",alignItems:"center",gap:6,opacity:0.6}}>
                    + 生成提案（请先生成 PRD）
                  </button>
                )}
              </>
          </div>
        ) : editMode ? (
          <div style={{padding:"20px",height:"100%",display:"flex",flexDirection:"column"}}>
            <textarea
              value={editText}
              onChange={e => onEditTextChange(e.target.value)}
              style={{width:"100%",flex:1,minHeight:300,padding:"14px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,color:C.ink,background:C.cream,outline:"none",resize:"none",lineHeight:1.7,fontFamily:"'DM Mono',monospace",boxSizing:"borderBox"}}
              autoFocus
            />
          </div>
        ) : (
          <div className="doc-content" style={{padding:"28px 40px",maxWidth:800}} onClick={handlePreviewClick}>
            <MarkdownRenderer content={content}/>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ChatbotPanel ──
function ChatbotPanel({ card, onSendMessage }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const currentModel = localStorage.getItem('ai_model_selected') || 'claude';
  const historyKey = `chatHistory_${currentModel}`;
  // 迁移兼容：如果是 claude 模式且存在旧版历史，优先用旧版直到新消息写入
  const chatHistory = card?.[historyKey] ?? (currentModel === 'claude' ? card?.chatHistory : null) ?? [];

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
        {(() => {
          const text = (card?.desc || card?.title || "");
          const label = text.length > 40 ? text.slice(0, 40) + "…" : text;
          const href = card?.sourceUrl || "https://www.github.com";
          return (
            <a href={href} target="_blank" rel="noreferrer noopener"
              style={{fontSize:11,color:C.muted,marginTop:4,display:"block",textDecoration:"none",transition:"color 0.15s"}}
              onMouseEnter={e => { e.currentTarget.style.color = C.accent; e.currentTarget.style.textDecoration = "underline"; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.textDecoration = "none"; }}>
              {label}
            </a>
          );
        })()}
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

        {chatHistory.map((msg, i) => (
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
function ReferencePanel({ currentCard, allCards, onUpdateRefs }) {
  const REF_TYPE_META = {
    feishu: { icon: "🪶", label: "飞书文档", color: "#00B96B" },
    prd:    { icon: "📋", label: "PRD",      color: C.accent },
    spec:   { icon: "📝", label: "SPEC",     color: C.purple },
    other:  { icon: "📄", label: "链接",     color: C.muted },
  };
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUrl, setNewUrl]           = useState('');
  const [newTitle, setNewTitle]       = useState('');
  const [newType, setNewType]         = useState('other');
  const [urlError, setUrlError]       = useState('');

  const refs = currentCard && Array.isArray(currentCard.references)
    ? currentCard.references.filter(r => r && r.url)
    : [];

  const handleAddLink = () => {
    if (!newUrl.trim()) { setUrlError('URL 不能为空'); return; }
    const newRef = { url: newUrl.trim(), title: newTitle.trim() || newUrl.trim(), type: newType };
    onUpdateRefs && onUpdateRefs(currentCard.id, [...refs, newRef]);
    setNewUrl(''); setNewTitle(''); setNewType('other'); setUrlError(''); setShowAddForm(false);
  };

  const handleDeleteRef = (index) => {
    onUpdateRefs && onUpdateRefs(currentCard.id, refs.filter((_, i) => i !== index));
  };

  const similarCards = useMemo(() => {
    if (!currentCard || !Array.isArray(allCards)) return [];
    return allCards
      .filter(c => c.id !== currentCard.id)
      .map(card => {
        let score = 0;
        const ctags = Array.isArray(currentCard.tags) ? currentCard.tags : [];
        const cardTags = Array.isArray(card.tags) ? card.tags : [];
        score += cardTags.filter(t => ctags.includes(t)).length * 10;
        if (card.priority === currentCard.priority) score += 5;
        return { card, score };
      })
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => ({...s.card, similarityScore: s.score}));
  }, [currentCard, allCards]);

  const descText = currentCard ? (currentCard.desc || currentCard.title || "") : "";
  const descLabel = descText.length > 40 ? descText.slice(0, 40) + "…" : descText;
  const descHref = currentCard ? (currentCard.sourceUrl || "https://www.github.com") : "#";

  const inputSt = { width:"100%", padding:"6px 10px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:12, background:C.white, outline:"none", boxSizing:"border-box" };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Header */}
      <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:C.cream}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:16}}>📚</span>
          <span style={{fontSize:13,fontWeight:600,color:C.ink}}>参考资料</span>
        </div>
        <a href={descHref} target="_blank" rel="noreferrer noopener"
          style={{fontSize:11,color:C.muted,marginTop:4,display:"block",textDecoration:"none"}}
          onMouseEnter={e => { e.currentTarget.style.color = C.accent; e.currentTarget.style.textDecoration = "underline"; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.textDecoration = "none"; }}>
          {descLabel}
        </a>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"12px"}}>
        {/* 参考文档分组 */}
        <div style={{fontSize:10,color:C.muted,letterSpacing:1,textTransform:"uppercase",fontFamily:"'DM Mono',monospace",marginBottom:8,paddingLeft:2}}>
          参考文档
        </div>

        {refs.length === 0 && !showAddForm ? (
          <div style={{border:`1.5px dashed ${C.border}`,borderRadius:8,padding:"16px 14px",marginBottom:8,textAlign:"center"}}>
            <div style={{fontSize:20,marginBottom:6}}>📎</div>
            <div style={{fontSize:12,color:C.muted,lineHeight:1.5}}>暂无参考文档</div>
          </div>
        ) : (
          <div style={{marginBottom:4}}>
            {refs.map((ref, i) => {
              const meta = REF_TYPE_META[ref.type] || REF_TYPE_META.other;
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                  <a href={ref.url} target="_blank" rel="noreferrer noopener"
                    style={{flex:1,display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:7,border:`1px solid ${C.border}`,textDecoration:"none",background:C.white,transition:"all 0.15s",cursor:"pointer",minWidth:0}}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = meta.color; e.currentTarget.style.boxShadow = `0 2px 6px ${meta.color}22`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}>
                    <span style={{fontSize:15,flexShrink:0}}>{meta.icon}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,color:C.ink,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ref.title}</div>
                      <div style={{fontSize:10,color:meta.color,marginTop:1}}>{meta.label}</div>
                    </div>
                    <span style={{fontSize:12,color:C.muted,flexShrink:0}}>→</span>
                  </a>
                  <button onClick={() => handleDeleteRef(i)} title="删除"
                    style={{flexShrink:0,width:22,height:22,borderRadius:4,border:`1px solid ${C.border}`,background:C.white,cursor:"pointer",fontSize:11,color:C.muted,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}
                    onMouseEnter={e => { e.currentTarget.style.color = C.danger; e.currentTarget.style.borderColor = C.danger; }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; }}>
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* 添加链接入口 */}
        {currentCard && (
          <div style={{marginBottom:16}}>
            <button onClick={() => { setShowAddForm(v => !v); setUrlError(''); setNewUrl(''); setNewTitle(''); setNewType('other'); }}
              style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",border:`1px dashed ${showAddForm ? C.accent : C.border}`,borderRadius:6,background:"none",cursor:"pointer",fontSize:12,color:showAddForm ? C.accent : C.muted,width:"100%",justifyContent:"center"}}>
              <span style={{fontSize:14,lineHeight:1}}>{showAddForm ? '−' : '+'}</span>
              <span>{showAddForm ? '收起' : '添加链接'}</span>
            </button>

            {showAddForm && (
              <div style={{marginTop:8,padding:"12px",border:`1px solid ${C.border}`,borderRadius:8,background:C.cream}}>
                <div style={{marginBottom:8}}>
                  <label style={{fontSize:11,fontWeight:600,color:C.ink,display:"block",marginBottom:4}}>URL *</label>
                  <input value={newUrl} onChange={e => { setNewUrl(e.target.value); setUrlError(''); }}
                    placeholder="https://..." style={{...inputSt, borderColor: urlError ? C.danger : C.border}}/>
                  {urlError && <div style={{fontSize:11,color:C.danger,marginTop:3}}>{urlError}</div>}
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontSize:11,fontWeight:600,color:C.ink,display:"block",marginBottom:4}}>标题</label>
                  <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
                    placeholder="留空则使用 URL" style={inputSt}/>
                </div>
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:11,fontWeight:600,color:C.ink,display:"block",marginBottom:4}}>类型</label>
                  <select value={newType} onChange={e => setNewType(e.target.value)}
                    style={{...inputSt, cursor:"pointer", fontFamily:"inherit"}}>
                    <option value="feishu">🪶 飞书文档</option>
                    <option value="prd">📋 PRD</option>
                    <option value="spec">📝 SPEC</option>
                    <option value="other">📄 其他</option>
                  </select>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={handleAddLink}
                    style={{flex:1,padding:"6px 0",background:C.accent,color:"#fff",border:"none",borderRadius:5,cursor:"pointer",fontSize:12,fontWeight:600}}>
                    添加
                  </button>
                  <button onClick={() => { setShowAddForm(false); setUrlError(''); }}
                    style={{padding:"6px 14px",background:"none",border:`1px solid ${C.border}`,borderRadius:5,cursor:"pointer",fontSize:12,color:C.muted}}>
                    取消
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 相似需求分组 */}
        <div style={{fontSize:10,color:C.muted,letterSpacing:1,textTransform:"uppercase",fontFamily:"'DM Mono',monospace",marginBottom:8,paddingLeft:2}}>
          相似需求
        </div>
        {similarCards.length === 0 ? (
          <div style={{textAlign:"center",color:C.muted,padding:"20px 0",fontSize:12}}>
            暂无相关历史需求
          </div>
        ) : similarCards.map(card => (
          <div key={card.id} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:8,padding:"12px",marginBottom:10,cursor:"pointer",transition:"all 0.15s"}}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.boxShadow = `0 2px 8px ${C.accent}33`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:C.muted}}>{card.id}</span>
              <span style={{fontSize:10,padding:"1px 5px",background:priorityColor(card.priority),color:"#fff",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>{card.priority}</span>
              {card.col === "approved" && <span style={{fontSize:9,padding:"1px 5px",background:C.successLight,color:C.success,borderRadius:3}}>已通过</span>}
              {card.col === "submitted" && <span style={{fontSize:9,padding:"1px 5px",background:"#f0ede8",color:C.muted,borderRadius:3}}>已提交（git commit）</span>}
              <span style={{marginLeft:"auto",fontSize:10,color:C.teal,fontWeight:600,fontFamily:"'DM Mono',monospace"}}>{card.similarityScore}% 相似</span>
            </div>
            <div style={{fontSize:12,fontWeight:600,color:C.ink,lineHeight:1.4,marginBottom:6}}>{card.title}</div>
            <div style={{fontSize:11,color:C.muted,lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
              {card.desc}
            </div>
            <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>
              {Array.isArray(card.tags) && card.tags.map(t => <span key={t} style={{fontSize:9,padding:"2px 6px",background:C.cream,color:C.muted,borderRadius:3}}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── RightPanel ──
function RightPanel({ currentCard, allCards, activeTab, onTabChange, onSendMessage, onUpdateRefs }) {
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
          <ReferencePanel currentCard={currentCard} allCards={allCards} onUpdateRefs={onUpdateRefs}/>
        )}
      </div>
    </div>
  );
}

// ── ProposalReviewDrawer ──
const PROPOSAL_GEN_STEPS = ['proposal', 'design', 'spec', 'tasks'];
const PROPOSAL_GEN_LABELS = { proposal: 'Proposal', design: 'Design', spec: 'Delta Spec', tasks: 'Tasks' };

function ProposalReviewDrawer({ card, onClose, onConfirm, reviewResult, reviewing, generating, generatingStep }) {
  if (!card) return null;
  const r = reviewResult;
  const totalSteps = PROPOSAL_GEN_STEPS.length;
  const currentStepIdx = generatingStep ? PROPOSAL_GEN_STEPS.indexOf(generatingStep) : -1;

  return (
    <div style={{position:"fixed",right:0,top:0,bottom:0,width:"52vw",minWidth:520,background:C.white,borderLeft:`1px solid ${C.border}`,zIndex:200,boxShadow:"-12px 0 48px rgba(0,0,0,0.18)",display:"flex",flexDirection:"column",animation:"slideIn 0.22s ease"}}>
      {/* Header */}
      <div style={{padding:"18px 28px 14px",borderBottom:`1px solid ${C.border}`,flexShrink:0,background:C.ink}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:"#6c7086",marginBottom:4,fontFamily:"'DM Mono',monospace"}}>{card.id}</div>
            <div style={{fontSize:15,fontWeight:700,color:"#fff",lineHeight:1.3}}>{card.title}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:"#6c7086",padding:"0 4px",lineHeight:1,flexShrink:0}}>×</button>
        </div>
        <div style={{marginTop:10,fontSize:12,color:"#a6e3a1",fontWeight:600}}>✦ PRD 评审报告</div>
      </div>

      {/* Body */}
      <div style={{flex:1,overflowY:"auto",padding:"24px 28px",paddingBottom:100}}>
        {reviewing && !r && (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:200,gap:16}}>
            <span style={{fontSize:32,display:"inline-block",animation:"spin 1.2s linear infinite"}}>⟳</span>
            <div style={{fontSize:14,color:C.muted}}>AI 评审中，请稍候…</div>
          </div>
        )}
        {r && (
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
                <span style={{fontSize:13,fontWeight:600,color:r.passed?C.success:C.danger}}>{r.passed?"AI建议：通过评审，可生成提案":"AI建议：需修改后再生成提案"}</span>
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

        {/* 生成进度 */}
        {generating && (
          <div style={{marginTop:20,padding:"16px 18px",background:C.purpleLight,border:`1px solid ${C.purple}33`,borderRadius:8}}>
            <div style={{fontSize:13,fontWeight:600,color:C.purple,marginBottom:10}}>
              <span style={{display:"inline-block",animation:"spin 1.2s linear infinite",marginRight:6}}>⟳</span>
              正在生成提案文档…
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {PROPOSAL_GEN_STEPS.map((step, idx) => {
                const isDone = currentStepIdx > idx;
                const isCurrent = currentStepIdx === idx;
                return (
                  <div key={step} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:5,fontSize:12,fontWeight:500,
                    background: isDone ? C.successLight : isCurrent ? C.purpleLight : C.cream,
                    color: isDone ? C.success : isCurrent ? C.purple : C.muted,
                    border: `1px solid ${isDone ? C.success+'44' : isCurrent ? C.purple+'44' : C.border}`}}>
                    {isDone ? "✓" : isCurrent ? <span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⟳</span> : "○"}
                    {PROPOSAL_GEN_LABELS[step]}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Bottom bar */}
      <div style={{position:"sticky",bottom:0,padding:"14px 28px",background:C.white,borderTop:`1px solid ${C.border}`,display:"flex",gap:10,alignItems:"center",flexShrink:0,boxShadow:"0 -4px 20px rgba(0,0,0,0.07)"}}>
        <button onClick={onConfirm} disabled={generating}
          style={{flex:2,padding:"11px 0",borderRadius:8,border:"none",cursor:generating?"not-allowed":"pointer",
            background:generating?C.border:C.purple,
            color:generating?C.muted:"#fff",
            fontWeight:600,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:7,
            boxShadow:generating?"none":`0 2px 8px ${C.purple}44`}}>
          {generating
            ? <><span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>⟳</span> 生成中…</>
            : <><span>✦</span> 提交并生成提案</>}
        </button>
        <button onClick={onClose}
          style={{flex:1,padding:"11px 0",borderRadius:8,border:`1.5px solid ${C.border}`,cursor:"pointer",background:"transparent",color:C.muted,fontWeight:600,fontSize:14}}>
          取消
        </button>
      </div>
    </div>
  );
}

// ── DetailPage ──
function DetailPage({ cards, focusCardId, onBack, onUpdateDocs, onSendMessage, projectConfig, onNavigateToSettings, onUpdateRefs }) {
  const [selectedKey, setSelectedKey] = useState(`${focusCardId}:prd`);
  const [expanded, setExpanded] = useState(() => {
    const init = {};
    cards.forEach(c => { init[c.id] = c.id === focusCardId; });
    return init;
  });
  const [expandedProposals, setExpandedProposals] = useState(new Set(["auth-system"]));
  const [generating, setGenerating] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const [rightTab, setRightTab] = useState("chatbot");

  // ProposalReviewDrawer state
  const [proposalReviewOpen, setProposalReviewOpen] = useState(false);
  const [proposalReviewResult, setProposalReviewResult] = useState(null);
  const [proposalReviewing, setProposalReviewing] = useState(false);
  const [proposalGenerating, setProposalGenerating] = useState(false);
  const [proposalGeneratingStep, setProposalGeneratingStep] = useState(null);
  const [proposalGenerateError, setProposalGenerateError] = useState(null);

  // 切换文档时重置编辑状态
  useEffect(() => { setEditMode(false); }, [selectedKey]);

  const toggleProposal = (proposalId) => {
    setExpandedProposals(prev => {
      const next = new Set(prev);
      next.has(proposalId) ? next.delete(proposalId) : next.add(proposalId);
      return next;
    });
  };
  const isProposalExpanded = (proposalId) => expandedProposals.has(proposalId);

  // ── 解析 selectedKey: 支持两种格式
  //   普通文档:   "${cardId}:${docType}"  (prd 或 legacy flat)
  //   提案文档:   "${cardId}:p:${proposalId}:${docType}"
  const parts = selectedKey.split(":");
  const selCardId = parts[0];
  const selCard = cards.find(c => c.id === selCardId);
  const normDocs = normalizeDocs(selCard?.docs);

  let selDocType, selProposalId, selContent, selProposalName;
  if (parts[1] === "p") {
    selProposalId = parts[2];
    selDocType = parts[3];
    const proposal = normDocs.proposals?.find(p => p.id === selProposalId);
    selContent = proposal?.[selDocType] ?? null;
    selProposalName = proposal?.name;
  } else {
    selDocType = parts[1];
    if (selDocType === "raw") {
      selContent = typeof selCard?.rawRequirement === 'string' ? selCard.rawRequirement : '';
    } else if (selDocType === "prd") {
      selContent = normDocs.prd ?? null;
    } else {
      // 单提案平铺模式：从 proposals[0] 读取
      selContent = normDocs.proposals?.[0]?.[selDocType] ?? null;
      selProposalName = normDocs.proposals?.[0]?.name;
    }
  }

  // ── 提交 git 成功后持久化 gitStatus
  const handleCommitSuccess = useCallback(({ docType, url }) => {
    if (!selCard) return;
    const nd = normalizeDocs(selCard.docs);
    const pid = selProposalId || nd.proposals?.[0]?.id;
    if (!pid) return; // prd 暂不追踪
    const updatedProposals = nd.proposals.map(p => {
      if (p.id !== pid) return p;
      return { ...p, gitStatus: { ...(p.gitStatus || {}), [docType]: url, committedAt: new Date().toISOString() } };
    });
    onUpdateDocs(selCard.id, { ...nd, proposals: updatedProposals }, { col: "submitted" });
  }, [selCard, selProposalId, onUpdateDocs]);

  // ── 更新文档内容（区分 prd / 提案文档）
  const updateDocContent = (docs, docType, proposalId, content) => {
    const nd = normalizeDocs(docs);
    if (!proposalId && docType === "prd") {
      return { ...nd, prd: content };
    }
    const pid = proposalId || nd.proposals?.[0]?.id;
    return {
      ...nd,
      proposals: nd.proposals.map(p => p.id === pid ? { ...p, [docType]: content } : p),
    };
  };

  const handleGenerate = async () => {
    if (!selCard || !selDocType) return;
    const genKey = selectedKey;
    setGenerating(genKey);
    try {
      const content = await callAIDoc(selCard, selDocType);
      const newDocs = updateDocContent(selCard.docs, selDocType, selProposalId, content);
      onUpdateDocs(selCard.id, newDocs);
    } catch (e) {
      console.error(e);
      const fallback = FALLBACK_DOCS[selDocType];
      if (fallback) {
        const newDocs = updateDocContent(selCard.docs, selDocType, selProposalId, fallback);
        onUpdateDocs(selCard.id, newDocs);
      }
    }
    setGenerating(null);
  };

  const handleSaveEdit = () => {
    const newDocs = updateDocContent(selCard.docs, selDocType, selProposalId, editText);
    onUpdateDocs(selCard.id, newDocs);
    setEditMode(false);
  };

  const enterEdit = () => {
    setEditText(selContent || "");
    setEditMode(true);
  };

  const isGenerating = generating === selectedKey;

  // 计算 hasProposals（Task 2.1）
  const hasProposals = (normDocs.proposals?.length ?? 0) > 0;

  // Task 4.2: 打开评审抽屉并触发 AI 评审
  const handleOpenProposalReview = async () => {
    if (!selCard) return;
    setProposalReviewOpen(true);
    setProposalReviewResult(null);
    setProposalGenerateError(null);
    setProposalReviewing(true);
    try {
      const result = await callAIReview(selCard);
      setProposalReviewResult(result);
    } catch (e) {
      console.error(e);
      setProposalReviewResult(DEMO_AI_REVIEW_RESULT);
      notify("AI 不可用，已使用示例评审结果");
    }
    setProposalReviewing(false);
  };

  const handleRetryReview = async () => {
    setProposalReviewResult(null);
    setProposalReviewing(true);
    try {
      const result = await callAIReview(selCard);
      setProposalReviewResult(result);
    } catch (e) {
      console.error(e);
      setProposalReviewResult(DEMO_AI_REVIEW_RESULT);
      notify("AI 不可用，已使用示例评审结果");
    }
    setProposalReviewing(false);
  };

  // Tasks 4.3-4.5: 串行生成提案文档
  const handleGenerateProposalDocs = async () => {
    if (!selCard) return;
    setProposalGenerating(true);
    setProposalGenerateError(null);

    const nd = normalizeDocs(selCard.docs);
    // 决定目标提案：单提案则更新，多提案或无提案则新建
    let targetProposalId;
    let currentDocs;
    if (nd.proposals.length === 1) {
      targetProposalId = nd.proposals[0].id;
      currentDocs = { ...nd };
    } else {
      targetProposalId = `proposal-${Date.now()}`;
      currentDocs = {
        ...nd,
        proposals: [...nd.proposals, { id: targetProposalId, name: "OpenSpec 提案", proposal: null, design: null, spec: null, tasks: null }],
      };
      onUpdateDocs(selCard.id, currentDocs);
    }

    for (const step of PROPOSAL_GEN_STEPS) {
      setProposalGeneratingStep(step);
      try {
        const content = await callAIDoc(selCard, step);
        currentDocs = {
          ...currentDocs,
          proposals: currentDocs.proposals.map(p =>
            p.id === targetProposalId ? { ...p, [step]: content } : p
          ),
        };
        onUpdateDocs(selCard.id, currentDocs);
      } catch (e) {
        console.error(e);
        const fallback = FALLBACK_DOCS[step] || '';
        currentDocs = {
          ...currentDocs,
          proposals: currentDocs.proposals.map(p =>
            p.id === targetProposalId ? { ...p, [step]: fallback } : p
          ),
        };
        onUpdateDocs(selCard.id, currentDocs);
        notify("AI 不可用，已使用示例内容继续生成");
      }
    }

    // Task 4.4: 存储 PRD 快照
    const prdSnapshot = normDocs.prd || selContent || '';
    onUpdateDocs(selCard.id, { ...currentDocs, _prdSnapshot: prdSnapshot });

    // 展开新提案文件夹
    setExpandedProposals(prev => { const next = new Set(prev); next.add(targetProposalId); return next; });

    setProposalGenerating(false);
    setProposalGeneratingStep(null);
    setProposalReviewOpen(false);
  };

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:C.paper}}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        .doc-content *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#3a3a5c;border-radius:3px}
      `}</style>

      {/* Top bar */}
      <div style={{background:C.ink,borderBottom:"1px solid #252535",padding:"0 16px",display:"flex",alignItems:"center",gap:12,flexShrink:0,height:48}}>
        <button onClick={onBack} style={{padding:"0 14px",height:"100%",background:"none",border:"none",cursor:"pointer",color:C.sbText,fontSize:12,display:"flex",alignItems:"center",gap:6,transition:"color 0.15s"}}
          onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = C.sbText}>
          ← 返回看板
        </button>
        <div style={{width:1,height:20,background:"#252535"}}/>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:11,color:C.sbMuted}}>需求看板</span>
          <span style={{color:"#444"}}>/</span>
          <span style={{fontSize:12,color:C.sbText,fontWeight:500}}>{selCard?.id}</span>
          <span style={{color:"#444"}}>/</span>
          <span style={{fontSize:12,color:C.sbText,fontWeight:500,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selCard?.title}</span>
        </div>
      </div>

      {/* Main content */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        <DocTreeSidebar
          cards={cards}
          selectedKey={selectedKey}
          onSelectKey={setSelectedKey}
          expanded={expanded}
          onToggleExpand={(id) => setExpanded(e => ({...e, [id]: !e[id]}))}
          focusCardId={focusCardId}
          expandedProposals={expandedProposals}
          onToggleProposal={toggleProposal}
        />

        <DocEditor
          card={selCard}
          docType={selDocType}
          proposalName={selProposalName}
          content={selContent}
          editMode={editMode}
          editText={editText}
          onEditMode={enterEdit}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={() => setEditMode(false)}
          onEditTextChange={setEditText}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          projectConfig={projectConfig}
          onNavigateToSettings={onNavigateToSettings}
          onGenerateProposal={selDocType === 'prd' ? handleOpenProposalReview : undefined}
          hasProposals={hasProposals}
          onCommitSuccess={handleCommitSuccess}
          gitStatusUrl={(() => {
            const pid = selProposalId || normDocs.proposals?.[0]?.id;
            const p = normDocs.proposals?.find(x => x.id === pid);
            return p?.gitStatus?.[selDocType] ?? null;
          })()}
        />

        <RightPanel
          currentCard={selCard}
          allCards={cards}
          activeTab={rightTab}
          onTabChange={setRightTab}
          onSendMessage={onSendMessage}
          onUpdateRefs={onUpdateRefs}
        />
      </div>

      {/* ProposalReviewDrawer (Task 4.6) */}
      {proposalReviewOpen && (
        <ProposalReviewDrawer
          card={selCard}
          onClose={() => { setProposalReviewOpen(false); setProposalGenerating(false); setProposalGeneratingStep(null); }}
          onConfirm={handleGenerateProposalDocs}
          reviewResult={proposalReviewResult}
          reviewing={proposalReviewing}
          generating={proposalGenerating}
          generatingStep={proposalGeneratingStep}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════ GIT INTEGRATION ═══════════════════════════════ */
function parseRepoUrl(repoUrl) {
  const gh = repoUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/);
  if (gh) return { owner: gh[1], repo: gh[2] };
  const gl = repoUrl.match(/gitlab[^/]*\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/);
  if (gl) return { owner: gl[1], repo: gl[2] };
  return { owner: '', repo: '' };
}

async function commitDocToGit(filePath, content, commitMessage, config) {
  const { platform, repoUrl, branch, token } = config;
  const { owner, repo } = parseRepoUrl(repoUrl);
  if (!owner || !repo) throw new Error('无法解析仓库 URL，请检查格式');
  const encoded = btoa(unescape(encodeURIComponent(content)));

  if (platform === 'github') {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };
    let sha;
    try {
      const getRes = await fetch(url + `?ref=${branch}`, { headers });
      if (getRes.ok) { const ex = await getRes.json(); sha = ex.sha; }
    } catch {}
    const body = { message: commitMessage, content: encoded, branch };
    if (sha) body.sha = sha;
    const putRes = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body) });
    if (!putRes.ok) { const err = await putRes.json(); throw new Error(err.message || `HTTP ${putRes.status}`); }
    const result = await putRes.json();
    return result.commit?.html_url || `https://github.com/${owner}/${repo}/blob/${branch}/${filePath}`;
  } else {
    const baseUrl = repoUrl.match(/^(https?:\/\/[^/]+)/)?.[1] || 'https://gitlab.com';
    const projectId = encodeURIComponent(`${owner}/${repo}`);
    const encodedPath = encodeURIComponent(filePath);
    const url = `${baseUrl}/api/v4/projects/${projectId}/repository/files/${encodedPath}`;
    const headers = { 'PRIVATE-TOKEN': token, 'Content-Type': 'application/json' };
    let method = 'POST';
    try {
      const getRes = await fetch(`${url}?ref=${branch}`, { headers });
      if (getRes.ok) method = 'PUT';
    } catch {}
    const body = { branch, content: encoded, commit_message: commitMessage, encoding: 'base64' };
    const putRes = await fetch(url, { method, headers, body: JSON.stringify(body) });
    if (!putRes.ok) { const err = await putRes.json(); throw new Error(err.message || `HTTP ${putRes.status}`); }
    return `${baseUrl}/${owner}/${repo}/-/blob/${branch}/${filePath}`;
  }
}

async function commitCardDocsToGit(card, config) {
  const results = [];
  const norm = normalizeDocs(card.docs);
  const reqId = card.id.toLowerCase();
  if (norm.prd) {
    const path = `docs/requirements/${reqId}/prd.md`;
    const url = await commitDocToGit(path, norm.prd, `docs(${card.id}): update prd`, config);
    results.push({ path, url });
  }
  for (const p of (norm.proposals || [])) {
    for (const key of ['proposal', 'design', 'spec', 'tasks']) {
      if (p[key]) {
        const path = `docs/requirements/${reqId}/proposals/${p.id}/${key}.md`;
        const url = await commitDocToGit(path, p[key], `docs(${card.id}): update ${p.id}/${key}`, config);
        results.push({ path, url });
      }
    }
  }
  return results;
}

/* ═══════════════════════════ PROJECT SETTINGS PAGE ═════════════════════════ */
const SDD_FRAMEWORKS = {
  openspec: {
    label: 'OpenSpec',
    desc: '本项目使用的 SDD 脚手架。通过 proposal / design / spec / tasks 四层文档结构管理规格变更，集成 openspec CLI 工具链。',
    defaultTemplates: {
      proposal: `## Why\n\n<!-- 说明变更动机，解决什么问题 -->\n\n## What Changes\n\n<!-- 具体变更内容，标注 BREAKING 变更 -->\n\n## Capabilities\n\n### New Capabilities\n- \`<name>\`: <描述>\n\n### Modified Capabilities\n- \`<name>\`: <变更内容>\n\n## Impact\n\n<!-- 影响的代码、API、依赖 -->`,
      design: `## Context\n\n<!-- 背景与现状 -->\n\n## Goals / Non-Goals\n\n**Goals:**\n<!-- 设计目标 -->\n\n**Non-Goals:**\n<!-- 明确排除的内容 -->\n\n## Decisions\n\n<!-- 关键技术决策与理由 -->\n\n## Risks / Trade-offs\n\n<!-- 已知风险与权衡 -->`,
      spec: `## ADDED Requirements\n\n### Requirement: <需求名>\n<需求描述，使用 SHALL/MUST>\n\n#### Scenario: <场景名>\n- **WHEN** <条件>\n- **THEN** <预期结果>`,
      tasks: `## 1. <任务组>\n\n- [ ] 1.1 <任务描述>\n- [ ] 1.2 <任务描述>\n\n## 2. <任务组>\n\n- [ ] 2.1 <任务描述>`,
    },
  },
  'spec-kit': {
    label: 'spec-kit',
    desc: '轻量级 SDD 脚手架，使用 YAML front-matter + Markdown 定义规格，支持 spec lint 和 CI 校验。适合小型团队快速迭代。',
    defaultTemplates: {
      proposal: `---\ntitle: <变更标题>\nstatus: draft\nauthors: []\n---\n\n# Problem\n\n<!-- 描述要解决的问题 -->\n\n# Solution\n\n<!-- 解决方案概述 -->\n\n# Alternatives Considered\n\n<!-- 考虑过的替代方案 -->`,
      design: `---\ntitle: <设计文档标题>\nstatus: draft\n---\n\n# Architecture\n\n<!-- 架构图或描述 -->\n\n# API Changes\n\n<!-- API 变更说明 -->\n\n# Data Model\n\n<!-- 数据模型变更 -->`,
      spec: `---\nfeature: <功能名>\nversion: 1.0\n---\n\n# Specification\n\n## Behavior\n\n- [ ] <行为描述>\n\n## Acceptance Criteria\n\n- Given <前提> When <操作> Then <结果>`,
      tasks: `# Implementation Tasks\n\n## Phase 1: Setup\n- [ ] <任务>\n\n## Phase 2: Core\n- [ ] <任务>\n\n## Phase 3: Test & Review\n- [ ] <任务>`,
    },
  },
  custom: {
    label: '自定义框架',
    desc: '使用自定义的文档规范。在下方模板编辑器中定义各文档类型的起始模板。',
    defaultTemplates: { proposal: '', design: '', spec: '', tasks: '' },
  },
};

const PROJECT_ASSOCIATION_OPTIONS = [
  {
    id: 'space-enterprise',
    name: '企业数字化空间',
    subsystems: [
      {
        id: 'subsystem-pm-ai',
        name: '智能需求平台',
        apps: [
          { id: 'app-pm-ai-web', name: 'PM AI Web' },
          { id: 'app-pm-ai-api', name: 'PM AI API' },
        ],
      },
      {
        id: 'subsystem-devops',
        name: '研发效能平台',
        apps: [
          { id: 'app-ci-center', name: 'CI 流水线中心' },
          { id: 'app-release-console', name: '发布控制台' },
        ],
      },
    ],
  },
  {
    id: 'space-marketing',
    name: '增长运营空间',
    subsystems: [
      {
        id: 'subsystem-campaign',
        name: '活动运营系统',
        apps: [
          { id: 'app-campaign-hub', name: 'Campaign Hub' },
          { id: 'app-cdp-link', name: 'CDP Connector' },
        ],
      },
      {
        id: 'subsystem-content',
        name: '内容生产系统',
        apps: [
          { id: 'app-content-studio', name: 'Content Studio' },
          { id: 'app-seo-pipeline', name: 'SEO Pipeline' },
        ],
      },
    ],
  },
];

const DEFAULT_PROJECT_CONFIG = {
  project: { spaceIds: [], subsystemIds: [], appIds: [] },
  ai: {
    model: 'claude',
    anthropicKey: '', anthropicBaseUrl: '', anthropicModel: '',
    glmKey: '',       glmBaseUrl: '',       glmModel: '',
    arkKey: '',       arkBaseUrl: '',       arkModel: '',
    customName: '', customBaseUrl: '', customModel: '', customKey: '', customAuthStyle: 'Bearer',
  },
  git: { platform: 'github', repoUrl: '', branch: 'main', token: '' },
  sdd: { framework: 'openspec', templates: { proposal: '', design: '', spec: '', tasks: '' } },
  skills: {},
};

function toIdArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

function normalizeProjectAssociationConfig(project) {
  const source = project || {};
  return {
    spaceIds: toIdArray(source.spaceIds ?? source.spaceId),
    subsystemIds: toIdArray(source.subsystemIds ?? source.subsystemId),
    appIds: toIdArray(source.appIds ?? source.appId),
  };
}

function loadProjectConfig() {
  try {
    const saved = localStorage.getItem('project-config');
    const base = saved ? JSON.parse(saved) : {};
    const normalizedSkills = normalizeSkillConfig(base.skills).normalized;
    return {
      project: normalizeProjectAssociationConfig(base.project),
      ai: {
        model: localStorage.getItem('ai_model_selected') || base.ai?.model || 'claude',
        anthropicKey:     localStorage.getItem('ai_model_claude_key')        || base.ai?.anthropicKey     || '',
        anthropicBaseUrl: localStorage.getItem('ai_model_claude_baseurl')    || base.ai?.anthropicBaseUrl || '',
        anthropicModel:   localStorage.getItem('ai_model_claude_modelname')  || base.ai?.anthropicModel   || '',
        glmKey:           localStorage.getItem('ai_model_glm_key')           || base.ai?.glmKey           || '',
        glmBaseUrl:       localStorage.getItem('ai_model_glm_baseurl')       || base.ai?.glmBaseUrl       || '',
        glmModel:         localStorage.getItem('ai_model_glm_modelname')     || base.ai?.glmModel         || '',
        arkKey:           localStorage.getItem('ai_model_ark_key')           || base.ai?.arkKey           || '',
        arkBaseUrl:       localStorage.getItem('ai_model_ark_baseurl')       || base.ai?.arkBaseUrl       || '',
        arkModel:         localStorage.getItem('ai_model_ark_modelname')     || base.ai?.arkModel         || '',
        customName:       localStorage.getItem('ai_model_custom_name')       || base.ai?.customName       || '',
        customBaseUrl:    localStorage.getItem('ai_model_custom_baseurl')    || base.ai?.customBaseUrl    || '',
        customModel:      localStorage.getItem('ai_model_custom_model')      || base.ai?.customModel      || '',
        customKey:        localStorage.getItem('ai_model_custom_key')        || base.ai?.customKey        || '',
        customAuthStyle:  localStorage.getItem('ai_model_custom_authstyle')  || base.ai?.customAuthStyle  || 'Bearer',
      },
      git: { ...DEFAULT_PROJECT_CONFIG.git, ...(base.git || {}) },
      sdd: { ...DEFAULT_PROJECT_CONFIG.sdd, ...(base.sdd || {}) },
      skills: { ...DEFAULT_PROJECT_CONFIG.skills, ...normalizedSkills },
    };
  } catch { return { ...DEFAULT_PROJECT_CONFIG }; }
}

function saveProjectConfig(config) {
  const skillNormalized = normalizeSkillConfig(config.skills).normalized;
  const normalizedConfig = { ...config, skills: skillNormalized };
  localStorage.setItem('project-config', JSON.stringify(normalizedConfig));
  localStorage.setItem('ai_model_selected', normalizedConfig.ai.model);
  const ai = normalizedConfig.ai;
  const set = (key, val) => val?.trim() ? localStorage.setItem(key, val.trim()) : localStorage.removeItem(key);
  set('ai_model_claude_key',        ai.anthropicKey);
  set('ai_model_claude_baseurl',    ai.anthropicBaseUrl);
  set('ai_model_claude_modelname',  ai.anthropicModel);
  set('ai_model_glm_key',           ai.glmKey);
  set('ai_model_glm_baseurl',       ai.glmBaseUrl);
  set('ai_model_glm_modelname',     ai.glmModel);
  set('ai_model_ark_key',           ai.arkKey);
  set('ai_model_ark_baseurl',       ai.arkBaseUrl);
  set('ai_model_ark_modelname',     ai.arkModel);
  set('ai_model_custom_name',       ai.customName);
  set('ai_model_custom_baseurl',    ai.customBaseUrl);
  set('ai_model_custom_model',      ai.customModel);
  set('ai_model_custom_key',        ai.customKey);
  set('ai_model_custom_authstyle',  ai.customAuthStyle);
  if (normalizedConfig.skills) localStorage.setItem('ai_skill_prompts', JSON.stringify(normalizedConfig.skills));
  return normalizedConfig;
}

function ProjectSettingsPage({ projectConfig, onSave, onBack }) {
  const [activeNav, setActiveNav]       = useState('project');
  const [projectSpaceIds, setProjectSpaceIds]         = useState(() => toIdArray(projectConfig.project?.spaceIds));
  const [projectSubsystemIds, setProjectSubsystemIds] = useState(() => toIdArray(projectConfig.project?.subsystemIds));
  const [projectAppIds, setProjectAppIds]             = useState(() => toIdArray(projectConfig.project?.appIds));
  const [aiModel, setAiModel]           = useState(projectConfig.ai.model);
  // API Keys
  const [anthropicKey, setAnthropicKey] = useState(projectConfig.ai.anthropicKey);
  const [glmKey, setGlmKey]             = useState(projectConfig.ai.glmKey);
  const [arkKey, setArkKey]             = useState(projectConfig.ai.arkKey || '');
  // Show/hide key toggles
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  const [showGlmKey, setShowGlmKey]             = useState(false);
  const [showArkKey, setShowArkKey]             = useState(false);
  const [showCustomKey, setShowCustomKey]       = useState(false);
  // BaseURL / ModelName overrides
  const [anthropicBaseUrl, setAnthropicBaseUrl] = useState(projectConfig.ai.anthropicBaseUrl || '');
  const [anthropicModel, setAnthropicModel]     = useState(projectConfig.ai.anthropicModel || '');
  const [glmBaseUrl, setGlmBaseUrl]             = useState(projectConfig.ai.glmBaseUrl || '');
  const [glmModel, setGlmModel]                 = useState(projectConfig.ai.glmModel || '');
  const [arkBaseUrl, setArkBaseUrl]             = useState(projectConfig.ai.arkBaseUrl || '');
  const [arkModel, setArkModel]                 = useState(projectConfig.ai.arkModel || '');
  // Custom model fields
  const [customName, setCustomName]             = useState(projectConfig.ai.customName || '');
  const [customBaseUrl, setCustomBaseUrl]       = useState(projectConfig.ai.customBaseUrl || '');
  const [customModel, setCustomModel]           = useState(projectConfig.ai.customModel || '');
  const [customKey, setCustomKey]               = useState(projectConfig.ai.customKey || '');
  const [customAuthStyle, setCustomAuthStyle]   = useState(projectConfig.ai.customAuthStyle || 'Bearer');
  const [gitPlatform, setGitPlatform]   = useState(projectConfig.git.platform);
  const [repoUrl, setRepoUrl]           = useState(projectConfig.git.repoUrl);
  const [branch, setBranch]             = useState(projectConfig.git.branch || 'main');
  const [gitToken, setGitToken]         = useState(projectConfig.git.token);
  const [gitErrors, setGitErrors]       = useState({});
  const [gitTestStatus, setGitTestStatus] = useState(null);
  const [gitTestMsg, setGitTestMsg]     = useState('');
  const [savedProject, setSavedProject] = useState(false);
  const [savedAI, setSavedAI]           = useState(false);
  const [aiTestStatus, setAiTestStatus] = useState(null);
  const [aiTestMsg, setAiTestMsg]       = useState('');
  const [savedGit, setSavedGit]         = useState(false);
  const [sddFramework, setSddFramework] = useState(projectConfig.sdd?.framework || 'openspec');
  const [sddTemplates, setSddTemplates] = useState(() => {
    const fw = projectConfig.sdd?.framework || 'openspec';
    const saved = projectConfig.sdd?.templates || {};
    const nonEmpty = Object.fromEntries(Object.entries(saved).filter(([, v]) => v !== ''));
    return { ...SDD_FRAMEWORKS[fw]?.defaultTemplates, ...nonEmpty };
  });
  const [activeTemplate, setActiveTemplate] = useState('proposal');
  const [savedSdd, setSavedSdd]         = useState(false);
  const [activeSkill, setActiveSkill]   = useState('review');
  const [skillConfigs, setSkillConfigs] = useState(() => normalizeSkillConfig(projectConfig.skills).normalized);
  const [activeSkillFile, setActiveSkillFile] = useState('SKILL.md');
  const [skillValidationMsg, setSkillValidationMsg] = useState('');
  const [savedSkills, setSavedSkills]   = useState(false);

  const scrollContainerRef = useRef(null);
  const projectRef = useRef(null);
  const aiRef     = useRef(null);
  const gitRef    = useRef(null);
  const sddRef    = useRef(null);
  const skillsRef = useRef(null);
  const sectionRefs = { project: projectRef, git: gitRef, ai: aiRef, sdd: sddRef, skills: skillsRef };

  const selectedSpaces = PROJECT_ASSOCIATION_OPTIONS.filter(space => projectSpaceIds.includes(space.id));
  const availableSubsystemMap = new Map();
  selectedSpaces.forEach(space => {
    space.subsystems.forEach(subsystem => {
      if (!availableSubsystemMap.has(subsystem.id)) availableSubsystemMap.set(subsystem.id, subsystem);
    });
  });
  const availableSubsystems = Array.from(availableSubsystemMap.values());

  const selectedSubsystems = availableSubsystems.filter(subsystem => projectSubsystemIds.includes(subsystem.id));
  const availableAppMap = new Map();
  selectedSubsystems.forEach(subsystem => {
    subsystem.apps.forEach(app => {
      if (!availableAppMap.has(app.id)) availableAppMap.set(app.id, app);
    });
  });
  const availableApps = Array.from(availableAppMap.values());

  const selectedAppNames = availableApps
    .filter(app => projectAppIds.includes(app.id))
    .map(app => app.name);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const found = Object.entries(sectionRefs).find(([, ref]) => ref.current === entry.target);
            if (found) setActiveNav(found[0]);
          }
        });
      },
      { root: scrollContainerRef.current, rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    Object.values(sectionRefs).forEach(ref => { if (ref.current) observer.observe(ref.current); });
    return () => observer.disconnect();
  }, []);

  const NAV_ITEMS = [
    { id: 'project', label: '项目配置',    icon: '🧭' },
    { id: 'git',    label: 'Git 仓库配置', icon: '⛓' },
    { id: 'ai',     label: 'AI 模型配置', icon: '✦' },
    { id: 'sdd',    label: 'SDD 框架',    icon: '📐' },
    { id: 'skills', label: 'Agent Skill',    icon: '🎯' },
  ];

  const sectionStyle = { background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24, marginBottom: 24 };
  const labelStyle   = { display: 'block', fontSize: 12, fontWeight: 600, color: C.ink, marginBottom: 6 };
  const inputStyle   = { width: '100%', padding: '8px 12px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 13, background: C.cream, color: C.ink, outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Mono',monospace" };
  const errStyle     = { fontSize: 11, color: C.danger, marginTop: 4 };
  const multiBoxStyle = { border: `1px solid ${C.border}`, borderRadius: 6, background: C.cream, padding: 8, display: 'grid', gap: 6, marginBottom: 10 };

  const handleTestAI = async () => {
    setAiTestStatus('testing');
    setAiTestMsg('');
    try {
      let res, data;
      if (aiModel === 'claude') {
        const endpoint = anthropicBaseUrl.trim() || '/api/anthropic/v1/messages';
        res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({ model: anthropicModel.trim() || 'claude-sonnet-4-20250514', max_tokens: 5, messages: [{ role: 'user', content: 'Hi' }] }),
        });
        data = await res.json();
        if (data.error) throw new Error(data.error.message || '请求失败');
        setAiTestStatus('success');
        setAiTestMsg(`测试成功（Claude）: ${data.content?.[0]?.text?.slice(0, 40) || 'OK'}`);
      } else if (aiModel === 'glm') {
        const endpoint = glmBaseUrl.trim() || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
        res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${glmKey}` },
          body: JSON.stringify({ model: glmModel.trim() || 'glm-4', max_tokens: 5, messages: [{ role: 'user', content: 'Hi' }] }),
        });
        data = await res.json();
        if (!res.ok || data.error) throw new Error(data?.error?.message || `HTTP ${res.status}`);
        setAiTestStatus('success');
        setAiTestMsg(`测试成功（GLM）: ${data.choices?.[0]?.message?.content?.slice(0, 40) || 'OK'}`);
      } else if (aiModel === 'ark') {
        const base = arkBaseUrl.trim() || 'https://ark.cn-beijing.volces.com/api/coding/v3';
        res = await fetch(`${base}/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${arkKey}` },
          body: JSON.stringify({ model: arkModel.trim() || 'ark-code-latest', max_tokens: 5, messages: [{ role: 'user', content: 'Hi' }] }),
        });
        data = await res.json();
        if (!res.ok || data.error) throw new Error(data?.error?.message || `HTTP ${res.status}`);
        setAiTestStatus('success');
        setAiTestMsg(`测试成功（ARK）: ${data.choices?.[0]?.message?.content?.slice(0, 40) || 'OK'}`);
      } else if (aiModel === 'custom') {
        const headers = { 'Content-Type': 'application/json' };
        if (customAuthStyle === 'x-api-key') headers['x-api-key'] = customKey;
        else headers['Authorization'] = `Bearer ${customKey}`;
        res = await fetch(`${customBaseUrl.trim()}/chat/completions`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ model: customModel.trim(), max_tokens: 5, messages: [{ role: 'user', content: 'Hi' }] }),
        });
        data = await res.json();
        if (!res.ok || data.error) throw new Error(data?.error?.message || `HTTP ${res.status}`);
        setAiTestStatus('success');
        setAiTestMsg(`测试成功（自定义）: ${data.choices?.[0]?.message?.content?.slice(0, 40) || 'OK'}`);
      }
    } catch (e) {
      setAiTestStatus('error');
      setAiTestMsg(e.message?.startsWith('网络') ? e.message : `请求失败: ${e.message}`);
    }
  };

  const handleSaveAI = () => {
    const config = { ...projectConfig, ai: {
      model: aiModel,
      anthropicKey, anthropicBaseUrl, anthropicModel,
      glmKey, glmBaseUrl, glmModel,
      arkKey, arkBaseUrl, arkModel,
      customName, customBaseUrl, customModel, customKey, customAuthStyle,
    }};
    const normalizedConfig = saveProjectConfig(config);
    onSave(normalizedConfig);
    setSavedAI(true);
    setTimeout(() => setSavedAI(false), 2000);
  };

  const handleSaveProject = () => {
    const config = {
      ...projectConfig,
      project: {
        spaceIds: projectSpaceIds,
        subsystemIds: projectSubsystemIds,
        appIds: projectAppIds,
      },
    };
    const normalizedConfig = saveProjectConfig(config);
    onSave(normalizedConfig);
    setSavedProject(true);
    setTimeout(() => setSavedProject(false), 2000);
  };

  const handleToggleSpace = (spaceId, checked) => {
    const nextSpaceIds = checked
      ? (projectSpaceIds.includes(spaceId) ? projectSpaceIds : [...projectSpaceIds, spaceId])
      : projectSpaceIds.filter(id => id !== spaceId);

    const nextSpaces = PROJECT_ASSOCIATION_OPTIONS.filter(space => nextSpaceIds.includes(space.id));
    const validSubsystemIds = new Set(nextSpaces.flatMap(space => space.subsystems.map(subsystem => subsystem.id)));
    const nextSubsystemIds = projectSubsystemIds.filter(subsystemId => validSubsystemIds.has(subsystemId));
    const validAppIds = new Set(
      nextSpaces
        .flatMap(space => space.subsystems)
        .filter(subsystem => nextSubsystemIds.includes(subsystem.id))
        .flatMap(subsystem => subsystem.apps.map(app => app.id))
    );

    setProjectSpaceIds(nextSpaceIds);
    setProjectSubsystemIds(nextSubsystemIds);
    setProjectAppIds(projectAppIds.filter(appId => validAppIds.has(appId)));
  };

  const handleToggleSubsystem = (subsystemId, checked) => {
    const nextSubsystemIds = checked
      ? (projectSubsystemIds.includes(subsystemId) ? projectSubsystemIds : [...projectSubsystemIds, subsystemId])
      : projectSubsystemIds.filter(id => id !== subsystemId);

    const validAppIds = new Set(
      availableSubsystems
        .filter(subsystem => nextSubsystemIds.includes(subsystem.id))
        .flatMap(subsystem => subsystem.apps.map(app => app.id))
    );

    setProjectSubsystemIds(nextSubsystemIds);
    setProjectAppIds(projectAppIds.filter(appId => validAppIds.has(appId)));
  };

  const handleToggleApp = (appId, checked) => {
    const nextAppIds = checked
      ? (projectAppIds.includes(appId) ? projectAppIds : [...projectAppIds, appId])
      : projectAppIds.filter(id => id !== appId);
    setProjectAppIds(nextAppIds);
  };

  const handleSaveGit = () => {
    const errs = {};
    if (!repoUrl.trim()) errs.repoUrl = '仓库 URL 不能为空';
    if (!gitToken.trim()) errs.token = 'Token 不能为空';
    if (Object.keys(errs).length > 0) { setGitErrors(errs); return; }
    setGitErrors({});
    const config = { ...projectConfig, git: { platform: gitPlatform, repoUrl: repoUrl.trim(), branch: branch.trim() || 'main', token: gitToken.trim() } };
    const normalizedConfig = saveProjectConfig(config);
    onSave(normalizedConfig);
    setSavedGit(true);
    setTimeout(() => setSavedGit(false), 2000);
  };

  const handleTestConnection = async () => {
    setGitTestStatus('testing');
    setGitTestMsg('');
    try {
      if (gitPlatform === 'github') {
        const res = await fetch('https://api.github.com/user', {
          headers: { 'Authorization': `Bearer ${gitToken}`, 'Accept': 'application/vnd.github.v3+json' }
        });
        const data = await res.json();
        if (res.ok) { setGitTestStatus('success'); setGitTestMsg(`连接成功，GitHub 用户: ${data.login}`); }
        else { setGitTestStatus('error'); setGitTestMsg(data.message || '认证失败'); }
      } else {
        const baseUrl = repoUrl.match(/^(https?:\/\/[^/]+)/)?.[1] || 'https://gitlab.com';
        const res = await fetch(`${baseUrl}/api/v4/user`, { headers: { 'PRIVATE-TOKEN': gitToken } });
        const data = await res.json();
        if (res.ok) { setGitTestStatus('success'); setGitTestMsg(`连接成功，GitLab 用户: ${data.username}`); }
        else { setGitTestStatus('error'); setGitTestMsg(data.message || '认证失败'); }
      }
    } catch (e) {
      setGitTestStatus('error');
      setGitTestMsg(`网络错误: ${e.message}`);
    }
  };

  const handleSaveSdd = () => {
    const config = { ...projectConfig, sdd: { framework: sddFramework, templates: sddTemplates } };
    const normalizedConfig = saveProjectConfig(config);
    onSave(normalizedConfig);
    setSavedSdd(true);
    setTimeout(() => setSavedSdd(false), 2000);
  };

  const handleSaveSkills = () => {
    const inspected = normalizeSkillConfig(skillConfigs);
    if (inspected.invalidPaths.length > 0) {
      setSkillValidationMsg(`存在非法路径，已阻止保存：${inspected.invalidPaths.join('；')}`);
      return;
    }
    const config = { ...projectConfig, skills: inspected.normalized };
    const normalizedConfig = saveProjectConfig(config);
    onSave(normalizedConfig);
    setSkillConfigs(inspected.normalized);
    if (inspected.correctedPaths.length > 0) {
      setSkillValidationMsg(`已自动纠正路径：${inspected.correctedPaths.join('；')}`);
    } else {
      setSkillValidationMsg('');
    }
    setSavedSkills(true);
    setTimeout(() => setSavedSkills(false), 2000);
  };

  const activeSkillMeta = AI_SKILLS[activeSkill];
  const activeSkillFiles = skillConfigs[activeSkill]?.files || buildDefaultSkillFiles(activeSkill);
  const activeSkillFileContent = activeSkillFiles[activeSkillFile] ?? '';

  useEffect(() => {
    setActiveSkillFile('SKILL.md');
    setSkillValidationMsg('');
  }, [activeSkill]);

  useEffect(() => {
    if (activeSkillFiles[activeSkillFile] == null) {
      const fallback = SKILL_STANDARD_FILE_KEYS.find(key => activeSkillFiles[key] != null) || 'SKILL.md';
      setActiveSkillFile(fallback);
    }
  }, [activeSkillFiles, activeSkillFile]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: C.paper, fontFamily: "'Noto Sans SC',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      {/* Header */}
      <div style={{ background: C.ink, padding: '0 24px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #1a1a1a', flexShrink: 0, height: 56 }}>
        <button onClick={onBack} style={{ padding: '0 14px', height: '100%', background: 'none', border: 'none', cursor: 'pointer', color: C.sbText, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = C.sbText}>
          ← 返回看板
        </button>
        <div style={{ width: 1, height: 20, background: '#252535' }}/>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>项目配置</span>
      </div>

      {/* Body: left nav + right content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left Nav Sidebar */}
        <div style={{ width: 188, flexShrink: 0, background: C.sb, borderRight: '1px solid #252535', display: 'flex', flexDirection: 'column', paddingTop: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.sbMuted, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 16px', marginBottom: 8 }}>配置项</div>
          {NAV_ITEMS.map(item => {
            const isActive = activeNav === item.id;
            return (
              <button key={item.id} onClick={() => sectionRefs[item.id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', background: isActive ? C.sbActive : 'none', border: 'none', cursor: 'pointer', color: isActive ? '#fff' : C.sbText, fontSize: 13, fontWeight: isActive ? 600 : 400, textAlign: 'left', width: '100%', borderRadius: 0, transition: 'background 0.15s' }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.sbHover; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'none'; }}>
                <span style={{ fontSize: 14, opacity: 0.9 }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div ref={scrollContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '36px 40px' }}>

          {/* 项目配置区块 */}
          <div ref={projectRef} style={{ marginBottom: 48 }}>
              <h2 style={{ fontWeight: 700, fontSize: 18, color: C.ink, marginBottom: 4 }}>项目配置</h2>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>先建立项目关联上下文，再进行仓库和模型配置。</p>
              <div style={sectionStyle}>
                <label style={labelStyle}>关联空间</label>
                <div style={multiBoxStyle}>
                  {PROJECT_ASSOCIATION_OPTIONS.map(space => (
                    <label key={space.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.ink, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={projectSpaceIds.includes(space.id)}
                        onChange={e => handleToggleSpace(space.id, e.target.checked)}
                      />
                      <span>{space.name}</span>
                    </label>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>可直接勾选多个空间。</div>

                <label style={labelStyle}>关联子系统</label>
                <div style={{ ...multiBoxStyle, opacity: projectSpaceIds.length ? 1 : 0.6 }}>
                  {!availableSubsystems.length && <div style={{ fontSize: 12, color: C.muted }}>暂无可选子系统</div>}
                  {availableSubsystems.map(subsystem => (
                    <label key={subsystem.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.ink, cursor: projectSpaceIds.length ? 'pointer' : 'not-allowed' }}>
                      <input
                        type="checkbox"
                        checked={projectSubsystemIds.includes(subsystem.id)}
                        onChange={e => handleToggleSubsystem(subsystem.id, e.target.checked)}
                        disabled={!projectSpaceIds.length}
                      />
                      <span>{subsystem.name}</span>
                    </label>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>请先选择至少一个空间后再选择子系统</div>

                <label style={labelStyle}>关联项目（应用）</label>
                <div style={{ ...multiBoxStyle, opacity: projectSubsystemIds.length ? 1 : 0.6 }}>
                  {!availableApps.length && <div style={{ fontSize: 12, color: C.muted }}>暂无可选应用</div>}
                  {availableApps.map(app => (
                    <label key={app.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.ink, cursor: projectSubsystemIds.length ? 'pointer' : 'not-allowed' }}>
                      <input
                        type="checkbox"
                        checked={projectAppIds.includes(app.id)}
                        onChange={e => handleToggleApp(app.id, e.target.checked)}
                        disabled={!projectSubsystemIds.length}
                      />
                      <span>{app.name}</span>
                    </label>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>请先选择至少一个子系统后再选择应用</div>

                <div style={{ fontSize: 12, color: C.muted, marginBottom: 16, lineHeight: 1.6 }}>
                  当前已选：
                  <span style={{ color: C.ink, fontWeight: 500 }}>
                    {(selectedSpaces.map(space => space.name).join('、') || '未选择空间')}
                    {' / '}
                    {(selectedSubsystems.map(subsystem => subsystem.name).join('、') || '未选择子系统')}
                    {' / '}
                    {(selectedAppNames.join('、') || '未选择应用')}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={handleSaveProject}
                    style={{ padding: '8px 20px', background: C.accent, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                    保存项目配置
                  </button>
                  {savedProject && <span style={{ fontSize: 12, color: C.success }}>✓ 已保存</span>}
                </div>
              </div>
          </div>

          {/* Git 仓库配置区块 */}
          <div ref={gitRef} style={{ marginBottom: 48 }}>
              <h2 style={{ fontWeight: 700, fontSize: 18, color: C.ink, marginBottom: 4 }}>Git 仓库配置</h2>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>配置后，生成的 PRD 和 SPEC 文档可自动提交到仓库，触发应用魔方 CI 流程。</p>
              <div style={sectionStyle}>
                <label style={labelStyle}>Git 平台</label>
                <select value={gitPlatform} onChange={e => setGitPlatform(e.target.value)}
                  style={{ ...inputStyle, marginBottom: 16, fontFamily: 'inherit', cursor: 'pointer' }}>
                  <option value="github">GitHub</option>
                  <option value="gitlab">GitLab</option>
                </select>

                <label style={labelStyle}>仓库 URL</label>
                <input value={repoUrl} onChange={e => { setRepoUrl(e.target.value); setGitErrors(v => ({ ...v, repoUrl: '' })); }}
                  placeholder={gitPlatform === 'github' ? 'https://github.com/org/repo' : 'https://gitlab.com/org/repo'}
                  style={{ ...inputStyle, marginBottom: 4, borderColor: gitErrors.repoUrl ? C.danger : C.border }}/>
                {gitErrors.repoUrl && <div style={errStyle}>{gitErrors.repoUrl}</div>}
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>完整仓库地址，例如 https://github.com/myorg/my-specs</div>

                <label style={labelStyle}>目标分支</label>
                <input value={branch} onChange={e => setBranch(e.target.value)}
                  placeholder="main" style={{ ...inputStyle, marginBottom: 16 }}/>

                <label style={labelStyle}>Personal Access Token</label>
                <input type="password" value={gitToken} onChange={e => { setGitToken(e.target.value); setGitErrors(v => ({ ...v, token: '' })); }}
                  placeholder={gitPlatform === 'github' ? 'ghp_...' : 'glpat-...'}
                  style={{ ...inputStyle, marginBottom: 4, borderColor: gitErrors.token ? C.danger : C.border }}/>
                {gitErrors.token && <div style={errStyle}>{gitErrors.token}</div>}
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>
                  ⚠ Token 保存在浏览器本地存储，请勿在共享设备上使用。需要 repo write 权限。
                </div>

                {gitTestStatus && (
                  <div style={{ padding: '8px 12px', borderRadius: 6, marginBottom: 12, fontSize: 12,
                    background: gitTestStatus === 'success' ? C.successLight : gitTestStatus === 'error' ? C.dangerLight : C.accentLight,
                    color: gitTestStatus === 'success' ? C.success : gitTestStatus === 'error' ? C.danger : C.accent,
                    border: `1px solid ${gitTestStatus === 'success' ? C.success : gitTestStatus === 'error' ? C.danger : C.accent}33` }}>
                    {gitTestStatus === 'testing' ? '测试中…' : gitTestMsg}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={handleSaveGit}
                    style={{ padding: '8px 20px', background: C.accent, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                    保存 Git 配置
                  </button>
                  <button onClick={handleTestConnection} disabled={!gitToken.trim()}
                    style={{ padding: '8px 16px', background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, cursor: gitToken.trim() ? 'pointer' : 'not-allowed', fontSize: 13, color: C.ink, opacity: gitToken.trim() ? 1 : 0.5 }}>
                    测试连接
                  </button>
                  {savedGit && <span style={{ fontSize: 12, color: C.success }}>✓ 已保存</span>}
                </div>
              </div>
          </div>

          {/* AI 配置区块 */}
          <div ref={aiRef} style={{ marginBottom: 48 }}>
              <h2 style={{ fontWeight: 700, fontSize: 18, color: C.ink, marginBottom: 4 }}>AI 模型配置</h2>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>选择 AI 模型并配置对应的 API Key，用于需求评审和文档生成。</p>
              <div style={sectionStyle}>
                <label style={labelStyle}>AI 模型</label>
                <select value={aiModel} onChange={e => setAiModel(e.target.value)}
                  style={{ ...inputStyle, marginBottom: 20, fontFamily: 'inherit', cursor: 'pointer' }}>
                  <option value="claude">Claude Sonnet (Anthropic)</option>
                  <option value="glm">GLM-4 (智谱 Zhipu)</option>
                  <option value="ark">ARK Code Latest (火山方舟)</option>
                  <option value="custom">自定义模型（OpenAI Compatible）</option>
                </select>

                {/* Claude 配置 */}
                {aiModel === 'claude' && (
                  <>
                    <label style={labelStyle}>Anthropic API Key</label>
                    <div style={{ position: 'relative', marginBottom: 4 }}>
                      <input type={showAnthropicKey ? 'text' : 'password'} value={anthropicKey} onChange={e => setAnthropicKey(e.target.value)}
                        placeholder="sk-ant-api03-..." style={{ ...inputStyle, paddingRight: 36 }}/>
                      <button onClick={() => setShowAnthropicKey(v => !v)} tabIndex={-1}
                        style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: C.muted, lineHeight: 1 }}>
                        {showAnthropicKey ? '🙈' : '👁'}
                      </button>
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>Keys 保存在浏览器本地，不上传服务器。</div>

                    <label style={labelStyle}>API Base URL</label>
                    <input value={anthropicBaseUrl} onChange={e => setAnthropicBaseUrl(e.target.value)}
                      placeholder="/api/anthropic/v1/messages" style={{ ...inputStyle, marginBottom: 4 }}/>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>留空使用默认端点，可填写代理地址。</div>

                    <label style={labelStyle}>Model Name</label>
                    <input value={anthropicModel} onChange={e => setAnthropicModel(e.target.value)}
                      placeholder="claude-sonnet-4-20250514" style={{ ...inputStyle, marginBottom: 20 }}/>
                  </>
                )}

                {/* GLM 额外字段 */}
                {aiModel === 'glm' && (
                  <>
                    <label style={labelStyle}>GLM API Key</label>
                    <div style={{ position: 'relative', marginBottom: 4 }}>
                      <input type={showGlmKey ? 'text' : 'password'} value={glmKey} onChange={e => setGlmKey(e.target.value)}
                        placeholder="xxxxxxxx.xxxxxxxx" style={{ ...inputStyle, paddingRight: 36 }}/>
                      <button onClick={() => setShowGlmKey(v => !v)} tabIndex={-1}
                        style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: C.muted, lineHeight: 1 }}>
                        {showGlmKey ? '🙈' : '👁'}
                      </button>
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>
                      申请地址：<a href="https://open.bigmodel.cn/usercenter/apikeys" target="_blank" rel="noreferrer" style={{ color: C.accent }}>open.bigmodel.cn</a>
                    </div>
                    <label style={labelStyle}>API Base URL</label>
                    <input value={glmBaseUrl} onChange={e => setGlmBaseUrl(e.target.value)}
                      placeholder="https://open.bigmodel.cn/api/paas/v4/chat/completions" style={{ ...inputStyle, marginBottom: 12 }}/>
                    <label style={labelStyle}>Model Name</label>
                    <input value={glmModel} onChange={e => setGlmModel(e.target.value)}
                      placeholder="glm-4" style={{ ...inputStyle, marginBottom: 20 }}/>
                  </>
                )}

                {/* ARK 额外字段 */}
                {aiModel === 'ark' && (
                  <>
                    <label style={labelStyle}>ARK API Key</label>
                    <div style={{ position: 'relative', marginBottom: 4 }}>
                      <input type={showArkKey ? 'text' : 'password'} value={arkKey} onChange={e => setArkKey(e.target.value)}
                        placeholder="请输入火山方舟 API Key" style={{ ...inputStyle, paddingRight: 36 }}/>
                      <button onClick={() => setShowArkKey(v => !v)} tabIndex={-1}
                        style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: C.muted, lineHeight: 1 }}>
                        {showArkKey ? '🙈' : '👁'}
                      </button>
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>
                      申请地址：<a href="https://ark.cn-beijing.volces.com" target="_blank" rel="noreferrer" style={{ color: C.accent }}>ark.cn-beijing.volces.com</a>
                    </div>
                    <label style={labelStyle}>API Base URL</label>
                    <input value={arkBaseUrl} onChange={e => setArkBaseUrl(e.target.value)}
                      placeholder="https://ark.cn-beijing.volces.com/api/coding/v3" style={{ ...inputStyle, marginBottom: 12 }}/>
                    <label style={labelStyle}>Model Name</label>
                    <input value={arkModel} onChange={e => setArkModel(e.target.value)}
                      placeholder="ark-code-latest" style={{ ...inputStyle, marginBottom: 20 }}/>
                  </>
                )}

                {/* 自定义模型 */}
                {aiModel === 'custom' && (
                  <>
                    <label style={labelStyle}>显示名称</label>
                    <input value={customName} onChange={e => setCustomName(e.target.value)}
                      placeholder="My Custom Model" style={{ ...inputStyle, marginBottom: 12 }}/>

                    <label style={labelStyle}>Base URL</label>
                    <input value={customBaseUrl} onChange={e => setCustomBaseUrl(e.target.value)}
                      placeholder="https://api.openai.com" style={{ ...inputStyle, marginBottom: 4 }}/>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>不含路径，系统自动追加 /chat/completions</div>

                    <label style={labelStyle}>Model Name</label>
                    <input value={customModel} onChange={e => setCustomModel(e.target.value)}
                      placeholder="gpt-4o" style={{ ...inputStyle, marginBottom: 12 }}/>

                    <label style={labelStyle}>API Key</label>
                    <div style={{ position: 'relative', marginBottom: 12 }}>
                      <input type={showCustomKey ? 'text' : 'password'} value={customKey} onChange={e => setCustomKey(e.target.value)}
                        placeholder="sk-..." style={{ ...inputStyle, paddingRight: 36 }}/>
                      <button onClick={() => setShowCustomKey(v => !v)} tabIndex={-1}
                        style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: C.muted, lineHeight: 1 }}>
                        {showCustomKey ? '🙈' : '👁'}
                      </button>
                    </div>

                    <label style={labelStyle}>鉴权方式</label>
                    <select value={customAuthStyle} onChange={e => setCustomAuthStyle(e.target.value)}
                      style={{ ...inputStyle, marginBottom: 20, fontFamily: 'inherit', cursor: 'pointer' }}>
                      <option value="Bearer">Bearer Token（Authorization: Bearer &lt;key&gt;）</option>
                      <option value="x-api-key">x-api-key Header（x-api-key: &lt;key&gt;）</option>
                    </select>
                  </>
                )}

                {aiTestStatus && (
                  <div style={{ padding: '8px 12px', borderRadius: 6, marginBottom: 12, fontSize: 12,
                    background: aiTestStatus === 'success' ? C.successLight : aiTestStatus === 'error' ? C.dangerLight : C.accentLight,
                    color: aiTestStatus === 'success' ? C.success : aiTestStatus === 'error' ? C.danger : C.accent,
                    border: `1px solid ${(aiTestStatus === 'success' ? C.success : aiTestStatus === 'error' ? C.danger : C.accent)}33` }}>
                    {aiTestStatus === 'testing' ? '⟳ 测试中…' : aiTestMsg}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={handleSaveAI}
                    style={{ padding: '8px 20px', background: C.accent, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                    保存 AI 配置
                  </button>
                  <button onClick={handleTestAI} disabled={aiTestStatus === 'testing' || (
                    aiModel === 'claude' ? !anthropicKey.trim() :
                    aiModel === 'glm'    ? !glmKey.trim() :
                    aiModel === 'ark'    ? !arkKey.trim() :
                    !customKey.trim() || !customBaseUrl.trim() || !customModel.trim()
                  )}
                    style={{ padding: '8px 16px', background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 13, color: C.ink,
                      cursor: aiTestStatus === 'testing' ? 'wait' : 'pointer',
                      opacity: (aiTestStatus === 'testing' || (aiModel === 'claude' ? !anthropicKey.trim() : aiModel === 'glm' ? !glmKey.trim() : aiModel === 'ark' ? !arkKey.trim() : !customKey.trim() || !customBaseUrl.trim() || !customModel.trim())) ? 0.45 : 1 }}>
                    {aiTestStatus === 'testing' ? '测试中…' : '测试请求'}
                  </button>
                  {savedAI && <span style={{ fontSize: 12, color: C.success }}>✓ 已保存</span>}
                </div>
              </div>
          </div>

          {/* SDD 框架配置板块 */}
          <div ref={sddRef} style={{ marginBottom: 48 }}>
              <h2 style={{ fontWeight: 700, fontSize: 18, color: C.ink, marginBottom: 4 }}>SDD 框架配置</h2>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>选择团队使用的规格驱动开发框架，并自定义各文档类型的起始模板。</p>

              {/* 框架选择 */}
              <div style={sectionStyle}>
                <label style={labelStyle}>SDD 框架</label>
                <select value={sddFramework}
                  onChange={e => {
                    const fw = e.target.value;
                    setSddFramework(fw);
                  }}
                  style={{ ...inputStyle, marginBottom: 8, fontFamily: 'inherit', cursor: 'pointer' }}>
                  {Object.entries(SDD_FRAMEWORKS).map(([id, fw]) => (
                    <option key={id} value={id}>{fw.label}</option>
                  ))}
                </select>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 20, lineHeight: 1.6 }}>
                  {SDD_FRAMEWORKS[sddFramework]?.desc}
                </div>

                {/* 模板编辑 */}
                <div style={{ fontWeight: 600, fontSize: 13, color: C.ink, marginBottom: 10 }}>Spec 模板编辑</div>
                {/* 模板类型 tab */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                  {['proposal', 'design', 'spec', 'tasks'].map(type => (
                    <button key={type} onClick={() => setActiveTemplate(type)}
                      style={{ padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
                        background: activeTemplate === type ? C.accent : C.accentLight,
                        color: activeTemplate === type ? '#fff' : C.accent }}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
                <textarea
                  value={sddTemplates[activeTemplate] ?? SDD_FRAMEWORKS[sddFramework]?.defaultTemplates[activeTemplate] ?? ''}
                  onChange={e => setSddTemplates(v => ({ ...v, [activeTemplate]: e.target.value }))}
                  placeholder={`输入 ${activeTemplate} 模板内容，留空则使用框架默认模板`}
                  style={{ ...inputStyle, height: 280, resize: 'vertical', lineHeight: 1.6, padding: '10px 12px', marginBottom: 12 }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <button onClick={handleSaveSdd}
                    style={{ padding: '8px 20px', background: C.accent, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                    保存 SDD 配置
                  </button>
                  <button onClick={() => setSddTemplates(v => ({ ...v, [activeTemplate]: SDD_FRAMEWORKS[sddFramework]?.defaultTemplates[activeTemplate] ?? '' }))}
                    style={{ padding: '8px 14px', background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, cursor: 'pointer', fontSize: 13, color: C.ink }}>
                    恢复默认
                  </button>
                  {savedSdd && <span style={{ fontSize: 12, color: C.success }}>✓ 已保存</span>}
                </div>
              </div>
          </div>

          {/* AI Skill 管理板块 */}
          <div ref={skillsRef} style={{ marginBottom: 48 }}>
              <h2 style={{ fontWeight: 700, fontSize: 18, color: C.ink, marginBottom: 4 }}>Agent Skill 管理</h2>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>系统内置标准 Skill 模板，支持按 Skill 与文件结构快速浏览和编辑。</p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'stretch', flexWrap: 'wrap' }}>
                <div style={{ ...sectionStyle, margin: 0, width: 420, flexShrink: 0, padding: 0, display: 'flex', overflow: 'hidden' }}>
                  <div style={{ width: 172, flexShrink: 0, padding: 10, borderRight: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, fontWeight: 700 }}>Skill 列表</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {Object.values(AI_SKILLS).map(skill => (
                      <button key={skill.id} onClick={() => setActiveSkill(skill.id)}
                        style={{ width: '100%', padding: '7px 9px', textAlign: 'left', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12,
                          background: activeSkill === skill.id ? C.accentLight : 'transparent',
                          color: activeSkill === skill.id ? C.accent : C.ink,
                          fontWeight: activeSkill === skill.id ? 600 : 400,
                          fontFamily: 'inherit' }}>
                        {skill.icon} {skill.name}
                      </button>
                    ))}
                  </div>
                  </div>

                  <div style={{ width: 248, flexShrink: 0, padding: 10 }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, fontWeight: 700 }}>文件结构</div>
                  <button onClick={() => setActiveSkillFile('SKILL.md')}
                    style={{ width: '100%', border: 'none', borderRadius: 6, textAlign: 'left', cursor: 'pointer', padding: '7px 9px', fontSize: 12,
                      background: activeSkillFile === 'SKILL.md' ? C.accentLight : 'transparent',
                      color: activeSkillFile === 'SKILL.md' ? C.accent : C.ink,
                      fontWeight: activeSkillFile === 'SKILL.md' ? 600 : 400,
                      boxShadow: activeSkillFile === 'SKILL.md' ? `inset 2px 0 0 ${C.accent}` : 'none' }}>
                    📄 SKILL.md
                  </button>

                  <div style={{ fontSize: 11, color: C.muted, marginTop: 10, marginBottom: 4 }}>references/</div>
                  {Object.keys(activeSkillFiles).filter(path => path.startsWith('references/')).map(path => (
                    <button key={path} onClick={() => setActiveSkillFile(path)}
                      style={{ width: '100%', border: 'none', borderRadius: 6, textAlign: 'left', cursor: 'pointer', padding: '6px 9px', fontSize: 12,
                        background: activeSkillFile === path ? C.accentLight : 'transparent',
                        color: activeSkillFile === path ? C.accent : C.ink,
                        fontWeight: activeSkillFile === path ? 600 : 400,
                        paddingLeft: 20,
                        boxShadow: activeSkillFile === path ? `inset 2px 0 0 ${C.accent}` : 'none' }}>
                      📘 {path.replace('references/', '')}
                    </button>
                  ))}

                  <div style={{ fontSize: 11, color: C.muted, marginTop: 10, marginBottom: 4 }}>scripts/</div>
                  {Object.keys(activeSkillFiles).filter(path => path.startsWith('scripts/')).map(path => (
                    <button key={path} onClick={() => setActiveSkillFile(path)}
                      style={{ width: '100%', border: 'none', borderRadius: 6, textAlign: 'left', cursor: 'pointer', padding: '6px 9px', fontSize: 12,
                        background: activeSkillFile === path ? C.accentLight : 'transparent',
                        color: activeSkillFile === path ? C.accent : C.ink,
                        fontWeight: activeSkillFile === path ? 600 : 400,
                        paddingLeft: 20,
                        boxShadow: activeSkillFile === path ? `inset 2px 0 0 ${C.accent}` : 'none' }}>
                      🧩 {path.replace('scripts/', '')}
                    </button>
                  ))}
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 320 }}>
                  <div style={{ ...sectionStyle, margin: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: C.ink, marginBottom: 4 }}>{activeSkillMeta?.icon} {activeSkillMeta?.name}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{activeSkillMeta?.desc}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>当前文件：<span style={{ color: C.ink, fontFamily: "'DM Mono',monospace" }}>{activeSkillFile}</span></div>

                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, fontWeight: 500 }}>可用占位符（点击复制）</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {(activeSkillMeta?.vars || []).map(v => (
                          <button key={v} onClick={() => navigator.clipboard.writeText(v)}
                            style={{ padding: '3px 8px', borderRadius: 4, border: `1px solid ${C.accent}44`, background: C.accentLight,
                              color: C.accent, fontSize: 11, cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      value={activeSkillFileContent}
                      onChange={e => setSkillConfigs(prev => ({
                        ...prev,
                        [activeSkill]: {
                          files: {
                            ...(prev[activeSkill]?.files || buildDefaultSkillFiles(activeSkill)),
                            [activeSkillFile]: e.target.value,
                          },
                        },
                      }))}
                      style={{ ...inputStyle, height: 340, resize: 'vertical', lineHeight: 1.6, padding: '10px 12px', marginBottom: 12,
                        fontFamily: "'DM Mono', monospace", fontSize: 12 }}
                    />

                    {skillValidationMsg && <div style={{ fontSize: 11, color: C.warn, marginBottom: 10 }}>{skillValidationMsg}</div>}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <button onClick={handleSaveSkills}
                        style={{ padding: '8px 20px', background: C.accent, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                        保存 Skill
                      </button>
                      <button onClick={() => {
                        setSkillConfigs(prev => ({ ...prev, [activeSkill]: { files: buildDefaultSkillFiles(activeSkill) } }));
                        setActiveSkillFile('SKILL.md');
                        setSkillValidationMsg('已恢复默认结构，点击保存后生效');
                      }}
                        style={{ padding: '8px 14px', background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, cursor: 'pointer', fontSize: 13, color: C.ink }}>
                        恢复默认结构
                      </button>
                      {savedSkills && <span style={{ fontSize: 12, color: C.success }}>✓ 已保存</span>}
                    </div>
                  </div>
                </div>
              </div>
          </div>

          {/* 危险区域（始终显示） */}
          <div style={{ ...sectionStyle, borderColor: C.danger + '44', marginTop: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.danger, marginBottom: 12 }}>危险操作</div>
            <button onClick={() => { localStorage.clear(); window.location.reload(); }}
              style={{ padding: '8px 16px', background: 'none', border: `1px solid ${C.danger}`, borderRadius: 6, cursor: 'pointer', fontSize: 13, color: C.danger }}>
              清除所有本地数据（退出登录）
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ SETTINGS DROPDOWN ═════════════════════════════ */
function SettingsDropdown({ onClose, onNavigateToSettings }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleLogout = () => {
    localStorage.clear();
    onClose();
    window.location.reload();
  };

  const menuItemStyle = {
    width:"100%", padding:"9px 14px", background:"none", border:"none",
    cursor:"pointer", fontSize:13, color:C.ink, textAlign:"left",
    borderRadius:6, display:"flex", alignItems:"center", gap:10, fontFamily:"inherit",
  };

  return (
    <div ref={ref} style={{position:"absolute",top:"calc(100% + 8px)",right:0,zIndex:300,background:C.white,border:`1px solid ${C.border}`,borderRadius:10,boxShadow:"0 8px 32px rgba(0,0,0,0.18)",width:224,overflow:"hidden"}}>
      {/* Account info */}
      <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,background:C.cream,display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:C.accent,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,flexShrink:0}}>
          达
        </div>
        <div style={{minWidth:0}}>
          <div style={{fontSize:13,fontWeight:600,color:C.ink,lineHeight:1.3}}>达尔文</div>
          <div style={{fontSize:11,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>darwin@pm-ai.dev</div>
        </div>
      </div>

      {/* Menu items */}
      <div style={{padding:4}}>
        <button style={menuItemStyle}
          onMouseEnter={e=>e.currentTarget.style.background=C.cream}
          onMouseLeave={e=>e.currentTarget.style.background="none"}
          onClick={() => { onNavigateToSettings(); onClose(); }}>
          <span>⚙️</span> 项目配置
        </button>
        <div style={{height:1,background:C.border,margin:"4px 8px"}}/>
        <button style={{...menuItemStyle,color:C.danger}}
          onMouseEnter={e=>e.currentTarget.style.background=C.dangerLight}
          onMouseLeave={e=>e.currentTarget.style.background="none"}
          onClick={handleLogout}>
          <span>🚪</span> 退出登录
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════ API KEY SETTINGS MODAL ════════════════════════ */
function ApiKeyModal({ onClose }) {
  const [claudeKey, setClaudeKey] = useState(localStorage.getItem('ai_model_claude_key') || '');
  const [glmKey, setGlmKey]       = useState(localStorage.getItem('ai_model_glm_key') || '');

  const handleSave = () => {
    if (claudeKey.trim()) localStorage.setItem('ai_model_claude_key', claudeKey.trim());
    else localStorage.removeItem('ai_model_claude_key');
    if (glmKey.trim()) localStorage.setItem('ai_model_glm_key', glmKey.trim());
    else localStorage.removeItem('ai_model_glm_key');
    onClose();
  };

  const inputStyle = {
    width:"100%", padding:"8px 12px", border:`1px solid ${C.border}`, borderRadius:6,
    fontSize:12, background:C.cream, color:C.ink, outline:"none", boxSizing:"border-box",
    fontFamily:"'DM Mono',monospace",
  };

  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:999}}/>
      <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:24,zIndex:1000,width:420,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
        <div style={{fontWeight:700,fontSize:15,color:C.ink,marginBottom:4}}>🔑 API Key 配置</div>
        <div style={{fontSize:12,color:C.muted,marginBottom:20}}>Keys 保存在浏览器本地存储，不会上传服务器。留空则使用环境变量配置。</div>

        <label style={{display:"block",fontSize:12,fontWeight:600,color:C.ink,marginBottom:6}}>Claude (Anthropic)</label>
        <input type="password" value={claudeKey} onChange={e=>setClaudeKey(e.target.value)}
          placeholder="sk-ant-api03-..." style={{...inputStyle,marginBottom:16}}/>

        <label style={{display:"block",fontSize:12,fontWeight:600,color:C.ink,marginBottom:6}}>GLM-4 (Zhipu)</label>
        <input type="password" value={glmKey} onChange={e=>setGlmKey(e.target.value)}
          placeholder="xxxxxxxx.xxxxxxxx" style={{...inputStyle,marginBottom:8}}/>

        <div style={{fontSize:11,color:C.muted,marginBottom:20}}>
          申请地址：<a href="https://open.bigmodel.cn/usercenter/apikeys" target="_blank" rel="noreferrer" style={{color:C.accent}}>open.bigmodel.cn</a>
        </div>

        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"7px 16px",background:"none",border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontSize:12,color:C.muted}}>取消</button>
          <button onClick={handleSave} style={{padding:"7px 16px",background:C.accent,color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600}}>保存</button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════ MULTI SELECT FILTER ═══════════════════════════ */
function MultiSelectFilter({
  availableSpaces, availableIterations, availableSubsystems, availableApps, availableAssignees,
  selectedSpaces, selectedIterations, selectedSubsystems, selectedApps, selectedAssignees,
  spaceOpen, iterationOpen, subsystemOpen, appOpen, assigneeOpen,
  onSpaceOpen, onIterationOpen, onSubsystemOpen, onAppOpen, onAssigneeOpen,
  onSpaceToggle, onIterationToggle, onSubsystemToggle, onAppToggle, onAssigneeToggle,
  onClearAll,
  drilldownFilter,
  onClearDrilldown,
  rightActions,
}) {
  const hasFilters = selectedSpaces.length > 0 || selectedIterations.length > 0 || selectedSubsystems.length > 0 || selectedApps.length > 0 || selectedAssignees.length > 0 || Boolean(drilldownFilter?.dimension);
  const checkboxStyle = (selected, color = C.accent, borderColor = C.accent) => ({
    width:14, height:14, borderRadius:3, flexShrink:0,
    border:`1.5px solid ${selected ? borderColor : C.border}`,
    background: selected ? color : "transparent",
    display:"flex", alignItems:"center", justifyContent:"center",
  });
  const dropdownBtn = (label, count, isOpen, accentColor, accentBg) => ({
    height:32, padding:"0 12px", background:C.white,
    border:`1px solid ${count > 0 ? accentColor : C.border}`,
    borderRadius:6, fontSize:12, cursor:"pointer",
    color: count > 0 ? accentColor : C.muted,
    display:"flex", alignItems:"center", gap:6, fontFamily:"inherit", transition:"border-color 0.15s",
  });
  return (
    <div style={{padding:"8px 16px",borderBottom:`1px solid ${C.border}`,background:C.cream,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",flexShrink:0}}>
      {/* Space dropdown */}
      <div style={{position:"relative"}}>
        <button onClick={(e) => { e.stopPropagation(); onSpaceOpen(!spaceOpen); onSubsystemOpen(false); onAppOpen(false); onIterationOpen(false); onAssigneeOpen(false); }}
          style={dropdownBtn('空间', selectedSpaces.length, spaceOpen, C.accent, C.accentLight)}>
          <span>空间</span>
          {selectedSpaces.length > 0 && <span style={{background:C.accent,color:"#fff",borderRadius:10,padding:"0 5px",fontSize:10,fontWeight:700}}>{selectedSpaces.length}</span>}
          <span style={{fontSize:9,color:C.muted}}>{spaceOpen?"▲":"▼"}</span>
        </button>
        {spaceOpen && (
          <div onClick={e => e.stopPropagation()} style={{position:"absolute",top:"calc(100% + 4px)",left:0,zIndex:200,background:C.white,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"0 4px 20px rgba(0,0,0,0.1)",minWidth:160,padding:4}}>
            {availableSpaces.map(space => (
              <div key={space} onClick={() => onSpaceToggle(space)}
                style={{padding:"7px 12px",borderRadius:5,cursor:"pointer",background:selectedSpaces.includes(space)?C.accentLight:"transparent",color:selectedSpaces.includes(space)?C.accent:C.ink,fontSize:13,display:"flex",alignItems:"center",gap:8}}>
                <span style={checkboxStyle(selectedSpaces.includes(space))}>
                  {selectedSpaces.includes(space) && <span style={{color:"#fff",fontSize:9,fontWeight:800}}>✓</span>}
                </span>
                {space}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subsystem dropdown */}
      <div style={{position:"relative"}}>
        <button onClick={(e) => { e.stopPropagation(); onSubsystemOpen(!subsystemOpen); onSpaceOpen(false); onAppOpen(false); onIterationOpen(false); onAssigneeOpen(false); }}
          style={dropdownBtn('子系统', selectedSubsystems.length, subsystemOpen, C.purple, C.purpleLight)}>
          <span>子系统</span>
          {selectedSubsystems.length > 0 && <span style={{background:C.purple,color:"#fff",borderRadius:10,padding:"0 5px",fontSize:10,fontWeight:700}}>{selectedSubsystems.length}</span>}
          <span style={{fontSize:9,color:C.muted}}>{subsystemOpen?"▲":"▼"}</span>
        </button>
        {subsystemOpen && (
          <div onClick={e => e.stopPropagation()} style={{position:"absolute",top:"calc(100% + 4px)",left:0,zIndex:200,background:C.white,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"0 4px 20px rgba(0,0,0,0.1)",minWidth:160,padding:4}}>
            {availableSubsystems.map(sub => (
              <div key={sub} onClick={() => onSubsystemToggle(sub)}
                style={{padding:"7px 12px",borderRadius:5,cursor:"pointer",background:selectedSubsystems.includes(sub)?C.purpleLight:"transparent",color:selectedSubsystems.includes(sub)?C.purple:C.ink,fontSize:13,display:"flex",alignItems:"center",gap:8}}>
                <span style={checkboxStyle(selectedSubsystems.includes(sub), C.purple, C.purple)}>
                  {selectedSubsystems.includes(sub) && <span style={{color:"#fff",fontSize:9,fontWeight:800}}>✓</span>}
                </span>
                {sub}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* App dropdown */}
      <div style={{position:"relative"}}>
        <button onClick={(e) => { e.stopPropagation(); onAppOpen(!appOpen); onSpaceOpen(false); onSubsystemOpen(false); onIterationOpen(false); onAssigneeOpen(false); }}
          style={dropdownBtn('应用', selectedApps.length, appOpen, C.warn, C.warnLight)}>
          <span>应用</span>
          {selectedApps.length > 0 && <span style={{background:C.warn,color:"#fff",borderRadius:10,padding:"0 5px",fontSize:10,fontWeight:700}}>{selectedApps.length}</span>}
          <span style={{fontSize:9,color:C.muted}}>{appOpen?"▲":"▼"}</span>
        </button>
        {appOpen && (
          <div onClick={e => e.stopPropagation()} style={{position:"absolute",top:"calc(100% + 4px)",left:0,zIndex:200,background:C.white,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"0 4px 20px rgba(0,0,0,0.1)",minWidth:180,padding:4}}>
            {availableApps.map(app => (
              <div key={app} onClick={() => onAppToggle(app)}
                style={{padding:"7px 12px",borderRadius:5,cursor:"pointer",background:selectedApps.includes(app)?C.warnLight:"transparent",color:selectedApps.includes(app)?C.warn:C.ink,fontSize:13,display:"flex",alignItems:"center",gap:8}}>
                <span style={checkboxStyle(selectedApps.includes(app), C.warn, C.warn)}>
                  {selectedApps.includes(app) && <span style={{color:"#fff",fontSize:9,fontWeight:800}}>✓</span>}
                </span>
                {app}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Iteration dropdown */}
      <div style={{position:"relative"}}>
        <button onClick={(e) => { e.stopPropagation(); onIterationOpen(!iterationOpen); onSpaceOpen(false); onSubsystemOpen(false); onAppOpen(false); onAssigneeOpen(false); }}
          style={dropdownBtn('迭代', selectedIterations.length, iterationOpen, C.teal, C.tealLight)}>
          <span>迭代</span>
          {selectedIterations.length > 0 && <span style={{background:C.teal,color:"#fff",borderRadius:10,padding:"0 5px",fontSize:10,fontWeight:700}}>{selectedIterations.length}</span>}
          <span style={{fontSize:9,color:C.muted}}>{iterationOpen?"▲":"▼"}</span>
        </button>
        {iterationOpen && (
          <div onClick={e => e.stopPropagation()} style={{position:"absolute",top:"calc(100% + 4px)",left:0,zIndex:200,background:C.white,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"0 4px 20px rgba(0,0,0,0.1)",minWidth:180,padding:4}}>
            {availableIterations.map(iter => (
              <div key={iter} onClick={() => onIterationToggle(iter)}
                style={{padding:"7px 12px",borderRadius:5,cursor:"pointer",background:selectedIterations.includes(iter)?C.tealLight:"transparent",color:selectedIterations.includes(iter)?C.teal:C.ink,fontSize:13,display:"flex",alignItems:"center",gap:8}}>
                <span style={checkboxStyle(selectedIterations.includes(iter), C.teal, C.teal)}>
                  {selectedIterations.includes(iter) && <span style={{color:"#fff",fontSize:9,fontWeight:800}}>✓</span>}
                </span>
                {iter}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assignee dropdown */}
      <div style={{position:"relative"}}>
        <button onClick={(e) => { e.stopPropagation(); onAssigneeOpen(!assigneeOpen); onSpaceOpen(false); onSubsystemOpen(false); onAppOpen(false); onIterationOpen(false); }}
          style={dropdownBtn('受理人', selectedAssignees.length, assigneeOpen, C.success, C.successLight)}>
          <span>受理人</span>
          {selectedAssignees.length > 0 && <span style={{background:C.success,color:"#fff",borderRadius:10,padding:"0 5px",fontSize:10,fontWeight:700}}>{selectedAssignees.length}</span>}
          <span style={{fontSize:9,color:C.muted}}>{assigneeOpen?"▲":"▼"}</span>
        </button>
        {assigneeOpen && (
          <div onClick={e => e.stopPropagation()} style={{position:"absolute",top:"calc(100% + 4px)",left:0,zIndex:200,background:C.white,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"0 4px 20px rgba(0,0,0,0.1)",minWidth:180,padding:4}}>
            {availableAssignees.map(assignee => (
              <div key={assignee} onClick={() => onAssigneeToggle(assignee)}
                style={{padding:"7px 12px",borderRadius:5,cursor:"pointer",background:selectedAssignees.includes(assignee)?C.successLight:"transparent",color:selectedAssignees.includes(assignee)?C.success:C.ink,fontSize:13,display:"flex",alignItems:"center",gap:8}}>
                <span style={checkboxStyle(selectedAssignees.includes(assignee), C.success, C.success)}>
                  {selectedAssignees.includes(assignee) && <span style={{color:"#fff",fontSize:9,fontWeight:800}}>✓</span>}
                </span>
                {assignee}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected tags */}
      {selectedSpaces.map(space => (
        <span key={`s-${space}`} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",background:C.accentLight,color:C.accent,borderRadius:12,fontSize:12,fontWeight:500}}>
          {space}
          <button onClick={() => onSpaceToggle(space)} style={{background:"none",border:"none",cursor:"pointer",color:C.accent,padding:0,fontSize:14,lineHeight:1,display:"flex",alignItems:"center"}}>×</button>
        </span>
      ))}
      {selectedSubsystems.map(sub => (
        <span key={`ss-${sub}`} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",background:C.purpleLight,color:C.purple,borderRadius:12,fontSize:12,fontWeight:500}}>
          {sub}
          <button onClick={() => onSubsystemToggle(sub)} style={{background:"none",border:"none",cursor:"pointer",color:C.purple,padding:0,fontSize:14,lineHeight:1,display:"flex",alignItems:"center"}}>×</button>
        </span>
      ))}
      {selectedApps.map(app => (
        <span key={`a-${app}`} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",background:C.warnLight,color:C.warn,borderRadius:12,fontSize:12,fontWeight:500}}>
          {app}
          <button onClick={() => onAppToggle(app)} style={{background:"none",border:"none",cursor:"pointer",color:C.warn,padding:0,fontSize:14,lineHeight:1,display:"flex",alignItems:"center"}}>×</button>
        </span>
      ))}
      {selectedIterations.map(iter => (
        <span key={`i-${iter}`} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",background:C.tealLight,color:C.teal,borderRadius:12,fontSize:12,fontWeight:500}}>
          {iter}
          <button onClick={() => onIterationToggle(iter)} style={{background:"none",border:"none",cursor:"pointer",color:C.teal,padding:0,fontSize:14,lineHeight:1,display:"flex",alignItems:"center"}}>×</button>
        </span>
      ))}
      {selectedAssignees.map(assignee => (
        <span key={`u-${assignee}`} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",background:C.successLight,color:C.success,borderRadius:12,fontSize:12,fontWeight:500}}>
          {assignee}
          <button onClick={() => onAssigneeToggle(assignee)} style={{background:"none",border:"none",cursor:"pointer",color:C.success,padding:0,fontSize:14,lineHeight:1,display:"flex",alignItems:"center"}}>×</button>
        </span>
      ))}
      {drilldownFilter?.dimension && (
        <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",background:C.warnLight,color:C.warn,borderRadius:12,fontSize:12,fontWeight:500}}>
          下钻: {drilldownFilter.label || `${DRILLDOWN_LABELS[drilldownFilter.dimension] || drilldownFilter.dimension}=${drilldownFilter.value}`}
          <button onClick={onClearDrilldown} style={{background:"none",border:"none",cursor:"pointer",color:C.warn,padding:0,fontSize:14,lineHeight:1,display:"flex",alignItems:"center"}}>×</button>
        </span>
      )}

      {(hasFilters || rightActions) && (
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          {hasFilters && (
            <button onClick={onClearAll} style={{padding:"3px 10px",background:"none",border:`1px solid ${C.border}`,borderRadius:5,cursor:"pointer",fontSize:12,color:C.muted,transition:"color 0.15s"}}>
              清除筛选
            </button>
          )}
          {rightActions}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════ MAIN APP ═══════════════════════════════════════ */
export default function PMPlatform() {
  const [cards,setCards]           = useState(INITIAL_CARDS);
  const [selected,setSelected]     = useState(null);
  const [studioCardId,setStudioId] = useState(null);
  const [detailCardId,setDetailId] = useState(null);
  const [reviewing,setReviewing]   = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewTargetCardId, setReviewTargetCardId] = useState(null);
  const [reviewQuestions, setReviewQuestions] = useState([]);
  const [reviewAnswers, setReviewAnswers] = useState({});
  const [reviewCustomInputs, setReviewCustomInputs] = useState({});
  const [reviewErrors, setReviewErrors] = useState({});
  const [dismissedReviewFill, setDismissedReviewFill] = useState({});
  const [demoReviewResultCards, setDemoReviewResultCards] = useState({});
  const [showAdd,setShowAdd]        = useState(false);
  const [dragCard,setDragCard]      = useState(null);
  const [activeTab,setActiveTab]    = useState("kanban");
  const [toast,setToast]            = useState(null);
  const [projectConfig, setProjectConfig] = useState(() => loadProjectConfig());
  const [currentView, setCurrentView]     = useState(null); // null | 'settings'
  const [selectedSpaces, setSelectedSpaces]               = useState([]);
  const [selectedIterations, setSelectedIterations]       = useState([]);
  const [selectedSubsystems, setSelectedSubsystems]       = useState([]);
  const [selectedApps, setSelectedApps]                   = useState([]);
  const [selectedAssignees, setSelectedAssignees]         = useState([]);
  const [trendGranularity, setTrendGranularity]           = useState("week");
  const [overviewDimension, setOverviewDimension]         = useState("priority");
  const [drilldownFilter, setDrilldownFilter]             = useState(null);
  const [spaceDropdownOpen, setSpaceDropdownOpen]         = useState(false);
  const [iterationDropdownOpen, setIterationDropdownOpen] = useState(false);
  const [subsystemDropdownOpen, setSubsystemDropdownOpen] = useState(false);
  const [appDropdownOpen, setAppDropdownOpen]             = useState(false);
  const [assigneeDropdownOpen, setAssigneeDropdownOpen]   = useState(false);
  const [showSettings, setShowSettings]                   = useState(false);
  const [showNewDropdown, setShowNewDropdown]             = useState(false);
  const [showImportDrawer, setShowImportDrawer]           = useState(false);

  const notify=(msg,ok=true)=>{setToast({msg,ok});setTimeout(()=>setToast(null),3000);};

  // ── Click outside to close dropdown ──
  useEffect(() => {
    const handler = (e) => {
      if (showNewDropdown && !e.target.closest('button')) {
        setShowNewDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNewDropdown]);

  // ── localStorage persistence ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kanban-filter-state');
      if (saved) {
        const { spaces, iterations, subsystems, apps, assignees, drilldown } = JSON.parse(saved);
        setSelectedSpaces(spaces || []);
        setSelectedIterations(iterations || []);
        setSelectedSubsystems(subsystems || []);
        setSelectedApps(apps || []);
        setSelectedAssignees(assignees || []);
        if (drilldown?.dimension) setDrilldownFilter(drilldown);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('kanban-filter-state', JSON.stringify({ spaces: selectedSpaces, iterations: selectedIterations, subsystems: selectedSubsystems, apps: selectedApps, assignees: selectedAssignees, drilldown: drilldownFilter }));
  }, [selectedSpaces, selectedIterations, selectedSubsystems, selectedApps, selectedAssignees, drilldownFilter]);

  // ── Filter computed values ──
  const availableSpaces = useMemo(() => {
    const dynamic = cards.map(c => c.space).filter(Boolean);
    return [...new Set([...KANBAN_SPACES, ...dynamic])];
  }, [cards]);

  const availableIterations = useMemo(() => {
    const relevant = selectedSpaces.length > 0 ? cards.filter(c => selectedSpaces.includes(c.space)) : cards;
    const dynamic = relevant.map(c => c.iteration).filter(Boolean);
    return [...new Set([...KANBAN_ITERATIONS, ...dynamic])];
  }, [cards, selectedSpaces]);

  const availableApps = useMemo(() => {
    if (selectedSubsystems.length === 0) {
      return [...new Set(Object.values(KANBAN_APPS).flat())];
    }
    return [...new Set(selectedSubsystems.flatMap(s => KANBAN_APPS[s] || []))];
  }, [selectedSubsystems]);

  const availableAssignees = useMemo(() => {
    const names = cards.map(c => c.assignee || c.owner || c.author).filter(Boolean);
    return [...new Set(names)];
  }, [cards]);

  const filteredCards = useMemo(() => cards.filter(c => {
    if (selectedSpaces.length > 0 && !selectedSpaces.includes(c.space)) return false;
    if (selectedSubsystems.length > 0 && !selectedSubsystems.includes(c.subsystem)) return false;
    if (selectedApps.length > 0 && !selectedApps.includes(c.app)) return false;
    if (selectedIterations.length > 0 && !selectedIterations.includes(c.iteration)) return false;
    if (selectedAssignees.length > 0) {
      const assignee = c.assignee || c.owner || c.author;
      if (!selectedAssignees.includes(assignee)) return false;
    }
    if (drilldownFilter?.dimension) {
      if (drilldownFilter.dimension === "priority" && c.priority !== drilldownFilter.value) return false;
      if (drilldownFilter.dimension === "author" && c.author !== drilldownFilter.value) return false;
      if (drilldownFilter.dimension === "space" && c.space !== drilldownFilter.value) return false;
      if (drilldownFilter.dimension === "iteration" && c.iteration !== drilldownFilter.value) return false;
      if (drilldownFilter.dimension === "stage" && c.col !== drilldownFilter.value) return false;
      if (drilldownFilter.dimension === "dateRange") {
        const date = safeParseDate(c.date);
        const start = safeParseDate(drilldownFilter?.value?.start);
        const end = safeParseDate(drilldownFilter?.value?.end);
        if (!date || !start || !end || date < start || date > end) return false;
      }
    }
    return true;
  }), [cards, selectedSpaces, selectedSubsystems, selectedApps, selectedIterations, selectedAssignees, drilldownFilter]);

  // ── Filter handlers ──
  const handleSpaceToggle = useCallback((space) => {
    setSelectedSpaces(prev => {
      const next = prev.includes(space) ? prev.filter(s => s !== space) : [...prev, space];
      if (next.length > 0) {
        const validIters = new Set(cards.filter(c => next.includes(c.space)).map(c => c.iteration));
        setSelectedIterations(iters => iters.filter(i => validIters.has(i)));
      }
      return next;
    });
  }, [cards]);

  const handleSubsystemToggle = useCallback((subsystem) => {
    setSelectedSubsystems(prev => {
      const next = prev.includes(subsystem) ? prev.filter(s => s !== subsystem) : [...prev, subsystem];
      const validApps = new Set(next.flatMap(s => KANBAN_APPS[s] || []));
      setSelectedApps(apps => apps.filter(a => validApps.has(a)));
      return next;
    });
  }, []);

  const handleAppToggle = useCallback((app) => {
    setSelectedApps(prev => prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]);
  }, []);

  const handleIterationToggle = useCallback((iter) => {
    setSelectedIterations(prev => prev.includes(iter) ? prev.filter(i => i !== iter) : [...prev, iter]);
  }, []);

  const handleAssigneeToggle = useCallback((assignee) => {
    setSelectedAssignees(prev => prev.includes(assignee) ? prev.filter(x => x !== assignee) : [...prev, assignee]);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setSelectedSpaces([]);
    setSelectedSubsystems([]);
    setSelectedApps([]);
    setSelectedIterations([]);
    setSelectedAssignees([]);
    setDrilldownFilter(null);
  }, []);

  const handleOverviewDrilldown = (dimension, value, label, meta = {}) => {
    const next = { dimension, value, label: label || `${DRILLDOWN_LABELS[dimension] || dimension}: ${String(value)}`, meta };
    setDrilldownFilter(next);
    if (dimension === "space" && value) {
      setSelectedSpaces(prev => (prev.includes(value) ? prev : [...prev, value]));
    }
    if (dimension === "iteration" && value) {
      setSelectedIterations(prev => (prev.includes(value) ? prev : [...prev, value]));
    }
    setActiveTab("kanban");
    notify(`已下钻到看板：${next.label}`);
  };

  const handleCardFilterClick = useCallback((dimension, value) => {
    if (dimension === 'space') handleSpaceToggle(value);
    else if (dimension === 'subsystem') handleSubsystemToggle(value);
    else if (dimension === 'app') handleAppToggle(value);
    else if (dimension === 'iteration') handleIterationToggle(value);
  }, [handleSpaceToggle, handleSubsystemToggle, handleAppToggle, handleIterationToggle]);

  const updateCard=(id,patch)=>{
    setCards(cs=>cs.map(c=>c.id===id?{...c,...patch}:c));
    setSelected(s=>s&&s.id===id?{...s,...patch}:s);
  };

  const stats = {
    total:filteredCards.length,
    approved:filteredCards.filter(c=>["approved","submitted"].includes(c.col)).length,
    rejected:filteredCards.filter(c=>c.col==="rejected").length,
    pending:filteredCards.filter(c=>!DONE_COLS.includes(c.col)).length,
    withDocs:filteredCards.filter(c=>Object.values(c.docs||{}).some(Boolean)).length,
  };
  const hasOverviewBusinessFilters = selectedSpaces.length > 0 || selectedSubsystems.length > 0 || selectedApps.length > 0 || selectedIterations.length > 0 || selectedAssignees.length > 0;

  const overviewData = useMemo(() => {
    const baseCards = filteredCards;
    const total = baseCards.length;
    const approved = baseCards.filter(c => ["approved", "submitted"].includes(c.col)).length;
    const rejected = baseCards.filter(c => c.col === "rejected").length;
    const done = approved + rejected;
    const active = baseCards.filter(c => !DONE_COLS.includes(c.col));
    const withDocs = baseCards.filter(c => Object.values(c.docs || {}).some(Boolean)).length;
    const avgCycleDays = done > 0
      ? Math.round(baseCards.filter(c => DONE_COLS.includes(c.col)).reduce((sum, c) => sum + dayDiffFromNow(c.date), 0) / done)
      : 0;
    const stalledCards = active
      .map(c => ({ ...c, stalledDays: dayDiffFromNow(c.date) }))
      .filter(c => c.stalledDays >= 14);

    const trendMap = new Map();
    baseCards.forEach((card) => {
      const key = getPeriodKey(card.date, trendGranularity);
      if (!key) return;
      if (!trendMap.has(key)) {
        trendMap.set(key, { key, newCount: 0, approved: 0, rejected: 0 });
      }
      const bucket = trendMap.get(key);
      bucket.newCount += 1;
      if (["approved", "submitted"].includes(card.col)) bucket.approved += 1;
      if (card.col === "rejected") bucket.rejected += 1;
    });

    const trends = [...trendMap.values()]
      .sort((a, b) => periodSortValue(a.key, trendGranularity) - periodSortValue(b.key, trendGranularity))
      .slice(-8)
      .map(item => ({ ...item, label: formatPeriodLabel(item.key, trendGranularity), backlog: 0 }));

    let backlogRunning = 0;
    trends.forEach((item) => {
      backlogRunning = Math.max(0, backlogRunning + item.newCount - item.approved - item.rejected);
      item.backlog = backlogRunning;
    });

    const funnel = COLUMNS.map(col => ({ ...col, count: baseCards.filter(c => c.col === col.id).length }));
    const bottleneckCount = funnel.length > 0 ? Math.max(...funnel.map(f => f.count)) : 0;

    const priorityWeight = { P0: 4, P1: 3, P2: 2, P3: 1 };
    const riskTop = stalledCards
      .map(c => ({
        id: c.id,
        title: c.title,
        col: c.col,
        priority: c.priority,
        stalledDays: c.stalledDays,
        riskScore: c.stalledDays * 10 + (priorityWeight[c.priority] || 1) * 15,
      }))
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5);

    const dimensionMap = new Map();
    baseCards.forEach((card) => {
      const value = card[overviewDimension];
      if (!value) return;
      dimensionMap.set(value, (dimensionMap.get(value) || 0) + 1);
    });
    const dimensionItems = [...dimensionMap.entries()]
      .map(([value, count]) => ({ value, label: String(value), count }))
      .sort((a, b) => b.count - a.count);

    return {
      metrics: {
        throughput: done,
        avgCycleDays,
        approvalRate: toPercent(approved, total),
        rejectionRate: toPercent(rejected, total),
        riskRate: toPercent(stalledCards.length, Math.max(1, active.length)),
        docCoverage: toPercent(withDocs, total),
      },
      trends,
      funnel,
      bottleneckCount,
      riskTop,
      dimensionItems,
    };
  }, [filteredCards, trendGranularity, overviewDimension]);

  const executeAIReview = useCallback(async (card) => {
    if (!card) return;
    setReviewing(true);
    updateCard(card.id,{col:"ai_review"});
    try {
      const result=await callAIReview(card);
      updateCard(card.id,{col:"confirm",aiResult:result});
      setDemoReviewResultCards((prev) => ({ ...prev, [card.id]: false }));
      notify(`✦ AI评审完成 · ${result.score}分`);
    } catch(e) {
      console.error(e);
      updateCard(card.id, { col: "confirm", aiResult: { ...DEMO_AI_REVIEW_RESULT, risks: [...DEMO_AI_REVIEW_RESULT.risks], suggestions: [...DEMO_AI_REVIEW_RESULT.suggestions] } });
      setDemoReviewResultCards((prev) => ({ ...prev, [card.id]: true }));
      notify("AI 不可用，已使用示例评审结果");
    }
    setReviewing(false);
  },[]);


  const closeReviewDialog = useCallback(() => {
    if (reviewTargetCardId) {
      setDismissedReviewFill((prev) => ({ ...prev, [reviewTargetCardId]: true }));
    }
    setShowReviewDialog(false);
    setReviewQuestions([]);
    setReviewAnswers({});
    setReviewCustomInputs({});
    setReviewErrors({});
  }, [reviewTargetCardId]);

  const handleReviewDialogSubmit = useCallback(async () => {
    if (!reviewTargetCardId) return;
    const baseCard = cards.find((c) => c.id === reviewTargetCardId);
    if (!baseCard) return;

    const errors = {};
    const patch = {};

    reviewQuestions.forEach((q) => {
      const selectedValue = reviewAnswers[q.field];
      const customValue = String(reviewCustomInputs[q.field] || "").trim();
      const value = Array.isArray(q.options)
        ? (selectedValue === "__other__" ? customValue : String(selectedValue || "").trim())
        : customValue;

      if (!value) {
        errors[q.field] = "该项为必填，请先补充";
        return;
      }

      if (q.field === "acceptanceCriteria") {
        const criteria = normalizeAcceptanceCriteria(value);
        if (criteria.length === 0) {
          errors[q.field] = "请至少填写一条验收标准";
          return;
        }
        patch.acceptanceCriteria = criteria;
        return;
      }

      patch[q.field] = value;
    });

    if (Object.keys(errors).length > 0) {
      setReviewErrors(errors);
      return;
    }

    const enrichedCard = { ...baseCard, ...patch };
    setDismissedReviewFill((prev) => ({ ...prev, [reviewTargetCardId]: false }));
    setShowReviewDialog(false);
    setReviewQuestions([]);
    setReviewAnswers({});
    setReviewCustomInputs({});
    setReviewErrors({});
    updateCard(reviewTargetCardId, patch);
    await executeAIReview(enrichedCard);
  }, [cards, reviewTargetCardId, reviewQuestions, reviewAnswers, reviewCustomInputs, executeAIReview]);

  const handleAIReview=useCallback(async(card)=>{
    const { isComplete, missingFields } = checkRequirementCompleteness(card);
    if (!isComplete) {
      if (dismissedReviewFill[card.id]) {
        notify("上次未完成补充，请先完善关键信息后再评审", false);
      }
      setReviewTargetCardId(card.id);
      setReviewQuestions(buildReviewQuestions(missingFields));
      setReviewAnswers({});
      setReviewCustomInputs({});
      setReviewErrors({});
      setShowReviewDialog(true);
      return;
    }
    await executeAIReview(card);
  },[dismissedReviewFill, executeAIReview]);

  const handleAIDesign=(card)=>{
    setSelected(null);
    setDetailId(card.id);
  };

  const handleUpdateDocs=(cardId, docs, extraPatch={})=>{
    updateCard(cardId,{docs, ...extraPatch});
    notify("✓ 文档已保存");
  };

  const handleSendMessage=useCallback(async(message, panel)=>{
    const card = cards.find(c => c.id === detailCardId);
    if(!card) return;

    const model = getSelectedModel();
    const historyKey = `chatHistory_${model}`;
    // 迁移兼容：若有旧版 chatHistory，迁移到 chatHistory_claude
    const chatHistory = card[historyKey] || (model === 'claude' ? card.chatHistory || [] : []);
    const newMessage = { role: "user", content: message };
    const updatedHistory = [...chatHistory, newMessage];

    try {
      const response = await callAI(
        resolveSkillPrompt('chatbot', card, { message }),
        1500
      );

      updateCard(card.id, { [historyKey]: [...updatedHistory, { role: "assistant", content: response }] });
    } catch(e) {
      console.error(e);
      notify(getAIErrorMessage(e), false);
    }
  }, [cards, detailCardId]);

  const handleMoveCard=(id,col)=>{
    updateCard(id,{col});
    notify(`已移至 · ${COLUMNS.find(c=>c.id===col)?.label}`);
  };

  const handleDragStart=(e,card)=>{setDragCard(card);e.dataTransfer.effectAllowed="move";};
  const handleDrop=(e,colId)=>{e.preventDefault();if(dragCard&&dragCard.col!==colId)handleMoveCard(dragCard.id,colId);setDragCard(null);};

  // ── Project Settings ──
  if(currentView === 'settings') {
    return (
      <ProjectSettingsPage
        projectConfig={projectConfig}
        onSave={(cfg) => setProjectConfig(cfg)}
        onBack={() => setCurrentView(null)}
      />
    );
  }

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

  // ── Detail Page ──
  if(detailCardId) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
        {toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:toast.ok?C.ink:C.danger,color:"#fff",padding:"10px 20px",borderRadius:8,fontSize:13,zIndex:999,boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>{toast.msg}</div>}
        <DetailPage
          cards={cards}
          focusCardId={detailCardId}
          onBack={()=>setDetailId(null)}
          onUpdateDocs={handleUpdateDocs}
          onSendMessage={handleSendMessage}
          projectConfig={projectConfig}
          onNavigateToSettings={() => { setDetailId(null); setCurrentView('settings'); }}
          onUpdateRefs={(cardId, refs) => updateCard(cardId, { references: refs })}
        />
      </>
    );
  }

  // ── Kanban / Stats ──
  return (
    <div style={{fontFamily:"'Noto Sans SC',sans-serif",background:C.paper,height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      {toast&&(
        <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:toast.ok?C.ink:C.danger,color:"#fff",padding:"10px 20px",borderRadius:8,fontSize:13,zIndex:999,boxShadow:"0 4px 20px rgba(0,0,0,0.3)",animation:"fadeIn 0.2s ease"}}>
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateX(-50%) translateY(-8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
          {toast.msg}
        </div>
      )}

      {/* Nav */}
      <div style={{background:C.ink,padding:"0 24px",display:"flex",alignItems:"center",gap:0,borderBottom:"1px solid #1a1a1a",flexShrink:0,height:56}}>
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
          <div style={{position:"relative"}}>
            <button onClick={()=>setShowSettings(v=>!v)}
              title="设置"
              style={{padding:"6px 10px",background:showSettings?"#2a2a2a":"#1a1a1a",color:showSettings?"#fff":"#888",border:"1px solid #333",borderRadius:5,cursor:"pointer",fontSize:14,transition:"all 0.15s"}}>
              ⚙
            </button>
            {showSettings && (
              <SettingsDropdown
                onClose={()=>setShowSettings(false)}
                onNavigateToSettings={()=>setCurrentView('settings')}
              />
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      {activeTab==="stats"&&(
        <div style={{flex:1,overflowY:"auto",padding:24,maxWidth:1100,margin:"0 auto",width:"100%"}} onClick={()=>{setSpaceDropdownOpen(false);setIterationDropdownOpen(false);setSubsystemDropdownOpen(false);setAppDropdownOpen(false);setAssigneeDropdownOpen(false);}}>
          <h2 style={{fontWeight:700,fontSize:22,color:C.ink,marginBottom:24}}>数据概览</h2>
          <MultiSelectFilter
            availableSpaces={availableSpaces}
            availableIterations={availableIterations}
            availableSubsystems={KANBAN_SUBSYSTEMS}
            availableApps={availableApps}
            availableAssignees={availableAssignees}
            selectedSpaces={selectedSpaces}
            selectedIterations={selectedIterations}
            selectedSubsystems={selectedSubsystems}
            selectedApps={selectedApps}
            selectedAssignees={selectedAssignees}
            spaceOpen={spaceDropdownOpen}
            iterationOpen={iterationDropdownOpen}
            subsystemOpen={subsystemDropdownOpen}
            appOpen={appDropdownOpen}
            assigneeOpen={assigneeDropdownOpen}
            onSpaceOpen={setSpaceDropdownOpen}
            onIterationOpen={setIterationDropdownOpen}
            onSubsystemOpen={setSubsystemDropdownOpen}
            onAppOpen={setAppDropdownOpen}
            onAssigneeOpen={setAssigneeDropdownOpen}
            onSpaceToggle={handleSpaceToggle}
            onIterationToggle={handleIterationToggle}
            onSubsystemToggle={handleSubsystemToggle}
            onAppToggle={handleAppToggle}
            onAssigneeToggle={handleAssigneeToggle}
            onClearAll={handleClearAllFilters}
            drilldownFilter={drilldownFilter}
            onClearDrilldown={() => setDrilldownFilter(null)}
            rightActions={null}
          />
          <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:10,marginTop:12,marginBottom:14}}>
            <div style={{fontSize:12,color:C.muted}}>趋势粒度</div>
            {[{ id:"week", label:"周" }, { id:"month", label:"月" }].map(x => (
              <button key={x.id} onClick={() => setTrendGranularity(x.id)}
                style={{padding:"5px 10px",borderRadius:14,border:`1px solid ${trendGranularity===x.id?C.accent:C.border}`,background:trendGranularity===x.id?C.accentLight:C.white,color:trendGranularity===x.id?C.accent:C.muted,cursor:"pointer",fontSize:12,fontWeight:600}}>
                {x.label}
              </button>
            ))}
            <div style={{marginLeft:18,paddingLeft:12,borderLeft:`1px solid ${C.border}`,fontSize:12,color:C.muted}}>维度切片</div>
            <select value={overviewDimension} onChange={(e) => setOverviewDimension(e.target.value)}
              style={{height:30,padding:"0 10px",border:`1px solid ${C.border}`,borderRadius:6,background:C.white,color:C.ink,fontSize:12}}>
              {OVERVIEW_DIMENSIONS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
            </select>
            <div style={{marginLeft:"auto",fontSize:11,color:C.muted}}>
              当前样本：{stats.total} 条{drilldownFilter?.dimension ? ` · 下钻：${drilldownFilter.label}` : ""}
            </div>
          </div>

          {stats.total === 0 && (
            <div style={{marginBottom:14,padding:"10px 12px",border:`1px solid ${C.border}`,borderRadius:8,background:C.cream,fontSize:12,color:C.muted}}>
              {hasOverviewBusinessFilters ? "当前筛选无数据，请调整条件或清除筛选。" : "当前暂无可展示数据。"}
            </div>
          )}

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:24}}>
            {[
              {label:"吞吐",val:overviewData.metrics.throughput,sub:"完成数",c:C.accent},
              {label:"周期时长",val:stats.total===0?"--":overviewData.metrics.avgCycleDays,sub:"平均天数",c:C.purple, suffix:stats.total===0?"":"d"},
              {label:"通过率",val:overviewData.metrics.approvalRate,sub:"Approved",c:C.success, suffix:"%"},
              {label:"拒绝率",val:overviewData.metrics.rejectionRate,sub:"Rejected",c:C.danger, suffix:"%"},
              {label:"逾期风险",val:overviewData.metrics.riskRate,sub:"Stalled",c:C.warn, suffix:"%"},
              {label:"文档覆盖",val:overviewData.metrics.docCoverage,sub:"With Docs",c:C.teal, suffix:"%"},
            ].map(s=>(
              <div key={s.label} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:"20px 22px",borderTop:`3px solid ${s.c}`}}>
                <div style={{fontSize:26,fontWeight:800,color:C.ink,fontFamily:"'DM Mono',monospace",marginBottom:4}}>{s.val}{s.suffix || ""}</div>
                <div style={{fontSize:13,color:C.ink,marginBottom:2}}>{s.label}</div>
                <div style={{fontSize:10,color:C.muted,fontFamily:"'DM Mono',monospace"}}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12,marginBottom:12}}>
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}}>
              {(() => {
                const isUsingFallbackTrend = overviewData.trends.length < 3;
                const displayTrends = isUsingFallbackTrend ? FALLBACK_TRENDS : overviewData.trends;
                return (
                  <>
                    <div style={{fontWeight:700,fontSize:14,color:C.ink,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
                      趋势（新增 / 通过 / 积压）
                      {isUsingFallbackTrend && <span style={{fontSize:11,color:C.warn,background:C.warnLight,padding:"2px 7px",borderRadius:10,fontWeight:400}}>示例数据</span>}
                    </div>
                    {(() => {
                      const width = 640;
                      const height = 200;
                      const max = Math.max(1, ...displayTrends.map(t => Math.max(t.newCount, t.approved, t.backlog)));
                      const x = i => (displayTrends.length === 1 ? width / 2 : (i / (displayTrends.length - 1)) * (width - 20) + 10);
                      const y = v => height - (v / max) * (height - 24) - 10;
                      const pathFor = key => displayTrends.map((t, i) => `${i===0?"M":"L"}${x(i)},${y(t[key])}`).join(" ");
                      return (
                        <svg viewBox={`0 0 ${width} ${height}`} style={{width:"100%",height:200,display:"block",background:C.cream,borderRadius:8,border:`1px solid ${C.border}`}}>
                          <path d={pathFor("newCount")} fill="none" stroke={C.accent} strokeWidth="2.5" />
                          <path d={pathFor("approved")} fill="none" stroke={C.success} strokeWidth="2.5" />
                          <path d={pathFor("backlog")} fill="none" stroke={C.warn} strokeWidth="2.5" strokeDasharray="4 4" />
                        </svg>
                      );
                    })()}
                    <div style={{display:"flex",gap:12,fontSize:11,color:C.muted,marginTop:8,marginBottom:8}}>
                      <span style={{color:C.accent}}>● 新增</span>
                      <span style={{color:C.success}}>● 通过</span>
                      <span style={{color:C.warn}}>● 积压</span>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:8}}>
                      {displayTrends.map(t => {
                        const parts = t.key.split("-");
                        const month = parts[parts.length - 1];
                        const weekOrMonth = trendGranularity === "month" ? `${t.key}-01` : `${parts[0]}-${month}-01`;
                        const start = safeParseDate(weekOrMonth) || new Date();
                        const end = new Date(start);
                        end.setDate(end.getDate() + (trendGranularity === "month" ? 30 : 6));
                        return (
                          <button key={t.key}
                            onClick={isUsingFallbackTrend ? undefined : () => handleOverviewDrilldown("dateRange", { start: start.toISOString(), end: end.toISOString() }, `${t.label}`)}
                            style={{border:`1px solid ${C.border}`,background:C.white,borderRadius:6,padding:"7px 10px",textAlign:"left",cursor:isUsingFallbackTrend?"default":"pointer",fontSize:11,color:C.ink}}>
                            <div style={{fontWeight:600,marginBottom:4}}>{t.label}</div>
                            <div>新增 {t.newCount} · 通过 {t.approved} · 积压 {t.backlog}</div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>

            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}}>
              <div style={{fontWeight:700,fontSize:14,color:C.ink,marginBottom:12}}>维度切片</div>
              {overviewData.dimensionItems.length === 0 ? (
                <div style={{fontSize:12,color:C.muted}}>暂无可分析维度</div>
              ) : overviewData.dimensionItems.map(item => (
                <button key={`${overviewDimension}-${item.value}`}
                  onClick={() => handleOverviewDrilldown(overviewDimension, item.value, `${OVERVIEW_DIMENSIONS.find(d=>d.key===overviewDimension)?.label || overviewDimension}: ${item.label}`)}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:10,border:`1px solid ${C.border}`,borderRadius:7,padding:"8px 10px",marginBottom:8,background:C.white,cursor:"pointer",textAlign:"left"}}>
                  <span style={{fontSize:12,color:C.ink,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.label}</span>
                  <span style={{fontSize:11,color:C.muted,fontFamily:"'DM Mono',monospace"}}>{item.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:12}}>
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:"20px 24px"}}>
              <div style={{fontWeight:700,fontSize:14,color:C.ink,marginBottom:16}}>阶段漏斗与转化</div>
              {overviewData.funnel.map((col, idx)=>{
                const pct = Math.round((col.count / Math.max(1, stats.total)) * 100);
                const prev = overviewData.funnel[idx - 1];
                const conv = prev ? toPercent(col.count, Math.max(1, prev.count)) : 100;
                const isRisk = col.count === overviewData.bottleneckCount && col.count > 0;
                return (
                  <button key={col.id} onClick={() => handleOverviewDrilldown("stage", col.id, `阶段: ${col.label}`)}
                    style={{width:"100%",display:"flex",alignItems:"center",gap:12,marginBottom:10,border:`1px solid ${isRisk ? C.warn : C.border}`,borderRadius:8,padding:"9px 10px",background:isRisk?C.warnLight:C.white,cursor:"pointer",textAlign:"left"}}>
                    <div style={{width:82,fontSize:12,color:C.ink}}>{col.label}</div>
                    <div style={{flex:1,height:8,background:C.border,borderRadius:4}}>
                      <div style={{height:"100%",width:`${pct}%`,background:col.color,borderRadius:4,minWidth:pct>0?8:0}}/>
                    </div>
                    <div style={{width:28,fontSize:12,color:C.ink,fontFamily:"'DM Mono',monospace",textAlign:"right"}}>{col.count}</div>
                    <div style={{width:52,fontSize:11,color:isRisk?C.warn:C.muted,textAlign:"right"}}>{conv}%</div>
                  </button>
                );
              })}
            </div>

            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:"20px 18px"}}>
              <div style={{fontWeight:700,fontSize:14,color:C.ink,marginBottom:12}}>Top 风险需求</div>
              {overviewData.riskTop.length === 0 ? (
                <div style={{fontSize:12,color:C.muted,padding:"16px 0"}}>暂无高风险需求</div>
              ) : overviewData.riskTop.map(item => (
                <div key={item.id} style={{padding:"9px 10px",border:`1px solid ${C.border}`,borderRadius:7,background:C.cream,marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{fontSize:11,color:C.muted,fontFamily:"'DM Mono',monospace"}}>{item.id}</span>
                    <span style={{fontSize:10,fontWeight:700,color:"#fff",background:priorityColor(item.priority),padding:"1px 6px",borderRadius:3}}>{item.priority}</span>
                    <span style={{marginLeft:"auto",fontSize:11,color:C.warn,fontFamily:"'DM Mono',monospace"}}>{item.stalledDays}d</span>
                  </div>
                  <div style={{fontSize:12,color:C.ink,lineHeight:1.45,marginBottom:6}}>{item.title}</div>
                  <button onClick={() => handleOverviewDrilldown("stage", item.col, `阶段: ${COLUMNS.find(c=>c.id===item.col)?.label || item.col}`)}
                    style={{fontSize:11,border:`1px solid ${C.border}`,background:C.white,color:C.muted,borderRadius:5,padding:"3px 8px",cursor:"pointer"}}>
                    查看同阶段
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Kanban */}
      {activeTab==="kanban"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}} onClick={()=>{setSpaceDropdownOpen(false);setIterationDropdownOpen(false);setSubsystemDropdownOpen(false);setAppDropdownOpen(false);setAssigneeDropdownOpen(false);}}>
          <MultiSelectFilter
            availableSpaces={availableSpaces}
            availableIterations={availableIterations}
            availableSubsystems={KANBAN_SUBSYSTEMS}
            availableApps={availableApps}
            availableAssignees={availableAssignees}
            selectedSpaces={selectedSpaces}
            selectedIterations={selectedIterations}
            selectedSubsystems={selectedSubsystems}
            selectedApps={selectedApps}
            selectedAssignees={selectedAssignees}
            spaceOpen={spaceDropdownOpen}
            iterationOpen={iterationDropdownOpen}
            subsystemOpen={subsystemDropdownOpen}
            appOpen={appDropdownOpen}
            assigneeOpen={assigneeDropdownOpen}
            onSpaceOpen={setSpaceDropdownOpen}
            onIterationOpen={setIterationDropdownOpen}
            onSubsystemOpen={setSubsystemDropdownOpen}
            onAppOpen={setAppDropdownOpen}
            onAssigneeOpen={setAssigneeDropdownOpen}
            onSpaceToggle={handleSpaceToggle}
            onIterationToggle={handleIterationToggle}
            onSubsystemToggle={handleSubsystemToggle}
            onAppToggle={handleAppToggle}
            onAssigneeToggle={handleAssigneeToggle}
            onClearAll={handleClearAllFilters}
            drilldownFilter={drilldownFilter}
            onClearDrilldown={() => setDrilldownFilter(null)}
            rightActions={(
              <div style={{position:"relative"}}>
                <button
                  onClick={() => setShowNewDropdown(!showNewDropdown)}
                  style={{height:32,padding:"0 14px",background:C.accent,color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
                  + 新建需求
                  <span style={{fontSize:10,opacity:0.8}}>▼</span>
                </button>
                {showNewDropdown && (
                  <div style={{position:"absolute",top:"calc(100% + 4px)",right:0,zIndex:300,background:C.white,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"0 4px 20px rgba(0,0,0,0.15)",minWidth:160,overflow:"hidden",animation:"dropdownFade 0.15s ease"}}>
                    <style>{`@keyframes dropdownFade{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
                    <button
                      onClick={() => { setShowAdd(true); setShowNewDropdown(false); }}
                      style={{width:"100%",padding:"10px 16px",background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.ink,textAlign:"left",display:"flex",alignItems:"center",gap:8,transition:"background 0.15s"}}
                      onMouseEnter={e=>e.currentTarget.style.background=C.cream}
                      onMouseLeave={e=>e.currentTarget.style.background="none"}>
                      <span>📝</span> 新建需求
                    </button>
                    <div style={{height:1,background:C.border,margin:"4px 8px"}}/>
                    <button
                      onClick={() => { setShowImportDrawer(true); setShowNewDropdown(false); }}
                      style={{width:"100%",padding:"10px 16px",background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.ink,textAlign:"left",display:"flex",alignItems:"center",gap:8,transition:"background 0.15s"}}
                      onMouseEnter={e=>e.currentTarget.style.background=C.cream}
                      onMouseLeave={e=>e.currentTarget.style.background="none"}>
                      <span>📥</span> 导入需求
                    </button>
                  </div>
                )}
              </div>
            )}
          />
          <div style={{flex:1,display:"flex",gap:0,overflowX:"auto",padding:"20px 16px",overflowY:"hidden"}} onClick={e=>e.stopPropagation()}>
            {filteredCards.length === 0 && (selectedSpaces.length > 0 || selectedIterations.length > 0 || selectedSubsystems.length > 0 || selectedApps.length > 0 || selectedAssignees.length > 0) ? (
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:C.muted,gap:12}}>
                <div style={{fontSize:36}}>🔍</div>
                <div style={{fontSize:14,fontWeight:600,color:C.ink}}>没有符合筛选条件的需求</div>
                <div style={{fontSize:12}}>请尝试清除筛选或调整筛选条件</div>
                <button onClick={handleClearAllFilters} style={{marginTop:4,padding:"6px 16px",background:C.accent,color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:13}}>清除筛选</button>
              </div>
            ) : (
              COLUMNS.map(col=>{
                const colCards=filteredCards.filter(c=>c.col===col.id);
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
                        <div key={card.id} style={{position:"relative"}}>
                          <KanbanCard card={card} onClick={c=>setSelected(c)} isDragging={dragCard?.id===card.id}
                            onFilterClick={handleCardFilterClick}
                            dragHandlers={{draggable:true,onDragStart:e=>handleDragStart(e,card),onDragEnd:()=>setDragCard(null)}}/>
                          <button onClick={(e)=>{e.stopPropagation();setDetailId(card.id);}}
                            style={{position:"absolute",top:8,right:8,background:"rgba(255,255,255,0.95)",border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 8px",cursor:"pointer",fontSize:10,color:C.muted,opacity:0,transition:"all 0.15s",zIndex:1}}
                            onMouseEnter={e=>{e.currentTarget.style.opacity=1;e.currentTarget.style.color=C.accent;}}
                            onMouseLeave={e=>{e.currentTarget.style.opacity=0;e.currentTarget.style.color=C.muted;}}>
                            详情 →
                          </button>
                        </div>
                      ))}
                      {colCards.length===0&&<div style={{textAlign:"center",color:C.muted,fontSize:12,padding:"20px 0"}}>拖拽需求到此处</div>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {selected&&(
        <>
          <div onClick={()=>setSelected(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.22)",zIndex:99}}/>
          <DetailDrawer card={selected} onClose={()=>setSelected(null)}
            onAIReview={handleAIReview} onAIDesign={handleAIDesign}
            reviewing={reviewing} onMoveCard={handleMoveCard}
            showDemoReviewTag={Boolean(demoReviewResultCards[selected.id])}
            onUpdateCard={updateCard}
            projectConfig={projectConfig}/>
        </>
      )}
      <ConfirmationDialog
        visible={showReviewDialog}
        questions={reviewQuestions}
        answers={reviewAnswers}
        customInputs={reviewCustomInputs}
        errors={reviewErrors}
        prdExample={PRD_EXAMPLE_SNIPPET}
        onSelectOption={(field, value) => {
          setReviewAnswers((prev) => ({ ...prev, [field]: value }));
          setReviewErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
          });
        }}
        onChangeCustom={(field, value) => {
          setReviewCustomInputs((prev) => ({ ...prev, [field]: value }));
          setReviewErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
          });
        }}
        onClose={closeReviewDialog}
        onSubmit={handleReviewDialogSubmit}
      />
      {showAdd&&<AddCardDrawer onAdd={card=>{setCards(cs=>[card,...cs]);notify("需求已创建");}} onClose={()=>setShowAdd(false)}/>} 
      {showImportDrawer&&<ImportDrawer visible={showImportDrawer} onClose={()=>setShowImportDrawer(false)}/>}
    </div>
  );
}

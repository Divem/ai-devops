# pm-ai-app/src/PMPlatform.jsx 源码解读

> Agentic·DevOps 产研智能工作台 - 主应用核心组件

---

## 📋 目录

1. [架构概览](#架构概览)
2. [核心数据结构](#核心数据结构)
3. [主要功能模块](#主要功能模块)
4. [AI 集成](#ai-集成)
5. [状态管理](#状态管理)
6. [组件层级](#组件层级)
7. [关键流程](#关键流程)

---

## 架构概览

### 设计理念

**Agentic·DevOps 产研智能工作台** 是一个基于 React 19 的单页面应用，采用**纯 React 状态管理**（无 Redux/Zustand），所有状态均为组件本地状态。

### 文件结构

```
pm-ai-app/src/
├── PMPlatform.jsx       # 主应用文件（持续迭代，5000+ 行）
├── main.jsx             # 入口
└── index.css

ai-client.js             # AI 客户端封装（项目根目录）
```

主应用模块划分：
```
PMPlatform.jsx
├── 颜色/常量/工具函数
├── 初始数据 (INITIAL_CARDS)
├── 辅助组件
│   ├── KanbanCard         - 看板卡片
│   ├── DetailDrawer       - 需求详情抽屉（带 AI 评审）
│   ├── ProposalReviewDrawer - 提案评审抽屉（AI 需求澄清）
│   ├── DocTreeSidebar     - 左侧文档树导航
│   ├── DocEditor          - 中间文档编辑/预览区
│   ├── RightPanel         - 右侧面板（聊天 + 参考资料）
│   ├── DetailPage         - 需求详情全屏页（三栏布局）
│   ├── ProjectSettingsPage - 项目配置全屏页（滚动导航）
│   └── MultiSelectFilter  - 多选筛选器
└── PMPlatform             - 根组件（路由 + 状态）
```

---

## 核心数据结构

### 1. 需求卡片 (Card)

```javascript
{
  id: "REQ-001",
  col: "backlog",               // 看板列: backlog | reviewing | ai_review | confirm | approved | rejected
  priority: "P0",               // P0 | P1 | P2 | P3
  space: "电商平台",             // 空间（业务域，用于筛选）
  iteration: "2025Q1-Sprint1",  // 迭代（用于筛选）
  title: "用户购买流程优化",
  desc: "需求简要描述",
  rawRequirement: "业务方提交的完整原始需求说明",  // 用于生成 PRD
  tags: ["电商", "体验优化"],
  author: "张晓薇",
  date: "2025-03-01",
  userStory: "作为用户...",
  acceptanceCriteria: ["验收条件1", "验收条件2"],
  aiResult: {                   // AI 评审结果
    score: 88,
    completeness: 92,
    logic: 86,
    risk: 84,
    summary: "总结说明",
    risks: ["风险1", "风险2"],
    suggestions: ["建议1", "建议2"],
    passed: true                // >= 70 为 true
  },
  docs: {
    prd: null,                  // PRD 文档（基于 rawRequirement 生成）
    proposals: [                // 技术提案数组（可多个）
      {
        id: "auth-system",
        name: "认证系统改造",
        proposal: "...",         // 技术提案
        design: "...",           // 技术设计
        spec: "...",             // Delta Spec
        tasks: "..."             // 开发任务
      }
    ]
  },
  chatHistory: [               // 聊天历史
    { role: "user", content: "..." },
    { role: "assistant", content: "..." }
  ]
}
```

### 2. 看板列 (COLUMNS)

```javascript
[
  { id: "backlog",   label: "待评审",  color: C.muted,  bg: "#f0ede8" },
  { id: "reviewing", label: "评审中",  color: C.accent, bg: C.accentLight },
  { id: "ai_review", label: "AI分析中",color: C.purple, bg: C.purpleLight },
  { id: "confirm",   label: "人工确认",color: C.warn,   bg: C.warnLight },
  { id: "approved",  label: "已通过",  color: C.success,bg: C.successLight },
  { id: "rejected",  label: "已拒绝",  color: C.danger, bg: C.dangerLight },
]
```

### 3. 项目配置 (DEFAULT_PROJECT_CONFIG)

```javascript
{
  project: { name: '', meego: '', description: '' },
  ai: {
    model: 'claude',           // 选中的 AI 模型
    anthropicKey: '',          // Claude API Key
    anthropicBaseUrl: '',      // Claude Base URL（空则用代理）
    anthropicModel: '',        // Claude 模型名（空则用默认）
    glmKey: '',                // GLM API Key
    glmBaseUrl: '',            // GLM Base URL
    glmModel: '',              // GLM 模型名
    arkKey: '',                // Ark API Key
    arkBaseUrl: '',            // Ark Base URL
    arkModel: '',              // Ark 模型名
    customName: '',            // 自定义模型显示名
    customBaseUrl: '',         // 自定义端点（OpenAI 兼容）
    customModel: '',           // 自定义模型 ID
    customKey: '',             // 自定义 API Key
    customAuthStyle: 'Bearer', // 认证方式: Bearer | x-api-key
  },
  git: { platform: 'github', token: '', owner: '', repo: '', branch: 'main' },
  skills: []
}
```

---

## 主要功能模块

### 1. 看板视图 (Kanban View)

6 列需求流转看板，支持：
- 卡片拖拽（HTML5 Drag & Drop API）
- 多维度多选筛选（空间 + 迭代）
- 点击卡片打开详情抽屉
- 需求优先级徽章（P0–P3 颜色区分）

### 2. 详情抽屉 (DetailDrawer)

展示需求完整信息 + AI 评审报告（ScoreRing 圆环图 + MiniBar 维度条），提供：
- AI 智能评审按钮
- AI 设计按钮（进入详情全屏页）
- 通过 / 拒绝操作

### 3. 提案评审抽屉 (ProposalReviewDrawer)

AI 需求澄清模块，包含：
- **原始需求**标签页：查看完整需求原文
- **AI 评审**标签页：显示 AI 分析摘要（loading 中仍可操作）
- **提交并生成提案**按钮：`disabled={generating}`（仅生成中禁用，非 AI 评审加载中）

### 4. 详情全屏页 (DetailPage)

三栏布局的需求详情页：

```
┌──────────────┬──────────────────────┬─────────────────┐
│ 文档树侧边栏  │    文档编辑/预览区    │  右侧面板        │
│ DocTreeSidebar│    DocEditor        │  ChatbotPanel   │
│              │                      │  ReferencePanel  │
└──────────────┴──────────────────────┴─────────────────┘
```

文档树层级：
```
REQ-001
├── 📋 产品需求 SPEC (PRD)
└── 提案文件夹/
    ├── 认证系统改造/
    │   ├── 💡 Proposal
    │   ├── 🏗 Design
    │   ├── 📝 Delta Spec
    │   └── ✅ Tasks
    └── Token 刷新机制/
        └── ✅ Tasks
```

### 5. 项目配置页 (ProjectSettingsPage)

滚动式全屏配置页，左侧固定导航，右侧内容区可滚动：

**左侧导航索引**（IntersectionObserver 驱动高亮）：
- AI 模型配置
- Git 仓库配置
- SDD 框架规范
- AI 技能管理

**AI 模型配置区块**：
- 下拉选择模型：Claude / GLM-4 / Ark / 自定义
- 各模型独立展示：API Key（密码显示/隐藏切换）+ Base URL + Model Name
- **保存 AI 配置** + **测试请求** 两个操作按钮
- 测试请求使用**表单当前值**（未保存状态）直接发起最小请求（max_tokens: 5）
- 测试结果用颜色条展示：蓝色（测试中）/ 绿色（成功）/ 红色（失败）

**Git 仓库配置区块**：
- 平台选择（GitHub / GitLab）+ Token + Owner + Repo + Branch
- **测试连接**按钮（调用 GitHub/GitLab API 验证）

### 6. 数据概览页 (Stats View)

4 个核心指标卡片 + 各阶段分布条形图。

---

## AI 集成

### 架构：ai-client.js

独立文件 `ai-client.js` 封装多模型 AI 调用：

```javascript
class AIClient {
  constructor(modelId) {
    this.provider = this._createProvider(modelId);
  }
  _createProvider(modelId) {
    switch (modelId) {
      case 'claude': return new ClaudeProvider();
      case 'glm':    return new GLMProvider();
      case 'ark':    return new ArkProvider();
      case 'custom': return new CustomProvider();
      default:       return new ClaudeProvider();
    }
  }
  async chat(prompt, maxTokens) { ... }
}
```

每个 Provider 在构造时从 `localStorage` 读取 key/baseUrl/model，支持运行时覆盖默认值：

```javascript
class ClaudeProvider {
  constructor() {
    this.apiKey      = localStorage.getItem('ai_model_anthropic_key') || '';
    this.apiEndpoint = localStorage.getItem('ai_model_claude_baseurl') || '/api/anthropic/v1/messages';
    this.model       = localStorage.getItem('ai_model_claude_modelname') || 'claude-sonnet-4-20250514';
  }
}
```

**支持的模型**：

| 模型 | Provider | API 格式 | 默认端点 |
|------|----------|----------|----------|
| claude | ClaudeProvider | Anthropic Messages | `/api/anthropic/v1/messages`（代理） |
| glm | GLMProvider | OpenAI 兼容 | `https://open.bigmodel.cn/api/paas/v4/...` |
| ark | ArkProvider | OpenAI 兼容 | `https://ark.cn-beijing.volces.com/api/coding/v3/...` |
| custom | CustomProvider | OpenAI 兼容 | 用户配置 |

### AI 功能入口

| 功能 | 函数 | 模型 |
|------|------|------|
| 需求评审 | `callAIReview(card)` | 当前选中模型 |
| 文档生成 | `callAIDoc(card, docType)` | 当前选中模型 |
| 需求澄清聊天 | `handleSendMessage()` | 当前选中模型 |
| 配置测试 | `handleTestAI()` | 直接 fetch，使用表单值 |

### AI 测试请求 (handleTestAI)

不经过 AIClient，直接用表单 state 值构造请求，确保测试的是"当前填写的配置"而非 localStorage 旧值：

```javascript
const handleTestAI = async () => {
  setAiTestStatus('testing');
  try {
    if (aiModel === 'claude') {
      // POST anthropicBaseUrl || '/api/anthropic/v1/messages'
      // headers: x-api-key + anthropic-version: 2023-06-01
      // body: Anthropic Messages 格式, max_tokens: 5
    } else {
      // POST baseUrl/chat/completions
      // headers: Authorization: Bearer key
      // body: OpenAI Chat Completions 格式, max_tokens: 5
    }
    setAiTestStatus('success');
    setAiTestMsg('测试成功: ...');
  } catch (e) {
    setAiTestStatus('error');
    setAiTestMsg(`网络错误: ${e.message}`);
  }
};
```

---

## 状态管理

### PMPlatform 根组件主状态

```javascript
const [cards, setCards]           = useState(INITIAL_CARDS);
const [activeTab, setActiveTab]   = useState("kanban");     // kanban | stats
const [selected, setSelected]     = useState(null);          // 详情抽屉的卡片
const [detailCardId, setDetailId] = useState(null);         // 详情全屏页卡片ID
const [reviewing, setReviewing]   = useState(false);        // AI 评审中
const [dragCard, setDragCard]     = useState(null);         // 拖拽中的卡片
const [toast, setToast]           = useState(null);
const [showAdd, setShowAdd]       = useState(false);
const [projectConfig, setProjectConfig] = useState(loadProjectConfig());
const [selectedSpaces, setSelectedSpaces]         = useState([]);
const [selectedIterations, setSelectedIterations] = useState([]);
```

### ProjectSettingsPage 局部状态（AI 模型配置部分）

```javascript
// 模型选择
const [aiModel, setAiModel] = useState(projectConfig.ai.model || 'claude');

// 各模型配置
const [anthropicKey, setAnthropicKey]         = useState(projectConfig.ai.anthropicKey || '');
const [anthropicBaseUrl, setAnthropicBaseUrl] = useState(projectConfig.ai.anthropicBaseUrl || '');
const [anthropicModel, setAnthropicModel]     = useState(projectConfig.ai.anthropicModel || '');
// ... glm / ark / custom 类似

// Key 显示/隐藏
const [showAnthropicKey, setShowAnthropicKey] = useState(false);
// ... 各模型各一个 showXxxKey

// 测试请求状态
const [aiTestStatus, setAiTestStatus] = useState(null);  // null | 'testing' | 'success' | 'error'
const [aiTestMsg, setAiTestMsg]       = useState('');
```

### 状态更新工具函数

```javascript
const updateCard = useCallback((id, updates) => {
  setCards(cs => cs.map(c => c.id === id ? { ...c, ...updates } : c));
}, []);

const handleMoveCard = (id, col) => {
  updateCard(id, { col });
  notify(`已移至 · ${COLUMNS.find(c => c.id === col)?.label}`);
};
```

---

## 组件层级

```
PMPlatform
├── 顶部导航栏（模型选择 / 统计 / 设置入口）
├── 看板视图 (activeTab === "kanban")
│   ├── MultiSelectFilter（空间 + 迭代多选）
│   ├── 6 × 看板列
│   │   └── KanbanCard[]
│   └── DetailDrawer（右侧抽屉）
│       └── ProposalReviewDrawer（提案评审抽屉）
├── 数据概览 (activeTab === "stats")
│   ├── 4 个统计指标卡片
│   └── 阶段分布条形图
├── DetailPage（详情全屏，detailCardId 非 null 时）
│   ├── DocTreeSidebar
│   ├── DocEditor
│   └── RightPanel
│       ├── ChatbotPanel
│       └── ReferencePanel
├── ProjectSettingsPage（设置全屏）
│   ├── 左侧固定导航（scroll-spy 高亮）
│   └── 右侧滚动内容区
│       ├── AI 模型配置区块（ref=aiRef）
│       ├── Git 仓库配置区块（ref=gitRef）
│       ├── SDD 框架规范区块（ref=sddRef）
│       └── AI 技能管理区块（ref=skillsRef）
└── 弹窗
    └── AddCardModal（新建需求）
```

---

## 关键流程

### 1. AI 评审流程

```
点击需求卡片 → 打开 DetailDrawer
  ↓
点击"AI 智能评审" → callAIReview(card)
  ↓
AI 返回 JSON 评审结果
  ↓
updateCard(id, { aiResult }) → 渲染评分环图 + 维度条
```

### 2. 生成文档流程

```
从 DetailDrawer 点击"AI 设计" → 打开 DetailPage
  ↓
在 DocTreeSidebar 选择文档节点
  ↓
DocEditor 中点击"AI 生成"
  ↓
callAIDoc(card, docType) → 生成 Markdown
  ↓
updateCard(id, { docs: { ...docs, [type]: content } })
```

### 3. 提案评审 & 生成流程

```
详情抽屉 → "AI 需求澄清" → ProposalReviewDrawer
  ↓
自动触发 AI 评审（后台加载，不阻塞操作）
  ↓
用户可直接点击"提交并生成提案"（disabled 仅在生成中）
  ↓
进入详情页，自动生成 proposal + design + spec + tasks
```

### 4. 需求流转（拖拽）

```
拖拽卡片到目标列 → onDrop
  ↓
handleMoveCard(card.id, targetColId)
  ↓
updateCard → 看板重新渲染 + Toast 提示
```

### 5. AI 配置测试

```
ProjectSettingsPage 中修改 API Key（未保存）
  ↓
点击"测试请求"
  ↓
handleTestAI() 用表单 state 直接 fetch（不读 localStorage）
  ↓
显示结果条：测试中（蓝）/ 成功（绿）/ 失败（红）
```

---

## 设计特点

### 1. 内联样式
所有样式通过 JS 对象内联，颜色统一走 `C` 对象（Color Tokens）。

### 2. scroll-spy 导航
ProjectSettingsPage 使用 `IntersectionObserver`（rootMargin: `-40% 0px -55% 0px`）在滚动时自动高亮左侧导航项。

### 3. AI 测试与保存解耦
测试请求直接使用表单 state，不依赖 localStorage；保存操作才写入 localStorage，两者完全解耦。

### 4. 多模型扩展
在 `ai-client.js` 中添加新 Provider 类并在 `_createProvider` switch 中注册，即可接入新模型。

---

## 扩展点

### 新增 AI 模型

```javascript
// ai-client.js
class NewModelProvider {
  constructor() {
    this.apiKey = localStorage.getItem('ai_model_new_key') || '';
    this.apiEndpoint = '...';
    this.model = 'model-name';
  }
  async chat(prompt, maxTokens) { /* OpenAI 格式 fetch */ }
}

// _createProvider 中
case 'new': return new NewModelProvider();
```

### 新增文档类型

在 `DOC_TYPES` 数组和 `DOC_PROMPTS` 对象中各添加一项即可。

---

*最后更新: 2026-03-08*

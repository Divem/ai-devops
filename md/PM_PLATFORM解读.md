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

**PM·AI 产品智能工作台** 是一个基于 React 19 的单页面应用，采用**纯 React 状态管理**（无 Redux/Zustand），所有状态均为组件本地状态。

### 文件结构

```
PMPlatform.jsx (2135 行)
├── 颜色和常量定义 (1-38)
├── 初始数据和示例 (39-67)
├── AI API 封装 (69-456)
├── 辅助组件 (458-718)
│   ├── KanbanCard - 看板卡片
│   ├── DetailDrawer - 详情抽屉
│   └── DesignStudio - 设计工作室
├── 主组件 PMPlatform (720-2135)
│   ├── 状态定义
│   ├── 事件处理
│   ├── 看板视图
│   ├── 详情页视图
│   └── 设置相关
└── 内联样式定义
```

---

## 核心数据结构

### 1. 需求卡片 (Card)

```javascript
{
  id: "REQ-001",                    // 需求ID
  col: "backlog",                   // 所在看板列
  priority: "P0",                  // 优先级: P0/P1/P2/P3
  space: "电商平台",                 // 空间（业务域）
  iteration: "2025Q1-Sprint1",     // 迭代
  title: "用户购买流程优化",       // 需求标题
  desc: "...",                      // 需求描述
  tags: ["电商","体验优化"],        // 标签
  author: "张晓薇",                 // 作者
  date: "2025-03-01",              // 日期
  userStory: "作为用户...",         // 用户故事
  acceptanceCriteria: ["..."],     // 验收标准数组
  aiResult: {                       // AI 评审结果
    score: 88,                      // 总分
    completeness: 92,                // 完整性
    logic: 86,                      // 逻辑性
    risk: 84,                       // 风险
    summary: "...",                  // 总结
    risks: ["..."],                 // 风险列表
    suggestions: ["..."],           // 建议列表
    passed: true                     // 是否通过
  },
  docs: {                           // 文档数据
    prd: null,                      // PRD 文档
    proposals: [                    // 提案数组（新版）
      {
        id: "auth-system",           // 提案ID
        name: "认证系统改造",        // 提案名称
        proposal: "...",             // Proposal 文档
        design: "...",               // Design 文档
        spec: "...",                 // Spec 文档
        tasks: "..."                // Tasks 文档
      }
    ]
  },
  chatHistory: [                   // 聊天历史
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

### 3. 文档类型 (DOC_TYPES)

```javascript
[
  { key: "prd",      label: "产品需求 SPEC",  icon: "📋", color: "#7c6af7", group: "product" },
  { key: "spec",     label: "需求规格说明",    icon: "📝", color: "#8b5cf6", group: "product" },
  { key: "proposal", label: "Proposal",       icon: "💡", color: "#f59e0b", group: "dev" },
  { key: "design",   label: "Design",         icon: "🏗",  color: "#3b82f6", group: "dev" },
  { key: "tasks",    label: "Tasks",          icon: "✅", color: "#10b981", group: "dev" },
]
```

---

## 主要功能模块

### 1. 看板视图 (Kanban View)

**位置**: PMPlatform 主组件，activeTab === "kanban"

**功能**:
- 6 列需求流转看板
- 需求卡片拖拽（原生 HTML5 Drag & Drop API）
- 多选筛选（空间 + 迭代）
- 点击卡片显示详情抽屉
- 悬浮显示"详情"按钮

**关键代码**:
```javascript
// 拖拽开始
const handleDragStart = (e, card) => {
  setDragCard(card);
  e.dataTransfer.effectAllowed = "move";
};

// 拖拽放下
const handleDrop = (e, colId) => {
  e.preventDefault();
  if (dragCard && dragCard.col !== colId) {
    handleMoveCard(dragCard.id, colId);
  }
  setDragCard(null);
};
```

**筛选器组件**: `MultiSelectFilter` (1684-1760 行)

---

### 2. 详情抽屉 (DetailDrawer)

**位置**: 617-718 行

**功能**:
- 展示需求完整信息（描述、用户故事、验收标准）
- AI 评审报告可视化
  - 圆环进度图 (ScoreRing)
  - 三维度评分条 (MiniBar)
  - 风险和建议列表
- AI 智能评审按钮
- AI 设计按钮
- 通过/拒绝操作

**AI 评审按钮点击**:
```javascript
const handleAIReview = async (card) => {
  setReviewing(true);
  const result = await callAIReview(card);
  updateCard(card.id, { aiResult: result });
  setReviewing(false);
};
```

---

### 3. 设计工作室 (DesignStudio)

**位置**: 720-1574 行

**功能**:
- 全屏文档编辑器
- 左侧文档树（需求层级 + 文档类型）
- 中间文档编辑/预览
- 右侧 AI 对话面板

**文档树组件**: `DocTreeSidebar` (约 800-1000 行)
```javascript
// 结构示例
REQ-001
├── 📋 产品需求 SPEC
└── 📝 提案文档树
    ├── 认证系统改造
    │   ├── 💡 Proposal
    │   ├── 🏗 Design
    │   ├── 📝 Spec
    │   └── ✅ Tasks
    └── Token 刷新机制
        └── ✅ Tasks
```

**文档编辑器**: `DocEditor` (约 1000-1500 行)
- Markdown 渲染
- 在线编辑模式
- AI 生成文档按钮

**AI 生成流程**:
```javascript
const handleGenerate = async () => {
  setGenerating(`${selCard.id}:${selDocType}`);
  const content = await callAIDoc(selCard, selDocType);
  const newDocs = { ...selCard.docs, [selDocType]: content };
  onUpdateDocs(selCard.id, newDocs);
  setGenerating(null);
};
```

---

### 4. 详情页 (DetailPage)

**位置**: 约 1800-1900 行

**功能**:
- 专用的需求详情页（与 DesignStudio 类似布局）
- 文档预览和编辑
- 右侧 AI 面板

---

### 5. 设置下拉菜单 (SettingsDropdown)

**位置**: 1577-1682 行

**功能**:
- API Key 配置入口
- 登出功能（清除 localStorage）

---

### 6. API Key 配置弹窗 (ApiKeyModal)

**位置**: 约 1630-1682 行

**功能**:
- 配置 Claude API Key
- 配置 GLM-4 API Key
- 密码输入框样式
- Key 保存在 localStorage

---

### 7. 数据概览页 (Stats View)

**位置**: 2035-2063 行

**功能**:
- 4 个核心指标卡片
  - 需求总数
  - 待处理
  - 已通过
  - 含文档
- 各阶段分布条形图

---

## AI 集成

### 1. AI 客户端封装

**位置**: 74-89 行

```javascript
// 获取当前选择的模型
function getSelectedModel() {
  return localStorage.getItem('ai_model_selected') || 'claude';
}

// 统一的 AI 调用接口
async function callAI(prompt, maxTokens = 1800) {
  const model = getSelectedModel();
  const client = new AIClient(model);
  return await client.chat(prompt, maxTokens);
}
```

**模型选择器** (顶部导航栏，1991-2007 行):
```javascript
<select
  value={selectedModel}
  onChange={(e) => {
    const model = e.target.value;
    setSelectedModel(model);
    localStorage.setItem('ai_model_selected', model);
    notify(`已切换到 ${model === 'claude' ? 'Claude' : 'GLM-4'}`);
    setTimeout(() => window.location.reload(), 500);
  }}
>
  <option value="claude">Claude (Anthropic)</option>
  <option value="glm">GLM-4 (Zhipu)</option>
</select>
```

### 2. AI 需求评审

**位置**: 84-89 行

```javascript
async function callAIReview(card) {
  const text = await callAI(
    `你是资深产品经理评审专家。请对以下需求评审，从完整性、逻辑性、风险三个维度打分（0-100）。
    需求ID: ${card.id} | 标题: ${card.title} | 描述: ${card.desc}
    | 用户故事: ${card.userStory} | 验收标准: ${card.acceptanceCriteria.join("；")}
    严格按JSON返回：{
      "score":<0-100>,
      "completeness":<0-100>,
      "logic":<0-100>,
      "risk":<0-100>,
      "summary":"<2-3句>",
      "risks":["<r1>","<r2>","<r3>"],
      "suggestions":["<s1>","<s2>","<s3>"],
      "passed":<bool,>=70为true>
    }`
  );
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}
```

### 3. AI 文档生成

**位置**: 91-456 行

```javascript
const DOC_PROMPTS = {
  prd: (card) => `...PRD 生成模板...`,
  spec: (card) => `...Spec 生成模板...`,
  proposal: (card) => `...Proposal 生成模板...`,
  design: (card) => `...Design 生成模板...`,
  tasks: (card) => `...Tasks 生成模板...`,
};

async function callAIDoc(card, docType) {
  const prompt = DOC_PROMPTS[docType](card);
  return await callAI(prompt, 2000);
}
```

### 4. AI 对话助手

**位置**: 1903-1922 行

```javascript
const handleSendMessage = async (message, tab) => {
  const card = cards.find(c => c.id === detailCardId);
  const historyKey = tab === "chatbot" ? "chatHistory" : "refChatHistory";
  const chatHistory = card[historyKey] || [];
  const newMessage = { role: "user", content: message };
  const updatedHistory = [...chatHistory, newMessage];

  const response = await callAI(
    `你是产品需求分析专家。针对以下需求回答用户的问题。
    需求标题: ${card.title}
    需求描述: ${card.desc}
    用户故事: ${card.userStory}
    验收标准: ${card.acceptanceCriteria.join("；")}
    用户问题: ${message}
    请以专业、友好的语气回复。`,
    1500
  );

  updateCard(card.id, { [historyKey]: [...updatedHistory, { role: "assistant", content: response }] });
};
```

---

## 状态管理

### 主状态定义 (PMPlatform 组件)

```javascript
const [cards, setCards] = useState(INITIAL_CARDS);           // 需求列表
const [activeTab, setActiveTab] = useState("kanban");       // 当前标签页
const [selected, setSelected] = useState(null);              // 选中的卡片（详情抽屉）
const [detailCardId, setDetailId] = useState(null);         // 详情页卡片ID
const [studioCardId, setStudioId] = useState(null);         // 设计工作室卡片ID
const [reviewing, setReviewing] = useState(false);          // AI 评审中
const [dragCard, setDragCard] = useState(null);            // 拖拽中的卡片
const [toast, setToast] = useState(null);                  // 提示消息
const [showAdd, setShowAdd] = useState(false);             // 显示新建弹窗
const [selectedModel, setSelectedModel] = useState(
  localStorage.getItem('ai_model_selected') || 'claude'    // AI 模型选择
);

// 筛选相关
const [selectedSpaces, setSelectedSpaces] = useState([]);   // 选中的空间
const [selectedIterations, setSelectedIterations] = useState([]); // 选中的迭代
const [spaceDropdownOpen, setSpaceDropdownOpen] = useState(false);
const [iterationDropdownOpen, setIterationDropdownOpen] = useState(false);

// 设置相关
const [showSettings, setShowSettings] = useState(false);
const [showApiKeyModal, setShowApiKeyModal] = useState(false);
```

### 状态更新工具函数

```javascript
// 更新需求
const updateCard = useCallback((id, updates) => {
  setCards(cs => cs.map(c => c.id === id ? { ...c, ...updates } : c));
}, []);

// 更新文档
const handleUpdateDocs = useCallback((cardId, newDocs) => {
  updateCard(cardId, { docs: newDocs });
}, [updateCard]);

// 移动需求到指定列
const handleMoveCard = (id, col) => {
  updateCard(id, { col });
  notify(`已移至 · ${COLUMNS.find(c => c.id === col)?.label}`);
};
```

### 统计数据计算

```javascript
const stats = useMemo(() => {
  const total = cards.length;
  const pending = cards.filter(c =>
    ["backlog","reviewing","ai_review","confirm"].includes(c.col)
  ).length;
  const approved = cards.filter(c => c.col === "approved").length;
  const withDocs = cards.filter(c =>
    Object.values(c.docs || {}).filter(Boolean).length > 0
  ).length;
  return { total, pending, approved, withDocs };
}, [cards]);
```

---

## 组件层级

```
PMPlatform (主组件)
├── 导航栏
│   ├── Logo + 标题
│   ├── 标签页切换 (需求评审看板 / 数据概览)
│   ├── AI 模型选择器
│   ├── 统计数据
│   ├── 设置下拉菜单
│   └── 新建需求按钮
├── 看板视图 (activeTab === "kanban")
│   ├── MultiSelectFilter (筛选器)
│   ├── COLUMNS (6列)
│   │   └── KanbanCard[] (需求卡片)
│   └── DetailDrawer (详情抽屉)
├── 数据概览 (activeTab === "stats")
│   ├── 统计卡片
│   └── 阶段分布条形图
├── DetailPage (详情页全屏)
│   ├── DocTreeSidebar (文档树)
│   ├── DocEditor (文档编辑器)
│   └── RightPanel (AI 面板)
├── DesignStudio (设计工作室全屏)
│   ├── DocTreeSidebar (文档树)
│   ├── DocEditor (文档编辑器)
│   └── RightPanel (AI 面板)
└── 弹窗
    ├── AddCardModal (新建需求)
    └── ApiKeyModal (API Key 配置)
```

---

## 关键流程

### 1. 新建需求流程

```
点击 "新建需求" 按钮
  ↓
打开 AddCardModal 弹窗
  ↓
填写需求信息（标题、描述、优先级等）
  ↓
点击保存
  ↓
setCards(cs => [newCard, ...cs])
  ↓
显示提示 "需求已创建"
```

### 2. AI 评审流程

```
点击需求卡片 → 打开详情抽屉
  ↓
点击 "AI 智能评审" 按钮
  ↓
setReviewing(true)
  ↓
调用 callAIReview(card)
  ↓
解析 AI 返回的 JSON
  ↓
updateCard(card.id, { aiResult: result })
  ↓
显示 AI 评审报告（评分、风险、建议）
```

### 3. AI 生成文档流程

```
点击 "AI 设计" 按钮
  ↓
打开 DesignStudio 全屏页
  ↓
在文档树中选择文档类型
  ↓
点击 "AI 生成" 按钮
  ↓
callAIDoc(card, docType)
  ↓
生成 Markdown 内容
  ↓
更新到 card.docs[docType]
  ↓
右侧渲染预览
```

### 4. 需求流转流程

```
拖拽需求卡片到目标列
  ↓
onDrop 事件触发
  ↓
调用 handleMoveCard(card.id, targetCol)
  ↓
updateCard(card.id, { col: targetCol })
  ↓
重新渲染看板
```

### 5. 筛选流程

```
点击 "空间" / "迭代" 下拉按钮
  ↓
显示复选框列表
  ↓
勾选多个选项
  ↓
selectedSpaces / selectedIterations 更新
  ↓
filteredCards 自动过滤
  ↓
看板重新渲染
```

---

## 设计特点

### 1. 内联样式

项目使用内联对象样式（无 CSS 模块或 Styled Components）:
```javascript
const styles = {
  container: { padding: '16px', background: '#f5f3ee' },
  button: { background: '#1a6cf6', color: '#fff' }
};
```

### 2. 组件化设计

- 独立的子组件（KanbanCard, DetailDrawer, DesignStudio 等）
- Props 传递数据
- 回调函数处理事件

### 3. 无外部状态管理

- 纯 React useState/useCallback/useMemo
- 状态提升至主组件
- 简单直接，易于理解

### 4. AI 能力集成

- 统一的 AIClient 抽象
- 支持多模型切换（Claude / GLM-4）
- Prompt 模板化
- 错误处理和重试

### 5. 响应式布局

- Flexbox 布局
- 相对单位
- 悬浮和过渡动画

---

## 扩展点

### 1. 新增 AI 模型

在 `ai-client.js` 中添加新的 Provider 类:
```javascript
class NewModelProvider {
  constructor() {
    this.apiKey = this._getApiKey();
    this.apiEndpoint = '...';
    this.model = 'model-name';
  }
  // 实现 chat 方法
}
```

### 2. 新增文档类型

在 `DOC_TYPES` 中添加:
```javascript
{ key: "new-type", label: "新文档类型", icon: "📌", color: "#xxx", group: "dev" }
```

在 `DOC_PROMPTS` 中添加生成模板。

### 3. 新增看板列

在 `COLUMNS` 中添加:
```javascript
{ id: "new-col", label: "新列名", color: C.xxx, bg: "#xxx" }
```

---

## 总结

**PMPlatform.jsx** 是一个功能完整的 React 单页应用，核心特点：

1. ✅ **完整的 AI 需求管理工作流**
   - 需求创建
   - AI 评审
   - 文档生成
   - 状态流转

2. ✅ **多模型 AI 支持**
   - Claude (Anthropic)
   - GLM-4 (Zhipu)

3. ✅ **直观的看板界面**
   - 拖拽操作
   - 多选筛选
   - 实时统计

4. ✅ **专业文档编辑**
   - Markdown 渲染
   - 在线编辑
   - AI 辅助生成

5. ✅ **简洁的技术栈**
   - React 19
   - 无外部状态管理
   - 内联样式

---

*文档生成时间: 2026-03-07*

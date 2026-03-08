# PM AI Platform 技术架构说明书

## 1. 文档目的

本说明书用于项目共享与后续回顾，回答三件事：

- 系统由哪些核心模块组成
- 模块之间如何协作与流转数据
- 后续扩展和维护时应关注哪些边界与风险

## 2. 系统边界与定位

PM AI Platform 是一个前端驱动的产品需求工作台，聚焦需求管理与 AI 辅助设计流程。

- 前端：`pm-ai-app`（Vite + React）
- AI 接入：`ai-client.js`（多模型封装）
- 规范管理：`openspec/`（变更与 specs）
- 产品文档：`md/`（用户手册、PRD、分析文档）

系统当前主要依赖浏览器本地状态（含 localStorage）与外部 API（AI、Git、Meego）。

## 3. 架构分层

### 3.1 表现层（UI Layer）

- 看板与详情：`PMPlatform.jsx` 内主界面、抽屉、详情页、文档树、配置页
- 交互形态：看板拖拽、筛选联动、抽屉 Tab、文档编辑与只读视图
- 状态展示：阶段状态、评审结果、Git 提交标识、示例兜底标识

### 3.2 业务编排层（Workflow Layer）

- 需求状态流转：待评审 -> 评审中 -> AI 分析中 -> 人工确认 -> 已通过/已拒绝 -> 已提交（git commit）
- AI 工作流：AI 评审、AI 文档生成、AI 对话
- 文档工作流：PRD 与多提案（proposal/design/spec/tasks）的生成、编辑、提交

### 3.3 集成层（Integration Layer）

- AI 模型：Claude / GLM / ARK（统一 client 调用）
- Git 平台：GitHub / GitLab 提交文件并返回 commit URL
- Meego：原始需求同步与跳转链接

### 3.4 规范与治理层（Spec Layer）

- `openspec/specs`：主能力规格
- `openspec/changes`：变更提案、设计、任务与归档记录
- CLI 流程：propose -> apply -> archive

## 4. 核心模块说明

### 4.1 需求看板模块

- 负责需求卡片聚合展示、状态流转与筛选
- 提供多维筛选（空间/子系统/应用/迭代）
- 对外输出当前需求上下文给详情抽屉和详情页

### 4.2 详情抽屉模块

- 双 Tab：评审报告 / 原始需求
- 原始需求支持基础信息、Meego 链接、编辑和同步
- 无真实原始需求时，使用 PRD 摘录示例兜底（显式标识示例来源）

### 4.3 详情页与文档中心模块

- 左侧文档树：PRD + 多提案文档
- 中间文档区：Markdown 展示与编辑、原始需求只读视图
- 右侧助手区：AI Chatbot 与参考资料
- Git 提交成功后写入 `gitStatus`，并推动卡片状态到 `submitted`

### 4.4 AI 能力模块

- `callAIReview()`：需求评审评分与建议
- `callAIDoc()`：文档生成
- `handleSendMessage()`：对话式澄清
- 异常时可回退到示例数据，保证流程可演示

### 4.5 配置管理模块

- 模型配置、Git 配置、SDD 模板配置、AI Skill 配置
- 配置项主要保存在 localStorage
- 模板支持自定义 prompt 与占位符

## 5. 关键数据对象

典型需求卡片对象：

- 基础字段：`id`, `col`, `priority`, `title`, `desc`, `author`, `date`
- 评审字段：`aiResult`
- 原始需求字段：`rawRequirement`, `rawRequirementMeta`, `meegoUrl`
- 文档字段：`docs`（PRD + proposals[]）
- 对话字段：`chatHistory_*`

## 6. 关键数据流

### 6.1 AI 评审流

1. 用户触发 AI 评审
2. 前端组装需求上下文
3. 调用模型接口并接收结果
4. 更新 `aiResult` 与状态列

### 6.2 文档生成与提交流

1. 用户生成文档（PRD/Proposal/Design/Spec/Tasks）
2. 前端更新 `docs`
3. 用户提交到 Git
4. 成功后更新 `gitStatus` + `col: submitted`

### 6.3 原始需求展示流

1. 优先读取 `rawRequirement` + `rawRequirementMeta`
2. 若正文缺失，回退到 `PM_AI_Plagform_PRD` 摘录示例
3. UI 显示“示例内容（来自 PRD 摘录）”

## 7. 设计决策与权衡

- 单文件主组件：开发快、上下文集中；代价是文件较大、认知负担高
- 前端优先集成：减少后端依赖；代价是配置与状态治理需更严格
- OpenSpec 驱动：需求-设计-任务可追踪；代价是流程纪律要求更高

## 8. 扩展建议

- 代码结构：逐步把 `PMPlatform.jsx` 拆分为域模块（看板/抽屉/文档/配置）
- 数据持久化：引入后端存储卡片与配置，减少 localStorage 依赖
- 观测能力：增加关键操作埋点（评审触发、文档提交成功率、回退率）
- 质量保障：补齐最小集成测试（关键状态流与提交流）

## 9. 运维与回顾检查清单

- 每周检查 active changes 是否积压
- 每次归档前确认 delta specs 已同步
- 每次版本更新后核对用户手册与 README 是否同步
- 每月回顾 AI 调用失败率与示例回退占比

## 10. 关联文档

- 项目说明：`README.md`
- 新用户手册：`md/NEW_USER_DEMO_MANUAL.md`
- 产品 PRD：`md/PM_AI_Plagform_PRD.md`
- OpenSpec 主规范：`openspec/specs/`

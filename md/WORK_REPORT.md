# 工作汇报

> Agentic·DevOps 产研智能工作台开发工作记录

**日期**: 2026-03-08
**项目**: agentic_coding_platform
**参与者**: 达尔文 (Dawin) + Claude Code + OpenCode

---

## 本期工作总结（2026-03-08）

### 一、完成变更总览

本期（03-07 下午 ~ 03-08 晚）共完成并归档 **30+** 个 OpenSpec 变更，涵盖功能开发、Bug 修复、数据/文档完善。

按工具分类：

| 工具 | 完成变更数 |
|------|-----------|
| OpenCode | ~22 个 |
| Claude Code | 4 个 |

---

### 二、OpenCode 完成的变更

#### 新用户演示手册（新建文档）

| 文件 | 内容 |
|------|------|
| `md/NEW_USER_DEMO_MANUAL.md` | 新用户演示手册（含演示路线、现场脚本、兜底方案） |
| `md/HMTL/NEW_USER_DEMO_MANUAL_PPT.html` | 手册的 PPT 网页版 |

---

#### UI 交互改进

| 变更名称 | 描述 | Tasks |
|----------|------|-------|
| `ai-review-confirmation-dialog` | AI 评审前检测需求完整性，不足时弹出问卷补充（选择题 + 填空） | 19/19 |
| `move-new-requirement-button-to-filter-row-right` | 「新建需求」按钮移到筛选行右侧，与筛选器同排 | 9/9 |
| `add-triple-click-edit-toggle-for-proposal-spec` | Proposal / Spec 文档支持三连击进入编辑态（不用点编辑按钮） | 完成 |
| `switch-primary-ai-action-by-review-status` | 详情抽屉按评审状态切换主 AI 操作按钮（未评审显示「AI 评审」，已评审显示「AI 设计」） | 4/4 |
| `refine-primary-ai-action-priority-by-status` | 精细化主操作按钮优先级排序策略 | 完成 |
| `add-prd-example-to-clarification-drawer` | 需求澄清抽屉内嵌 PRD 填写示例，降低用户认知门槛 | 7/7 |
| `review-drawer-raw-req-tabs` | 评审抽屉新增「原始需求」标签页，查看业务方原文 | 完成 |

---

#### AI 模型与配置

| 变更名称 | 描述 | Tasks |
|----------|------|-------|
| `add-volc-ark-model-option` | 新增火山引擎 Ark 模型选项（`ArkProvider`，OpenAI 兼容格式） | 10/10 |
| `add-model-config-test-request` | AI 模型配置页「测试请求」按钮（早期版本） | 完成 |
| `proposal-review-ai-fallback` | 提案评审页 AI 调用失败兜底（示例数据） | 完成 |
| `ai-review-error-fallback-demo` | AI 评审 API 失败时提供「使用示例评审结果」入口，保障演示链路 | 15/15 |

---

#### 数据概览升级

| 变更名称 | 描述 | Tasks |
|----------|------|-------|
| `enhance-data-overview-page` | 数据概览从静态统计升级为决策驾驶舱（关键指标、趋势、漏斗、风险、下钻） | 19/19 |
| `data-overview-add-four-filters` | 数据概览新增四维业务筛选（空间、子系统、应用、迭代），与看板语义对齐 | 15/15 |

---

#### 原始需求管理

| 变更名称 | 描述 | Tasks |
|----------|------|-------|
| `add-raw-requirement-doc-in-ai-design-page` | AI 设计页文档树中展示原始需求文档（rawRequirement 字段） | 7/7 |
| `add-raw-requirement-base-info-and-meego-link` | 原始需求区块新增基础信息字段 + Meego 需求链接 | 完成 |
| `seed-raw-requirement-sample-from-pm-ai-platform-prd` | 从 PM AI Platform PRD 填充示例原始需求数据 | 完成 |

---

#### 项目配置增强

| 变更名称 | 描述 | Tasks |
|----------|------|-------|
| `add-project-config-selector-and-reorder-settings` | 配置页顶部新增项目选择器，调整 Git / AI 模型配置顺序 | 完成 |
| `support-multi-select-project-association` | 项目关联字段改为多选（空间/子系统/应用均支持多选） | 9/9 |
| `add-submitted-status-after-git-sync` | Git 同步成功后自动将需求状态更新为「已提交」 | 完成 |

---

#### Bug 修复

| 变更名称 | 描述 |
|----------|------|
| `fix-sdd-spec-template-empty` | 修复 SDD Spec 模板内容为空的问题 |

---

### 三、Claude Code 完成的变更

| 变更名称 | 描述 | Tasks |
|----------|------|-------|
| `fix-submit-proposal-button` | 修复提案评审抽屉「提交并生成提案」按钮因 AI 评审加载导致不可点击 | 2/2 |
| `settings-page-scroll-nav` | 项目配置页改为滚动式，左侧固定导航跟随滚动自动高亮 | 全部 |
| `ai-model-config-advanced` | AI 模型配置支持 Base URL / 自定义模型 / 密钥显示切换，新增自定义模型类型 | 全部 |
| `ai-model-test-connection` | AI 配置页「测试请求」按钮，使用表单当前值（未保存）直接发起最小请求 | 5/5 |

---

### 四、关键功能详解

#### 1. AI 评审前需求完整性检测（`ai-review-confirmation-dialog`）

点击「AI 智能评审」时，系统检测 `title / desc / priority / userStory / acceptanceCriteria` 是否填写完整。若不足，弹出问卷面板（选择题 + 填空），用户补充后自动写入 card，再发起评审。避免因需求信息残缺导致评审质量差。

#### 2. 数据概览驾驶舱（`enhance-data-overview-page` + `data-overview-add-four-filters`）

- **指标升级**：从"4 个基础数字"升级为包含吞吐量、周期时长、通过率、拒绝率、逾期风险、文档覆盖率的完整仪表盘
- **趋势 + 漏斗 + 风险清单**：每周趋势图、各阶段漏斗转化、高风险需求清单
- **四维筛选**：空间、子系统、应用、迭代，与看板筛选逻辑对齐
- **下钻联动**：点击数据块注入筛选条件，自动跳转看板

#### 3. 多模型支持（`add-volc-ark-model-option` + `ai-model-config-advanced`）

当前支持四种模型：

| 模型 | Provider | 默认端点 |
|------|----------|----------|
| Claude | ClaudeProvider | `/api/anthropic/v1/messages`（Vite 代理） |
| GLM-4 | GLMProvider | `https://open.bigmodel.cn/api/paas/v4/...` |
| Ark | ArkProvider | `https://ark.cn-beijing.volces.com/api/coding/v3/...` |
| 自定义 | CustomProvider | 用户配置（OpenAI 兼容） |

每种模型支持：Base URL 配置、Model Name 配置、API Key 显示/隐藏切换、配置测试（使用表单值直接 fetch）。

#### 4. 项目配置页滚动导航（`settings-page-scroll-nav`）

- 四个配置区块（AI / Git / SDD / 技能）全部渲染，绑定 ref
- `IntersectionObserver`（rootMargin: `-40% 0px -55% 0px`）自动高亮当前区块对应的左侧导航项
- 点击导航项 `scrollIntoView({ behavior: 'smooth' })` 平滑跳转

---

### 五、文件变更统计

#### 主要修改文件

| 文件 | 变更内容 |
|------|----------|
| `pm-ai-app/src/PMPlatform.jsx` | 本期迭代主文件，涉及全部 UI 变更 |
| `ai-client.js` | 新增 ArkProvider / CustomProvider，各 Provider 支持 localStorage 配置覆盖 |

#### 新增文档文件

| 文件 | 内容 |
|------|------|
| `md/NEW_USER_DEMO_MANUAL.md` | 新用户产品演示手册（20-30 分钟标准路线） |
| `md/HMTL/NEW_USER_DEMO_MANUAL_PPT.html` | 手册 PPT 网页版 |
| `md/PM_PLATFORM解读.md` | 主应用源码解读文档（本次更新至最新架构） |

---

## 历史工作记录

### 2026-03-07 完成变更（节选）

| 变更名称 | 描述 |
|----------|------|
| `add-project-settings-page` | 项目配置全屏页（AI / Git / SDD / 技能四区块） |
| `add-import-requirement-drawer` | 看板导入需求抽屉 |
| `prd-proposal-workflow` | PRD → 多提案工作流（docs.proposals 数组结构） |
| `doc-tree-proposal-folders` | 文档树支持多提案文件夹 |
| `kanban-multi-select-filter` | 看板空间 + 迭代多选过滤器 |
| `ai-skill-management` | AI 技能管理区块 |
| `fix-anthropic-cors-proxy` | Vite 代理解决 Anthropic CORS 问题 |
| `reference-panel-doc-links` | 参考面板文档链接 |
| `proposal-git-status` | 提案 Git 同步状态展示 |
| `always-show-proposal-folder` | 文档树始终显示提案文件夹（含未生成文档的） |
| `card-filter-click` | 卡片标签点击直接触发筛选 |
| `enhance-data-overview-page` | 数据概览升级（后续在 03-08 被进一步增强） |
| `ai-review-confirmation-dialog` | AI 评审前需求完整性问卷（在 03-07 session 创建并归档） |
| `move-new-requirement-button-to-filter-row-right` | 新建按钮移至筛选行右侧 |

### 2026-03-06 完成变更

| 变更名称 | 描述 |
|----------|------|
| `add-zhipu-glm-model` | 智谱 GLM-4 模型支持 |
| `add-settings-dropdown-to-kanban` | 看板设置下拉菜单 |
| `kanban-multi-select-filter` | 看板多选筛选器（提案） |
| `add-sample-data-to-sdd2` | SDD2 示例数据 |
| `rename-product-to-agentic-devops` | 品牌升级：PM·AI → Agentic·DevOps |
| `sdd-add-spec-page-example` | SDD Spec 页面示例 |

---

## 技术栈

- **前端框架**: React 19 + Vite
- **AI 集成**: Claude (Anthropic) / GLM-4 (智谱) / Ark (火山引擎) / 自定义 OpenAI 兼容
- **变更管理**: OpenSpec（spec-driven 工作流）
- **AI 编码工具**: Claude Code + OpenCode（双工具并行）

---

*汇报更新时间: 2026-03-08*

# Agentic·DevOps 面向技术团队需求文档（Tech PRD）

## 1. 文档信息

- 文档版本：v1.1（2026-03-10）
- 产品范围：需求看板、AI 评审、AI 设计文档中心、配置与集成
- 代码基线：`pm-ai-app/src/PMPlatform.jsx`
- 规格基线：`openspec/specs/`

---

## 2. 背景与目标

### 2.1 背景

需求澄清、评审、文档生成与交付在传统工具链中割裂，导致上下文重复传递、质量波动与协作摩擦。

### 2.2 目标

- 建立端到端需求闭环：看板推进 -> AI 评审 -> 澄清补全 -> 文档生成 -> Git 提交。
- 提升过程可追溯性：关键问答、生成上下文与失败路径可回看。
- 提升演示与日常使用稳定性：失败可兜底，状态可见，操作路径更短。

### 2.3 非目标

- 本期不建设完整后端持久化与权限体系。
- 本期不实现复杂多方协同编辑（实时协同、评论工作流）。

---

## 3. 用户与场景

- 产品经理：评审需求、补充澄清、生成文档、推进状态。
- 研发负责人：查看风险与文档完整度，评估可执行性。
- 研发工程师：消费 Spec/Tasks 并追踪提交状态。
- 售前/演示角色：展示可追溯 AI 流程与稳定兜底链路。

核心场景：

- 看板进入 AI 评审，补齐缺失字段后给出结构化评分。
- PRD/SPEC 生成前执行澄清问答，并将摘要写入 Chatbot 历史。
- 在 AI 设计页完成文档生成、编辑、提交。
- 在 Chatbot 中进行 Markdown 预览、追问、查看思考轨迹。

---

## 4. 功能范围

## 4.1 In Scope

- 看板管理：状态流转、筛选、新建、导入。
- AI 评审：完整性检测、补充弹框、评审结果落盘、失败兜底。
- 文档中心：PRD + 多提案文档树（proposal/design/spec/tasks）及编辑能力。
- 澄清流程：PRD/SPEC 生成前问答、Q/A 摘要入 Chatbot、摘要参与生成上下文。
- Chatbot：乐观发送、Markdown 预览、thinking trace、失败示例兜底与重试。
- 页面效率：顶部模型快捷切换、三栏拖拽改宽与布局持久化、文档树分组。

## 4.2 Out of Scope

- Meego 双向同步完整链路。
- 提案评审版本历史/批注/分屏对比全套能力。
- 提案包级提交与 PR/MR 自动创建。

---

## 5. 关键流程（技术口径）

### 5.1 评审流程

1. 用户触发 AI 评审。
2. 校验需求字段完整性（title/desc/priority/userStory/acceptanceCriteria）。
3. 缺失则弹确认问卷；提交成功后可写澄清摘要。
4. 发起 AI 评审并写入 `aiResult`；失败则进入示例兜底。

### 5.2 PRD/SPEC 生成流程

1. 用户点击生成文档。
2. 执行澄清检测，不足时弹 `PrdClarificationDialog`。
3. 提交问答后生成 Q/A 摘要，写入 `chatHistory_{model}`。
4. 将摘要拼接到 prompt，再调用文档生成。

### 5.3 Chatbot 发送流程

1. 本地先写入用户消息与思考占位（乐观更新）。
2. 异步调用 AI 并按消息 ID 原位回填。
3. 失败时写入 fallback 消息并展示重试入口。
4. 支持思考轨迹折叠/展开查看。

---

## 6. 数据模型与状态约束

### 6.1 核心对象

- 卡片字段：`id/col/priority/title/desc/userStory/acceptanceCriteria/aiResult/docs`
- 文档结构：`docs.prd` + `docs.proposals[]`（proposal/design/spec/tasks/gitStatus）
- 会话结构：`chatHistory_claude/chatHistory_glm/chatHistory_ark/chatHistory_custom`

### 6.2 关键约束

- AI 请求中禁止重复触发同类动作。
- 必填校验失败不落澄清摘要。
- 消息状态需可区分 `pending/done/failed/fallback`。
- 三栏宽度需经过 min/max clamp，防止布局不可用。

---

## 7. 非功能需求

- 可用性：关键路径必须有失败可恢复方案（重试/兜底/人工编辑）。
- 性能：请求中按钮禁用并有可见反馈；渲染降级策略可用。
- 安全：API Key 本地存储，避免提交到仓库；错误分级输出。
- 可维护性：新能力优先以 OpenSpec 小步变更落地。

---

## 8. 验收标准（当前版本）

- 至少一个模型完成“评审 -> 澄清 -> 生成 -> 提交”全链路演示。
- 澄清问答可在 Chatbot 中可见并可追溯。
- Chatbot Markdown 预览与消息渲染一致。
- Chatbot 失败时会话内可见 fallback，且支持重试。
- 三栏拖拽与重进页面宽度恢复可用。

---

## 9. 下一步技术任务建议

1. 提案包级 Git 提交（聚合 proposal/design/spec/tasks）。
2. 澄清摘要到字段的自动映射（结构化回填）。
3. 文档版本快照 + 基础 diff。
4. Meego 最小可用同步（先拉取后回写）。

---

*Tech PRD 版本: v1.1*

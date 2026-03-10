## Context

当前 PRD SPEC 生成入口在 `DocEditor` 中，点击「AI 生成」按钮后直接调用 `callAIDoc(card, 'prd')`，以 `card.rawRequirement || card.desc` 作为输入。已有 `ai-review-confirmation-dialog` 实现了评审前的需求完整性问卷（检测 title/desc/priority 等字段），但 PRD 生成场景不同——问题是「内容语义」上的缺口（用户群体不明、业务规则未给、边界未定义），而非字段是否为空。

图片参考（OpenCode 工具「询问用户」UI）：卡片式弹框，每个问题独占一行，chip 按钮展示选项，已选绿色高亮，最后一行「提交回答」按钮。

## Goals / Non-Goals

**Goals**
- 在 PRD 生成前对原始需求做语义缺口分析，仅在真正需要时触发弹框
- 问卷 UI 与 OpenCode 「询问用户」风格一致（chip 选择 + 填空）
- 问答结果追加到 Chatbot 历史，并作为生成 prompt 上下文
- 支持「跳过」，若用户不想回答，直接生成

**Non-Goals**
- 不对 proposal/design/spec/tasks 等其他文档类型触发（本期只覆盖 PRD/prd）
- 不持久化问卷配置（问题由 AI 动态生成，非固定模板）
- 不改变 Chatbot 的主动提问行为

## Decisions

**D1：两阶段触发（快速检测 + AI 生成问题）**

点击「AI 生成」后：
1. 先做本地快速检测（rawRequirement 长度 < 50 字符 / 没有用户相关词汇 / Skill 中有明确格式要求未满足），若通过则直接生成
2. 未通过则调用一次轻量 AI 请求（max_tokens: 200），返回 JSON 格式问题列表（题型 + 选项 / 填空）
3. 弹出 `PrdClarificationDialog` 展示问题
4. 用户提交 → 关闭弹框 → 结果追加 chatHistory → 携带结果调用 `callAIDoc`

**D2：问题数据结构**

```javascript
{
  questions: [
    { id: 'q1', type: 'choice', text: '该功能主要面向哪类用户？', options: ['C 端消费者', 'B 端运营', '内部员工', '其他...'], multi: false },
    { id: 'q2', type: 'choice', text: '核心场景是？', options: ['首次注册', '日常使用', '问题处理', '其他...'], multi: true },
    { id: 'q3', type: 'text', text: '请补充关键业务规则或阈值（可选）', placeholder: '例如：超时时间为 30 秒' }
  ]
}
```

**D3：UI 组件 `PrdClarificationDialog`**

- `position: fixed` 居中覆盖层，白色卡片，圆角 12px，最大宽 520px
- 每题一个区块：灰色小标题 + chip 行（选中绿色 `C.success` 背景） 或 `<textarea>`
- 底部：「跳过，直接生成」（次要按钮）+ 「提交回答」（主按钮，至少有一个答案才可点）
- 关闭后触发生成，弹框中不展示生成进度

**D4：Chatbot 注入格式**

```
【AI 澄清问答摘要】
- 目标用户：C 端消费者
- 核心场景：首次注册、日常使用
- 补充规则：超时时间为 30 秒
```
以 `role: 'assistant'` 追加到 `chatHistory`，标注为系统摘要而非用户输入。

**D5：PRD 生成 prompt 扩展**

在现有 `DOC_PROMPTS.prd(card)` 末尾增加：
```
${clarificationSummary ? `\n\n用户已提供以下澄清信息，请优先参考：\n${clarificationSummary}` : ''}
```

## Risks / Trade-offs

- [轻量 AI 调用额外消耗] → max_tokens: 200，成本极低；本地快速检测可减少触发频率
- [问题质量依赖 AI] → 提供 fallback：若 AI 返回解析失败，展示 3 个通用问题（用户群体/核心场景/关键规则）
- [弹框打断生成节奏] → 提供「跳过」按钮，用户有自主权

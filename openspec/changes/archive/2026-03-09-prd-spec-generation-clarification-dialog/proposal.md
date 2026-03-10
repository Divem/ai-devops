## Why

当产品经理在 AI 设计页点击「生成产品需求 SPEC」时，AI 会直接基于卡片的已有字段（title/desc/rawRequirement）生成内容。但业务方提交的原始需求往往措辞模糊、缺少关键信息（用户群体、业务规则、边界条件），或者不符合当前 AI Skill 对输入的格式期望，导致生成质量不稳定、产出物需要大量人工补丁。

参考 OpenCode 工具中「询问用户」弹框交互（选择题 + 填空题 + 提交回答），在 PRD SPEC 生成前加入一个结构化的澄清对话步骤，让 AI 自动判断需求描述中的缺口，并以可交互的 UI 弹框向产品经理收集补充信息，选答完成后将问答结果显示到 Chatbot 面板，再触发生成。

## What Changes

- **新增 `PRD Spec 澄清对话框`**：在 AI 设计页「生成产品需求 SPEC」按钮点击后，若检测到原始需求缺少关键信息（或不符合 Skill 规范），不立即生成，而是先弹出结构化问卷 Dialog
- **问卷渲染**：AI 分析缺口并生成若干澄清问题，每题以选择题（单/多选 chip）或填空题（文本输入框）形式渲染，参考图片样式（卡片式弹框，绿色高亮已选项，「提交回答」按钮）
- **结果注入 Chatbot**：用户提交回答后，问答摘要以结构化文本消息的形式追加到 Chatbot 历史记录（`chatHistory`），作为生成上下文
- **携带澄清上下文生成**：生成 PRD Spec 时，将问答摘要拼入 prompt，提升生成质量
- **直接通过选项**：若需求信息充分，直接跳过弹框，立即生成

## Capabilities

### New Capabilities

- `prd-spec-clarification-dialog`: PRD SPEC 生成前的结构化澄清对话框——AI 分析需求缺口，弹出选择题/填空题问卷，结果注入 Chatbot 并作为生成上下文

### Modified Capabilities

- `clarification-drawer-prd-example`: 澄清流程现与弹框对话联动，弹框回答结果会显示在 Chatbot 中

## Impact

- `pm-ai-app/src/PMPlatform.jsx`
  - `DocEditor` 或 PRD 生成入口：生成按钮点击后的处理逻辑（新增澄清检测 + 弹框触发）
  - 新增 `PrdClarificationDialog` 组件（问卷 UI）
  - `ChatbotPanel`：接收问答摘要追加到 `chatHistory`
  - PRD 生成 prompt 拼接：加入问答摘要

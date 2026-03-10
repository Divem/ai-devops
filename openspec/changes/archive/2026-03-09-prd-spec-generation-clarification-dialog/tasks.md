## 1. 需求完整性检测

- [x] 1.1 在 PRD 生成入口（`DocEditor` 中 docType === 'prd' 的 AI 生成按钮点击处理）新增 `shouldTriggerClarification(card)` 函数，判断条件：`rawRequirement` 长度 < 50 字符，或不含用户相关词汇（"用户"/"用例"/"场景"/"谁"），返回 boolean
- [x] 1.2 若 `shouldTriggerClarification` 返回 false，直接走现有生成流程（不改变现有路径）

## 2. AI 问题生成

- [x] 2.1 新增 `generateClarificationQuestions(card)` 异步函数：POST AI 接口（max_tokens: 300），prompt 为「分析以下需求描述，列出 3-5 个需要产品经理补充的关键问题，每题说明题型（choice/text）和选项，严格返回 JSON」
- [x] 2.2 解析 AI 返回的 JSON，失败或格式异常时返回 3 个通用兜底问题（目标用户/核心场景/补充说明）

## 3. PrdClarificationDialog 组件

- [x] 3.1 新增 `PrdClarificationDialog` 组件，props：`questions[]`、`onSubmit(answers)`、`onSkip()`、`onClose()`
- [x] 3.2 布局：`position: fixed` 全屏遮罩 + 居中白色卡片（maxWidth: 520px，borderRadius: 12px，padding: 24px）
- [x] 3.3 标题区：「📋 补充需求信息」标题 + 副标题「AI 发现以下信息需要确认，选答后将用于生成更准确的 PRD」
- [x] 3.4 选择题渲染：每题灰色小标题 + chip 行，chip 样式：未选灰色边框，已选 `C.success` 背景 + 白色文字；`multi: true` 支持多选
- [x] 3.5 填空题渲染：小标题 + `<textarea>`（minHeight: 60px，placeholder 示例文本）
- [x] 3.6 底部操作行：「跳过，直接生成」次要按钮 + 「提交回答」主按钮，主按钮 disabled 条件：所有题均无答案

## 4. 流程串联

- [x] 4.1 在 PRD 生成按钮 handler 中：若 `shouldTriggerClarification` 为 true → `setLoadingClarificationQuestions(true)` → 调用 `generateClarificationQuestions` → `setClarificationQuestions(questions)` → `setShowClarificationDialog(true)`
- [x] 4.2 `onSubmit(answers)` handler：关闭 Dialog → 生成问答摘要文本 → 追加到 `chatHistory`（`role: 'assistant'`，内容为「【AI 澄清问答摘要】\n- 问题: 答案\n...」） → 携带摘要调用 `callAIDoc(card, 'prd', clarificationSummary)`
- [x] 4.3 `onSkip()` handler：关闭 Dialog → 直接调用 `callAIDoc(card, 'prd')`（不携带摘要）
- [x] 4.4 扩展 `DOC_PROMPTS.prd(card, clarificationSummary?)` 支持可选的澄清摘要参数，在 prompt 末尾拼接

## 5. 状态管理

- [x] 5.1 在相关组件（`DocEditor` 或父组件）新增 state：`showClarificationDialog`（boolean）、`clarificationQuestions`（数组）、`loadingClarificationQuestions`（boolean）
- [x] 5.2 生成问题期间，PRD 生成按钮显示 loading 状态「分析中…」，避免重复点击

构建记录：在 `pm-ai-app` 执行 `npm run build` 构建通过；存在历史重复键告警（`proposal`、`border`），与本次澄清弹框实现无直接关系。

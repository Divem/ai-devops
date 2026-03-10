## ADDED Requirements

### Requirement: PRD SPEC 生成前结构化澄清对话框

在 AI 设计页触发「生成产品需求 SPEC」时，系统 SHALL 先检测原始需求的语义完整性，若不足则弹出结构化问卷 Dialog，收集补充信息后再生成。

#### Scenario: 需求信息充分时直接生成

- **WHEN** 用户点击「AI 生成」且原始需求通过本地快速检测（长度 ≥ 50 字符且含用户相关描述）
- **THEN** 系统 SHALL 跳过弹框，直接调用 PRD 生成

#### Scenario: 需求信息不足时弹出问卷

- **WHEN** 用户点击「AI 生成」且原始需求未通过完整性检测
- **THEN** 系统 SHALL 调用 AI 生成问题列表（≤ 5 题），并弹出 `PrdClarificationDialog` 展示问卷

#### Scenario: 问卷包含选择题

- **WHEN** Dialog 展示选择类问题
- **THEN** 页面 SHALL 以 chip 按钮形式渲染选项，支持单选或多选，已选项 SHALL 以绿色高亮区分

#### Scenario: 问卷包含填空题

- **WHEN** Dialog 展示文本输入类问题
- **THEN** 页面 SHALL 渲染 textarea 输入框，并显示 placeholder 示例文本

#### Scenario: 提交回答触发生成

- **WHEN** 用户完成回答（至少一题有答案）并点击「提交回答」
- **THEN** 系统 SHALL：
  1. 关闭 Dialog
  2. 将问答摘要以 assistant 消息形式追加到 chatHistory
  3. 携带问答摘要调用 PRD 生成（注入 prompt 末尾）

#### Scenario: 跳过澄清直接生成

- **WHEN** 用户点击「跳过，直接生成」
- **THEN** 系统 SHALL 关闭 Dialog 并不带澄清上下文直接调用 PRD 生成

#### Scenario: AI 问题生成失败时使用默认问题

- **WHEN** AI 生成问题列表请求失败或返回格式错误
- **THEN** 系统 SHALL 展示 3 个通用兜底问题：目标用户群体（选择题）/ 核心使用场景（多选题）/ 补充说明（填空题）

#### Scenario: 问答摘要显示在 Chatbot

- **WHEN** 用户提交回答后
- **THEN** Chatbot 面板 SHALL 显示一条「【AI 澄清问答摘要】」格式的消息，包含所有问题与对应答案

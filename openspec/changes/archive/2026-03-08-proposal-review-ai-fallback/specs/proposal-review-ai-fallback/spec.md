## ADDED Requirements

### Requirement: 提案评审抽屉 AI 失败时自动注入示例评审结果
当 `handleOpenProposalReview` 调用 `callAIReview` 失败时，系统 SHALL 自动将 `DEMO_AI_REVIEW_RESULT` 注入评审结果状态，抽屉正常渲染评分与建议，演示流程不中断。

#### Scenario: AI 评审请求失败时展示示例结果
- **WHEN** 用户点击「生成提案」后 `callAIReview` 抛出异常（网络错误、余额不足、限流等）
- **THEN** 系统 SHALL 将 `DEMO_AI_REVIEW_RESULT` 写入 `proposalReviewResult` 状态
- **THEN** `ProposalReviewDrawer` SHALL 正常渲染评分卡、风险列表与建议列表
- **THEN** 系统 SHALL 显示 toast 提示"AI 不可用，已使用示例评审结果"

#### Scenario: AI 评审请求成功时不使用兜底数据
- **WHEN** `callAIReview` 成功返回真实结果
- **THEN** 系统 SHALL 使用真实结果渲染，不注入示例数据

### Requirement: 提案文档串行生成时单步兜底不中断循环
当 `handleGenerateProposalDocs` 串行执行中任一步骤 `callAIDoc` 失败时，系统 SHALL 使用 `FALLBACK_DOCS[step]` 填充当步内容并继续下一步，直至 4 步全部完成。

#### Scenario: 单步 AI 生成失败时使用示例内容继续
- **WHEN** 提案文档生成循环中某步（proposal/design/spec/tasks）调用 `callAIDoc` 抛出异常
- **THEN** 系统 SHALL 将 `FALLBACK_DOCS[step]` 写入对应提案字段
- **THEN** 系统 SHALL 继续执行下一步，不终止循环
- **THEN** 系统 SHALL 显示 toast 提示"AI 不可用，已使用示例内容继续生成"

#### Scenario: 所有步骤完成后抽屉正常关闭
- **WHEN** 4 个生成步骤（包含兜底）全部完成
- **THEN** 系统 SHALL 关闭 `ProposalReviewDrawer`
- **THEN** 文档树 SHALL 显示新提案文件夹及其 4 个子文档

### Requirement: 兜底流程不引入二次崩溃
catch 块内的兜底逻辑 SHALL 使用已定义常量（`DEMO_AI_REVIEW_RESULT`、`FALLBACK_DOCS`），不得引用未定义变量导致 `ReferenceError`。

#### Scenario: catch 块内使用正确常量名
- **WHEN** AI 请求抛出异常进入 catch 块
- **THEN** 系统 SHALL 调用 `setProposalReviewResult(DEMO_AI_REVIEW_RESULT)` 而非其他未定义常量
- **THEN** 系统 SHALL 不抛出二次异常

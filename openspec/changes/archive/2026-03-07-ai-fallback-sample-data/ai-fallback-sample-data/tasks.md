## 1. 修改提案串行生成（handleGenerateProposalDocs）

- [x] 1.1 找到 `handleGenerateProposalDocs` 中的 `for (const step of PROPOSAL_GEN_STEPS)` 循环
- [x] 1.2 将 catch 块改为：`console.error(e); const fallback = FALLBACK_DOCS[step] || ''; currentDocs = { ...currentDocs, proposals: currentDocs.proposals.map(p => p.id === targetProposalId ? { ...p, [step]: fallback } : p) }; onUpdateDocs(selCard.id, currentDocs); notify("AI 不可用，已使用示例内容继续生成");`
- [x] 1.3 移除 catch 块中的 `setProposalGenerateError(...)` 和 `return`（不再中断循环）
- [x] 1.4 验证：API 失败时提案文件夹仍能生成并展开，四个子文档均有兜底内容

## 2. 修改单文档生成（handleGenerate）

- [x] 2.1 找到 DetailPage 中两处 `handleGenerate` 函数（约 2356 行和 3718 行）
- [x] 2.2 将每处 catch 块改为：`console.error(e); const fallback = FALLBACK_DOCS[selDocType]; if (fallback) { const newDocs = updateDocContent(selCard.docs, selDocType, selProposalId, fallback); onUpdateDocs(selCard.id, newDocs); } setDocError(null);`
- [x] 2.3 验证：单文档生成失败后，文档区域自动显示兜底内容，无错误提示

## 3. 修改 AI 评审自动兜底

- [x] 3.1 找到 `handleOpenProposalReview` 的 catch 块
- [x] 3.2 将 catch 块改为：`console.error(e); setProposalReviewResult(DEMO_REVIEW_RESULT); notify("AI 不可用，已使用示例评审结果");`（移除 `setProposalReviewError(...)`）
- [x] 3.3 找到 `handleRetryReview` 的 catch 块，做同样修改
- [x] 3.4 验证：评审失败后评审结果区域正常显示，可继续点击"提交并生成提案"

## 4. 清理手动兜底 UI

- [x] 4.1 删除 `docError` 相关的"查看示例内容"按钮 UI（约 3140-3150 行附近）
- [x] 4.2 删除 `docError` state 的声明（`const [docError, setDocError] = useState(null)`）及所有引用
- [x] 4.3 删除"🧪 使用示例评审结果"按钮 UI（约 2308 行附近）及相关 `proposalReviewError` 显示逻辑
- [x] 4.4 验证：页面无遗留的手动兜底按钮，无 lint 错误

## 1. 提交后持久化 gitStatus

- [x] 1.1 在 `DetailPage` 中找到 git 提交成功的回调处，获取 `results = [{ path, url }]`
- [x] 1.2 解析每个 result.path，提取 proposalId（`proposals/${proposalId}/${docType}.md`）和 docType
- [x] 1.3 构建 gitStatus patch：遍历 `card.docs.proposals`，找到对应 proposalId，合并 `{ [docType]: url, committedAt: new Date().toISOString() }`
- [x] 1.4 调用 `updateCard(card.id, { docs: { ...card.docs, proposals: updatedProposals } })` 持久化（通过 onCommitSuccess → handleCommitSuccess → onUpdateDocs）

## 2. DocTreeSidebar ProposalFolder git 状态徽标

- [x] 2.1 `ProposalFolder` 接收 `proposal.gitStatus` 数据（已在 proposal 对象中，无需额外传参）
- [x] 2.2 计算 `committedCount`：`PROPOSAL_DOC_TYPES.filter(dt => proposal[dt.key] && proposal.gitStatus?.[dt.key]).length`
- [x] 2.3 计算 `allCommitted`：committedCount === completedDocs（有内容的文档全部提交）
- [x] 2.4 ProposalFolder 右侧徽标：`allCommitted` → 绿色 `✓ Git` 徽标；`committedCount > 0` → 绿色 `n/m` 徽标；否则保留原有数量徽标

## 3. TreeItem 文档级 git 状态

- [x] 3.1 `TreeItem` 新增可选 prop `isCommitted: bool`
- [x] 3.2 已提交（`isCommitted=true`）：右侧显示绿色 `✓` 替换原绿点
- [x] 3.3 有文档未提交（`hasDoc=true, isCommitted=false`）：保留原绿点
- [x] 3.4 `ProposalFolder` 渲染 `TreeItem` 时，传入 `isCommitted={!!proposal.gitStatus?.[dt.key]}`

## 4. DocEditor git 状态提示行

- [x] 4.1 `DocEditor` 新增 `onCommitSuccess` 和 `gitStatusUrl` props
- [x] 4.2 获取当前 docType 的 git URL 并从 DetailPage 传入 `gitStatusUrl`
- [x] 4.3 若 URL 存在且无临时 commitResult，渲染状态行：`✓ 已提交到 Git` + `查看 Commit →` 链接

## 5. 验证

- [x] 5.1 提交 git 后刷新页面，DocTreeSidebar 仍显示 git 状态（localStorage 持久化）
- [x] 5.2 ProposalFolder 展示正确的 committed/total 计数
- [x] 5.3 已提交子文档显示绿色 ✓，未提交有内容显示绿点
- [x] 5.4 点击 DocEditor 的"查看 Commit →"链接正常跳转
- [x] 5.5 无 git 配置或未提交时，界面无异常显示

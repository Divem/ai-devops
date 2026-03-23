## MODIFIED Requirements

### Requirement: 提案 gitStatus 数据持久化
系统 SHALL 在提案文档成功提交 Git 后，将各文档在各目标仓库的提交结果持久化到提案的 `gitStatus` 字段中，并通过 `updateCard` 写入 card state。提交完成后，若至少一个目标仓库成功，系统 SHALL 将卡片状态更新为 `submitted`。

#### Scenario: 提交成功后记录多仓库 gitStatus
- **WHEN** 用户触发"提交到 Git"操作且某文档在多个目标仓库提交
- **THEN** 对应提案的 `gitStatus` 中，按 `docType -> profileId -> result` 记录提交结果，并写入 `committedAt` 时间戳
- **THEN** 若存在至少一个 `ok=true` 的仓库结果，当前需求卡片状态 SHALL 更新为 `submitted`

#### Scenario: 部分仓库提交成功
- **WHEN** 同一文档在多个目标仓库提交时只有部分仓库成功
- **THEN** `gitStatus` 同时保留成功仓库 URL 与失败仓库错误信息，用于后续重试与展示

### Requirement: DocTreeSidebar 提案 Git 状态标识
`DocTreeSidebar` 中的提案文件夹 SHALL 展示该提案的 Git 提交聚合状态，区分全部成功、部分成功、未成功三种状态。

#### Scenario: 全部目标仓库均提交成功
- **WHEN** 提案中所有有内容文档在所有目标仓库均成功提交
- **THEN** ProposalFolder 显示绿色 ✓ 徽标

#### Scenario: 仅部分目标仓库成功
- **WHEN** 提案存在文档提交成功与失败并存
- **THEN** ProposalFolder 显示"成功仓库数/目标仓库数"或等价部分成功标识

### Requirement: TreeItem 文档级 Git 状态标识
文档树中各子文档条目 SHALL 区分「至少一个仓库已提交成功」和「有内容但无成功提交」两种状态。

#### Scenario: 文档至少一个仓库已提交成功
- **WHEN** 文档条目对应的 `gitStatus[docType]` 中存在任一 `ok=true` 结果
- **THEN** 该条目右侧显示绿色 ✓

#### Scenario: 文档有内容但无成功提交
- **WHEN** 文档内容存在，但 `gitStatus[docType]` 不存在成功结果
- **THEN** 该条目右侧显示小绿点（原有行为不变）

### Requirement: DocEditor Git 状态提示
DocEditor 文档区顶部 SHALL 在当前文档存在提交记录时，展示多仓库提交状态摘要和可点击的仓库提交链接。

#### Scenario: 当前文档存在多仓库提交记录
- **WHEN** 用户查看一个已有多仓库 `gitStatus` 的文档
- **THEN** 文档内容区顶部显示聚合状态（如"2/3 仓库已提交"）并提供成功仓库的"查看 Commit →"链接

#### Scenario: 当前文档无提交记录
- **WHEN** 文档无 `gitStatus` 记录
- **THEN** 不显示 git 状态行，保持现有布局

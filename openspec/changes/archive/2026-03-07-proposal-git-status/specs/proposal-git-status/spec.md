## ADDED Requirements

### Requirement: 提案 gitStatus 数据持久化
系统 SHALL 在提案文档成功提交 Git 后，将各文档的 commit URL 持久化到提案的 `gitStatus` 字段中，并通过 `updateCard` 写入 card state。

#### Scenario: 提交成功后记录 gitStatus
- **WHEN** 用户触发"提交到 Git"操作且提交成功
- **THEN** 对应提案的 `gitStatus` 中，已提交文档的 key 值更新为 commit URL，`committedAt` 更新为当前时间戳

#### Scenario: 部分文档提交
- **WHEN** 提案中只有 proposal 和 design 有内容并提交
- **THEN** `gitStatus.proposal` 和 `gitStatus.design` 有 URL，`gitStatus.spec` 和 `gitStatus.tasks` 为 null

### Requirement: DocTreeSidebar 提案 Git 状态标识
`DocTreeSidebar` 中的提案文件夹 SHALL 展示该提案的 Git 提交状态，区分全部已提交、部分已提交、未提交三种状态。

#### Scenario: 全部文档已提交
- **WHEN** 提案的所有有内容的文档均有 gitStatus URL
- **THEN** ProposalFolder 显示绿色 ✓ 徽标

#### Scenario: 部分文档已提交
- **WHEN** 提案有部分文档提交、部分未提交
- **THEN** ProposalFolder 显示已提交数量（如 "2/4"）的灰色徽标

### Requirement: TreeItem 文档级 Git 状态标识
文档树中各子文档条目 SHALL 区分「已提交」和「有内容但未提交」两种状态。

#### Scenario: 文档已提交到 Git
- **WHEN** 文档条目对应的 `gitStatus[docType]` 有 URL
- **THEN** 该条目右侧显示绿色 ✓（替换原绿点）

#### Scenario: 文档有内容但未提交
- **WHEN** 文档内容存在，但 `gitStatus[docType]` 为 null 或不存在
- **THEN** 该条目右侧显示小绿点（原有行为不变）

### Requirement: DocEditor Git 状态提示
DocEditor 文档区顶部 SHALL 在当前文档已提交 Git 时，展示提交状态和 commit 链接。

#### Scenario: 当前文档已提交
- **WHEN** 用户查看一个已有 gitStatus URL 的文档
- **THEN** 文档内容区顶部显示"✓ 已提交到 Git"及可点击的"查看 Commit →"链接

#### Scenario: 当前文档未提交
- **WHEN** 文档无 gitStatus URL
- **THEN** 不显示 git 状态行，保持现有布局

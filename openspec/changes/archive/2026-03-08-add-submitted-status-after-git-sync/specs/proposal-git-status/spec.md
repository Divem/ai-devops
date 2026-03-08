## MODIFIED Requirements

### Requirement: 提案 gitStatus 数据持久化
系统 SHALL 在提案文档成功提交 Git 后，将各文档的 commit URL 持久化到提案的 `gitStatus` 字段中，并通过 `updateCard` 写入 card state。提交成功后，系统 SHALL 同步将卡片状态更新为 `submitted`。

#### Scenario: 提交成功后记录 gitStatus
- **WHEN** 用户触发"提交到 Git"操作且提交成功
- **THEN** 对应提案的 `gitStatus` 中，已提交文档的 key 值更新为 commit URL，`committedAt` 更新为当前时间戳
- **THEN** 当前需求卡片状态 SHALL 更新为 `submitted`

#### Scenario: 部分文档提交
- **WHEN** 提案中只有 proposal 和 design 有内容并提交
- **THEN** `gitStatus.proposal` 和 `gitStatus.design` 有 URL，`gitStatus.spec` 和 `gitStatus.tasks` 为 null

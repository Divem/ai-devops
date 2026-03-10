## MODIFIED Requirements

### Requirement: 文档自动提交到 Git 仓库
系统 SHALL 在需求卡片的文档生成完成后，提供"提交到仓库"操作，将 PRD 和/或各 OpenSpec 提案文档以 Markdown 文件形式写入配置的一个或多个目标 Git 仓库。提交路径规则为：
```
docs/requirements/{req-id}/prd.md
docs/requirements/{req-id}/proposals/{proposal-id}/proposal.md
docs/requirements/{req-id}/proposals/{proposal-id}/design.md
docs/requirements/{req-id}/proposals/{proposal-id}/spec.md
docs/requirements/{req-id}/proposals/{proposal-id}/tasks.md
```

#### Scenario: 有有效目标仓库时并行提交文档
- **WHEN** 用户在详情页点击"提交到仓库"按钮，且系统已解析到一个或多个有效目标仓库
- **THEN** 系统并行调用对应 Git 平台 REST API，将当前卡片目标文档写入各目标仓库，并返回逐仓库提交结果（成功或失败）

#### Scenario: 无可用目标仓库时提示引导
- **WHEN** 用户点击"提交到仓库"但未解析到可用目标仓库
- **THEN** 系统显示提示"请先在项目配置页面完善 Git 仓库信息与应用绑定"，并提供跳转入口

#### Scenario: 提交冲突处理（文件已存在）
- **WHEN** 任一目标仓库的目标路径已存在同名文件
- **THEN** 系统先 GET 文件获取 SHA，再以更新模式（PUT with sha）覆盖写入，commit message 标注为"update"

#### Scenario: 部分仓库提交失败
- **WHEN** 多仓库提交过程中部分仓库 API 调用返回错误（如 401 未授权、404 仓库不存在）
- **THEN** 系统保留其它仓库提交结果并展示失败仓库及具体错误信息，不中断应用

### Requirement: 支持 GitHub 和 GitLab 平台
系统 SHALL 支持 GitHub（github.com）和 GitLab（gitlab.com 及自建实例）两种 Git 平台，通过各自的 REST API 实现文件写入，并可在多仓库并行提交中混合使用。

#### Scenario: GitHub 平台文件写入
- **WHEN** 目标仓库 profile 的 `platform` 为 "github"，执行文档提交
- **THEN** 系统使用 GitHub Contents API (`PUT /repos/{owner}/{repo}/contents/{path}`) 写入文件

#### Scenario: GitLab 平台文件写入
- **WHEN** 目标仓库 profile 的 `platform` 为 "gitlab"，执行文档提交
- **THEN** 系统使用 GitLab Repository Files API (`PUT /projects/{id}/repository/files/{file_path}`) 写入文件

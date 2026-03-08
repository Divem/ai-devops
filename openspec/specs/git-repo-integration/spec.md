## ADDED Requirements

### Requirement: 文档自动提交到 Git 仓库
系统 SHALL 在需求卡片的文档生成完成后，提供"提交到仓库"操作，将 PRD 和/或各 OpenSpec 提案文档以 Markdown 文件形式写入配置的 Git 仓库。提交路径规则为：
```
docs/requirements/{req-id}/prd.md
docs/requirements/{req-id}/proposals/{proposal-id}/proposal.md
docs/requirements/{req-id}/proposals/{proposal-id}/design.md
docs/requirements/{req-id}/proposals/{proposal-id}/spec.md
docs/requirements/{req-id}/proposals/{proposal-id}/tasks.md
```

#### Scenario: 有 Git 配置时提交文档
- **WHEN** 用户在详情页点击"提交到仓库"按钮，且 projectConfig.git 已完整配置
- **THEN** 系统调用对应 Git 平台 REST API，将当前卡片所有已生成文档写入仓库，并显示提交成功提示（含 commit URL）

#### Scenario: 无 Git 配置时提示引导
- **WHEN** 用户点击"提交到仓库"但 projectConfig.git 未配置或不完整
- **THEN** 系统显示提示"请先在项目配置页面完善 Git 仓库信息"，并提供跳转入口

#### Scenario: 提交冲突处理（文件已存在）
- **WHEN** 仓库目标路径已存在同名文件
- **THEN** 系统先 GET 文件获取 SHA，再以更新模式（PUT with sha）覆盖写入，commit message 标注为"update"

#### Scenario: 提交失败处理
- **WHEN** Git API 调用返回错误（如 401 未授权、404 仓库不存在）
- **THEN** 系统显示具体错误信息，不中断应用

### Requirement: 支持 GitHub 和 GitLab 平台
系统 SHALL 支持 GitHub（github.com）和 GitLab（gitlab.com 及自建实例）两种 Git 平台，通过各自的 REST API 实现文件写入。

#### Scenario: GitHub 平台文件写入
- **WHEN** projectConfig.git.platform 为 "github"，执行文档提交
- **THEN** 系统使用 GitHub Contents API (`PUT /repos/{owner}/{repo}/contents/{path}`) 写入文件

#### Scenario: GitLab 平台文件写入
- **WHEN** projectConfig.git.platform 为 "gitlab"，执行文档提交
- **THEN** 系统使用 GitLab Repository Files API (`PUT /projects/{id}/repository/files/{file_path}`) 写入文件

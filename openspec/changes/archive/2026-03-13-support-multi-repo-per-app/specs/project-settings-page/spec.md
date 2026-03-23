## MODIFIED Requirements

### Requirement: Git 仓库配置区块
项目配置页面 SHALL 包含 Git 仓库配置区块，支持维护多个仓库档案（Repo URL、Branch、Token、Platform），并支持按应用绑定多个仓库以及配置默认仓库。

#### Scenario: 新增并保存 Git 仓库档案
- **WHEN** 用户填写仓库 URL、分支名、Token，并选择平台类型后点击保存
- **THEN** 系统将仓库档案存入 `projectConfig.git.profiles`，并显示保存成功提示

#### Scenario: Git 档案配置校验
- **WHEN** 用户点击保存仓库档案但仓库 URL 或 Token 为空
- **THEN** 系统显示字段校验错误，不执行保存

#### Scenario: 测试连接
- **WHEN** 用户填写完某仓库档案并点击"测试连接"
- **THEN** 系统调用对应平台 API 验证 Token 有效性，显示"连接成功"或具体错误信息

#### Scenario: 保存应用仓库绑定
- **WHEN** 用户为一个应用选择多个仓库并点击保存
- **THEN** 系统将绑定关系持久化到 `projectConfig.git.bindingsByAppId` 并显示保存成功提示

#### Scenario: 保存默认仓库
- **WHEN** 用户在默认仓库设置中选择一个或多个仓库并点击保存
- **THEN** 系统将默认仓库集合持久化到 `projectConfig.git.defaultProfileIds`

#### Scenario: 兼容历史单仓库配置
- **WHEN** 用户刷新页面且本地仍是旧版单仓库 `projectConfig.git`
- **THEN** 系统自动迁移为一个可编辑的仓库档案并保持原配置值可继续使用

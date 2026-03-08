## ADDED Requirements

### Requirement: 应用与多仓库绑定配置
系统 SHALL 支持在项目配置中维护多个 Git 仓库档案（profiles），并支持为每个应用绑定一个或多个仓库；系统 SHALL 同时支持配置默认仓库集合作为兜底。

#### Scenario: 维护仓库档案
- **WHEN** 用户在 Git 配置区块新增或编辑一个仓库档案并保存
- **THEN** 系统将仓库档案持久化到 `projectConfig.git.profiles`，并为该档案分配稳定 `id`

#### Scenario: 绑定应用到多个仓库
- **WHEN** 用户为某个应用选择多个仓库并保存
- **THEN** 系统将绑定关系持久化到 `projectConfig.git.bindingsByAppId[appId]`

#### Scenario: 配置默认仓库
- **WHEN** 用户在默认仓库设置中选择一个或多个仓库并保存
- **THEN** 系统将默认仓库集合持久化到 `projectConfig.git.defaultProfileIds`

### Requirement: 提交目标仓库解析
系统 SHALL 在执行文档提交前，根据需求卡片关联应用解析目标仓库集合：先取应用绑定仓库并集，若为空则使用默认仓库集合，并对重复仓库去重。

#### Scenario: 应用绑定存在时按绑定解析
- **WHEN** 需求卡片关联应用且这些应用存在仓库绑定
- **THEN** 系统使用绑定仓库并集作为目标仓库集合

#### Scenario: 应用无绑定时使用默认仓库
- **WHEN** 需求卡片关联应用但未命中任何仓库绑定
- **THEN** 系统使用 `defaultProfileIds` 作为目标仓库集合

#### Scenario: 无可用仓库时阻止提交
- **WHEN** 应用绑定与默认仓库均为空
- **THEN** 系统阻止提交并提示用户前往项目配置完善仓库绑定

## Why

当前 Git 配置仅支持单仓库，无法满足一个子系统下多个应用、每个应用对应多个仓库并行提交的场景，导致文档提交需要反复切换配置且容易漏提。随着项目规模扩大，需要把仓库管理从"单仓库"升级为"应用级多仓库并行"。

## What Changes

- 将 Git 配置从单对象升级为仓库档案集合（profiles），支持新增、编辑、删除、测试多个仓库连接。
- 增加应用到仓库的绑定关系配置，支持一个应用绑定多个仓库，并支持默认仓库兜底策略。
- 文档提交流程升级为多仓库并行提交，返回逐仓库成功/失败结果，并支持失败重试。
- 提案 gitStatus 从单 URL 升级为按仓库维度的结果结构，支持展示部分成功状态。
- 兼容并迁移历史 `projectConfig.git` 单仓库配置，避免已有配置失效。

## Capabilities

### New Capabilities
- `app-repo-multi-binding`: 定义应用与多个 Git 仓库的绑定关系、默认仓库兜底策略与配置持久化行为。

### Modified Capabilities
- `git-repo-integration`: 将文档提交行为从单仓库提交扩展为按目标仓库集合并行提交。
- `proposal-git-status`: 将 gitStatus 从单文档 URL 结构扩展为按仓库维度记录并支持部分成功展示。
- `project-settings-page`: Git 配置区块从单仓库表单升级为仓库档案管理和应用绑定配置。

## Impact

- 受影响代码：`pm-ai-app/src/PMPlatform.jsx`（ProjectSettingsPage、DocEditor、commit helpers、gitStatus 渲染）。
- 受影响数据：`projectConfig.git` 数据结构升级；proposal `gitStatus` 结构升级并需向后兼容。
- 外部依赖：继续使用 GitHub/GitLab REST API，无需新增后端服务。

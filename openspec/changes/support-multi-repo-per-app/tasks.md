## 1. 配置模型与迁移

- [x] 1.1 新增 `normalizeGitConfig`，将旧版单仓库 `projectConfig.git` 迁移为 `profiles/bindingsByAppId/defaultProfileIds` 结构
- [x] 1.2 为 Git profile 定义稳定 `id` 生成与去重规则，确保编辑/删除后引用一致
- [x] 1.3 在配置加载与保存链路接入新结构，并保持旧数据读取兼容

## 2. 项目配置页改造

- [x] 2.1 将 Git 配置区块从单仓库表单改为仓库档案列表（新增/编辑/删除）
- [x] 2.2 增加“应用-仓库绑定”编辑区，支持每个应用多选绑定仓库
- [x] 2.3 增加“默认仓库”配置区，用于应用未绑定时兜底
- [x] 2.4 复用并扩展测试连接逻辑，使其支持对指定 profile 单独测试

## 3. 多仓库提交引擎

- [x] 3.1 实现目标仓库解析函数：按 `card.appIds`（兼容 `card.app`）解析绑定并集并去重，空时回落默认仓库
- [x] 3.2 将 DocEditor 提交流程改造为 `Promise.allSettled` 并行提交，输出逐仓库结果
- [x] 3.3 支持提交结果中的失败仓库重试（仅重试失败项）

## 4. gitStatus 与界面状态改造

- [x] 4.1 将 proposal `gitStatus` 写入结构升级为 `docType -> profileId -> result`，并保留旧 URL 结构读取兼容
- [x] 4.2 更新 DocTreeSidebar/TreeItem 的 Git 状态判定逻辑，支持“全部成功/部分成功/未成功”展示
- [x] 4.3 更新 DocEditor 顶部状态条，显示多仓库聚合状态与成功仓库 commit 链接
- [x] 4.4 调整卡片状态流转规则：存在至少一个仓库提交成功即流转到 `submitted`

## 5. 验证与文档

- [ ] 5.1 手工回归旧配置迁移场景：旧单仓库数据刷新后可继续提交
- [ ] 5.2 手工回归多仓库场景：全成功、部分失败、全失败、重试失败仓库
- [x] 5.3 更新相关说明文档（README/新手手册）中 Git 配置与提交行为描述

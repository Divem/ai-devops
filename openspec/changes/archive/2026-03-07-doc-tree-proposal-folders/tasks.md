## 1. 数据模型迁移

- [x] 1.1 创建 `normalizeDocs()` 函数，检测并转换旧数据结构为新结构
- [x] 1.2 旧数据结构 `{prd, spec, proposal, design, tasks}` 转换为 `{prd, proposals: [{id: "default", ...}]}`
- [x] 1.3 在卡片加载或初始化时自动调用 `normalizeDocs()`

## 2. 状态管理实现

- [x] 2.1 在 `DetailPage` 组件中添加 `expandedProposals` state (Set 数据结构)
- [x] 2.2 创建 `toggleProposal(proposalId)` 函数处理展开/收起逻辑
- [x] 2.3 添加 `isProposalExpanded(proposalId)` 辅助函数判断展开状态

## 3. 文档树组件更新

- [x] 3.1 修改 `DocTreeSidebar` 组件，检测 `docs.proposals` 是否存在
- [x] 3.2 实现提案文件夹渲染逻辑（多提案模式）
- [x] 3.3 保持平铺渲染逻辑作为向后兼容（单提案或旧数据）
- [x] 3.4 添加文件夹图标 📁/📂 切换逻辑

## 4. 提案文件夹内容渲染

- [x] 4.1 创建 `ProposalFolder` 子组件渲染单个提案
- [x] 4.2 在提案文件夹内渲染 4 个文档项（Proposal, Design, Delta Spec, Tasks）
- [x] 4.3 每个文档项使用正确的图标和标签

## 5. 文档选择与内容关联

- [x] 5.1 更新文档选择逻辑，支持提案上下文
- [x] 5.2 修改 `selectedDoc` state 存储提案信息 `{proposalId, docType}`
- [x] 5.3 更新文档内容获取逻辑，从 `docs.proposals[i][docType]` 读取

## 6. 示例数据创建

- [x] 6.1 创建包含 2 个提案的示例卡片数据
- [x] 6.2 验证多提案场景下文档树显示正确
- [x] 6.3 验证单提案场景自动降级为平铺显示

## 7. 向后兼容验证

- [x] 7.1 测试旧数据结构的卡片仍能正常显示
- [x] 7.2 测试旧卡片的文档选择和编辑功能正常
- [x] 7.3 验证数据迁移函数不损坏现有数据

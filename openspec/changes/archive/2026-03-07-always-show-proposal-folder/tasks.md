## 1. 修改 DocTreeSidebar 渲染逻辑

- [x] 1.1 删除 `multiProposal` 变量（`const multiProposal = proposals.length >= 2`）
- [x] 1.2 将渲染条件改为 `proposals.length > 0` 统一使用文件夹模式
- [x] 1.3 删除单提案平铺分支（`proposals.length === 1` 的 `PROPOSAL_DOC_TYPES.map(...)` 块）

## 2. 验证

- [x] 2.1 打开 REQ-100（单提案卡片），确认提案显示为可展开文件夹
- [x] 2.2 打开 REQ-104（双提案卡片），确认多提案文件夹 UI 未受影响
- [x] 2.3 打开无提案卡片（如 REQ-103），确认提案区域不显示

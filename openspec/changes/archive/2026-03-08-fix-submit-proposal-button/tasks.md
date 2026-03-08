## 1. 修复按钮禁用逻辑

- [x] 1.1 在 `ProposalReviewDrawer` 组件中，将底部"提交并生成提案"按钮的 `disabled` 从 `{reviewing || generating}` 改为 `{generating}`
- [x] 1.2 同步修改按钮样式中的条件判断（`cursor`、`background`、`color`、`boxShadow`），将所有 `(reviewing||generating)` 改为 `generating`

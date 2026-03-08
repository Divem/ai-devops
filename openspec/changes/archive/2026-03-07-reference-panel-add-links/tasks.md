## 1. 回调链透传

- [x] 1.1 `PMPlatform` 根组件：在传递 `DetailPage` 的 props 中添加 `onUpdateRefs={(cardId, refs) => updateCard(cardId, { references: refs })}`
- [x] 1.2 `DetailPage`：接收 `onUpdateRefs` prop，透传给 `RightPanel`
- [x] 1.3 `RightPanel`：接收 `onUpdateRefs` prop，透传给 `ReferencePanel`
- [x] 1.4 `ReferencePanel`：接收 `onUpdateRefs` prop（签名：`(cardId, newRefs) => void`）

## 2. ReferencePanel 状态

- [x] 2.1 添加 `showAddForm` state，默认 `false`
- [x] 2.2 添加 `newUrl` state，默认 `''`
- [x] 2.3 添加 `newTitle` state，默认 `''`
- [x] 2.4 添加 `newType` state，默认 `'other'`
- [x] 2.5 添加 `urlError` state，默认 `''`（URL 校验错误提示）

## 3. 删除链接功能

- [x] 3.1 在每条 refs 链接右侧添加 ✕ 删除按钮（hover 时显示，cursor: pointer）
- [x] 3.2 点击删除按钮：`onUpdateRefs(currentCard.id, refs.filter((_, i) => i !== index))`

## 4. 添加链接 UI

- [x] 4.1 在参考文档区块底部添加"+ 添加链接"切换按钮（`showAddForm` toggle）
- [x] 4.2 `showAddForm === true` 时渲染表单：
  - URL 输入框（value: newUrl，onChange 清除 urlError）
  - 标题输入框（value: newTitle）
  - 类型 select（options: 飞书文档/PRD/SPEC/其他，value: newType）
  - "添加"按钮 + "取消"按钮
- [x] 4.3 URL 为空时显示 `urlError`（"URL 不能为空"），不提交

## 5. 添加链接逻辑

- [x] 5.1 实现 `handleAddLink`：校验 URL → 构建 `{ url, title: newTitle || newUrl, type: newType }` → `onUpdateRefs(currentCard.id, [...refs, newRef])` → 重置表单状态、关闭表单

## 6. 验证

- [x] 6.1 打开详情页参考资料 tab，确认"+ 添加链接"按钮显示
- [x] 6.2 点击展开表单，填写 URL 和标题后添加，确认链接出现在列表
- [x] 6.3 不填 URL 直接提交，确认显示错误提示
- [x] 6.4 点击已有链接的 ✕，确认链接被删除
- [x] 6.5 切换到其他需求卡片再切回，确认链接仍在（state 持久）

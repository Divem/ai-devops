## 1. DetailDrawer 组件重构

- [x] 1.1 `DetailDrawer` props 新增 `onUpdateCard(cardId, partial)`、`projectConfig`
- [x] 1.2 组件内新增 `activeTab` state（默认 `"review"`）、`rawEditMode` state、`rawEditText` state、`meegoSyncing` state、`meegoSyncResult` state
- [x] 1.3 在 Header 下方、Body 上方插入 Tab bar，渲染「原始需求」和「评审报告」两个 Tab 按钮，激活样式使用 `C.ink` 背景 + 白色文字

## 2. 评审报告 Tab

- [x] 2.1 将原 Body 内容（需求描述 / 用户故事 / 验收标准 / AI 评审报告）迁移到 `activeTab === "review"` 条件渲染块，UI 不变

## 3. 原始需求 Tab — 展示与编辑

- [x] 3.1 `activeTab === "raw"` 时渲染原始需求区域：有内容则以 `white-space: pre-wrap` 展示，无内容则显示空态提示
- [x] 3.2 预览态顶部显示"✎ 编辑"按钮，点击进入编辑态（`rawEditMode = true, rawEditText = card.rawRequirement`）
- [x] 3.3 编辑态：textarea 全宽展示，顶部"保存"和"取消"按钮
- [x] 3.4 点击"保存"：调用 `onUpdateCard(card.id, { rawRequirement: rawEditText })`，退出编辑态
- [x] 3.5 点击"取消"：退出编辑态，内容复原

## 4. 原始需求 Tab — Meego 同步

- [x] 4.1 预览态底部显示"同步到 Meego"按钮（非编辑态时可见）
- [x] 4.2 点击时检查 `projectConfig?.meego?.apiUrl && projectConfig?.meego?.token`，缺失则显示提示信息，不发请求
- [x] 4.3 配置存在时：`meegoSyncing = true`，发起 PUT 请求至 `{apiUrl}/requirements/{card.id}`，body 为 `{ rawContent: rawRequirement }`，携带 `Authorization: Bearer {token}` header
- [x] 4.4 成功：显示"✓ 已同步到 Meego" toast（3 秒后消失）
- [x] 4.5 失败：显示错误提示，`meegoSyncing = false`

## 5. PMPlatform 调用处更新

- [x] 5.1 找到 `<DetailDrawer>` 的调用处，补充 `onUpdateCard={updateCard}` 和 `projectConfig={projectConfig}` props

## 6. 验证

- [x] 6.1 打开有 rawRequirement 的卡片（如 REQ-001），切换到「原始需求」Tab，确认内容正常展示
- [x] 6.2 编辑原始需求并保存，确认内容更新、编辑态退出
- [x] 6.3 点击"同步到 Meego"，未配置时确认出现提示

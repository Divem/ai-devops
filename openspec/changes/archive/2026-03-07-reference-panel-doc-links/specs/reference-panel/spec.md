## MODIFIED Requirements

### Requirement: reference-doc-links

**Capability:** reference-panel

"参考资料"面板新增**参考文档分组**，显示在相似需求列表之上：

- 渲染来源：`currentCard.references`（数组，可选字段）
- 每条文档显示：类型图标 + 文档标题 + 右箭头 `→`
- 点击在新标签页打开 `url`（`target="_blank"`）；`url` 为空时该条不渲染
- 支持的 type：`feishu`（🪶）、`prd`（📋）、`spec`（📝），未知 type 显示 📄
- `references` 为空数组或不存在时，显示占位卡片提示"暂无参考文档"

### Requirement: similar-cards-section

**Capability:** reference-panel

相似需求列表保留，移至参考文档分组下方，增加分组标题"相似需求"。空状态文案和逻辑不变。

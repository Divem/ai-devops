## ADDED Requirements

### Requirement: subtitle-clickable-link

**Capability:** requirement-source-link

需求详情页右侧面板（CHATBOT 和参考资料模块）的 Header 副标题区域：

- **内容**：显示 `card.desc`（超过 40 字符截断 + `…`），若 `desc` 为空则显示 `card.title`
- **交互**：该副标题为可点击链接（`<a>` 标签），鼠标移入时显示 `cursor: pointer`，颜色变为 accent 蓝（`#1a6cf6`），无下划线 → 移入后显示下划线
- **跳转**：点击在新标签页打开 `card.sourceUrl`；若 `card.sourceUrl` 未配置，默认跳转至 `https://www.github.com`
- **安全**：链接设置 `rel="noreferrer noopener"`

### Requirement: source-url-field

**Capability:** requirement-source-link

卡片数据支持可选字段 `sourceUrl: string`，表示该需求的来源系统链接（如 Jira ticket URL、飞书文档链接等）。该字段缺失时降级为默认值，不影响其他功能。

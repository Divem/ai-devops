## MODIFIED Requirements

### Requirement: demo-data-multi-proposal

**Capability:** multi-proposal-doc-tree

`INITIAL_CARDS` 中必须存在至少一张卡片，其 `docs.proposals` 数组包含 **2 个或以上**提案对象，每个提案对象包含完整的 `id`、`name`、`proposal`、`design`、`spec`、`tasks` 字段，且内容非空。

此要求确保多提案文件夹 UI 在默认示例数据下即可被演示，无需用户手动触发 AI 生成。

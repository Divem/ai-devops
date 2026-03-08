## Context

`DEFAULT_PROJECT_CONFIG` 目前只有 `ai` 和 `git` 两个字段。`ProjectSettingsPage` 使用 `NAV_ITEMS` 数组驱动左侧导航（上一个 change 已实现）。新增 SDD 框架板块只需往 `NAV_ITEMS` 追加一项并在 content area 添加条件渲染块。

## Goals / Non-Goals

**Goals:**
- 扩展 `DEFAULT_PROJECT_CONFIG` 增加 `sdd` 字段
- 在 `ProjectSettingsPage` 新增"SDD 框架"板块，包含框架选择和模板编辑器
- 模板以 key-value 形式存储（`templates: { proposal: '...', design: '...', spec: '...', tasks: '...' }`）
- 模板编辑器：选择模板类型后展示文本框，可编辑并保存

**Non-Goals:**
- 不实现框架间的自动迁移或格式转换
- 不在 AI 文档生成时实际注入自定义模板（留给后续 change）
- 不提供模板版本管理（只保存当前版本）

## Decisions

**D1 — `projectConfig.sdd` 数据结构**

```js
sdd: {
  framework: 'openspec',          // 'openspec' | 'spec-kit' | 'custom'
  templates: {                    // 每个框架各一套，key 为文档类型
    proposal: '',   // 空字符串 = 使用内置默认模板
    design: '',
    spec: '',
    tasks: '',
  }
}
```

不同框架共用同一个 `templates` 对象（框架选择影响 label 和说明文字，模板内容由用户自定义）。

**D2 — 模板编辑 UI 结构**

```
SDD 板块
├── 框架选择（select）: OpenSpec / spec-kit / 自定义
├── 框架说明（小字）
└── 模板编辑区
    ├── 模板类型 tab 选择（Proposal / Design / Spec / Tasks）
    └── textarea（显示当前框架对应文档类型的模板内容）
    └── "恢复默认" 按钮 + "保存模板" 按钮
```

Tab 用简单按钮组实现（`activeTemplate` state），不引入第三方 tab 组件。

**D3 — 内置默认模板常量**

定义 `SDD_FRAMEWORKS` 常量，包含每个框架的元数据和默认模板占位文字：

```js
const SDD_FRAMEWORKS = {
  openspec: { label: 'OpenSpec', desc: '...', defaultTemplates: { proposal: '# Proposal\n\n## Why\n\n## What Changes\n...', ... } },
  'spec-kit': { label: 'spec-kit', desc: '...', defaultTemplates: { ... } },
  custom: { label: '自定义', desc: '...', defaultTemplates: { proposal: '', design: '', spec: '', tasks: '' } },
};
```

"恢复默认"按钮将当前模板重置为该框架的 `defaultTemplates`。

**D4 — loadProjectConfig / saveProjectConfig 向后兼容**

`loadProjectConfig` 在合并时加入 `sdd: { ...DEFAULT_PROJECT_CONFIG.sdd, ...(base.sdd || {}) }` 兜底，老数据不会报错。

## Risks / Trade-offs

- **模板内容较长**：textarea 高度设为 300px，用户可滚动；不引入代码编辑器，保持简单
- **spec-kit 默认模板**：spec-kit 是真实存在的工具，其模板格式参考官方 README，内置一个合理的起点模板

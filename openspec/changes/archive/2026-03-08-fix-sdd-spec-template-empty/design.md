## Context

`ProjectSettings` 组件中 `sddTemplates` 状态的初始化：

```js
const [sddTemplates, setSddTemplates] = useState(() => {
  const fw = projectConfig.sdd?.framework || 'openspec';
  return { ...SDD_FRAMEWORKS[fw]?.defaultTemplates, ...projectConfig.sdd?.templates };
});
```

`DEFAULT_PROJECT_CONFIG.sdd.templates` 为 `{ proposal: '', design: '', spec: '', tasks: '' }`，这些空字符串通过 spread 覆盖了右边 `SDD_FRAMEWORKS[fw].defaultTemplates` 中的非空值。

textarea 渲染时：
```js
value={sddTemplates[activeTemplate] ?? SDD_FRAMEWORKS[sddFramework]?.defaultTemplates[activeTemplate] ?? ''}
```
`??` 仅对 `null`/`undefined` fallback，空字符串 `''` 是 falsy 但不是 nullish，所以不会 fallback 到默认值。

## Goals / Non-Goals

**Goals:**
- 合并 `projectConfig.sdd.templates` 时跳过空字符串，让 framework 默认模板正常显示
- 用户手动清空某个模板并保存后，重新加载时恢复为默认模板（与当前"重置为默认"按钮行为一致）

**Non-Goals:**
- 不改动 `SDD_FRAMEWORKS` 的模板内容
- 不改动 textarea 渲染逻辑
- 不影响 spec-kit / 自定义框架

## Decisions

### 决策：在初始化时过滤空字符串

```js
const [sddTemplates, setSddTemplates] = useState(() => {
  const fw = projectConfig.sdd?.framework || 'openspec';
  const saved = projectConfig.sdd?.templates || {};
  const nonEmpty = Object.fromEntries(Object.entries(saved).filter(([, v]) => v !== ''));
  return { ...SDD_FRAMEWORKS[fw]?.defaultTemplates, ...nonEmpty };
});
```

- **原因**：最小改动，语义清晰——空字符串表示"未自定义"，不应覆盖默认值
- **备选**：改 `??` 为 `|| `（空字符串时也 fallback），但 textarea 受控值不能这样处理
- **未选原因**：会影响用户刻意写空模板的场景（虽然罕见）

## Risks / Trade-offs

- [取舍] 用户若刻意将模板设为空字符串并保存，重新打开后会还原为默认模板
  → 可接受：清空模板的正常方式是点"恢复默认"，而非手动清空

## Migration Plan

1. 修改 `sddTemplates` useState 初始化表达式（单处）
2. 验证：刷新页面后各框架下 spec 模板正常显示默认内容
3. 验证：保存非空自定义模板后刷新，自定义内容正常保留

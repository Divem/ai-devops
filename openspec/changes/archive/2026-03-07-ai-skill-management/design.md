## Context

所有 AI prompt 分布在三处：
1. `callAIReview(card)` — 需求评审 prompt（固定字符串拼接 card 字段）
2. `DOC_PROMPTS` 对象 — prd / spec / proposal / design / tasks 五个生成 prompt（函数，接收 card）
3. `handleSendMessage` — chatbot 系统 prompt

这些函数在模块级别定义，不能直接访问 React props。`getSelectedModel()` 使用 `localStorage` 读取模型选择，SKILL 自定义 prompt 也采用同样策略从 localStorage 读取。

## Goals / Non-Goals

**Goals:**
- 定义 `AI_SKILLS` 常量，含各 SKILL 的 id、名称、用途描述、默认 prompt 模板（`{{card.title}}` 占位符风格）
- 实现 `resolveSkillPrompt(skillId, card)` helper：读 localStorage → 优先自定义，无则 fallback 默认 → 替换 `{{var}}` 占位符
- `callAIReview`、`callAIDoc`、`handleSendMessage` 改为调用 `resolveSkillPrompt`
- `ProjectSettingsPage` 新增 SKILL 板块：列表选择 skill → textarea 展示/编辑 prompt → 保存到 localStorage
- `projectConfig.skills` 同步到 localStorage 的 `ai_skill_prompts` key（JSON 格式）

**Non-Goals:**
- 不改变 `callAIReview` 返回值的 JSON 解析逻辑（JSON 格式要求作为固定后缀拼接，不纳入可编辑模板）
- 不引入 prompt 版本管理

## Decisions

**D1 — 占位符格式：`{{card.xxx}}`**

用户在 textarea 中看到 `{{card.title}}`、`{{card.desc}}`、`{{card.userStory}}` 等占位符。`resolveSkillPrompt` 执行简单字符串替换：

```js
function resolveSkillPrompt(skillId, card) {
  const saved = JSON.parse(localStorage.getItem('ai_skill_prompts') || '{}');
  const template = saved[skillId] || AI_SKILLS[skillId]?.defaultPrompt || '';
  return template
    .replace(/\{\{card\.id\}\}/g, card.id || '')
    .replace(/\{\{card\.title\}\}/g, card.title || '')
    .replace(/\{\{card\.desc\}\}/g, card.desc || '')
    .replace(/\{\{card\.userStory\}\}/g, card.userStory || '')
    .replace(/\{\{card\.tags\}\}/g, (card.tags || []).join('、'))
    .replace(/\{\{card\.criteria\}\}/g, (card.acceptanceCriteria || []).join('；'));
}
```

**D2 — review prompt 的 JSON 输出格式固定**

`callAIReview` 中，可编辑的部分是 "系统角色 + 评审重点" 的前半段。JSON 格式要求作为固定后缀（`\n严格按JSON返回：{...}`）在代码中拼接，不纳入可编辑模板，避免用户误删导致解析失败。

**D3 — SKILL 列表 UI 设计**

```
左侧：SKILL 列表（竖向按钮列表，点击选择）
右侧：
  - SKILL 名称 + 用途说明
  - 可用占位符提示（badge 列表）
  - textarea（prompt 模板内容）
  - "恢复默认" + "保存 Skill" 按钮
```

使用 `activeSkill` state 控制当前选中的 skill。

**D4 — localStorage key**

SKILL 自定义 prompt 存储：`localStorage.setItem('ai_skill_prompts', JSON.stringify({review: '...', prd: '...', ...}))`

`saveProjectConfig` 在保存时同步 `config.skills` 到此 key。`loadProjectConfig` 从此 key 读取并合并到 `projectConfig.skills`。

## Risks / Trade-offs

- **占位符拼写错误**：用户写错占位符名称时替换失败，输出含原始 `{{...}}`，AI 仍能理解但效果略差 → 可接受
- **review JSON 格式依赖**：固定后缀策略确保解析不受用户影响

## 1. 定义 AI_SKILLS 常量

- [x] 1.1 在 `callAI` 函数前定义 `AI_SKILLS` 常量对象，包含以下 7 个 skill：
  - `review`：需求评审（prompt 含 `{{card.id}}` `{{card.title}}` `{{card.desc}}` `{{card.userStory}}` `{{card.criteria}}`）
  - `prd`：PRD 生成（prompt 为当前 `DOC_PROMPTS.prd` 模板化版本）
  - `spec`：需求规格说明生成
  - `proposal`：Proposal 生成
  - `design`：Design 生成
  - `tasks`：Tasks 生成
  - `chatbot`：需求分析助手（含 `{{card.title}}` `{{card.desc}}` `{{message}}`）
- [x] 1.2 每个 skill 结构：`{ id, name, desc, defaultPrompt, vars[] }`（vars 为可用占位符列表）

## 2. 实现 resolveSkillPrompt helper

- [x] 2.1 在 `callAIReview` 之前实现 `resolveSkillPrompt(skillId, card, extra = {})` 函数：
  - 从 `localStorage.getItem('ai_skill_prompts')` 读取自定义 prompt（JSON parse）
  - 优先使用自定义，无则 fallback `AI_SKILLS[skillId].defaultPrompt`
  - 替换所有 `{{card.id}}` `{{card.title}}` `{{card.desc}}` `{{card.userStory}}` `{{card.tags}}` `{{card.criteria}}` `{{message}}`（extra 中的额外变量）

## 3. 更新 AI 调用函数

- [x] 3.1 更新 `callAIReview(card)`：用 `resolveSkillPrompt('review', card)` 替代硬编码 prompt 的前半段，JSON 格式要求固定拼接在末尾
- [x] 3.2 更新 `callAIDoc(card, docType)` 中对 `DOC_PROMPTS[docType]` 的调用：改为 `resolveSkillPrompt(docType, card)`
- [x] 3.3 更新 `handleSendMessage` 中的 chatbot prompt：改为 `resolveSkillPrompt('chatbot', card, { message })`

## 4. 扩展 projectConfig 数据结构

- [x] 4.1 在 `DEFAULT_PROJECT_CONFIG` 新增 `skills: {}` 字段（空对象表示全部使用默认）
- [x] 4.2 更新 `loadProjectConfig`：合并 `skills: { ...DEFAULT_PROJECT_CONFIG.skills, ...(base.skills || {}) }`
- [x] 4.3 更新 `saveProjectConfig`：保存 config 后同步 `localStorage.setItem('ai_skill_prompts', JSON.stringify(config.skills))`

## 5. 项目配置页 SKILL 板块 UI

- [x] 5.1 在 `NAV_ITEMS` 末尾追加 `{ id: 'skills', label: 'AI Skill', icon: '🎯' }`
- [x] 5.2 在 `ProjectSettingsPage` 添加 `activeSkill` state（默认 `'review'`）和 `skillPrompts` state（从 `projectConfig.skills` 初始化）及 `savedSkills` state
- [x] 5.3 在 content area 添加 `{activeSection === 'skills' && (...)}` 条件渲染块
- [x] 5.4 板块布局：左侧 SKILL 列表（140px，每项点击高亮）+ 右侧编辑区
- [x] 5.5 右侧编辑区：
  - SKILL 名称 + 描述
  - 占位符 badge 列表（每个 badge 点击复制到剪贴板）
  - textarea（value: `skillPrompts[activeSkill] ?? AI_SKILLS[activeSkill].defaultPrompt`，高度 320px，DM Mono 字体）
  - "恢复默认"按钮（重置当前 skill 的 textarea 内容）
  - "保存 Skill"按钮 + 成功提示
- [x] 5.6 实现 `handleSaveSkills`：构建 `{ ...projectConfig, skills: skillPrompts }` → `saveProjectConfig` → `onSave`

## 6. 验证

- [x] 6.1 打开项目配置页，确认左侧导航出现"AI Skill 🎯"条目
- [x] 6.2 点击后右侧显示 SKILL 列表和 prompt 编辑器
- [x] 6.3 切换不同 SKILL，确认 textarea 内容正确切换
- [x] 6.4 修改 PRD 的 prompt 并保存，触发 PRD 生成，确认使用了自定义 prompt
- [x] 6.5 点击"恢复默认"，确认 textarea 回到内置模板
- [x] 6.6 老数据不报错（无 skills 字段时正常运行）

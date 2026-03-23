# 特性清单

> 本文档记录 Agentic·DevOps 产研智能工作台的所有提案及其状态

## 概述

| 状态 | 数量 |
|------|------|
| ✅ 已完成 | 7 |
| 🚧 进行中 | 0 |
| 📋 待处理 | 13 |

---

## 特性列表

### 1. add-import-requirement-drawer

**状态**: ✅ 已完成  
**描述**: 在看板页面添加导入需求抽屉，支持 URL 导入和从空间/迭代/需求列表中选择导入

**文件位置**: `openspec/changes/add-import-requirement-drawer/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

### 2. add-requirement-link-to-sdd2-subtitle

**状态**: ✅ 已完成  
**描述**: SDD2 设计工作台副标题中的需求名称支持点击跳转飞书文档

**文件位置**: `openspec/changes/add-requirement-link-to-sdd2-subtitle/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

### 3. add-sample-data-to-sdd2

**状态**: ✅ 已完成  
**描述**: 为 SDD2 设计工作台添加示例数据

**文件位置**: `openspec/changes/add-sample-data-to-sdd2/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

### 4. add-settings-dropdown-to-kanban

**状态**: ✅ 已完成  
**描述**: 在看板页面添加设置下拉菜单

**文件位置**: `openspec/changes/add-settings-dropdown-to-kanban/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

### 5. add-zhipu-glm-model

**状态**: ✅ 已完成  
**描述**: 添加智谱 GLM 模型支持

**文件位置**: `openspec/changes/add-zhipu-glm-model/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

### 6. rename-product-to-agentic-devops

**状态**: ✅ 已完成  
**描述**: 将产品名称从 "PM·AI 产品智能工作台" 更改为 "Agentic·DevOps 产研智能工作台"

**文件位置**: `openspec/changes/rename-product-to-agentic-devops/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

### 7. sdd-add-spec-page-example

**状态**: ✅ 已完成  
**描述**: SDD 添加 spec 页面示例

**文件位置**: `openspec/changes/sdd-add-spec-page-example/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

## 已归档

### archive/

已完成的变更已归档处理。

---

## 待处理提案（2026-03-14）

### Meego 集成系列（P0，7 SP）

### 8. meego-api-adapter

**状态**: 📋 待处理
**优先级**: P0 | **故事点**: 3
**描述**: Meego Open API 封装（认证、请求、字段映射），建立与飞书项目的数据通道

**文件位置**: `openspec/changes/2026-03-14-meego-api-adapter/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

### 9. meego-sync-mechanism

**状态**: 📋 待处理
**优先级**: P0 | **故事点**: 2 | **依赖**: #8 meego-api-adapter
**描述**: 定时/手动拉取策略、增量同步逻辑、冲突检测

**文件位置**: `openspec/changes/2026-03-14-meego-sync-mechanism/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

### 10. meego-sync-ui-and-fallback

**状态**: 📋 待处理
**优先级**: P0 | **故事点**: 2 | **依赖**: #8 meego-api-adapter
**描述**: 同步状态指示器、错误兜底提示、手动重试入口

**文件位置**: `openspec/changes/2026-03-14-meego-sync-ui-and-fallback/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

### Git 增强系列（P1，5 SP）

### 11. git-batch-commit

**状态**: 📋 待处理
**优先级**: P1 | **故事点**: 2
**描述**: 提案全部文档一次性批量提交

**文件位置**: `openspec/changes/2026-03-14-git-batch-commit/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

### 12. git-pr-creation

**状态**: 📋 待处理
**优先级**: P1 | **故事点**: 2 | **依赖**: #11 git-batch-commit
**描述**: 调用 GitHub/GitLab API 创建 PR/MR

**文件位置**: `openspec/changes/2026-03-14-git-pr-creation/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

### 13. git-commit-receipt-panel

**状态**: 📋 待处理
**优先级**: P1 | **故事点**: 1 | **依赖**: #11 git-batch-commit
**描述**: 批量提交进度与结果展示

**文件位置**: `openspec/changes/2026-03-14-git-commit-receipt-panel/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

### 文档协作评审系列（P1，8 SP）

### 14. doc-diff-view

**状态**: 📋 待处理
**优先级**: P1 | **故事点**: 3
**描述**: 基于 versionHistory 的分屏 diff 视图

**文件位置**: `openspec/changes/2026-03-14-doc-diff-view/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

### 15. doc-inline-annotation

**状态**: 📋 待处理
**优先级**: P1 | **故事点**: 3 | **依赖**: #14 doc-diff-view
**描述**: 选中文本添加批注、批注列表管理、批注状态流转

**文件位置**: `openspec/changes/2026-03-14-doc-inline-annotation/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

### 16. doc-version-rollback

**状态**: 📋 待处理
**优先级**: P1 | **故事点**: 2 | **依赖**: #14 doc-diff-view
**描述**: 版本选择器与一键回滚

**文件位置**: `openspec/changes/2026-03-14-doc-version-rollback/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

### Skill 管理系列（P1，3 SP）

### 17. skill-management-page

**状态**: 📋 待处理
**优先级**: P1 | **故事点**: 1.5
**描述**: Skill 卡片列表 + 恢复/导出

**文件位置**: `openspec/changes/2026-03-14-skill-management-page/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

### 18. skill-prompt-editor

**状态**: 📋 待处理
**优先级**: P1 | **故事点**: 1.5 | **依赖**: #17 skill-management-page
**描述**: 全屏 Prompt 编辑器 + 变量高亮

**文件位置**: `openspec/changes/2026-03-14-skill-prompt-editor/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

### 看板增强系列（P2，3 SP）

### 19. kanban-column-sort

**状态**: 📋 待处理
**优先级**: P2 | **故事点**: 1.5
**描述**: 列表头排序按钮（优先级/人/日期）

**文件位置**: `openspec/changes/2026-03-14-kanban-column-sort/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

### 20. clarification-field-mapping

**状态**: 📋 待处理
**优先级**: P2 | **故事点**: 1.5
**描述**: Q/A → 需求字段自动映射

**文件位置**: `openspec/changes/2026-03-14-clarification-field-mapping/`

**Artifacts**:
- [x] proposal.md
- [x] design.md
- [x] specs
- [x] tasks.md

---

*最后更新: 2026-03-14*

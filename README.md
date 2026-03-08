# PM AI Platform - 产品智能工作台

> AI 驱动的需求评审、文档生成与 OpenSpec 变更协作平台。

## 项目概览

PM AI Platform 将需求管理从“收集 -> 评审 -> 设计 -> 文档 -> Git 提交 -> 回顾”放到同一工作台中，核心定位是：

- 用看板管理需求状态
- 用 AI 提升需求质量与文档产出效率
- 用 OpenSpec 管理变更与实施过程
- 用数据概览支持复盘与决策

## 主要能力

- 需求看板：多阶段流转（含 `已提交（git commit）`）+ 拖拽 + 多维筛选
- 详情抽屉：评审报告 / 原始需求双 Tab，原始需求支持基础信息、Meego 链接、编辑与同步
- AI 能力：需求评审、文档生成、聊天澄清、失败回退演示
- 文档中心：PRD + 多提案（Proposal/Design/Spec/Tasks）树状管理
- Git 集成：文档提交到 GitHub/GitLab，提交状态持久化与展示
- OpenSpec：propose/apply/archive 全流程变更管理

## 快速启动

```bash
cd pm-ai-app
npm install
npm run dev
```

- 默认访问：`http://localhost:5173`
- 生产构建：`npm run build`

## 仓库结构

```text
agentic_coding_platform/
├── pm-ai-app/                        # 主应用（Vite + React）
│   └── src/PMPlatform.jsx            # 核心单文件页面逻辑
├── preview-apps/                     # 设计变体预览
│   ├── vibe-app/
│   └── sdd2-app/
├── openspec/                         # OpenSpec 规范与变更
│   ├── specs/                        # 主 specs
│   └── changes/                      # active + archive changes
├── md/                               # 用户手册、PRD、分析文档
└── ai-client.js                      # 模型调用封装
```

## 开发命令

### 主应用

```bash
cd pm-ai-app
npm run dev
npm run build
npm run lint
```

### 预览应用

```bash
cd preview-apps/vibe-app   # 或 preview-apps/sdd2-app
npm install
npm run dev
```

## AI 模型配置

在页面右上角进入项目配置：

- AI 模型配置：Claude / GLM / ARK
- Git 仓库配置：GitHub / GitLab
- SDD 框架配置：OpenSpec / 其他模板
- AI Skill 配置：结构化 Skill 包管理（`SKILL.md` + `references/*` + `scripts/*`）

### AI Skill 标准结构（示例）

```text
skillname/
├── SKILL.md
├── references/
│   ├── req-clarification.md
│   ├── git-sync-checklist.md
│   └── field-mapping.md
└── scripts/
    └── scriptname.ts
```

- 旧版仅字符串 prompt 配置会自动迁移到 `SKILL.md`
- 保存时会校验路径规范，并自动将 `scrips/*` 修正为 `scripts/*`

未配置 API Key 时，部分流程会使用示例回退数据以保证演示可走通。

## OpenSpec 工作流

常用命令：

- 创建变更：`/opsx-propose <change-name-or-desc>`
- 实施任务：`/opsx-apply <change-name>`
- 归档变更：`/opsx-archive <change-name>`

参考目录：

- active changes：`openspec/changes/`
- archived changes：`openspec/changes/archive/`
- main specs：`openspec/specs/`

## 文档索引

- 新用户手册：`md/NEW_USER_DEMO_MANUAL.md`
- 技术架构说明书：`md/TECHNICAL_ARCHITECTURE.md`
- 产品 PRD 摘录来源：`md/PM_AI_Plagform_PRD.md`

## 许可证

MIT

## 1. 数据准备

- [x] 1.1 从 md/PM_AI_Plagform_PRD.md 提取 6 个核心功能模块需求
- [x] 1.2 为每个需求设计新的业务化标题（避免直接复制原文档）
- [x] 1.3 准备每个需求的完整字段数据（desc、tags、author、date、userStory、acceptanceCriteria）

## 2. 数据结构设计

- [x] 2.1 确认需求分布在不同看板列（backlog、reviewing、ai_review、confirm、approved）
- [x] 2.2 设置不同的优先级（P0、P1、P2）分布
- [x] 2.3 准备部分需求的 aiResult 模拟数据

## 3. 代码实现

- [x] 3.1 打开 pm-ai-platform_sdd2.jsx 文件
- [x] 3.2 定位 INITIAL_CARDS 数组（约第 664 行）
- [x] 3.3 用新准备的示例数据替换现有的 INITIAL_CARDS 内容
- [x] 3.4 确保数据格式与现有组件兼容

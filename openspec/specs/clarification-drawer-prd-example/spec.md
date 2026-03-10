## ADDED Requirements

### Requirement: 需求澄清抽屉展示原始需求示例摘录
系统 SHALL 在需求澄清交互弹框中展示“原始需求示例”只读区块，内容来自 `PM_AI_Plagform_PRD.md` 的预定义摘录片段，并明确该内容仅用于参考。该弹框 SHALL 支持由看板页需求澄清入口或 PRD 页“功能演示”入口触发。

#### Scenario: Open from kanban clarification entry
- **WHEN** 用户从看板页面打开需求澄清交互
- **THEN** 系统 SHALL 显示“原始需求示例”区块，且示例文本可见

#### Scenario: Open from PRD demo entry
- **WHEN** 用户在 PRD 文档页点击“功能演示”并打开需求澄清交互
- **THEN** 系统 SHALL 显示与看板入口一致的“原始需求示例”区块和澄清问题交互

#### Scenario: 示例不覆盖用户输入
- **WHEN** 用户查看示例并继续填写澄清问题
- **THEN** 系统 SHALL 不自动写入或覆盖任何用户输入字段

#### Scenario: 示例源不可用时降级
- **WHEN** `PM_AI_Plagform_PRD.md` 不存在、为空或摘录失败
- **THEN** 系统 SHALL 显示“示例暂不可用，请按真实业务场景补充原始需求”的降级提示，且不阻断用户提交

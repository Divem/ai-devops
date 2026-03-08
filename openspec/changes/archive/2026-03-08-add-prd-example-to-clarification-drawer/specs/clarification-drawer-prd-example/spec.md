## ADDED Requirements

### Requirement: 需求澄清抽屉展示原始需求示例摘录
系统 SHALL 在看板页面的需求澄清抽屉中展示“原始需求示例”只读区块，内容来自 `PM_AI_Plagform_PRD.md` 的预定义摘录片段，并明确该内容仅用于参考。

#### Scenario: 抽屉打开时展示示例
- **WHEN** 用户打开需求澄清抽屉
- **THEN** 系统 SHALL 在抽屉中显示“原始需求示例”区块，且示例文本可见

#### Scenario: 示例不覆盖用户输入
- **WHEN** 用户查看示例并继续填写澄清问题
- **THEN** 系统 SHALL 不自动写入或覆盖任何用户输入字段

#### Scenario: 示例源不可用时降级
- **WHEN** `PM_AI_Plagform_PRD.md` 不存在、为空或摘录失败
- **THEN** 系统 SHALL 显示“示例暂不可用，请按真实业务场景补充原始需求”的降级提示，且不阻断用户提交

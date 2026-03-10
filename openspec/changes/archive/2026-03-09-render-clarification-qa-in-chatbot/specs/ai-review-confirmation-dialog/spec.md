## MODIFIED Requirements

### Requirement: 需求信息更新
系统 SHALL 在用户完成信息补充后，自动更新需求的相关字段，并将本次补充的问答对摘要写入当前需求的 Chatbot 历史。

#### Scenario: 成功更新需求
- **WHEN** 用户完成所有问题并点击"确认补充"
- **THEN** 系统更新需求对象中的对应字段，关闭面板，触发 AI 评审

#### Scenario: 成功补充后写入 Chatbot 问答摘要
- **WHEN** 用户完成所有问题并点击"确认补充"且字段校验通过
- **THEN** 系统 SHALL 生成包含“问题-答案”对的澄清摘要消息并追加到当前需求 `chatHistory`
- **THEN** 该摘要消息 SHALL 保留用户本次填写顺序与文本内容（含“其他”自定义输入）

#### Scenario: 校验失败不写入摘要
- **WHEN** 用户点击"确认补充"但存在必填项为空或验收标准无有效条目
- **THEN** 系统 SHALL 阻止提交并展示错误提示
- **THEN** 系统 SHALL NOT 向 `chatHistory` 写入澄清摘要消息

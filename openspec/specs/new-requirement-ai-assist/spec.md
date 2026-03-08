## ADDED Requirements

### Requirement: 新建需求支持 AI 辅助生成
系统 SHALL 在新建需求抽屉中提供“AI 辅助生成”入口，用于根据用户输入上下文自动生成需求草稿并回填表单。该入口 SHALL 位于底部固定操作区并与“创建需求”按钮邻近。

#### Scenario: 底部操作区触发 AI 辅助生成
- **WHEN** 用户在新建需求抽屉底部点击“AI 辅助生成”
- **THEN** 系统 SHALL 调用 AI 生成需求草稿内容

#### Scenario: 生成结果回填表单
- **WHEN** AI 生成成功返回草稿
- **THEN** 系统 SHALL 将生成结果回填到需求标题、需求描述、用户故事、验收标准等字段

#### Scenario: 生成失败提示
- **WHEN** AI 生成请求失败或超时
- **THEN** 系统 SHALL 显示失败提示且保留用户当前已输入内容

### Requirement: AI 生成过程可感知
系统 SHALL 在 AI 生成进行中显示加载状态，并在完成后允许用户继续手动编辑。

#### Scenario: 生成中禁用重复触发
- **WHEN** AI 辅助生成功能处于进行中
- **THEN** 生成按钮 SHALL 显示加载态并禁用重复点击

#### Scenario: 生成后可继续编辑
- **WHEN** 生成内容回填完成
- **THEN** 用户 SHALL 可以继续手动修改任意字段后再点击“创建需求”

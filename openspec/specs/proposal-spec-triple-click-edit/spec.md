## Spec: 文档预览态三连击进入编辑态

**Capability**: proposal-spec-triple-click-edit
**Status**: active
**Source Change**: add-triple-click-edit-toggle-for-proposal-spec

---

## Requirements

### Requirement: Proposal、Spec 与 PRD 预览态支持三连击进入编辑态
系统 MUST 在 AI 设计页文档预览区域，为 `proposal`、`spec` 与 `prd` 文档提供三连击进入编辑态能力。

#### Scenario: Proposal 文档三连击进入编辑态
- **WHEN** 用户在 Proposal 文档预览态下于时间窗内连续点击三次内容区域
- **THEN** 系统 SHALL 进入该文档编辑态并加载当前文档内容

#### Scenario: Spec 文档三连击进入编辑态
- **WHEN** 用户在 Spec 文档预览态下于时间窗内连续点击三次内容区域
- **THEN** 系统 SHALL 进入该文档编辑态并加载当前文档内容

#### Scenario: PRD 文档三连击进入编辑态
- **WHEN** 用户在 PRD 文档预览态下于时间窗内连续点击三次内容区域
- **THEN** 系统 SHALL 进入该文档编辑态并加载当前文档内容

### Requirement: 三连击能力不得影响非目标文档类型
系统 MUST 将三连击进入编辑态能力限制在 `proposal`、`spec` 与 `prd` 文档，不得影响其它文档类型原有行为。

#### Scenario: Design/Tasks 文档不触发三连击编辑
- **WHEN** 用户在 Design 或 Tasks 文档预览态下连续点击三次内容区域
- **THEN** 系统 SHALL 保持预览态，且不自动切换为编辑态

### Requirement: 三连击能力与既有编辑入口并存
系统 MUST 保留现有"✎ 编辑"按钮入口，并确保三连击与按钮入口触发后的编辑行为一致。

#### Scenario: 按钮入口仍可正常编辑
- **WHEN** 用户点击"✎ 编辑"按钮
- **THEN** 系统 SHALL 按既有流程进入编辑态并允许保存或取消

#### Scenario: 三连击进入后保存流程一致
- **WHEN** 用户通过三连击进入编辑态后执行保存
- **THEN** 系统 SHALL 使用与按钮入口相同的保存逻辑写回文档内容

### Requirement: 三连击时间窗与防误触
系统 MUST 在 500ms 时间窗内计数点击次数，超时后重置，仅在 `!editMode && content` 条件下启用。

#### Scenario: 编辑态不启用三连击
- **WHEN** 用户已处于编辑态
- **THEN** 系统 SHALL 不响应预览容器的三连击事件

#### Scenario: 空内容不启用三连击
- **WHEN** 文档内容为空（尚未生成）
- **THEN** 系统 SHALL 不响应预览容器的三连击事件

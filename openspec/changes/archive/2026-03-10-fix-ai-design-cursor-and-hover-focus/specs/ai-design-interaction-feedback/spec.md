## ADDED Requirements

### Requirement: AI 设计页面默认光标语义
系统 SHALL 在 AI 设计页面使用语义化光标：非交互区域 MUST 显示箭头光标，仅交互元素显示对应光标类型。

#### Scenario: 页面默认区域显示箭头
- **WHEN** 用户将鼠标移动到 AI 设计页面的普通容器、文本展示区或空白区域
- **THEN** 光标显示为默认箭头（default）

#### Scenario: 交互元素显示对应光标
- **WHEN** 用户将鼠标移动到按钮、可点击树节点、筛选 chip、输入框或拖拽分隔条
- **THEN** 分别显示 pointer、text、或 col-resize 等与交互类型匹配的光标

### Requirement: 可操作元素悬浮反馈
系统 SHALL 为 AI 设计页面可操作元素提供一致的 hover 反馈，以便用户快速识别可交互区域。

#### Scenario: 按钮和可点击项悬浮
- **WHEN** 用户悬浮在按钮、可点击列表项或文档树节点上
- **THEN** 元素显示可感知的悬浮反馈（如背景加深、边框高亮或阴影变化）
- **AND** 悬浮反馈不改变元素文义与布局

#### Scenario: 不可交互元素无误导反馈
- **WHEN** 用户悬浮在不可交互的静态文本或容器上
- **THEN** 不显示与可点击元素相同的高亮反馈

### Requirement: 键盘焦点可见性
系统 SHALL 为 AI 设计页面可聚焦交互元素提供 focus-visible 反馈，且与 hover 反馈风格保持一致。

#### Scenario: 键盘导航焦点高亮
- **WHEN** 用户使用 Tab 键导航至按钮、筛选 chip、树节点或输入控件
- **THEN** 当前焦点元素显示明显可见的 focus-visible 样式

#### Scenario: 鼠标点击不产生冗余焦点噪音
- **WHEN** 用户使用鼠标点击元素
- **THEN** 焦点反馈遵循 focus-visible 规则，不对所有点击都强制显示键盘焦点样式

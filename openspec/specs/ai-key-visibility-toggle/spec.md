## ADDED Requirements

### Requirement: API Key 显示/隐藏切换
所有 API Key 输入框 SHALL 在右侧显示眼睛图标按钮，点击后切换该输入框的显示/隐藏状态（`type="password"` ↔ `type="text"`）。

#### Scenario: 默认隐藏状态
- **WHEN** 用户打开 AI 配置页面
- **THEN** 所有 API Key 输入框 SHALL 默认为 `type="password"`（内容以点号掩码显示）

#### Scenario: 点击眼睛按钮显示密钥
- **WHEN** 用户点击某个 API Key 输入框右侧的眼睛图标
- **THEN** 该输入框 SHALL 切换为 `type="text"`，明文显示已输入的 Key 内容；图标 SHALL 切换为"关闭眼睛"样式

#### Scenario: 再次点击隐藏密钥
- **WHEN** 用户点击已显示状态的眼睛图标
- **THEN** 该输入框 SHALL 切换回 `type="password"`；图标 SHALL 恢复为"眼睛"样式

#### Scenario: 各输入框状态独立
- **WHEN** 用户切换 Anthropic Key 的显示状态
- **THEN** GLM Key 和 ARK Key 的显示/隐藏状态 SHALL 不受影响

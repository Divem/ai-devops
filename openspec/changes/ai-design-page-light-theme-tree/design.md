## Context

AI设计页面 (`pm-ai-platform_*.jsx`) 目前使用固定的深色主题样式，与全局浅色主题不兼容。左侧文档树形导航同样使用固定深色配色。项目已存在主题切换系统（通过全局theme context管理light/dark模式），但AI设计页面尚未接入。

当前技术栈：React 19 + Vite，内联样式对象（无CSS-in-JS库），主题状态存储在localStorage并通过context传递。

## Goals / Non-Goals

**Goals:**
- AI设计页面支持浅色/深色主题切换并与全局主题状态同步
- 左侧文档树组件移除固定深色样式，接入主题系统
- 确保所有交互状态（hover/active/focus）在两种主题下均有良好视觉反馈
- 保持现有深色主题视觉效果不变（回归防护）

**Non-Goals:**
- 不重构整体主题系统架构（沿用现有实现）
- 不引入新的CSS-in-JS库或CSS变量方案
- 不修改AI设计页面以外的其他页面

## Decisions

### 1. 主题变量接入方式
**Decision**: 复用现有主题状态管理（localStorage + React Context）
- **Rationale**: 与项目已有add-theme-mode-toggle变更保持一致，避免重复造轮子
- **Alternative**: 创建独立主题状态（Rejected - 会造成状态分散）

### 2. 样式实现方案
**Decision**: 使用条件渲染内联样式对象，基于theme模式切换样式常量
- **Rationale**: 与现有代码风格一致（项目大量使用内联样式对象）
- **Implementation**: 
  ```javascript
  const styles = {
    container: theme === 'dark' ? darkStyles.container : lightStyles.container
  }
  ```

### 3. 树形导航改造策略
**Decision**: 将固定深色样式改为从props接收theme参数，内部根据theme选择对应样式集
- **Rationale**: 使组件与父级主题状态解耦，提高可复用性
- **Breaking Change**: 移除默认深色样式，改为必传theme参数或默认浅色

### 4. 文件修改范围
**Decision**: 同时修改三个设计系统变体文件（sdd, sdd2, vibe）确保一致性
- **Rationale**: AI设计页面存在于所有三个变体中，需要保持行为一致

## Risks / Trade-offs

- **[Risk]** 样式对象复杂度增加，代码可读性下降 → **Mitigation**: 将light/dark样式分离为独立对象，保持主逻辑清晰
- **[Risk]** 主题切换时可能出现闪烁 → **Mitigation**: 确保theme状态在组件渲染前已确定（从localStorage预读取）
- **[Risk]** 遗漏某些边缘元素的样式适配 → **Mitigation**: 建立检查清单覆盖所有UI元素（编辑器、预览、按钮、输入框、树节点）

## Migration Plan

1. **Phase 1**: 修改AI设计页面根组件，接入theme context
2. **Phase 2**: 为主题敏感区域创建light/dark样式对象
3. **Phase 3**: 改造树形导航组件，移除固定深色样式
4. **Phase 4**: 回归测试（深色模式保持原有外观，浅色模式视觉正确）

**Rollback**: 若出现问题，回退到修改前的jsx文件版本即可

## Open Questions

- 树形导航的图标颜色是否需要随主题变化？（建议：是，使用muted色）
- AI设计页面的代码编辑器区域是否跟随主题？（建议：编辑器保留专业主题，或提供编辑器专属主题切换）

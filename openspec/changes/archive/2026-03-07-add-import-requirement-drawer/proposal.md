## Why

用户在使用看板页面时，目前只能手动新建需求，无法从外部系统（如 Meego）导入已有需求。添加导入功能可以减少重复录入工作，提升用户体验。

## What Changes

- 在看板页面右上角的"新建需求"按钮添加下拉箭头
- 下拉菜单包含两个选项：新建需求、导入需求
- 点击"导入需求"后弹出右侧抽屉
- 抽屉中支持两种导入方式：
  - 输入 URL 导入
  - 从列表选择导入（包含空间、迭代、需求列表三级选择）

## Capabilities

### New Capabilities

- **import-requirement-drawer**: 导入需求抽屉组件，支持 URL 导入和从空间/迭代/需求列表中选择导入

### Modified Capabilities

- (无)

## Impact

- 主要影响 `pm-ai-app/src/PMPlatform.jsx` 中的看板页面组件
- 需要新增导入需求相关的 UI 组件

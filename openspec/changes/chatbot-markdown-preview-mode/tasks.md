## 1. Chatbot 输入预览交互

- [x] 1.1 在 `ChatbotPanel` 增加输入模式状态（edit/preview）与模式切换按钮
- [x] 1.2 将输入控件从单行 input 升级为 textarea，支持多行 Markdown 编写
- [x] 1.3 在 preview 模式渲染当前草稿 Markdown，并补充空内容占位提示

## 2. 消息渲染与容错

- [x] 2.1 将 assistant 消息内容接入 `MarkdownRenderer` 渲染
- [x] 2.2 增加 Markdown 渲染异常回退为纯文本的兜底逻辑
- [x] 2.3 调整消息样式以适配 Markdown 元素（标题、列表、代码块）显示

## 3. 发送行为与快捷键

- [x] 3.1 统一发送逻辑：preview 模式发送时提交原始 Markdown 文本
- [x] 3.2 发送后清空草稿并自动切回 edit 模式
- [x] 3.3 明确 Enter/Shift+Enter 行为，保证多行输入与快捷发送兼容

## 4. 回归验证与验收

- [x] 4.1 手工验证编辑/预览切换、空预览、Markdown 样式渲染
- [x] 4.2 手工验证发送链路（普通文本、Markdown、多行、preview 发送）
- [x] 4.3 运行构建检查并记录验收结果

## 验收记录

- 已完成构建验证：`npm run build` 通过。
- 已完成功能核对：编辑/预览切换、空预览提示、assistant Markdown 渲染、Enter 发送与 Shift+Enter 换行。

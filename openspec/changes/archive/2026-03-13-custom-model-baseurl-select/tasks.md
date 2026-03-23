## 1. 定义预设选项数据

- [x] 1.1 在 Custom 模型配置区块前定义 OpenAI 格式预设数组：`[{value:'', label:'请选择...'}, {value:'https://api.openai.com', label:'OpenAI: https://api.openai.com'}, {value:'https://api.deepseek.com', label:'DeepSeek: https://api.deepseek.com'}, {value:'https://api.groq.com/openai', label:'Groq: https://api.groq.com/openai'}, {value:'https://api.together.xyz', label:'Together AI: https://api.together.xyz'}]`
- [x] 1.2 定义 Anthropic 格式预设数组：`[{value:'', label:'请选择...'}, {value:'https://api.anthropic.com', label:'Anthropic: https://api.anthropic.com'}]`

## 2. 替换 Base URL 输入框为下拉选择器

- [x] 2.1 将 Custom 模型的 `<input>` Base URL 替换为 `<select>`，根据 `customFormat` 动态渲染对应预设列表，末尾追加"自定义..."选项（value=`__custom__`）
- [x] 2.2 实现 select onChange：预设选项直接 `setCustomBaseUrl(value)`；`__custom__` 选项在当前值匹配预设时设置为 `'https://'` 触发自定义输入框显示
- [x] 2.3 实现 select value 计算：当前 `customBaseUrl` 匹配预设时显示对应选项，否则显示 `__custom__`

## 3. 自定义输入框条件展示

- [x] 3.1 在 `<select>` 下方添加条件渲染的 `<input>`：当 `customBaseUrl` 不匹配当前格式的任何预设 value 时显示
- [x] 3.2 保留原有的动态路径拼接提示（`/chat/completions` 或 `/v1/messages`）在输入框/下拉下方

## 4. 格式切换联动

- [x] 4.1 修改 `customFormat` onChange：当切换格式时，如果当前 `customBaseUrl` 匹配旧格式的预设值，则重置为空字符串

## 5. 验证

- [x] 5.1 OpenAI 格式下拉选项正确显示，选择预设后 state 更新
- [x] 5.2 Anthropic 格式下拉选项正确显示，选择预设后 state 更新
- [x] 5.3 选择"自定义..."后输入框展开，输入值正确写入 state
- [x] 5.4 从"自定义"切回预设后输入框隐藏
- [x] 5.5 切换 API 格式时预设值正确重置

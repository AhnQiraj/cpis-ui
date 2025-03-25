# @cpis/uno-preset

UnoCSS 预设，为 CPIS 项目提供一致的样式主题和色彩系统。

## 安装

```bash
pnpm install -D @cpis/uno-preset
```

## 功能特性

- 内置 UnoCSS 预设配置
- 内置多套主题色系：科技蓝、中国红、活力橙、中性灰
- 提供 CSS 变量生成和主题切换支持
- 包含标准化的色彩系统，便于应用统一的设计规范

## 使用方法

### 基本配置

在您的 UnoCSS 配置文件中引入并使用：

```js
// uno.config.js
import { defineConfig } from 'unocss'
import { preseet } from '@cpis/uno-preset'

export default defineConfig({
  presets: [
    preseet()
  ],
})
```

### 主题切换

通过添加对应的主题类名来切换主题：

```html
<!-- 科技蓝主题 -->
<body class="theme-cpis-blue">...</body>
```

### 使用预设颜色

```html
<!-- 使用主题色 -->
<div class="text-primary">使用当前主题的颜色</div>
<div class="bg-primary-6">使用主题色的第6级变体</div>

<!-- 使用特定颜色 -->
<div class="text-blue">蓝色文本</div>
<div class="bg-red-5">红色背景（第5级）</div>
<div class="border-gray-3">灰色边框（第3级）</div>
```

## 可用颜色

### 主题颜色系统

每个颜色都提供了从1到10的变体，其中DEFAULT对应第6级。

- `primary`: 当前主题的主色
- `blue`: 科技蓝
- `red`: 中国红
- `green`: 翡翠绿
- `orange`: 活力橙
- `gray`/`grey`: 中性灰

### 功能性颜色

- `success`: 成功状态色（对应green-6）
- `error`: 错误状态色（对应red-6）
- `active`: 激活状态色


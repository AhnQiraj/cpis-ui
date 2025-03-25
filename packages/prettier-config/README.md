# @cpis/prettier-config

CPIS 项目的统一 Prettier 配置。

## 安装

```bash
pnpm install -D @cpis/prettier-config
```

## 使用方法

在项目的 `package.json` 中添加：

```json
{
  "prettier": "@cpis/prettier-config"
}
```

或者在 `.prettierrc.js` 文件中：

```js
module.exports = require('@cpis/prettier-config');
```

## 配置详解

本配置包含以下 Prettier 选项：

### `tabWidth: 2`
- 缩进的空格数量为 2 个空格

### `useTabs: false`
- 使用空格而非制表符（Tab）进行缩进

### `semi: false`
- 不在语句末尾添加分号

### `singleQuote: true`
- 使用单引号而非双引号

### `bracketSpacing: true`
- 在对象字面量的括号内部添加空格，如 `{ foo: bar }`

### `jsxBracketSameLine: false`
- JSX 中的右括号 `>` 不与最后一行的属性放在同一行，而是单独换行

### `arrowParens: "avoid"`
- 当箭头函数只有一个参数时，省略括号，如 `x => x`

### `trailingComma: "none"`
- 不添加尾随逗号

### `vueIndentScriptAndStyle: false`
- 不缩进 Vue 文件中的 `<script>` 和 `<style>` 标签

### `printWidth: 120`
- 设置每行代码的最大长度为 120 个字符

### `quoteProps: "as-needed"`
- 仅在需要时为对象属性添加引号

### `jsxSingleQuote: false`
- 在 JSX 中使用双引号而非单引号

### `bracketSameLine: false`
- 多行 HTML 元素的闭合 `>` 放在最后一个属性之后而不是新行上

### `htmlWhitespaceSensitivity: "ignore"`
- 忽略 HTML 元素中的空白敏感度

### `singleAttributePerLine: false`
- 不强制要求每个 HTML 属性单独占一行

### `endOfLine: "auto"`
- 根据操作系统自动选择行尾字符（Windows: CRLF, Unix: LF）

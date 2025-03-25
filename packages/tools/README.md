# @cpis/tools

工具库 - CPIS 项目的通用工具集合

## 安装

```bash
pnpm install @cpis/tools
```

## 功能

### 实用函数

该库提供了以下实用函数:

- **日期格式化**
  - `dateFormat`: 将日期对象或时间戳格式化为指定的日期字符串格式
  - `formatRelativeTime`: 获取相对时间表示 (如 "3分钟前", "昨天")

- **数字格式化**
  - `numberFormatter`: 将大数字转换为带单位的简洁形式 (如 1000 → 1k)
  - `toThousandslsFilter`: 为数字添加千分位分隔符

- **字符串处理**
  - `removeHtmlTag`: 移除字符串中的所有 HTML 标签
  - `firstStr`: 获取字符串的第一个字符
  - `optionsFilter`: 根据值查找选项列表中的标签

### CLI 工具

该库包含两个命令行工具:

- **cpis-check-update**: 检查依赖更新的工具
- **cpis-i18n**: 国际化文本管理工具

## 使用示例

### 导入工具函数

#### 局部引用

```javascript
import { filters } from '@cpis/tools';

// 日期格式化
const formattedDate = filters.dateFormat(new Date(), 'yyyy-MM-dd');
console.log(formattedDate); // 例如: 2023-09-15

// 数字格式化
const formattedNumber = filters.numberFormatter(1500000);
console.log(formattedNumber); // 输出: 1.5M

// 移除 HTML 标签
const plainText = filters.removeHtmlTag('<p>Hello <b>World</b></p>');
console.log(plainText); // 输出: Hello World
```

#### 全局引用

```javascript
import { filters } from '@/filters/index.js'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
```





### 使用命令行工具

```bash
# 检查项目依赖更新
npm run cpis-check-update

# 国际化文本管理
npm run cpis-i18n [command] [options]
```

## API 参考

### dateFormat(dateObj, dateFormat, origFormat)

将日期对象格式化为指定的日期字符串格式。

- `dateObj`: 日期对象、时间戳或日期字符串
- `dateFormat`: 输出日期格式 (默认: 'yyyy-MM-dd HH:mm:ss')
- `origFormat`: 可选，原始日期字符串的格式

### numberFormatter(num, digits)

将数字格式化为带单位的简洁形式。

- `num`: 要格式化的数字
- `digits`: 小数位数 (默认: 2)

### optionsFilter(val, options, labelKey, valueKey, defaultValue)

根据值在选项列表中查找对应的标签。

- `val`: 要查找的值
- `options`: 选项数组
- `labelKey`: 标签字段名 (默认: 'label')
- `valueKey`: 值字段名 (默认: 'value')
- `defaultValue`: 未找到时的默认值 (默认: '')

## 更多信息

有关更详细的 API 文档和使用方法，请参阅源代码和注释。
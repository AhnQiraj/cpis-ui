# CPIS UI 组件库

基础UI组件库。2.0新开发的组件库

## 安装

```bash
pnpm add @cpis/cpis-ui 
```

## 使用

### 全局引用

```js
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import CpisUI from '@cpis/cpis-ui'

Vue.use(ElementUI)
Vue.use(CpisUI)
```

### 按需引用

```js
import { CpisButton, CpisTable } from '@cpis/cpis-ui'

export default {
  components: {
    CpisButton,
    CpisTable
  }
}
```

## 可用组件

- `CpisTag` - 增强型标签组件
- `CpisProCascader` - 专业级联选择器
- `CpisPageContainer` - 页面布局容器
- `CpisButton` - 样式化按钮组件
- `CpisInput` - 具有附加功能的输入组件
- `CpisContainerHeader` - 容器头部组件
- `CpisForm` - 增强型表单组件
- `CpisFormItem` - 表单项组件
- `CpisFormSection` - 表单分段组件
- `CpisDrawer` - 侧边抽屉组件
- `CpisSearchBar` - 搜索输入栏
- `CpisTree` - 树形组件
- `CpisTreeContainer` - 树形组件容器
- `CpisDatePicker` - 日期选择组件
- `CpisTimeSelect` - 时间选择组件
- `CpisSelect` - 增强型选择组件
- `CpisMenu` - 导航菜单
- `CpisMenuItem` - 菜单项组件
- `CpisSubmenu` - 子菜单组件
- `CpisTabs` - 标签页导航组件
- `CpisTabPane` - 标签页内容面板
- `CpisDialog` - 模态对话框组件
- `CpisDialogTable` - 对话框中+表格
- `CpisDialogTreeTable` - 对话框+左树右表格
- `CpisBasicTable` - 基础表格组件
- `CpisTable` - 增强型数据表格（相当于 BasicTable + 搜索 + 分页 + 操作）

## 开发

```bash
# 构建生产版本
npm run build
```

## 发布

```bash
# 构建并发布到仓库
npm publish
```
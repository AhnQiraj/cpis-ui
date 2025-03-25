# @cpis/platformbase

基础 UI 组件库，为 CPIS 前端项目提供统一的 UI 组件和工具函数。

## 简介

`@cpis/platformbase` 是一个基于 Vue 2.x 和 Element UI 的组件库，提供了一系列通用组件、业务组件和工具函数，旨在提高开发效率和统一项目风格。

## 安装

```bash
pnpm install @cpis/platformbase
```

## 使用

### 全局引入

```js
import Vue from 'vue'
import PlatformBase from '@cpis/platformbase'

Vue.use(PlatformBase)
```

### 按需引入

```js
import Vue from 'vue'
import { IbpsContainer, IbpsIcon } from '@cpis/platformbase'

Vue.component(IbpsContainer.name, IbpsContainer)
Vue.component(IbpsIcon.name, IbpsIcon)
```

## 主要组件

### 容器组件

- `IbpsContainer` - 页面容器组件
- `IbpsContainerFrame` - 框架容器
- `IbpsLayout` - 布局组件
- `IbpsScrollbar` - 滚动条组件

### 数据展示组件

- `IbpsCrud` - 数据表格组件
- `IbpsList` - 列表组件
- `IbpsTree` - 树形组件
- `IbpsEmpty` - 空数据展示
- `IbpsQrCode` - 二维码组件
- `IbpsFileViewer` - 文件预览组件

### 表单与输入组件

- `IbpsEditor` - 文本编辑器
- `IbpsUeditor` - 富文本编辑器
- `IbpsFileUploader` - 文件上传组件
- `IbpsImage` - 图片组件
- `IbpsCheckbox` - 复选框组件

### 选择器组件

- `IbpsSelector` - 通用选择器
- `IbpsEmployeeSelector` - 员工选择器
- `IbpsGroupSelector` - 群组选择器
- `IbpsOrgSelector` - 组织机构选择器
- `IbpsIconSelect` - 图标选择器
- `IbpsAddressCascader` - 地址级联选择器

### 流程组件

- `FlowApproveMessage` - 流程审批消息
- `FlowApproveOpinion` - 流程审批意见
- `FlowDiagramDialog` - 流程图展示对话框

### 辅助组件

- `IbpsIcon` - 图标组件
- `IbpsIconSvg` - SVG图标组件
- `IbpsHelp` - 帮助提示组件
- `IbpsToolbar` - 工具栏组件
- `IbpsTextEllipsis` - 文本省略组件
- `IbpsSteps` - 步骤条组件


## 版本历史

详见 [CHANGELOG.md](./CHANGELOG.md)

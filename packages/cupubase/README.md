# @cpis/cupubase

基础UI组件库。历史遗留下的组件库

## 安装

```bash
pnpm add @cpis/cupubase
```

## 使用

### 全局引入

```js
import Vue from 'vue'
import cupubase from '@cpis/cupubase'

Vue.use(cupubase)
```

### 按需引入

```js
import Vue from 'vue'
import { CpSelect, UserDialogSelect } from '@cpis/cupubase'

Vue.component(CpSelect.name, CpSelect)
Vue.component(UserDialogSelect.name, UserDialogSelect)
```

## 组件

### 基础框架组件

- `z-toolbar` - 搜索工具栏
- `z-table` - 表格列表
- `z-tree` - 树控件
- `z-comb` - 组件组合
- `z-dialog-table` - 弹出框模板

### 选择/选人组件

- `UserDialogSelect` - 用户选择组件
- `OrgDialogSelect` - 组织选择组件
- `TeamDialogSelect` - 团队选择组件
- `DeptTreeSelect` - 部门树选择组件
- `OrgSelect` - 组织选择器
- `PositionDialogSelect` - 岗位选择组件

### 设备相关组件

- `EqLocationDialogSelect` - 设备位置选择组件
- `EqManageObjectDialogSelect` - 设备管理对象选择组件
- `EqMeasurePointDialogSelect` - 设备测点选择组件
- `EqTypeDialogSelect` - 设备类型选择组件
- `EqAreaDialogSelect` - 设备区域选择组件
- `EqAssetDialogSelect` - 设备资产选择组件
- `EqAssetTypeDialogSelect` - 设备资产类型选择组件
- `EqManufacturerDialogSelect` - 设备制造商选择组件
- `IotAreaDeviceDialogSelect` - 物联网区域设备选择组件

### 物料相关组件

- `SparePartsDialogSelect` - 备件选择组件
- `MaterialDialogSelect` - 物料选择组件

### 工单相关组件

- `WorkTicketDialogSelect` - 工作票选择组件
- `OperaTicketDialogSelect` - 操作票选择组件
- `IssueWorkTicket` - 发放工作票组件

### 文件上传组件

- `InputUploadFile` - 文件上传组件
- `InputUploadFileset` - 文件集上传组件
- `CpisUploadList` - 文件上传列表组件

### 其他组件

- `CpSelect` - 自定义选择器
- `CpQrCode` - 二维码组件
- `CpAreaCode` - 区域码组件
- `BizTagDialogSelect` - 业务标签选择组件
- `EngrContractDialogSelect` - 工程合同选择组件
- `DefectDialogSelect` - 缺陷选择组件
- `DangerSourceSelect` - 危险源选择组件
- `ImportModelView` - 导入模型视图组件

## 使用示例

### 文件上传组件示例

```vue
<template>
  <upload-list
    v-model="formData.attachFile"
    :params="{ 'business-data-code': 'xxxx' }"
    tip="支持jpg、png格式，大小不超过2M"
  />
</template>
```

禁用上传和删除:

```vue
<template>
  <upload-list
    disabled
    v-model="formData.attachFile"
    :params="{ 'business-data-code': 'xxxx' }"
    tip="支持jpg、png格式，大小不超过2M"
  />
</template>
```

## 版本历史

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新历史。

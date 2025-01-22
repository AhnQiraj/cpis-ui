# @cpis/cupubase

## 2.0.0

### Major Changes

- 开启新纪源 2.0 时代

## 0.1.15

### Patch Changes

- 上传组件 UploadList, 修改预览方式，判断文件类型，图片类型直接用img， 其他类型使用iframe (原逻辑)

## 0.1.14

### Patch Changes

- 选人组件新增拖拽排序功能

## 0.1.13

### Patch Changes

- 换成短横杠命名法

## 0.1.12

### Patch Changes

- z-comb 和z-table 新增sort-change event

## 0.1.11

### Patch Changes

- 删除危险点预控 http://172.169.50.28:8090/pages/viewpage.action?pageId=26116322, 危险源预控选择弹窗修改

## 0.1.10

### Patch Changes

- 修改上传组件弹窗，文字过长，位置错乱问题

## 0.1.9

### Patch Changes

- # Upload-List 组件文档

  ## 组件介绍

  Upload-List 是一个文件上传列表组件，用于展示上传文件并支持自定义上传参数和提示信息。

  ## 参数说明

  | 参数名 | 类型   | 必填 | 默认值 | 说明                 |
  | ------ | ------ | ---- | ------ | -------------------- |
  | tip    | string | 否   | -      | 上传提示信息         |
  | params | object | 否   | {}     | 上传请求时的附加参数 |

  # cpis-upload-list 组件文档

  ## 组件介绍

  Upload-List 是一个文件上传列表组件

  ## 参数说明

  | 参数名    | 类型    | 必填 | 默认值                                                                | 说明                                                                             |
  | --------- | ------- | ---- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
  | tip       | string  | 否   | 单个文件不能超过{sizeLimit}MB,在线打开支持 Word、Excel、PDF、MP4、JPG | 可以覆盖，默认值中的{sizeLimit}会被 sizeLimit 替换                               |
  | params    | object  | 是   | {}                                                                    | 上传请求时的附加参数，businessCode，subBusinessCode，businessDataCode，projectId |
  | disabled  | boolean | 否   | false                                                                 | 是否禁用                                                                         |
  | limit     | number  | 否   | 100                                                                   | 限制上传数量                                                                     |
  | sizeLimit | number  | 否   | 20 _ 1024 _ 1024                                                      | 上传大小限制                                                                     |

  ## 代码示例

  ```vue
  <template>
    <upload-list
      v-model="formData.attachFile"
      :params="{ 'business-data-code': 'xxxx' }"
      tip="支持jpg、png格式，大小不超过2M"
    />
  </template>
  ```

  disabled 场景，禁止上传和删除

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

  ## 使用场景

  - 文件上传，需要展示图片缩略图的场景

## 0.1.8

### Patch Changes

- `eqLocationDialog` 新增 `props`, `treeInitParam` 和 `defaultExpandAll`
  `treeInitParam` 默认为 null， 传入参数后，会在请求左侧树结构数据时作为参数
  `defaultExpandAll` 默认 false， 传入 true 后，会默认展开所有树节点

## 0.1.7

### Patch Changes

- `input-upload-fileset` 组件，新增支持 json 格式的 val 设置。 新增 `view-mode`参数，方便在表格中显示。

## 0.1.6

### Patch Changes

- 修改人员导入组件 `importModelView` ，增加人员导入的功能。

## 0.1.5

### Patch Changes

- 工单 ZNFDYWB-III-202443-00305 ，n 部门选择组件，接口 从 /entity/query 换成/extend/v3/entity/findAllByCondition， 参数从

```json
{
  "parameters": [
    {
      "key": "Q^PARENT_ID_^SL",
      "value": "xx"
    },
    {
      "key": "Q^PARTY_TYPE_^SL",
      "value": "org"
    }
  ]
}
```

换成

```json
{
  "parameters": [
    {
      "key": "orgId",
      "value": "xxx"
    },
    {
      "key": "levelType",
      "value": "org"
    }
  ]
}
```

## 0.1.4

### Patch Changes

- 修复 qrcodejs 报错问题，使用 qscodejs-fixed 替代

## 0.1.3

### Patch Changes

- 修改用户选择组件中，双击删除用户，某些用户不能正确被删除，并且重新查询搜索数据，已选择内容发生变化
  涉及组件：UserDialogSelect

## 0.1.2

### Patch Changes

- 人员选择组件，组织 ID 查询模糊匹配变更为精确匹配

## 0.1.1

### Patch Changes

- 1.流程审批历史组件优化,增加展示当前节点，且时间倒叙排列； 2.优化文件集创建文件集 ID 逻辑，由前端生成 ID，解决新增时同时上传多个文件丢失部分文件问题； 3.优化选择危险点组件分页结构体；

## 0.1.0 (2024-08-30)

### Patch Changes

- | 节点                                     | 作者                            | 日期            | 提交信息                                           |
  | ---------------------------------------- | ------------------------------- | --------------- | -------------------------------------------------- |
  | 8af16ac751dca05ad37e52869dd4891fcdeaa7ee | 邢飞 <fly@xingfei.com>          | 2024/8/7 17:24  | 设备位置组件优化                                   |
  | 2de18c45565d1ffa6dab573c371d9c522a5f5baa | qishao <shaobingmaster@163.com> | 2024/7/18 16:19 | 添加设备弹出框提醒                                 |
  | 978b4663929f1651a935bef67184761195f31028 | baiyafei <m18001583207@163.com> | 2024/8/6 17:07  | 导入方法                                           |
  | 9aa352d62a2f4f55c100e3c82adaf33facc2011d | qishao <shaobingmaster@163.com> | 2024/8/14 15:03 | 添加缺陷选择/岗位选择弹出框组件                    |
  | 08681f4ed9d447d18aaeb614e1a5e1388d393b92 | qishao <shaobingmaster@163.com> | 2024/7/17 17:34 | 区域二维码样式修复                                 |
  | 5b6486f2d5d588fd0ad0f6044585dcfd2bf4ec92 | 邢飞 <fly@xingfei.com>          | 2024/8/30 11:34 | 增加是否需要水印参数                               |
  | 6527beb507de3ffadf9be7ef50fc1447cb0a19c1 | yangyin <2711978737@qq.com>     | 2024/7/12 08:39 | 修复组织机构选择器多选模式下禁选单位仍然可选的问题 |
  | 22283cfb245c55a2bed2202efd131340d6641588 | yangyin <2711978737@qq.com>     | 2024/7/5 18:19  | 组织机构选择器已选单位显示宽度调整                 |

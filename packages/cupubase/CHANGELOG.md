# @cpis/cupubase

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

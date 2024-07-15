/**
 * 按钮
 */
export default {
  search: {
    label: "搜索",
    type: "primary",
    accessControl: false,
    icon: "ibps-icon-search",
    scope: ["toolbar", "search"]
  },
  resetSearch: {
    label: "重置",
    type: "danger",
    icon: "ibps-icon-undo",
    scope: ["toolbar", "search"]
  },
  moreSearch: {
    label: "更多",
    type: "primary",
    icon: "ibps-icon-ellipsis-h",
    scope: ["toolbar", "search"]
  },
  add: {
    label: "添加",
    type: "primary",
    icon: "ibps-icon-add",
    scope: ["toolbar", "contextmenu"],
    contextmenu: "all"
  },
  remove: {
    label: "删除",
    type: "primary",
    icon: "ibps-icon-remove",
    scope: ["toolbar", "manage"],
    contextmenu: "sub"
  },
  edit: {
    label: "编辑",
    type: "primary",
    icon: "ibps-icon-edit",
    scope: ["toolbar", "manage"],
    contextmenu: "sub"
  },
  detail: {
    label: "明细",
    type: "primary",
    icon: "ibps-icon-detail",
    scope: ["toolbar", "manage"],
    contextmenu: "sub"
  },
  batchModify: {
    label: "批量修改",
    type: "primary",
    icon: "ibps-icon-check-square-o",
    scope: ["toolbar"]
  },
  import: {
    label: "导入",
    type: "primary",
    icon: "ibps-icon-import",
    scope: ["toolbar"]
  },
  export: {
    label: "导出",
    type: "primary",
    icon: "ibps-icon-export",
    scope: ["toolbar"],
    dropdown: [
      {
        label: "导出所有",
        key: "exportAll"
      },
      {
        label: "导出选中",
        key: "exportSelected"
      },
      {
        label: "导出当前页",
        key: "exportCurPage"
      },
      {
        label: "根据查询结果导出",
        key: "exportQuery"
      }
    ]
  },
  close: {
    label: "关闭",
    icon: "ibps-icon-close",
    scope: ["edit", "detail"]
  },
  save: {
    label: "保存",
    type: "primary",
    accessControl: false,
    icon: "ibps-icon-save",
    scope: ["edit"]
  },
  print: {
    label: "打印",
    type: "primary",
    icon: "ibps-icon-print",
    scope: ["toolbar", "manage", "edit", "detail"]
  },
  custom: {
    label: "自定义",
    type: "primary",
    icon: "ibps-icon-setting",
    scope: ["toolbar", "manage", "edit", "detail", "dialog"]
  },
  confirm: {
    label: "确定",
    type: "primary",
    icon: "ibps-icon-ok",
    scope: ["dialog"]
  },
  clean: {
    label: "清空",
    type: "info",
    icon: "ibps-icon-clean",
    scope: ["dialog"]
  },
  cleanSelected: {
    label: "清空选择",
    type: "warning",
    icon: "ibps-icon-times-circle-o",
    scope: ["dialog"]
  },
  cancel: {
    label: "取消",
    icon: "ibps-icon-cancel",
    accessControl: false,
    scope: ["dialog"]
  },
  refresh: {
    label: "刷新",
    type: "primary",
    accessControl: false,
    icon: "ibps-icon-refresh",
    scope: ["toolbar"]
  },
  expand: {
    label: "展开",
    type: "primary",
    icon: "ibps-icon-expand",
    accessControl: false,
    scope: ["toolbar"]
  },
  compress: {
    label: "收缩",
    type: "primary",
    icon: "ibps-icon-compress",
    accessControl: false,
    scope: ["toolbar"]
  },
  more: {
    label: "更多",
    type: "primary",
    icon: "ibps-icon-list-alt",
    scope: ["toolbar"]
  },
  collapse: {
    label: "收缩",
    icon: "ibps-icon-angle-up",
    scope: ["toolbar"]
  },
  expansion: {
    label: "展开",
    icon: "ibps-icon-angle-down",
    scope: ["toolbar"]
  },
  fullscreen: {
    label: "全屏",
    icon: "ibps-icon-window-maximize",
    scope: ["toolbar"]
  },
  fullscreenOn: {
    label: "小屏",
    icon: "ibps-icon-window-restore",
    scope: ["toolbar"]
  }
}

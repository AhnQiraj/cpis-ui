import toolbar from "./components/toolbar"
import table from "./components/table"
import tree from "./components/tree"
import comb from "./components/comb"
import dialogTable from "./components/dialogTable"
export default {
  install(Vue) {
    // 搜索工具栏
    Vue.component("z-toolbar", toolbar)
    // 表格列表
    Vue.component("z-table", table)
    // 树控件
    Vue.component("z-tree", tree)
    // 组件组合
    Vue.component("z-comb", comb)
    // 弹出框模板
    Vue.component("z-dialog-table", dialogTable)
  }
}

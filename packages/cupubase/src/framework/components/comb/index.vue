<template>
  <div class="comb-container">
    <template v-if="treeIsShow && treeProp.show !== false">
      <div class="leftTree" :class="[moreTreeArea ? 'width4' : 'width3']">
        <div class="treeHeader" :class="[moreTreeArea ? 'width4' : 'width3']">
          <span>{{ treeProp.title }}</span>
          <!-- <i class="fa fa-angle-double-left" aria-hidden="true" @click="onSwitchTree" /> -->
          <span>
            <i class="el-icon-d-arrow-left" @click="onSwitchTree(1)" />
            <i v-if="moreTree" class="el-icon-d-arrow-right" @click="onSwitchTree(3)" />
          </span>
        </div>
        <z-tree ref="tree" v-bind="treeProp" @nodeClick="onClickTreeNode" @rightClick="rightClick" />
      </div>
    </template>
    <template v-if="!treeIsShow && treeProp.show !== false">
      <div class="compressTree">
        <!-- <i class="fa fa-angle-double-right" aria-hidden="true" /> -->
        <i class="el-icon-d-arrow-right" @click="onSwitchTree(2)" />
      </div>
    </template>
    <div class="curd">
      <div class="curd-toolbar">
        <z-toolbar v-if="toolbarProp.show !== false" ref="toolbar" :model="toolbarProp.searchData" v-bind="toolbarProp" @addNew="onAddNew" @delete="onDelete" @update="onUpdate" @search="onToolbarSearch" @view="onView" @reset="OnRest" @setColumn="onSetColumn">
          <template #default>
            <slot name="searchBar" />
          </template>
          <template #alwaysShowBtn>
            <slot name="toolbar-always" :selection-columns="selectionColumns" />
          </template>
          <template #buttons>
            <slot name="toolbar-buttons" :selection-columns="selectionColumns" />
          </template>
        </z-toolbar>
      </div>
      <div v-if="tableProp.show !== false" class="curd-table">
        <z-table ref="table" v-bind="tableProp" :key_="key_" @selectChange="onSelectChange" @selectOne="onSelectOne" @selectAll="onSelectAll" @pageChange="onPageChange" @pageSizeChange="onPageSizeChange" @tableLoadDone="onTableLoadDone" @selection-change="checkboxChangeEvent">
          <template v-for="columnName in tableProp.slotColumns" :slot="columnName" slot-scope="scope">
            <slot :slot-scope="scope.slotScope" :name="columnName" />
          </template>
        </z-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    toolbarProp: {
      type: Object,
      default() {
        return {}
      }
    },
    tableProp: {
      type: Object,
      default() {
        return {}
      }
    },
    treeProp: {
      type: Object,
      default() {
        return {}
      }
    },
    nativeProp: {
      type: Object,
      default() {
        return {}
      }
    },
    key_: {
      type: String,
      default: "id"
    },
    // 更多树形区域按钮
    moreTree: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeIsShow: true, // 是展示不展示(并不是启不启动)
      searchParams: {},
      selectionColumns: [],
      defalutTableWidth: "",
      moreTreeArea: false // 更多树形区域
    }
  },
  mounted() {
    this.defalutTableWidth = this.$refs.table.getTableWidth()
  },
  methods: {
    onClickTreeRefresh() {
      this.$emit("tree-fresh")
    },
    /**
     * 清除树节点选中状态
     * @author mbb
     */
    clearClick() {
      this.$refs.tree.clearClick()
    },
    /**
     * 重新加载树数据
     */
    onReload() {
      this.$refs.tree.onReload()
    },
    /**
     * 重置搜索框
     */
    resetFields() {
      this.$refs.toolbar.resetFields()
    },
    // 表格查询
    tableQuery(params = {}) {
      this.$refs.table.reload(params)
    },
    // 新增事件
    onAddNew() {
      this.$emit("toolbar-add")
    },
    // 删除事件
    onDelete() {
      this.$emit("toolbar-delete", this.selectionColumns)
    },
    // 修改事件
    onUpdate() {
      this.$emit("toolbar-update", this.selectionColumns)
    },
    // 搜索事件
    onToolbarSearch(searchData) {
      this.$emit("toolbar-search", searchData)
    },
    // 浏览事件
    onView() {
      this.$emit("toolbar-view", this.selectionColumns)
    },
    // 切换是否显示树 1往左边缩，2展开一部分，3展开更多部分
    onSwitchTree(type) {
      if (type == 1) {
        // 展示更多树区域的时候
        if (this.treeIsShow && this.moreTreeArea) {
          this.moreTreeArea = false
          this.$refs.table.setTableWidth(this.defalutTableWidth)
        } else {
          this.treeIsShow = false
          this.$refs.table.setTableWidth("100%")
        }
      } else if (type == 2) {
        this.treeIsShow = true
        this.$refs.table.setTableWidth(this.defalutTableWidth)
      } else if (type == 3) {
        this.moreTreeArea = true
        this.$refs.table.setTableWidth("calc(" + this.defalutTableWidth + " - 250px)")
      }
    },
    // 打开列设置
    onSetColumn() {
      this.$refs.table.openSetColumn()
    },
    checkboxChangeEvent(event) {},
    changeAllEvent(event) {},
    /**
     * 单选:操作单项
     * @author mbb
     */
    onSelectChange(rows) {
      // 展示需要表个选择显示的操作按钮
      this.$refs.toolbar.showOptionBtns(rows.length > 0)
      this.selectionColumns = rows
      this.$emit("table-selection-change", rows)
    },
    /**
     * 多选:操作单项
     * @author mbb
     */
    onSelectOne(columns, row) {
      // 展示需要表个选择显示的操作按钮
      this.$refs.toolbar.showOptionBtns(columns.length > 0)
      this.selectionColumns = columns
      this.$emit("table-selection-one", columns, row)
    },
    /**
     * 多选:操作所有
     * @author mbb
     */
    onSelectAll(columns) {
      this.$emit("table-selection-all", columns)
    },
    // 点击树节点
    onClickTreeNode(node) {
      this.$emit("tree-click", node)
    },
    /**
     * 右击树节点
     */
    rightClick(MouseEvent, object, Node, element) {
      this.$emit("rightClick", MouseEvent, object, Node, element)
    },
    // 分页事件
    onPageChange(pagination) {
      this.$emit("table-page", pagination)
    },
    onPageSizeChange(pagination) {
      this.$emit("table-pagesize", pagination)
    },
    // 数据加载完成
    onTableLoadDone(res, data) {
      this.$emit("table-loadDone", res, data)
    },
    // 根据索引选择列；多选回显数据
    toggleSelectionWithIndex(indexArray) {
      this.$refs.table.toggleSelectionWithIndex(indexArray)
    },
    // 根据索引选择列；单选回显数据
    toggleNewSelectionWithIndex(indexArray) {
      this.$refs.table.toggleNewSelectionWithIndex(indexArray)
    },
    // 根据索引选择列
    toggleSelection(columns) {
      this.$refs.table.toggleSelection(columns)
    },
    // 根据索引选择列
    clearSelection() {
      this.$refs.table.clearSelection()
    },
    getTableWidth() {
      return this.$refs.table.getTableWidth()
    },
    OnRest() {
      this.$emit("on-reset")
    },
    getTableData() {
      return this.$refs.table.getCurrentTableData()
    },
    getColumnsByIndex(index) {
      return this.$refs.table.getColumnsByIndex(index)
    }
  }
}
</script>
<style scoped lang="scss">
.width2 {
  min-width: 200px;
  width: 200px;
}
.width3 {
  min-width: 300px;
  width: 300px;
}
.width4 {
  min-width: 550px;
  width: 550px;
}
.comb-container {
  display: flex;
  width: 100%;
  height: 100%;
  max-height: 100%;
  box-sizing: border-box;
}
.leftTree {
  margin: 0 5px 0 0;
  background: #fff;
  // min-width: 200px;
  // width: 200px;
  .treeHeader {
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    // width: 200px;
    span {
      font-weight: bold;
      font-size: 14px;
    }
    i {
      cursor: pointer;
    }
  }
}
.compressTree {
  margin: 0 5px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  min-width: 40px;
  height: 40px;
  cursor: pointer;
}
.curd {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .curd-table {
    flex: 1;
    height: 100%;
    width: 100%;
  }
  .curd-toolbar {
    width: 100%;
  }
}
</style>

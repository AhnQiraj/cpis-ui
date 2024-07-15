<template>
  <el-table
    ref="elTable"
    :height="height"
    :data="formatData"
    :row-style="showRow"
    v-bind="$attrs"
    @select-all="handleSelectAll"
    @cell-click="handleCellClick"
    @row-click="handleRowClick"
    @selection-change="handleSelectionChange"
  >
    <!--选择列 多选-->
    <el-table-column
      v-if="(selectionRow || selectionRow === '') && selectionType === 'checkbox'"
      v-bind="typeof selectionRow === 'Object'?selectionRow:null"
      :label="handleAttribute(selectionRow.label, '')"
      type="selection"
    />
    <!--索引列-->
    <el-table-column
      v-if="indexRow || indexRow === ''"
      v-bind="typeof indexRow === 'Object'?indexRow:null"
      :label="handleAttribute(indexRow.label, $t('components.crud.index'))"
      :width="handleAttribute(indexRow.label, '50px')"
      type="index"
    />
    <el-table-column v-if="columns.length===0" width="150">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" :key="space" class="ibps-tree-table-space" />
        <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="ibps-icon-caret-right" />
          <i v-else class="ibps-icon-caret-down" />
        </span>
        {{ scope.$index }}
      </template>
    </el-table-column>
    <el-table-column
      v-for="(column, index) in columns"
      v-else
      :key="column.prop"
      :label="column.label"
      :width="column.width"
    >
      <template slot-scope="scope">
        <template v-if="index === 0">
          <span v-for="space in scope.row._level" :key="space" class="ibps-tree-table-space" />
        </template>
        <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="(event)=>{toggleExpanded(event,scope.$index)} ">
          <i v-if="!scope.row._expanded" class="ibps-icon-caret-right" />
          <i v-else class="ibps-icon-caret-down" />
        </span>
        {{ scope.row[column.prop] }}
      </template>
    </el-table-column>
    <slot />
  </el-table>
</template>
<script>
import TreeUtils from '@platform/utils/tree'
import treeToArray from './eval'
export default {
  name: 'TreeTable',
  props: {
    data: {
      type: [Array, Object],
      required: true
    },
    dataType: {
      type: String,
      default: 'list'
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: true
    },
    height: [String, Number],
    options: {
      type: Object,
      default: () => {
        return {
          idKey: 'id',
          pidKey: 'parentId',
          childrenKey: 'children'
        }
      }
    },
    /**
     * @description 索引
     */
    indexRow: {
      type: [Object, Boolean],
      default: true
    },
    /**
     * @description 多选
     */
    selectionRow: {
      type: [Object, Boolean],
      default: true
    },
    /**
     * @description 类型
     * [可选值] radio/checkbox
     */
    selectionType: {
      type: String,
      default: 'checkbox'
    }
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      if (!this.data || this.data.length === 0) {return []}
      let tmp
      if (this.dataType === 'list') {
        tmp = TreeUtils.transformToTreeFormat(JSON.parse(JSON.stringify(this.data)), {
          idKey: this.options.idKey,
          pIdKey: this.options.pidKey,
          childrenKey: this.options.childrenKey
        })
      } else {
        tmp = JSON.parse(JSON.stringify(this.data))
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      return func.apply(null, args)
    }
  },
  methods: {
    doLayout() {
      this.$refs.elTable.doLayout()
    },
    showRow: function(row) {
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // 切换下级是否展开
    toggleExpanded: function(event, trIndex) {
      event.preventDefault()
      event.stopPropagation()
      const record = this.formatData[trIndex]
      record._expanded = !record._expanded
    },
    // 图标显示
    iconShow(index, record) {
      return (index === 0 && record.children && record.children.length > 0)
    },
    /**
     * @description 组件属性默认值
     */
    handleAttribute(attribute, defaultValue) {
      if (attribute === false || attribute === 0 || attribute === '') {
        return attribute
      }
      return attribute || defaultValue
    },
    /**
     * @description 行点击时触发的事件
     */
    handleRowClick(row, event, column) {
      // 点击行，触发选中
      if (this.selectionType === 'radio') {
        this.selectionRadio = row[this.pkKey]
        this.$emit('selection-change', row)
      } else {
        this.$refs.elTable.toggleRowSelection(row)
      }
      this.$emit('row-click', row, event, column)
    },
    /**
     * @description 单元格点击时触发的事件
     */
    handleCellClick(row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event)
    },
    /**
     * @description 勾选数据时触发的事件
     */
    handleSelect(selection, row) {
      this.$emit('select', selection, row)
    },
    /**
     * @description 勾选全选时触发的事件
     */
    handleSelectAll(selection) {
      this.$emit('select-all', selection)
    },
    /**
     * @description 复选框选择项发生变化时触发的事件
     */
    handleSelectionChange(selection) {
      this.$emit('selection-change', selection)
    }
  }
}
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  @-webkit-keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  $ctrl-color: #a3afb7;
  $space-width: 18px;
  .ibps-tree-table-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }
  .process-container{
    width: 100%;
    height: 100%;
  }
  table td {
    line-height: 26px;
  }
  .tree-ctrl{
    position: relative;
    cursor: pointer;
    color: $ctrl-color;
    margin-left: -$space-width;
  }
</style>

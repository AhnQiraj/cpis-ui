<template>
  <el-table-column :prop="prop" :label-class-name="required ? 'is-required' : ''" :align="align" v-bind="$attrs">
    <template slot-scope="scope">
      <slot name="columns" :column="scope.column" :row="scope.row" :$index="scope.$index">
        <span
          v-on="getComponentListeners(scope)"
          class="cursor-pointer text-primary"
          v-bind="typeof fieldProps === 'function' ? fieldProps(scope.row, scope.column, scope.$index) : fieldProps"
        >
          {{ formatter?.(scope.row, scope.column, scope.$index) || scope.row?.[prop] }}
        </span>
      </slot>
    </template>
  </el-table-column>
</template>
<script>
import { TableColumn } from 'element-ui'
export default {
  name: 'CpisLinkColumn',
  components: {
    ElTableColumn: TableColumn
  },
  methods: {
    handleClick(row, column, index) {
      console.log(row, column, index)
    },
    getComponentListeners(item) {
      debugger
      const listeners = {}
      // 如果item中有events配置，则应用对应的事件处理器
      if (this.fieldEvents) {
        Object.entries(this.fieldEvents).forEach(([event, handler]) => {
          listeners[event] = (...args) => {
            handler(...args, item)
          }
        })
      }
      return listeners
    }
  },
  props: {
    required: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    prop: {
      type: String,
      default: ''
    },
    align: {
      type: String,
      default: 'center'
    },
    formatter: {
      type: Function,
      default: null
    },
    editItemProps: {
      type: Object,
      default: () => ({})
    },
    fieldProps: {
      type: [Object, Function],
      default: () => ({})
    },
    fieldEvents: {
      type: Object,
      default: null
    }
  }
}
</script>

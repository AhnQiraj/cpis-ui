<template>
  <el-table-column
    :prop="prop"
    :property="prop"
    :label-class-name="required ? 'is-required' : ''"
    :align="align"
    v-bind="$attrs"
  >
    <template slot-scope="scope">
      <span
        v-on="getComponentListeners(scope)"
        class="cursor-pointer text-primary"
        v-bind="
          typeof fieldProps === 'function' ? fieldProps(scope.row, getColumn(scope.column), scope.$index) : fieldProps
        "
      >
        {{ formatter?.(scope.row, getColumn(scope.column), scope.$index) || scope.row?.[prop] }}
      </span>
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
  inject: ['cpisTable'],

  methods: {
    getColumn(column) {
      return {
        ...column,
        prop: this.prop
      }
    },
    getComponentListeners(item) {
      const listeners = {}
      // 如果item中有events配置，则应用对应的事件处理器
      if (this.fieldEvents) {
        Object.entries(this.fieldEvents).forEach(([event, handler]) => {
          listeners[event] = (...args) => {
            handler(...args, { ...item, column: this.getColumn(item.column) })
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
    prop: {
      type: String,
      default: ''
    },
    align: {
      type: String,
      default: 'left'
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

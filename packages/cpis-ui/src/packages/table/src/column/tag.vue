<template>
  <el-table-column :prop="prop" :label-class-name="required ? 'is-required' : ''" :align="align" v-bind="$attrs">
    <template slot-scope="scope">
      <CpisTag
        size="small"
        v-bind="
          typeof fieldProps === 'function' ? fieldProps(scope.row, getColumn(scope.column), scope.$index) : fieldProps
        "
      >
        {{ formatter?.(scope.row, getColumn(scope.column), scope.$index) || scope.row?.[prop] }}
      </CpisTag>
    </template>
  </el-table-column>
</template>
<script>
import { TableColumn } from 'element-ui'
export default {
  name: 'CpisTagColumn',
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
    }
  }
}
</script>

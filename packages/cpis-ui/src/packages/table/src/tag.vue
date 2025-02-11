<template>
  <el-table-column
    :prop="prop"
    :label-class-name="required ? 'is-required' : ''"
    :align="align"
    v-bind="$attrs"
  >
    <template slot-scope="scope">
      <slot
        name="columns"
        :column="scope.column"
        :row="scope.row"
        :$index="scope.$index"
      >
        <CpisTag
          size="small"
          v-bind="
            typeof fieldProps === 'function'
              ? fieldProps(scope.row, scope.column, scope.$index)
              : fieldProps
          "
        >
          {{
            formatter?.(scope.row, scope.column, scope.$index) ||
            scope.row?.[prop]
          }}
        </CpisTag>
      </slot>
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
    }
  }
}
</script>

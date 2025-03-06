<template>
  <ElTable
    ref="elTable"
    v-on="$listeners"
    v-bind="$attrs"
    border
    class="cpis-table"
    :cell-style="{ paddingTop: '8px', paddingBottom: '8px' }"
    :header-cell-style="{
      backgroundColor: '#F5F5F5',
      color: '#434343',
      paddingBottom: '8px',
      paddingTop: '8px'
    }"
  >
    <template v-for="(_, name) in $slots" #[name]="scopeData">
      <slot :name="name" v-bind="scopeData"></slot>
    </template>
  </ElTable>
</template>
<script>
import { Table } from 'element-ui'
export default {
  name: 'CpisBasicTable',
  comments: {
    ElTable: Table
  },
  getTable() {
    return this.$refs.elTable
  }
}
</script>

<template>
  <CpisDialog :visible.sync="visible" :size="size" v-bind="$attrs" v-on="$listeners">
    <CpisTreeContainer :tree-props="treeProps">
      <div v-if="multiple" slot="header" class="p-2 min-h-[42px]">
        <div class="border border-dashed border-gray-3 min-h-[42px] flex items-center gap-2 p-2 box-border">
          <cpis-tag
            v-for="(item, index) in selection"
            size="small"
            :key="item.id"
            closable
            @close="handleTagClose(item, index)"
          >
            {{ item.name }}
          </cpis-tag>
        </div>
      </div>
      <CpisTable
        ref="table"
        v-bind="tableProps"
        :selectable="multiple"
        @select="handleSelect"
        @current-change="handleCurrentChange"
        :highlight-current-row="!multiple"
      />
    </CpisTreeContainer>
    <template #footer>
      <slot name="footer">
        <CpisButton type="primary" @click="handleOk">确定</CpisButton>
        <CpisButton @click="handleCancel">取消</CpisButton>
      </slot>
    </template>
  </CpisDialog>
</template>
<script>
import CpisTable from '../../table/index'
import CpisDialog from './dialog.vue'
import CpisTreeContainer from '../../tree-container/index'
import CpisTag from '../../tag/index'
export default {
  name: 'CpisDialogTable',
  components: {
    CpisDialog,
    CpisTreeContainer,
    CpisTag,
    CpisDialog
  },
  data() {
    return {
      currentSelection: [],
      currentRow: null
    }
  },
  methods: {
    handleOk() {
      this.$emit('update:visible', false)
      this.$emit('ok', this.multiple ? this.currentSelection : this.currentRow)
    },
    handleCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    handleTagClose(item, index) {
      this.currentSelection.splice(index, 1)
      this.$refs.table.getTable
    },
    handleSelect(selection, row) {
      console.log('select', selection)
      console.log('row', row)

      this.currentSelection = selection
    },
    // 当前行变化
    handleCurrentChange(row, oldCurrentRow) {
      this.currentRow = row
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'large',
      validator(value) {
        // 40 60 80
        return ['small', 'medium', 'large'].includes(value)
      }
    },
    treeProps: {
      type: Object,
      default: () => ({})
    },
    tableProps: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

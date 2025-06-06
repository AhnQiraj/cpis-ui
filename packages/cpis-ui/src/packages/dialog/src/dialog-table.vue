<template>
  <CpisDialog
    :visible="localVisible"
    @update:visible="$emit('update:visible', $event)"
    :size="size"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <div class="flex flex-col size-full gap-2">
      <div v-if="multiple" slot="header" class="p-2 min-h-[42px] bg-white">
        <div class="border border-dashed border-gray-3 min-h-[42px] flex items-center gap-2 p-2 box-border">
          <cpis-tag
            v-for="(item, index) in currentData"
            size="small"
            :key="item[selectedDataKey]"
            closable
            @close="handleTagClose(item, index)"
          >
            {{ item[selectedDataLabel] }}
          </cpis-tag>
        </div>
      </div>
      <CpisTable
        ref="table"
        class="flex-1"
        v-bind="tableProps"
        :selectable="multiple"
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChange"
        :highlight-current-row="!multiple"
        @data-loaded="handleDataLoaded"
      />
    </div>
    <template #footer>
      <slot name="footer">
        <CpisButton type="primary" @click="handleOk">确定</CpisButton>
        <CpisButton @click="handleCancel">取消</CpisButton>
      </slot>
    </template>
  </CpisDialog>
</template>
<script>
import listeners from '../../../mixins/listeners.js'
import CpisTable from '../../table/index'
import CpisDialog from './dialog.vue'
import CpisTag from '../../tag/index'
export default {
  mixins: [listeners],
  name: 'CpisDialogTable',
  components: {
    CpisDialog,
    CpisTag,
    CpisDialog,
    CpisTable
  },
  computed: {
    localVisible: {
      get() {
        return this.$props.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    }
  },
  data() {
    return {
      currentData: this.selectedData || []
    }
  },
  watch: {
    selectedData: {
      handler(newVal) {
        if (newVal && Array.isArray(newVal)) {
          this.currentData = [...newVal]
        }
      },
      immediate: true
    },
    visible(newVal) {
      if (newVal) {
        // this.key++
        // // 当对话框打开时，更新表格选择以匹配currentData
        // this.$nextTick(() => {
        //   if (this.$refs.table && this.multiple) {
        //     const table = this.$refs.table
        //     // 清除当前选择
        //     table.clearSelection()
        //     // 根据currentData设置选择
        //     this.currentData.forEach(row => {
        //       table.toggleRowSelectionByRowKey(row[this.selectedDataKey], true)
        //     })
        //   }
        // })
      }
    }
  },
  methods: {
    handleDataLoaded({ dataSource }) {
      this.$nextTick(() => {
        if (this.$refs.table && this.multiple) {
          const table = this.$refs.table
          // 清除当前选择
          table.clearSelection()
          // 根据currentData设置选择
          this.currentData.forEach(row => {
            table.toggleRowSelectionByRowKey(row[this.selectedDataKey], true)
          })
        }
      })
    },
    handleOk() {
      this.$emit('update:visible', false)
      this.$emit('ok', this.currentData)
    },
    handleCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    handleTagClose(item, index) {
      this.currentData.splice(index, 1)
      this.$refs.table.toggleRowSelection(item, false)
    },
    handleSelectionChange(selection) {
      this.currentData = selection
    },
    // 当前行变化
    handleCurrentChange(row, oldCurrentRow) {
      // 防止多选下，点击表格导致数据被清空
      if (this.multiple) {
        return
      }
      this.currentData = [row]
    },
    getTable() {
      return this.$refs.table
    },
    getTree() {
      return this.$refs.tree
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    selectedData: {
      type: Array,
      default: () => []
    },
    selectedDataLabel: {
      type: String,
      default: 'name'
    },
    selectedDataKey: {
      type: String,
      default: 'id'
    },
    size: {
      type: String,
      default: 'large',
      validator(value) {
        // 40 60 80
        return ['small', 'medium', 'large'].includes(value)
      }
    },
    tableProps: {
      type: Object,
      default: () => ({})
    },
    tableEvents: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

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
        class="flex-1"
        v-bind="tableProps"
        :selectable="multiple"
        @select="handleSelect"
        @current-change="handleCurrentChange"
        :highlight-current-row="!multiple"
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
      singleData: null,
      multipleData: []
    }
  },
  methods: {
    handleOk() {
      this.$emit('update:visible', false)
      this.$emit('ok', this.multiple ? this.multipleData : this.singleData)
    },
    handleCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    handleTagClose(item, index) {
      this.multipleData.splice(index, 1)
      // this.$refs.table.getTable
    },
    handleSelect(selection, row) {
      console.log('select', selection)
      console.log('row', row)

      this.multipleData = selection
    },
    // 当前行变化
    handleCurrentChange(row, oldCurrentRow) {
      this.singleData = row
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
    selectData: {
      type: Array,
      default: () => []
    },
    selectDataLabel: {
      type: String,
      default: 'name'
    },
    selectDataKey: {
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

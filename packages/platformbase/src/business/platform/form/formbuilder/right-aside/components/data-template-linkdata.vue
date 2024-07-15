<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="data-template-linkdata-dialog"
    top="0"
    width="50%"
    append-to-body
    @open="getFormData"
    @close="closeDialog"
  >
    <el-table ref="elTable" :data="formData" border stripe>
      <el-table-column label="返回结果字段" prop="label" />
      <el-table-column label="绑定显示的属性" prop="field">
        <template slot-scope="scope">
          <el-select v-model="scope.row.field" clearable>
            <el-option
              v-for="field in boFields"
              :key="field.name"
              :value="field.name"
              :label="field.label"
            />
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import ActionUtils from '@platform/utils/action'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '设置联动数据'
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    fields: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      formName: 'form',
      toolbars: [
        { key: 'confirm' },
        { key: 'reset', label: '重置', icon: 'ibps-icon-undo', type: 'danger' },
        { key: 'cancel' }
      ],
      formData: [],
      rules: {
        id: [{ required: true, message: this.$t('validate.required') }],
        text: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  computed: {
    boFields() {
      return this.fields || []
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        if (this.dialogVisible) {
          this.$nextTick(() => {
            this.$refs.elTable.doLayout()
          })
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.toolbars = null
    this.formData = null
    this.rules = null
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'reset':
          this.handleReset()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleConfirm() {
      this.$emit('callback', this.formData)
      this.closeDialog()
    },
    handleReset() {
      for (let i = 0; i < this.formData.length; i++) {
        this.formData[i].field = ''
      }
      ActionUtils.success('重置成功！')
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      if (this.$utils.isEmpty(this.columns)) {
        return
      }
      const formDataMap = {}
      if (this.$utils.isNotEmpty(this.data)) {
        const data = JSON.parse(JSON.stringify(this.data))
        data.forEach(d => {
          formDataMap[d.name] = d
        })
      }
      const fieldsMap = {}
      if (this.$utils.isNotEmpty(this.boFields)) {
        const data = JSON.parse(JSON.stringify(this.boFields))
        data.forEach(d => {
          fieldsMap[d.name] = d
        })
      }
      const formData = []
      for (let i = 0; i < this.columns.length; i++) {
        const column = this.columns[i]
        const name = column.name
        const data = {
          name: name,
          label: column.label,
          field: ''
        }
        if (formDataMap[name]) {
          const fieldData = formDataMap[name] || {}
          const field = fieldData.field
          if (this.$utils.isNotEmpty(field) && fieldsMap[field]) {
            data['field'] = field
          }
        }
        formData.push(data)
      }
      this.formData = formData
    }
  }
}
</script>
<style lang="scss" >
.data-template-linkdata-dialog{
  .el-dialog__body{
    padding-top:10px;
  }
}
</style>

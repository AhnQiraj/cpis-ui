<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="data-template-condition-dialog"
    top="5vh"
    width="50%"
    append-to-body
    @open="getFormData"
    @close="closeDialog"
  >
    <el-table ref="elTable" :data="formData" border>
      <el-table-column label="参数名称" prop="fieldLabel" width="150px" />
      <el-table-column label="参数绑定方式" prop="mode" width="200px">
        <template slot-scope="scope">
          <el-select v-model="scope.row.mode">
            <el-option value="bind" label="绑定表单字段" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="绑定数据字段或固定值" prop="value">
        <template slot-scope="scope">
          <ibps-tree-select
            v-model="scope.row.value"
            :data="treeFields"
            :props="props"
            :node-key="nodeKey"
            :select-mode="selectMode"
            clearable
          />
          <!-- <el-select v-model="scope.row.value" clearable>
            <el-option
              v-for="field in fields"
              :key="field.name"
              :value="field.name"
              :label="field.label"
            />
          </el-select> -->
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
// import ActionUtils from '@platform/utils/action'
import TreeUtils from '@platform/utils/tree'
import IbpsTreeSelect from '@platform/components/ibps-tree-select'
export default {
  components: {
    IbpsTreeSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '设置动态条件'
    },
    conditions: {
      type: Object,
      default: () => {
        return {}
      }
    },
    props: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'label'
        }
      }
    },
    nodeKey: {
      type: String,
      default: 'name'
    },
    selectMode: {
      type: String,
      default: 'leaf'
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
    treeFields() {
      return TreeUtils.transformToTreeFormat(this.fields)
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
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      if (this.$utils.isEmpty(this.conditions)) {
        return
      }
      const formDataMap = {}
      if (this.$utils.isNotEmpty(this.data)) {
        const data = JSON.parse(JSON.stringify(this.data))
        data.forEach(d => {
          formDataMap[d.fieldName] = d
        })
      }
      this.formData = []
      for (const key in this.conditions) {
        const condition = this.conditions[key]
        let data = {}
        if (formDataMap[key]) {
          data = formDataMap[key]
        } else {
          data = {
            fieldName: key,
            fieldLabel: condition.label,
            mode: 'bind',
            value: ''
          }
        }
        this.formData.push(data)
      }
    }
  }
}
</script>

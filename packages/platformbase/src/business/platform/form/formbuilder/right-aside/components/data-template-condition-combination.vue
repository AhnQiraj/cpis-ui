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
    <el-form :model="formData" label-width="100px">
      <el-form-item
        label="联动控件"
        prop="bindField"
        :rules="{
          required: true, message: '必填'
        }"
      >
        <el-select v-model="formData.bindField" style="width:100%;" @change="changField">
          <el-option
            v-for="item in formFields"
            :key="item.name"
            :value="item.name"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table ref="elTable" :data="formData.conditions" border>
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
          <el-select
            v-if="formData.bindFieldType === 'onlineForm' || formData.bindFieldType === 'detailForm'"
            v-model="scope.row.value"
            style="width:100%"
            placeholder="绑定数据字段"
          >
            <el-option
              v-for="item in mappingFields"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            >
              <span class="ibps-fl">{{ item.name }}</span>
              <span class="casade-field__desc">{{ item.key }}</span>
            </el-option>
          </el-select>
          <el-input v-else v-model="scope.row.value" placeholder="绑定数据字段key" />
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
import { getFormDataByFormKey, buildTree } from '@platform/api/platform/form/formDef'
export default {
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
      type: Object
    },
    formFields: {
      type: Array
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
      formData: {},
      mappingFields: []
    }
  },
  computed: {
    formFieldMap() {
      if (this.$utils.isNotEmpty(this.formFields)) {
        const formFieldMap = {}
        this.formFields.forEach(field => {
          formFieldMap[field.name] = field
        })
        return formFieldMap
      } else {
        return {}
      }
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
      const conditionDataMap = {}
      let formData = {}
      if (this.$utils.isNotEmpty(this.data)) {
        formData = JSON.parse(JSON.stringify(this.data))
        this.changField(formData.bindField)
        const conditions = formData.conditions
        conditions.forEach(d => {
          conditionDataMap[d.fieldName] = d
        })
      }
      const conditionData = []
      for (const key in this.conditions) {
        const condition = this.conditions[key]
        let data = {}
        if (conditionDataMap[key]) {
          data = conditionDataMap[key]
        } else {
          data = {
            fieldName: key,
            fieldLabel: condition.label,
            mode: 'bind',
            value: ''
          }
        }
        conditionData.push(data)
      }
      this.formData = formData
      this.formData.conditions = conditionData
    },
    async changField(key) {
      const formField = this.formFieldMap[key]
      if (this.$utils.isEmpty(formField)) {return}
      this.formData.bindFieldType = formField.fieldType
      if (formField.fieldType === 'onlineForm' || formField.fieldType === 'detailForm') {
        this.mappingFields = await this.getFieldsByFormKey(formField.key)
      }
    },
    // 通过表单key获取业务对象
    async getFieldsByFormKey(key) {
      return new Promise((resolve, reject) => {
        getFormDataByFormKey({
          formKey: key
        }).then(response => {
          const formData = this.$utils.parseData(response.data)
          // 2.buildTree
          buildTree({
            boCode: formData.code,
            boDefId: formData.busId,
            mode: formData.mode || ''
          }).then(response => {
            const _data = this.$utils.parseData(response.data)
            resolve(this.filterField(_data))
          }).catch((e) => {
            resolve([])
          })
        }).catch(() => {
          resolve([])
        })
      })
    },
    filterField(data, name = 'field') { // 过滤非主表的字段
      if (this.$utils.isEmpty(data)) {return []}
      const fields = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].attrType === name) { // 过滤非主表的字段
          fields.push(data[i])
        }
      }
      return fields
    }
  }
}
</script>

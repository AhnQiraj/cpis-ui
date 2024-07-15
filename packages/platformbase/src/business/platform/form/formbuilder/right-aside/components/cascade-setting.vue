<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    append-to-body
    top="5vh"
    width="70%"
    class="ibps-dialog-70"
    @close="closeDialog"
    @open="getFormData"
  >
    <el-form
      v-if="dialogVisible"
      :ref="formName"
      v-loading="loading"
      :model="formData"
      label-width="120px"
      label-suffix=":"
      :element-loading-text="$t('common.loading')"
      @submit.native.prevent
    >
      <el-form-item
        label="联动名称"
        prop="label"
        :rules="{
          required: true, message: '必填'
        }"
      >
        <el-input v-model="formData.label" placeholder="联动名称" />
      </el-form-item>
      <el-form-item
        label="联动控件"
        prop="field"
        :rules="{
          required: true, message: '必填'
        }"
      >
        <el-select v-model="formData.field" style="width:100%;" @change="changField">
          <el-option
            v-for="item in formFields"
            :key="item.name"
            :value="item.name"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <div v-if="formData.fieldType === 'dataTemplate'" class="ibps-pb-10">
        <el-table ref="elTable" :data="formData.casadeFields" empty-text="未设置过滤条件" border>
          <el-table-column label="参数名称" prop="fieldLabel" width="300px" />
          <el-table-column label="参数绑定方式" prop="mode" width="200px">
            <template slot-scope="scope">
              <el-select v-model="scope.row.mode">
                <el-option value="bind" label="绑定字段" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="绑定当前控件字段" prop="value">
            <template slot-scope="scope">
              <ibps-tree-select
                v-if="fieldType === 'onlineForm' || fieldType === 'detailForm'"
                v-model="scope.row.value"
                :data="curFields"
                :props="{
                  children: 'children',
                  label: 'name'
                }"
                node-key="key"
                select-mode="leaf"
                clearable
              />
              <el-input v-else v-model="scope.row.value" placeholder="绑定当前控件字段key" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!---表单、详情表单、自定义--->
      <el-card v-else class="ibps-m-10">
        <div slot="header" class="clearfix">
          <span>设置级联字段</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="addCasadeField">添加</el-button>
        </div>
        <el-table ref="elTable" :data="formData.casadeFields" empty-text="未设置级联字段" border>
          <el-table-column label="当前控件字段" prop="fieldLabel" width="300px">
            <template slot-scope="scope">
              <el-select
                v-if="fieldType === 'onlineForm' || fieldType === 'detailForm'"
                v-model="scope.row.key"
                placeholder="请选择控件字段"
                style="width:100%"
              >
                <el-option
                  v-for="item in curFields"
                  :key="item.key"
                  :label="item.name"
                  :value="item.key"
                >
                  <span class="ibps-fl">{{ item.name }}</span>
                  <span class="casade-field__desc">{{ item.key }}</span>
                </el-option>
              </el-select>
              <el-input v-else v-model="scope.row.key" placeholder="当前控件字段key" />
            </template>
          </el-table-column>
          <el-table-column label="级联方式">级联</el-table-column>
          <el-table-column label="级联控件字段" prop="value">
            <template slot-scope="scope">
              <el-select
                v-if="formData.fieldType === 'onlineForm' || formData.fieldType === 'detailForm'"
                v-model="scope.row.value"
                style="width:100%"
                placeholder="级联控件字段"
              >
                <el-option
                  v-for="item in mappingFields"
                  :key="item[relation.value]"
                  :label="item[relation.label]"
                  :value="item[relation.value]"
                >
                  <span class="ibps-fl">{{ item.name }}</span>
                  <span class="casade-field__desc">{{ item.key }}</span>
                </el-option>
              </el-select>
              <el-input v-else v-model="scope.row.value" placeholder="级联控件字段key" />
            </template>
          </el-table-column>
          <el-table-column label="管理" width="80px">
            <template slot-scope="scope">
              <el-link type="danger" @click="removeCasadeField(scope.$index)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-form>
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
import FormFieldUtil from '@platform/business/platform/form/utils/formFieldUtil'
import { getSelectorDataByKey } from '@platform/api/platform/data/dataTemplate'
import { getFormDataByFormKey, buildTree } from '@platform/api/platform/form/formDef'
import { buildDynamicParams } from '@platform/business/platform/data/templaterender/utils'
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
      default: '级联设置'
    },
    data: { // 数据
      type: Object
    },
    fields: {
      type: Array
    },
    fieldItem: {
      type: Object
    }
  },
  data() {
    return {
      formName: 'cascadeForm',
      formData: {},
      formFields: [],
      curFields: [],
      mappingFields: [],
      dialogVisible: false,
      loading: false,
      toolbars: [ // 底部按钮
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      valueTypeOptions: [
        {
          value: 'fixed',
          label: '固定值'
        }, {
          value: 'bo',
          label: '业务对象'
        }, {
          value: 'script',
          label: '脚本'
        }
      ],
      relation: { // 关联字段显示以及保存的name值
        value: 'key',
        label: 'name'
      }
    }
  },
  computed: {
    defaultValueTypeOptions() {
      return this.valueTypeOptions
    },
    fieldType() {
      return this.fieldItem.field_type
    },
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
      },
      immediate: true
    }
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
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    handleConfirm() {
      this.$refs[this.formName].validate((valid) => {
        if (valid) {
          if (this.$utils.isEmpty(this.formData.casadeFields)) {
            this.$message({
              message: '请设置级联字段',
              type: 'warning'
            })
            return
          }
          for (let i = 0; i < this.formData.casadeFields.length; i++) {
            const casadeField = this.formData.casadeFields[i]
            if (this.formData.fieldType === 'dataTemplate') {
              if (this.$utils.isEmpty(casadeField.fieldName)) {
                this.$message({
                  message: '请绑定当前控件字段',
                  type: 'warning'
                })
                return
              }
            } else {
              if (this.$utils.isEmpty(casadeField.key)) {
                this.$message({
                  message: '请选择或输入当前控件字段',
                  type: 'warning'
                })
                return
              }
            }
            if (this.$utils.isEmpty(casadeField.value)) {
              this.$message({
                message: '请选择或输入级联控件字段',
                type: 'warning'
              })
              return
            }
          }
          const data = JSON.parse(JSON.stringify(this.formData))
          this.closeDialog()
          this.$emit('callback', data)
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    async  getFormData() {
      this.formFields = FormFieldUtil.getFormFields(this.fields, this.fieldItem ? this.fieldItem.id : '')
      if (this.fieldType === 'onlineForm' || this.fieldType === 'detailForm') {
        this.curFields = await this.getFieldsByFormKey(this.fieldItem.field_options.formKey)
      }
      if (this.$utils.isEmpty(this.data)) {
        this.formData = {}
      } else {
        const data = JSON.parse(JSON.stringify(this.data))
        this.changField(data.field)
        this.formData = data
      }
      this.formValidate()
    },
    // 通过表单key获取业务对象
    async getFieldsByFormKey(key) {
      return new Promise((resolve, reject) => {
        this.loading = true
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
            this.loading = false
          }).catch((e) => {
            this.loading = false
            resolve([])
          })
        }).catch(() => {
          this.loading = false
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
    },
    // 通过模板key获取业务对象
    getFieldsByTemplateKey(key) {
      if (this.$utils.isEmpty(key)) {return}
      this.loading = true
      getSelectorDataByKey({
        dataTemplateKey: key
      }).then(response => {
        const data = response.data
        // 过滤条件
        let dynamicConditions = {}
        if (this.$utils.isNotEmpty(data.filterConditions)) {
          const filterConditions = this.$utils.parseJSON(data.filterConditions)
          if (this.$utils.isNotEmpty(filterConditions)) {
            dynamicConditions = buildDynamicParams(filterConditions)
          }
        }
        this.dynamicConditions = dynamicConditions
        this.initDynamicConditions(dynamicConditions)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    initDynamicConditions(conditions) {
      if (this.$utils.isEmpty(conditions)) {
        this.formData.casadeFields = []
        return
      }
      let casadeFields = []
      const formDataMap = {}
      if (this.$utils.isNotEmpty(this.formData.casadeFields)) {
        casadeFields = JSON.parse(JSON.stringify(this.formData.casadeFields))
        casadeFields.forEach(d => {
          formDataMap[d.fieldName] = d
        })
        this.formData.casadeFields = []
      } else {
        this.$set(this.formData, 'casadeFields', [])
      }
      for (const key in conditions) {
        const condition = conditions[key]
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
        this.formData.casadeFields.push(data)
      }
    },
    async changField(key) {
      const formField = this.formFieldMap[key]
      if (!formField) {
        this.$set(this.formData, 'casadeFields', [])
        return
      }
      this.formData.fieldType = formField.fieldType
      if (formField.fieldType === 'onlineForm' || formField.fieldType === 'detailForm') {
        this.mappingFields = await this.getFieldsByFormKey(formField.key)
      } else if (formField.fieldType === 'dataTemplate') {
        this.getFieldsByTemplateKey(formField.key)
      }
    },
    addCasadeField() {
      if (this.$utils.isEmpty(this.formData.casadeFields)) {
        this.$set(this.formData, 'casadeFields', [])
      }
      if (this.$utils.isEmpty(this.formData.field)) {
        this.$message({
          message: '请选择数据来源字段',
          type: 'warning'
        })
        return
      }
      const data = {
        key: (this.fieldType === 'onlineForm' || this.fieldType === 'detailForm') ? this.curFields[0][this.relation.value] : '',
        valueType: 'cascade',
        value: (this.formData.fieldType === 'onlineForm' || this.formData.fieldType === 'detailForm') ? this.mappingFields[0][this.relation.value] : ''
      }
      this.formData.casadeFields.push(data)
    },
    // 删除关联字段映射
    removeCasadeField(index) {
      this.formData.casadeFields.splice(index, 1)
    }
  }
}
</script>

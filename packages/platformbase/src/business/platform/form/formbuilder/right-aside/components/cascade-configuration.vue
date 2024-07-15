<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    append-to-body
    top="5vh"
    width="70%"
    class="ibps-casade-configuration ibps-dialog-70"
    @close="closeDialog"
    @open="getFormData"
  >
    <el-form
      :ref="formName"
      class="casade-configuration"
      :model="formData"
      label-width="120px"
      label-suffix=":"
      @submit.native.prevent
    >
      <el-form-item label="级联类型" prop="label">
        <el-select v-model="formData.type" style="width:100%;" @change="changeType">
          <el-option
            v-for="item in defaultTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="formData.type === 'fixed'"
        label="超链接地址"
        prop="url"
        :rules="{
          required: true, message: '必填'
        }"
      >
        <el-input v-model="formData.url" placeholder="超链接地址">
          <el-button slot="append" type="primary" style="background: #a6a9ad; border-color: #a6a9ad;color: #FFF;" @click="addParam">添加参数</el-button>
        </el-input>
      </el-form-item>
      <el-row v-if="formData.type === 'form' || formData.type === 'detail' || formData.type === 'combination'">
        <el-col :span="22">
          <el-form-item
            :label="formData.type === 'form'?'在线表单':formData.type === 'detail'?'详情表单':'组合表单'"
            prop="formKey"
            :rules="{
              required: true, message: '必填'
            }"
          >
            <form-def-selector2
              v-model="formData.formKey"
              :form-type="formData.type"
              value-key="key"
              @change="handlerChangeForm"
            />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="info" style="width:100%" @click="addParam">添加参数</el-button>
        </el-col>
      </el-row>
      <el-row v-else-if="formData.type === 'dataTemplate'">
        <el-col :span="22">
          <el-form-item
            label="数据模板"
            prop="bind_template_key"
            :rules="{
              required: true, message: '必填'
            }"
          >
            <data-template-selector
              v-model="formData.bind_template_key"
              value-key="key"
              type="default"
              @change="handlerInput"
            />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="info" style="width:100%" @click="addParam">添加参数</el-button>
        </el-col>
      </el-row>
      <!--参数设置-->
      <template v-if="formData.params && formData.params.length >0">
        <fieldset class="ibps-fieldset ibps-fieldset--solid">
          <legend style=" width: 90px;border-bottom:0;margin-bottom:10px;">
            <span :style="'marginLeft:8px;font-size:16px;'">参数设置</span>
          </legend>
          <el-card v-for="(param,i) in formData.params" :key="i" class="ibps-m-10">
            <div slot="header" class="clearfix">
              <span>参数信息({{ i+1 }})</span>
              <el-link style="float: right; padding: 3px 0" type="danger" @click="removeParam(i)">删除</el-link>
            </div>
            <el-form-item
              label="参数键"
              :rules="{
                required: true, message: '必填'
              }"
            >
              <el-input v-model="formData.params[i].key" placeholder="参数键" />
            </el-form-item>
            <el-form-item label="参数类型">
              <el-select v-model="formData.params[i].type" placeholder="请选择" style="width:100%">
                <el-option value="varchar" label="字符串" />
                <el-option value="number" label="数字" />
                <el-option value="date" label="日期" />
              </el-select>
            </el-form-item>
            <el-form-item label="值来源">
              <el-select
                v-model="formData.params[i].valueType"
                placeholder="请选择"
                style="width:100%"
                @change="changeValueType('params',i)"
              >
                <el-option
                  v-for="item in defaultValueTypeOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="参数值">
              <el-input
                v-if="formData.params[i].valueType === 'fixed'"
                v-model="formData.params[i].value"
                placeholder="参数值"
              />
              <el-select
                v-else-if="formData.params[i].valueType === 'bo'"
                v-model="formData.params[i].value"
                placeholder="请选择参数值"
                style="width:100%"
              >
                <el-option
                  v-for="item in boFields"
                  :key="item.key"
                  :label="item.name"
                  :value="item.key"
                >
                  <span class="ibps-fl">{{ item.name }}</span>
                  <span class="casade-field__desc">{{ item.key }}</span>
                </el-option>
              </el-select>
              <el-button
                v-else-if="formData.params[i].valueType === 'script'"
                type="primary"
                @click="handleDynamicScript( 'params',i)"
              >设置参数脚本</el-button>
            </el-form-item>
          </el-card>
        </fieldset>
      </template>
      <el-form-item
        v-if="formData.type === 'form'"
        label="数据处理方式"
        prop="dataType"
        :rules="{
          required: false
        }"
      >
        <el-radio-group v-model="formData.dataType" @change="changeDataType">
          <el-radio
            v-for="item in dataTypeOptions"
            :key="item.value"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 设置级联字段 -->
      <template v-if="formData.type === 'form' && formData.dataType==='add'">
        <el-card
          class="ibps-m-10"
        >
          <div slot="header" class="clearfix">
            <span>设置级联字段</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="addCasadeField">添加</el-button>
          </div>
          <el-table ref="elTable" :data="formData.casadeFields" empty-text="未设置级联字段" border>
            <el-table-column label="目标表单字段" prop="fieldLabel" width="300px">
              <template slot-scope="scope">
                <el-select v-model="scope.row.key" style="width:100%" placeholder="请选择目标字段">
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
              </template>
            </el-table-column>
            <el-table-column label="映射来源" prop="valueType" width="200px">
              <template slot-scope="scope">
                <el-select v-model="scope.row.valueType" @change="changeValueType('casadeFields',scope.$index)">
                  <el-option
                    v-for="item in defaultValueTypeOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="映射值/业务对象" prop="value">
              <template slot-scope="scope">
                <el-input
                  v-if="scope.row.valueType === 'fixed'"
                  v-model="scope.row.value"
                  placeholder="映射值"
                />
                <el-select
                  v-else-if="scope.row.valueType === 'bo'"
                  v-model="scope.row.value"
                  placeholder="请选择业务对象"
                  style="width:100%"
                >
                  <el-option
                    v-for="item in boFields"
                    :key="item.key"
                    :label="item.name"
                    :value="item.key"
                  >
                    <span class="ibps-fl">{{ item.name }}</span>
                    <span class="casade-field__desc">{{ item.key }}</span>
                  </el-option>
                </el-select>
                <el-button
                  v-else-if="scope.row.valueType === 'script'"
                  type="primary"
                  @click="handleDynamicScript('casadeFields',scope.$index)"
                >设置映射值脚本</el-button>
              </template>
            </el-table-column>
            <el-table-column label="管理" width="80px">
              <template slot-scope="scope">
                <el-link type="danger" @click="removeCasadeField(scope.$index)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </template>
      <template v-else-if="formData.type==='detail' || (formData.type === 'form' && formData.dataType==='edit')">
        <el-form-item label="主键来源">
          <el-select v-model="formData.pkValueType" style="width:100%;" @change="changePkValueType">
            <el-option
              v-for="item in defaultValueTypeOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="主键值">
          <el-input
            v-if="formData.pkValueType === 'fixed'"
            v-model="formData.pkValue"
            placeholder="请输入主键值"
          />
          <el-select
            v-else-if="formData.pkValueType==='bo'"
            v-model="formData.pkValue"
            placeholder="请选择"
            style="width:100%;"
          >
            <el-option
              v-for="item in boFields"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            >
              <span class="ibps-fl">{{ item.name }}</span>
              <span class="casade-field__desc">{{ item.key }}</span>
            </el-option>
          </el-select>
          <el-input
            v-else-if="formData.pkValueType === 'script'"
            v-model="formData.pkValue"
            type="textarea"
            placeholder="请输入主键值"
          />
        </el-form-item>
        <el-form-item label="是否必填">
          <el-checkbox v-model="formData.required">必填</el-checkbox>
          <el-input v-if="formData.required" v-model="formData.requiredMsg" placeholder="必填提示信息" />
        </el-form-item>
      </template>
      <div v-else-if="formData.type === 'dataTemplate' && formData.casadeFields && formData.casadeFields.length >0" class="ibps-pb-10">
        <el-table ref="elTable" :data="formData.casadeFields" empty-text="未设置过滤条件" border>
          <el-table-column label="参数名称" prop="fieldLabel" width="300px" />
          <el-table-column label="参数绑定方式" prop="mode" width="200px">
            <template slot-scope="scope">
              <el-select v-model="scope.row.mode">
                <el-option value="bind" label="绑定字段" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="绑定数据字段" prop="value">
            <template slot-scope="scope">
              <ibps-tree-select
                v-model="scope.row.value"
                :data="boFields"
                :props="{
                  children: 'children',
                  label: 'name'
                }"
                node-key="key"
                select-mode="leaf"
                clearable
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-form-item label="显示方式" prop="openType">
        <el-radio-group v-model="formData.openType" @change="changeOpenType">
          <el-radio
            v-for="item in openTypeOptions"
            :key="item.value"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" placeholder="标题" />
      </el-form-item>
      <el-form-item v-if="formData.openType === 'dialog'" label="弹窗尺寸" prop="label">
        <div>
          <div>宽度
            <el-input-number
              v-model="formData.width"
              size="mini"
              :min="300"
              :precision="0"
              :step="1"
            />
            <el-tag type="info" size="medium" style="margin-left:10px;">像素(px)</el-tag>
          </div>
          <div>高度
            <el-input-number
              v-model="formData.height"
              size="mini"
              :min="300"
              :precision="0"
              :step="1"
            />
            <el-tag type="info" size="medium" style="margin-left:10px;">像素(px)</el-tag>
          </div>
        </div>
      </el-form-item>
      <!--动态脚本-->
      <dynamic-script
        :visible="dynamicScriptVisible"
        label="设置脚本"
        :bo-data="boData"
        :data="dynamicScriptValue"
        @callback="setDynamicScriptValue"
        @close="visible => dynamicScriptVisible = visible"
      />
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
import Ids from 'ids'
import ActionUtils from '@platform/utils/action'
import { cascadeTypeOptions } from '@platform/business/platform/form/constants/fieldOptions'
import FormDefSelector2 from '@platform/business/platform/form/form-def/selector2'
import DataTemplateSelector from '@platform/business/platform/data/dataTemplate/selector'
import { getSelectorDataByKey } from '@platform/api/platform/data/dataTemplate'
import { getFormDataByFormKey, buildTree } from '@platform/api/platform/form/formDef'
import { buildDynamicParams } from '@platform/business/platform/data/templaterender/utils'
import IbpsTreeSelect from '@platform/components/ibps-tree-select'
import DynamicScript from './dynamic-script'
export default {
  components: {
    FormDefSelector2,
    DataTemplateSelector,
    IbpsTreeSelect,
    DynamicScript
  },
  props: {
    defaultValueTypes: { // 默认值类型
      type: String,
      default: 'fixed,form,dataTemplate,detail,combination'
    },
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
    boFields: {
      type: Array,
      default: () => []
    },
    boData: {
      type: Array
    }
  },
  data() {
    return {
      formName: 'cascadeForm',
      formData: {},
      dialogVisible: false,
      toolbars: [ // 底部按钮
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      openTypeOptions: [ // 显示方式
        {
          value: 'fullscreen',
          label: '全屏'
        }, {
          value: 'dialog',
          label: '弹窗'
        }, {
          value: 'url',
          label: '新页面'
        }, {
          value: 'tab',
          label: '标签页'
        }
      ],
      dataTypeOptions: [
        {
          value: 'add',
          label: '新增'
        }, {
          value: 'edit',
          label: '编辑'
        }
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
      mappingFields: [], // 对应的表单业务对象字段
      relation: { // 关联字段显示以及保存的name值
        value: 'key',
        label: 'name'
      },
      dynamicScriptVisible: false,
      dynamicScriptValue: '',
      dynamicScriptIndex: -1,
      dynamicScriptType: 'params'
    }
  },
  computed: {
    defaultTypeOptions() {
      const options = []
      cascadeTypeOptions.forEach((type) => {
        if (this.defaultValueTypes.includes(type.value)) {
          options.push(type)
        }
      })
      return options
    },
    defaultValueTypeOptions() {
      if (this.hasBoData) {return this.valueTypeOptions}
      return this.valueTypeOptions.filter((item) => {
        return item.value !== 'bo'
      })
    },
    hasBoData() {
      if (this.$utils.isEmpty(this.boFields)) {
        return false
      }
      return true
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    data: {
      handler: function(val, oldVal) {
        if (this.$utils.isEmpty(val)) {return}
        this.formData = JSON.parse(JSON.stringify(val))
      },
      immediate: true
    }
  },
  methods: {
    // 添加参数
    addParam() {
      if (this.$utils.isEmpty(this.formData.params)) {
        this.$set(this.formData, 'params', [])
      }
      const data = {
        key: '',
        type: 'varchar',
        valueType: 'fixed',
        value: ''
      }
      this.formData.params.push(data)
    },
    removeParam(index) {
      this.formData.params.splice(index, 1)
    },
    //
    addCasadeField() {
      if (this.$utils.isEmpty(this.formData.casadeFields)) {
        this.$set(this.formData, 'casadeFields', [])
      }
      let data = {
        key: '',
        valueType: 'fixed',
        value: ''
      }
      if (this.formData.type === 'form') {
        if (this.$utils.isEmpty(this.mappingFields)) {
          this.$message({
            message: '请选择表单',
            type: 'warning'
          })
          return
        }
        data = {
          key: this.mappingFields[0][this.relation.value],
          valueType: this.hasBoData ? 'bo' : 'fixed',
          value: this.hasBoData ? this.boFields[0][this.relation.value] : ''
        }
      }
      this.formData.casadeFields.push(data)
    },
    // 删除关联字段映射
    removeCasadeField(index) {
      this.formData.casadeFields.splice(index, 1)
    },
    changeValueType(type, i) {
      this.formData[type][i].value = ''
    },
    handleDynamicScript(type, i) {
      this.dynamicScriptValue = this.formData[type][i].value
      this.dynamicScriptType = type
      this.dynamicScriptIndex = i
      this.dynamicScriptVisible = true
    },
    setDynamicScriptValue(val) {
      this.formData[this.dynamicScriptType][ this.dynamicScriptIndex].value = val
    },
    // 改变显示方式
    changeOpenType(val) {
      if (val !== 'dialog') {
        this.$set(this.formData, 'height', null)
        this.$set(this.formData, 'width', null)
      } else {
        this.$set(this.formData, 'height', 600)
        this.$set(this.formData, 'width', 800)
      }
    },
    // 改变级联类型
    changeType(type) {
      this.$set(this.formData, 'formKey', null)
      this.$set(this.formData, 'bind_template_key', null)
      this.$set(this.formData, 'casadeFields', null)
      this.$set(this.formData, 'templateId', null)
      this.$set(this.formData, 'url', null)
      this.$set(this.formData, 'pkValueType', null)
      this.$set(this.formData, 'dataType', null)
      this.mappingFields = []
      if (type === 'form') {
        this.$set(this.formData, 'dataType', 'add')
      } else if (type === 'detail') {
        this.$set(this.formData, 'pkValueType', 'bo')
      }
      this.formValidate()
    },
    changeDataType(type) {
      let pkValueType = null
      if (type === 'edit') {
        pkValueType = 'bo'
      }
      this.$set(this.formData, 'pkValueType', pkValueType)
      this.$set(this.formData, 'casadeFields', null)
    },
    changePkValueType() {
      this.$set(this.formData, 'pkValue', '')
    },
    // 通过表单key获取业务对象
    getFieldsByFormKey(key) {
      if (this.$utils.isEmpty(key)) {return}
      // 1.getFormDataByFormKey
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
          this.mappingFields = this.filterField(_data)
        }).catch((e) => {
          this.mappingFields = []
        })
      }).catch(() => {
        this.mappingFields = []
      })
    },
    // 通过模板key获取业务对象
    getFieldsByTemplateKey(key) {
      if (this.$utils.isEmpty(key)) {return}
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
      }).catch(() => {
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
    // 选择表单
    handlerChangeForm(data) {
      this.$set(this.formData, 'casadeFields', [])
      if (this.$utils.isEmpty(data)) {return}
      this.getFieldsByFormKey(data.key)
    },
    // 选择数据模板
    handlerInput(data) {
      this.$set(this.formData, 'casadeFields', [])
      if (this.$utils.isEmpty(data)) {return}
      if (data.type !== 'default') {
        this.$message({
          message: `请选择模板类型为[默认]的数据模板。`,
          type: 'warning'
        })
        this.$set(this.formData, 'templateId', null)
        this.$set(this.formData, 'bind_template_key', '')
        return
      }
      // this.formData.templateData = JSON.parse(JSON.stringify(data))
      this.formData.templateId = data.id
      this.getFieldsByTemplateKey(this.formData.bind_template_key)
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
      this.formData = {}
      this.mappingFields = []
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
          if (this.$utils.isEmpty(this.formData.id)) {
            this.formData.id = new Ids([32, 36, 1]).next()
          }
          const data = JSON.parse(JSON.stringify(this.formData))
          this.closeDialog()
          this.$emit('callback', data)
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    getFormData() {
      if (this.$utils.isEmpty(this.data)) {
        this.formData = {}
        this.$set(this.formData, 'type', this.defaultTypeOptions[0].value)
        this.$set(this.formData, 'openType', this.openTypeOptions[0].value)
        // todo: 唯一标识(id)
        this.formData.boKey = 'id'
      } else {
        this.formData = JSON.parse(JSON.stringify(this.data))
      }
      if (this.$utils.isEmpty(this.boFields)) {return}
      if (this.formData.type === 'form') {
        this.getFieldsByFormKey(this.formData.formKey)
      } else if (this.formData.type === 'dataTemplate') {
        this.getFieldsByTemplateKey(this.formData.bind_template_key)
      }
      this.formValidate()
    }
  }
}
</script>
<style lang="scss" >
.ibps-casade-configuration{
  .casade-configuration{
    height: 60vh;
    .casade-field{
       border-bottom: 1px solid #DCDFE6;
      .casade-field_header{
        .casade-field_header__left{
          margin-right: 30px;
        }
      }
      .casade-field__content{
        padding: 5px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
.casade-field__desc{
    float: right;
    color: #8492a6;
    font-size: 13px
  }
</style>

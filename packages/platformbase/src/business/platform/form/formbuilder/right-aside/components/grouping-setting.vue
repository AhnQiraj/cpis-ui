<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    class="form-button-dialog"
    top="5vh"
    width="50%"
    append-to-body
    @close="closeDialog"
  >
    <el-form :ref="formName" :model="formData" :rules="rules" label-width="150px" size="mini" @submit.native.prevent>
      <el-form-item label="配置名称" prop="label">
        <el-input v-model="formData.label" placeholder="配置名称" />
      </el-form-item>
      <el-form-item label="分组条件" prop="groupingCondition">
        <template slot="label">分组条件<help-tip prop="groupingCondition" /></template>
        <el-select v-model="formData.groupingCondition" multiple value-key="key" placeholder="请选择" style="width:100%;" @change="formValidate">
          <el-option
            v-for="item in boData"
            :key="item.key"
            :label="item.name"
            :value="item"
          >
            <i :class="item.icon" />{{ item.name }}
          </el-option>
        </el-select>
      </el-form-item>
      <!--展示信息-头部-->
      <el-form-item>
        <template slot="label">头部信息<help-tip prop="headInformation" /></template>
        <!-- 头部信息拼接 -->
        <combination-field
          v-model="formData.headInformation"
          :fields="boData"
          value-key="key"
          label-key="name"
          tips="选择的字段数据必须为当前分组共同拥有且相同。"
        />
        <!-- <el-row>
            <el-col :span="18">
              <textarea ref="title" v-model="formData.headInformation" style="height:32px;" />
            </el-col>
            <el-col :span="6">
              <el-dropdown style="padding-left: 10px;" :hide-on-click="false" trigger="click" @command="insertField">
                <el-button type="primary">字段</el-button>
                <ibps-help content="选择的字段数据必须为当前分组共同拥有且相同。" />
                <el-dropdown-menu slot="dropdown">
                  <el-scrollbar
                    tag="div"
                    wrap-class="el-select-dropdown__wrap"
                    view-class="el-select-dropdown__list"
                  >
                    <el-dropdown-item
                      v-for="field in boData"
                      :key="field.id"
                      :command="field"
                    >
                      <i :class="field.icon" />{{ field.name }}
                    </el-dropdown-item>
                  </el-scrollbar>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row> -->
      </el-form-item>
      <!--展示信息-附加-->
      <el-form-item>
        <template slot="label">附加信息格式<help-tip prop="informationFormat" /></template>
        <el-select v-model="formData.additionalFormat" clearable placeholder="请选择">
          <el-option
            v-for="item in formatOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 公式计算 -->
      <el-form-item v-if="formData.additionalFormat === 'formula'">
        <el-button :style="{minWidth}" type="primary" icon="ibps-icon-file-code-o" @click="calculationFormula()">公式计算</el-button>
      </el-form-item>
      <!-- 信息展示脚本 -->
      <el-form-item v-else-if="formData.additionalFormat === 'script'">
        <el-button :style="{minWidth}" type="primary" icon="ibps-icon-file-code-o" @click="additionalInformationScript()">信息展示脚本</el-button>
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
    <!-- 附加信息脚本格式 -->
    <information-script
      :visible="scriptVisible"
      :title="informationScriptTitle"
      :bo-data="boData"
      :data="formData.informationScript"
      @callback="handlerInformationScript"
      @close="visible => scriptVisible = visible"
    />
    <!-- 附加信息计算函数格式 -->
    <formula-edit
      :visible="functionVisible"
      :title="'附加信息显示'"
      :bo-data="currentFields"
      :data="formData.calculationFormula"
      @callback="handlerCalculationFormula"
      @close="visible => functionVisible = visible"
    />
  </el-dialog>
</template>
<script>
import ActionUtils from '@platform/utils/action'
import InformationScript from '@platform/business/platform/form/formbuilder/right-aside/components/information-script'
import FormulaEdit from '@platform/business/platform/form/formbuilder/right-aside/components/formula-edit'
import CombinationField from '@platform/business/platform/form/components/combination-field'
import Ids from 'ids'
export default {
  components: {
    InformationScript,
    FormulaEdit,
    CombinationField
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '分组配置'
    },
    data: { // 分组配置对象
      type: Object,
      default: () => {}
    },
    boData: { // 业务对象字段
      type: Array
    },
    currentFields: { // 当前控件业务对象字段
      type: Array
    }
  },
  data() {
    return {
      dialogVisible: false,
      formName: 'groupingForm',
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      formData: {},
      rules: {
        label: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
        groupingCondition: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }]
      },
      scriptVisible: false, // 脚本弹窗显示
      informationScriptTitle: '信息展示脚本',
      functionVisible: false, // 附加信息计算函数弹窗显示
      activeNames: ['additional'],
      formatOptions: [{
        value: 'formula',
        label: '公式'
      }, {
        value: 'script',
        label: '脚本'
      }],
      minWidth: '190px',
      editor: null
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
      handler(val) {
        this.formData = val
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getFormData()
  },
  beforeDestroy() {
    this.toolbars = null
    this.formData = null
    this.rules = null
    this.formatOptions = null
    this.editor = null
  },
  methods: {
    // 附加信息展示脚本
    additionalInformationScript() {
      this.scriptVisible = true
    },
    // 脚本返回数据
    handlerInformationScript(value) {
      try {
        const temp = new Function('return ' + value)
        const fun = temp()
        if (typeof fun !== 'function') {
          this.$message({
            message: '脚本返回数据不是函数，请重新编写。',
            type: 'warning'
          })
        } else {
          this.formData.informationScript = value
        }
      } catch (e) {
        this.$message({
          message: '脚本返回数据出错，请重新编写。',
          type: 'warning'
        })
      }
    },
    // 附加信息计算函数
    calculationFormula() {
      this.functionVisible = true
    },
    // 计算函数返回结果
    handlerCalculationFormula(value) {
      this.formData.calculationFormula = value
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
          this.$emit('close', false)
          this.$emit('callback', data)
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$refs[this.formName].resetFields()
      this.$emit('close', false)
    },
    getFormData() {
    }
  }
}
</script>

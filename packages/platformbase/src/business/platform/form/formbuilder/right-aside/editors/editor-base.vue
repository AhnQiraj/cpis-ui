<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <span><i :class="icon" />{{ label }}</span>
      <div v-if="types.includes('switchFieldType')" class="ibps-fr">
        <el-dropdown @command="switchFieldType">
          <span class="el-dropdown-link">
            更换控件
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown" class="field-type-dropdown">
            <el-scrollbar
              tag="div"
              wrap-class="el-select-dropdown__wrap"
              view-class="el-select-dropdown__list"
            >
              <template v-for="field in fieldTypes">
                <el-dropdown-item
                  :key="field.key"
                  :command="field.field_type"
                  :divided="field.divided"
                  :disabled="field.field_type===fieldItem.field_type"
                >
                  <i :class="field.icon" />{{ field.label }}
                </el-dropdown-item>
              </template>
            </el-scrollbar>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="panel-body">
      <el-form-item v-if="types.includes('label')" prop="label">
        <template slot="label">标签文本<help-tip prop="label" /></template>
        <el-input v-model="fieldItem.label" placeholder="请输入标签文本" :maxlength="64" />
      </el-form-item>
      <el-form-item v-if="types.includes('label') && types.includes('customLabel')" prop="is_label">
        <template slot="label">自定义标签</template>
        <div class="editor-base_custom_label">
          <el-tooltip content="是否自定义标签">
            <el-checkbox v-model="fieldOptions.is_label" @change="changeLabel" />
          </el-tooltip>
          <el-select v-if="fieldOptions.is_label" v-model="fieldOptions.custom_label_type" class="editor-base_custom_label_select ibps-pl-5" @change="changeLabelType">
            <el-option v-for="item in labelTypesOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <template v-if="fieldOptions.is_label && fieldOptions.custom_label_type">
          <div class="ibps-pt-5">
            <el-button type="primary" plain style="width:100%;" @click="handleLabelValue">{{ fieldOptions.custom_label_type| optionsFilter(defaultValueTypeOptions) }}</el-button>
          </div>
        </template>
      </el-form-item>
      <el-form-item v-if="types.includes('label') && types.includes('customLabel') && fieldOptions.is_label">
        <template slot="label">标签位置<help-tip prop="labelSettingPosition" /></template>
        <el-radio-group v-model="fieldOptions.custom_label_position">
          <el-radio-button label="front">前面</el-radio-button>
          <el-radio-button label="behind">后面</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="types.includes('name')" prop="name">
        <template slot="label">对象属性<help-tip title="关于对象属性" :content="getContent" /></template>
        <ibps-bo-select
          v-model="fieldItem.name"
          :data="boFields"
          placeholder="请绑定对象属性"
          :empty-text="emptyText"
          @change="changeBoName"
        />
      </el-form-item>
      <el-form-item v-if="types.includes('key')" prop="name">
        <template slot="label">字段标识<help-tip prop="key" /></template>
        <el-input v-model="fieldItem.name" placeholder="字段标识" />
      </el-form-item>
      <el-form-item v-if="types.includes('datefmt')" prop="datefmt">
        <template slot="label">日期格式<help-tip prop="datefmt" /></template>
        <el-select v-model="fieldOptions.datefmt_type" style="width:100%;" placeholder="请选择日期格式" @change="changeDatefmtType">
          <el-option
            v-for="item in dateFormatTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div v-if="fieldOptions.datefmt_type === 'custom'" class="ibps-pt-5">
          <el-input v-model="fieldOptions.datefmt" />
        </div>
      </el-form-item>
      <el-form-item v-if="types.includes('defaultValue')">
        <template slot="label">默认值<help-tip prop="defaultValue" /></template>
        <el-select v-model="fieldOptions.default_value_type" style="width:100%;" @change="changeDefaultValueType">
          <el-option v-for="item in defauleValueOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div v-if="!fieldOptions.default_value_type|| fieldOptions.default_value_type === 'fixed'" class="ibps-pt-5">
          <el-input
            v-if="fieldType=== 'text'|| fieldType=== 'textarea'|| fieldType=== 'hidden'||fieldType=== 'label'||fieldType==='tag'"
            v-model="fieldOptions.default_value"
            :type="fieldType=== 'textarea'?'textarea':'text'"
            clearable
            placeholder="请输入默认值"
          />
          <slot v-else :name="'fixedValue'" />
        </div>
        <!--预设值-->
        <template v-else-if="fieldOptions.default_value_type === 'today' || fieldOptions.default_value_type === 'present'">
          <slot :name="fieldOptions.default_value_type+'Value'" />
        </template>
        <!--其他【】-->
        <div v-else class="ibps-pt-5">
          <el-button type="primary" plain style="width:100%;" @click="handleDefaultValue">{{ fieldOptions.default_value_type| optionsFilter(defaultValueTypeOptions) }}</el-button>
        </div>
      </el-form-item>
      <el-form-item v-if="types.includes('units')" prop="units">
        <template slot="label">单位<help-tip prop="units" /></template>
        <el-input v-model="fieldOptions.units" />
      </el-form-item>
      <el-form-item v-if="$utils.isNotEmpty(fieldOptions.units)" prop="position" class="editor-number_radio">
        <template slot="label">位置<help-tip prop="position" /></template>
        <el-radio-group v-model="fieldOptions.position">
          <el-radio-button label="label">标签内</el-radio-button>
          <el-radio-button label="front">数据前</el-radio-button>
          <el-radio-button label="after">数据后</el-radio-button>
          <el-radio-button label="behind">控件后</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!--数字展示格式：参考https://www.iviewui.com/components/input-number-->
      <template v-if="types.includes('numberFormat')">
        <el-form-item prop="number_format">
          <template slot="label">展示格式<help-tip prop="number_format" /></template>
          <el-select v-model="fieldOptions.number_format" style="width:100%;">
            <el-option
              v-for="item in numberFormatOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="fieldOptions.number_format ==='number'" label="小数位" prop="decimal_place">
          <el-input-number v-model="formData.field_options.decimal_place" />
        </el-form-item>
      </template>
      <el-form-item v-if="types.includes('combination')">
        <template slot="label">组合字段<help-tip prop="combination" /></template>
        <combination-field
          v-model="fieldOptions.combination"
          :fields="boFields"
          value-key="key"
          label-key="name"
        />
      </el-form-item>
      <el-form-item v-if="types.includes('placeholder')">
        <template slot="label">占位符<help-tip prop="placeholder" /></template>
        <el-input v-model="fieldOptions.placeholder" type="textarea" maxlength="200" :autosize="{ minRows: 1, maxRows: 10}" placeholder="请输入占位符" />
      </el-form-item>
      <el-form-item v-if="types.includes('desc')">
        <template slot="label">描述信息<help-tip prop="desc" /></template>
        <el-input v-model="fieldItem.desc" type="textarea" :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入描述信息" :maxlength="1024" />
      </el-form-item>
      <el-form-item v-if="types.includes('isPk')" label="是否主键">
        <template slot="label">是否主键<help-tip prop="isPk" /></template>
        <el-switch v-model="fieldOptions.is_pk" />
      </el-form-item>
      <div v-if="types.includes('splitLine')" class="el-form-item">
        <el-checkbox v-model="fieldOptions.split_line">显示分割线</el-checkbox>
      </div>
      <el-form-item v-if="types.includes('lineStyle') && fieldOptions.split_line">
        <template slot="label">分割线样式</template>
        <el-select v-model="fieldOptions.line_style">
          <el-option value="dashed" label="虚线" />
          <el-option value="solid" label="实线" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="types.includes('contentPosition')">
        <template slot="label">标题位置<help-tip prop="contentPosition" /></template>
        <el-radio-group v-model="fieldOptions.content_position">
          <el-radio-button label="left">左侧</el-radio-button>
          <el-radio-button label="center">居中</el-radio-button>
          <el-radio-button label="right">右侧</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="isSub && types.includes('display')">
        <template slot="label">显示字段<help-tip prop="displayColumn" /></template>
        <el-switch v-model="isDisplay" />
      </el-form-item>
      <el-form-item v-if="types.includes('table')">
        <template slot="label">隐藏标题</template>
        <el-switch v-model="fieldOptions.hidden_header" />
      </el-form-item>
      <div v-if="types.includes('tag')">
        <el-alert
          title="使用该控件，需设置默认值或者通过其他值计算才能生效。"
          type="warning"
          :closable="false"
        />
      </div>
    </div>
    <!--公式编辑-->
    <formula-edit
      :visible="labelFormulaEditVisible"
      :label="fieldItem.label"
      :bo-data="boData"
      :data="fieldItem.field_options.custom_label_value"
      @callback="setFormLabelValue"
      @close="visible => labelFormulaEditVisible = visible"
    />
    <!--动态脚本-->
    <dynamic-script
      :visible="labelDynamicScriptVisible"
      :label="fieldItem.label"
      :bo-data="boData"
      :data="fieldItem.field_options.custom_label_value"
      @callback="setFormLabelValue"
      @close="visible => labelDynamicScriptVisible = visible"
    />
    <!--公式编辑-->
    <formula-edit
      :visible="formulaEditVisible"
      :label="fieldItem.label"
      :bo-data="boData"
      :data="fieldItem.field_options.default_value"
      @callback="setFormDefaultValue"
      @close="visible => formulaEditVisible = visible"
    />
    <!--动态脚本-->
    <dynamic-script
      :visible="dynamicScriptVisible"
      :label="fieldItem.label"
      :bo-data="boData"
      :data="fieldItem.field_options.default_value"
      @callback="setFormDefaultValue"
      @close="visible => dynamicScriptVisible = visible"
    />
    <!--数据联动-->
    <linkage-data
      :visible="linkageDataVisible"
      :label="fieldItem.label"
      :fields="fields"
      :field-item="fieldItem"
      :data="fieldItem.field_options.default_value"
      @callback="setFormDefaultValue"
      @close="visible => linkageDataVisible = visible"
    />
    <!-- 自定义标签设置(总数统计配置) -->
    <label-setting
      :visible="labelVisible"
      :data="fieldItem.field_options.label_setting"
      @callback="handlerLabelSetting"
      @close="visible => labelVisible = visible"
    />
  </div>
</template>
<script>
import FIELD_TYPES from '@platform/business/platform/form/constants/fieldTypes'
import FormOptions from '@platform/business/platform/form/constants/formOptions'
import { defaultValueTypeOptions, datefmtTypeOptions, timefmtTypeOptions, numberFormatOptions } from '@platform/business/platform/form/constants/fieldOptions'
import IbpsBoSelect from '@platform/business/platform/bo/def/select'
import { getDefaultAttributes } from '../../utils'
import FormulaEdit from '../components/formula-edit'
import DynamicScript from '../components/dynamic-script'
import LinkageData from '../components/linkage-data'
import BaseMixin from '../mixins/base'
import EditorMixin from '../mixins/editor'
import CombinationField from '@platform/business/platform/form/components/combination-field'
import LabelSetting from '@platform/business/platform/form/formbuilder/right-aside/components/label-setting'
/**
 *  字段基本属性
 */
export default {
  components: {
    IbpsBoSelect,
    FormulaEdit,
    DynamicScript,
    LinkageData,
    CombinationField,
    LabelSetting
  },
  mixins: [BaseMixin, EditorMixin],
  props: {
    types: {
      type: String,
      default: 'switchFieldType,label,name,defaultValue,placeholder,desc,display'
    },
    defaultValueTypes: { // 默认值类型
      type: String,
      default: 'fixed,dynamic,linkage,formula'
    }
  },
  data() {
    return {
      defaultValueTypeOptions,
      numberFormatOptions,
      fixedVisible: false,
      dynamicScriptVisible: false,
      formulaEditVisible: false,
      linkageDataVisible: false,
      display: this.fieldItem.field_options.display,
      labelVisible: false,
      labelTypes: 'statistics,dynamic,formula',
      labelFormulaEditVisible: false,
      labelDynamicScriptVisible: false
    }
  },
  computed: {
    // 获取提示内容
    getContent() {
      const content = `此属性用于绑定业务对象属性,用于提交数据绑定对象名称。</br>
      注意：</br>
      1)当子表单为多级子表业务对象且表单模式为弹窗或表内编辑模式时，设置当前子表单为多级表单。</br>
      2)多级表单的上级表单必须存在，且表单模式为弹窗或表内编辑模式。`
      return content
    },
    fieldTypes() {
      const fieldTypes = []
      let group
      for (const type in FIELD_TYPES) {
        const field = FIELD_TYPES[type]
        const isFormType = (!field.form_type || field.form_type.includes(this.formType))
        const isInput = this.$utils.toBoolean(field.is_input, true)
        if ((type === 'table') || !isInput || !isFormType) {
          continue
        }
        if (group && group !== field.group) {
          field.divided = true
        } else {
          field.divided = false
        }
        group = field.group
        if (this.isSub) {
          if (this.$utils.toBoolean(field.sub, true)) {
            if (type === 'dictionary') {
              field.divided = true
            }
            fieldTypes.push(field)
          }
        } else {
          fieldTypes.push(field)
        }
      }
      return fieldTypes
    },
    labelTypesOptions() {
      const options = []
      defaultValueTypeOptions.forEach((type) => {
        if (this.labelTypes.includes(type.value)) {
          options.push(type)
        }
      })
      return options
    },
    defauleValueOptions() {
      const options = []
      defaultValueTypeOptions.forEach((type) => {
        if (this.defaultValueTypes.includes(type.value)) {
          options.push(type)
        }
      })
      return options
    },
    emptyText() {
      if (this.isSub && this.$utils.isEmpty(this.code)) {
        return this.fieldItem.field_type === 'table' ? '无子表业务对象' : '请先选择子表对象属性'
      }
      return '无业务对象属性'
    },
    dateFormatTypeOptions() {
      if (this.fieldItem.field_type === 'currentTime') {
        return timefmtTypeOptions
      } else {
        return datefmtTypeOptions
      }
    },
    isDisplay: {
      get() {
        return this.$utils.toBoolean(this.display, true)
      },
      set(val) {
        this.fieldItem.field_options.display = this.display = val
      }
    }
  },
  watch: {
    display: {
      handler(val, oldVal) {
        if (this.$utils.isEmpty(this.fieldItem.field_options.display)) {
          this.isDisplay = this.fieldItem.field_options.display = true
        } else {
          if (val !== oldVal) {
            this.isDisplay = this.fieldItem.field_options.display = val
          }
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.defaultValueTypeOptions = null
    this.numberFormatOptions = null
  },
  methods: {
    // 自定义标签选择类型
    changeLabelType(type) {
      this.$set(this.fieldOptions, 'custom_label_type', type)
      if (this.$utils.isNotEmpty(this.fieldOptions.custom_label_value)) {
        this.setFormLabelValue(null)
      }
      if (this.fieldOptions.custom_label_type === 'statistics') {
        this.handlerLabelSetting({ format: '($_widget_statistics#)' })
      } else {
        this.handlerLabelSetting(null)
      }
    },
    handleLabelValue() {
      switch (this.fieldOptions.custom_label_type) {
        case 'statistics':// 总数统计
          this.labelVisible = true
          break
        case 'dynamic': // 公式编辑
          this.labelDynamicScriptVisible = true
          break
        case 'formula': // 公式编辑
          this.labelFormulaEditVisible = true
          break
        default:
          break
      }
    },
    setFormLabelValue(data) {
      this.$set(this.fieldItem.field_options, 'custom_label_value', data)
    },
    // 自定义标签设置返回的数据
    handlerLabelSetting(data) {
      this.$set(this.fieldItem.field_options, 'label_setting', data)
    },
    // 选择勾选自定义标签
    changeLabel(val) {
      if (val) {
        this.$set(this.fieldItem.field_options, 'custom_label_position', 'behind')
        this.$set(this.fieldItem.field_options, 'custom_label_type', 'statistics')
        this.handlerLabelSetting({ format: '($_widget_statistics#)' })
      } else {
        this.$set(this.fieldItem.field_options, 'custom_label_position', null)
        this.$set(this.fieldItem.field_options, 'custom_label_type', null)
        this.handlerLabelSetting(null)
      }
      this.setFormLabelValue(null)
    },
    // 设置只读文本
    handleCutomLabel() {
      this.labelVisible = true
    },
    changeBoName(value, node) {
      if (this.$utils.isNotEmpty(value)) {
        this.fieldItem.label = node.label
      }
      // 关系类型[一对一，一对多]
      if (this.$utils.isNotEmpty(node.data) && this.$utils.isNotEmpty(node.data.relation)) {
        const relation = node.data.relation || 'one2many'
        this.fieldOptions.relation = relation
        if (relation === 'one2one') {
          this.setOne2oneFieldOptions()
        }
      }
      // 设置所在的层级
      if (this.$utils.isNotEmpty(node.data) && this.$utils.isNotEmpty(node.data.level) && node.data.level > 0) {
        this.fieldOptions.level = node.data.level
        this.fieldOptions.parentKey = this.getParentKey(node.data.parentId)
      } else {
        this.fieldOptions.parentKey = undefined
      }
      if (this.fieldOptions.three_levels) {this.fieldOptions.three_levels = false}
    },
    getParentKey(parentId) {
      const field = this.boFields.find((item) => {
        return item.id === parentId
      })
      return field.key
    },
    setOne2oneFieldOptions() {
      this.fieldOptions.mode = 'block'
      this.fieldOptions.buttons = null
    },
    changeDatefmtType(value) {
      let datefmt = FormOptions.t.DATE_FORMATS['date']
      if (this.fieldType === 'currentDate') {
        datefmt = FormOptions.t.DATE_FORMATS['date']
      } else if (this.fieldType === 'currentTime') {
        datefmt = FormOptions.t.DATE_FORMATS['time']
      } else {
        if (value !== 'custom') {
          datefmt = FormOptions.t.DATE_FORMATS[value] || FormOptions.t.DATE_FORMATS['date']
        }
      }
      this.fieldOptions.datefmt = datefmt
      if (this.$utils.isNotEmpty(this.fieldOptions.default_value)) {
        this.fieldOptions.default_value = null
      }
    },
    /**
     * 改变默认值
     */
    changeDefaultValueType(type) {
      this.fieldOptions.default_value_type = type
      if (this.$utils.isNotEmpty(this.fieldOptions.default_value)) {
        this.fieldOptions.default_value = null
      }
    },
    handleDefaultValue() {
      switch (this.fieldOptions.default_value_type) {
        case 'fixed':// 固定值
          this.fixedVisible = true
          break
        case 'dynamic': // 公式编辑
          this.dynamicScriptVisible = true
          break
        case 'linkage': // 联动数据
          this.linkageDataVisible = true
          break
        case 'formula': // 公式编辑
          this.formulaEditVisible = true
          break
        default:
          break
      }
    },
    /**
     * 设置默认值
     */
    setFormDefaultValue(data) {
      this.fieldItem.field_options.default_value = data
    },
    /**
     * 更换控件
     */
    switchFieldType(type) {
      this.fieldItem.field_type = type
      // 有共性的字段替换 (主要是单选、多选、下拉 相互替换),不进行清空
      const field = getDefaultAttributes(this.fieldItem)
      let options = []
      if (this.fieldItem.field_options.options) {
        options = JSON.parse(JSON.stringify(this.fieldItem.field_options.options))
      }
      this.fieldItem.field_options = field.field_options
      if (this.$utils.isNotEmpty(options)) {
        this.fieldItem.field_options.options = options
      }
      this.$message({
        message: '更换字段控件成功',
        type: 'success'
      })
    }
  }
}
</script>
<style scoped>
.field-type-dropdown.el-dropdown-menu {
  padding: 0;
}
</style>
<style lang="scss">
.panel-body{
  .editor-number_radio {
    .el-radio-button__inner{
      padding: 7px 10px;
    }
  }
  .editor-base_custom_label{
    display: flex;
    .editor-base_custom_label_select{
      flex: 1;
    }
  }
}
</style>

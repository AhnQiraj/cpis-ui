import ActionUtils from '@platform/utils/action'
import FormFieldUtil from '@platform/business/platform/form/utils/formFieldUtil'
import { buildDynamicParams } from '@platform/business/platform/data/templaterender/utils'
import { getSelectorDataByKey } from '@platform/api/platform/data/dataTemplate'
export default {
  data() {
    return {
      dataTemplateLoading: false,
      resultColumns: [],
      queryColumns: [],
      dynamicConditions: {},
      dataTemplateConfigVisible: false,
      dataTemplateConditionVisible: false,
      dataTemplateLinkDataVisible: false,
      dataTemplateLinkAttrVisible: false,
      formFields: [], // 表单现在有的可以输入字段，排除自己
      formSubFields: [], // 表单当前字段包含主表和当前子表数据
      formLabelFields: [] // 表单现在有的[label]字段
    }
  },
  computed: {
    disabledResultColumns() {
      return this.dataTemplateLoading ? true : this.$utils.isEmpty(this.resultColumns)
    },
    disabledQueryColumns() {
      return this.dataTemplateLoading ? true : this.$utils.isEmpty(this.queryColumns)
    },
    disabledDynamicConditions() {
      return this.dataTemplateLoading ? true : this.$utils.isEmpty(this.dynamicConditions)
    }
  },
  beforeDestroy() {
    this.resultColumns = null
    this.queryColumns = null
    this.dynamicConditions = null
    this.formFields = null
    this.formSubFields = null
    this.formLabelFields = null
  },
  methods: {
    changeDataSource(val, key) {
      if (this.$utils.isEmpty(val)) {
        this.resultColumns = []
        this.queryColumns = []
        this.dynamicConditions = {}
        return
      }
      this.dataTemplateLoading = true
      getSelectorDataByKey({
        dataTemplateKey: val
      }).then(response => {
        this.dataTemplateLoading = false
        const data = response.data
        // 返回字段=====
        let resultColumns = []
        if (this.$utils.isNotEmpty(data.resultColumns)) {
          resultColumns = this.$utils.parseJSON(data.resultColumns)
          // 返回字段---默认值处理
          if ((key === 'value_source' || key === 'linkdata') && this.$utils.isNotEmpty(resultColumns)) {
            const linkConfig = this.fieldItem && this.fieldItem.field_options ? this.fieldItem.field_options.link_config : {}
            if (this.$utils.isEmpty(linkConfig) || (this.$utils.isEmpty(linkConfig.id) && this.$utils.isEmpty(linkConfig.text))) {
              this.setDataTemplateConfig({
                id: data.unique,
                text: resultColumns[0].name
              })
            }
          }
        }
        this.resultColumns = resultColumns
        // 查询字段
        let queryColumns = []
        if (this.$utils.isNotEmpty(data.queryColumns)) {
          queryColumns = this.$utils.parseJSON(data.queryColumns)
        }
        this.queryColumns = queryColumns
        // 过滤条件
        let dynamicConditions = {}
        if (this.$utils.isNotEmpty(data.filterConditions)) {
          const filterConditions = this.$utils.parseJSON(data.filterConditions)
          if (this.$utils.isNotEmpty(filterConditions)) {
            dynamicConditions = buildDynamicParams(filterConditions)
          }
        }
        this.dynamicConditions = dynamicConditions
      }).catch(() => {
        this.dataTemplateLoading = false
      })
    },
    /**
     *
     * @param {*} needAllObj  是当前对象还是子
     */
    setFormFields() {
      this.formFields = FormFieldUtil.getFormField(this.fields, this.isSub, this.code, this.fieldItem ? this.fieldItem.id : '')
      this.formSubFields = this.isSub ? FormFieldUtil.getFormSubField(this.fields, this.code, this.fieldItem ? this.fieldItem.id : '') : this.formFields
    },
    setFormLabelFields() {
      this.formLabelFields = FormFieldUtil.getFormField(this.fields, this.isSub, this.code, this.fieldItem ? this.fieldItem.id : '', 'label')
    },
    getDataTemplateLable(key) {
      if (key === 'value_source') {
        return '值来源'
      } else if (key === 'dialog') {
        return '自定义对话框'
      } else if (key === 'linkdata') {
        return '关联数据'
      }
    },
    // 设置id和value
    settingDataTemplateConfig(key) {
      const label = this.getDataTemplateLable(key)
      if (this.$utils.isEmpty(this.fieldItem.field_options[key])) {
        ActionUtils.warning(`请设置${label}`)
        return
      }
      if (this.$utils.isEmpty(this.resultColumns)) {
        ActionUtils.warning(`请设置[${label}]返回字段`)
        return
      }
      this.dataTemplateConfigVisible = true
    },
    // 设置动态参数
    settingDataTemplateCondition(key) {
      const label = this.getDataTemplateLable(key)
      if (this.$utils.isEmpty(this.fieldItem.field_options[key])) {
        ActionUtils.warning(`请设置${label}`)
        return
      }
      if (this.$utils.isEmpty(this.dynamicConditions)) {
        ActionUtils.warning(`请设置[${label}]过滤条件`)
        return
      }
      // 构建表单字段
      this.setFormFields(true)
      this.dataTemplateConditionVisible = true
    },
    // 设置联动数据
    settingDataTemplateLinkData(key) {
      const label = this.getDataTemplateLable(key)
      if (this.$utils.isEmpty(this.fieldItem.field_options[key])) {
        ActionUtils.warning(`请设置${label}`)
        return
      }
      if (this.$utils.isEmpty(this.resultColumns)) {
        ActionUtils.warning(`请设置[${label}]返回字段`)
        return
      }
      // 构建表单字段
      this.setFormFields(true)
      this.dataTemplateLinkDataVisible = true
    },
    // 设置联动属性
    settingDataTemplateLinkAttr(key) {
      const label = this.getDataTemplateLable(key)
      if (this.$utils.isEmpty(this.fieldItem.field_options[key])) {
        ActionUtils.warning(`请设置${label}`)
        return
      }
      if (this.$utils.isEmpty(this.resultColumns)) {
        ActionUtils.warning(`请设置[${label}]返回字段`)
        return
      }
      // 构建表单【lable】字段
      this.setFormLabelFields()
      if (this.$utils.isEmpty(this.formLabelFields)) {
        ActionUtils.warning(`表单未设置字段类型为【文本】的字段`)
        return
      }
      this.dataTemplateLinkAttrVisible = true
    },
    // ==================设置值
    setDataTemplateConfig(data) {
      this.fieldItem.field_options.link_config = data
    },
    setDataTemplateCondition(data) {
      this.fieldItem.field_options.link_condition = data
    },
    setDataTemplateLinkData(data) {
      this.fieldItem.field_options.link_linkage = data
    },
    setDataTemplateLinkAttr(data) {
      this.fieldItem.field_options.link_attr = data
    },
    setDataTemplateDefaultValue() {
      this.fieldItem.field_options.link_config = null
      this.fieldItem.field_options.link_condition = null
      this.fieldItem.field_options.link_linkage = null
      this.fieldItem.field_options.link_attr = null
    }
  }
}

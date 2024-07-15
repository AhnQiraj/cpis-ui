// import FormOptions from '../../../constants/formOptions'
import { nestedFieldTypes } from '@platform/business/platform/form/constants/fieldTypes'
import Styles from '@platform/business/platform/form/utils/global-style'
export default {
  props: {
    models: [String, Number, Object, Array], // 字段数据
    rights: [String, Object], // 字段权限
    formData: [Array, Object], // 表单数据（包含子表）
    field: Object, // 字段
    code: String, // 表名
    mainCode: String, // 主表名
    row: [String, Number], // 子表行数
    params: Object, // 默认参数
    tableParams: Object, // 子表参数
    curActiveStep: Number
  },
  computed: {
    // 规则显示，隐藏
    ruleDisplay() {
      if (this.$utils.isEmpty(this.field) ||
      this.$utils.isEmpty(this.field.field_options)) {return ''}
      if (this.$utils.isNotEmpty(this.field.field_options.rule_display)) {
        return this.field.field_options.rule_display
      }
      const hideRights = this.field.field_options.hide_rights
      if (this.$utils.isNotEmpty(hideRights) && hideRights) {
        return 'hidden'
      } else {
        return
      }
    },
    descPosition() {
      return this.params ? this.params.descPosition || 'inline' : 'inline'
    }
  },
  methods: {
    // 获取高度间隔配置
    getUDGutter() {
      if (this.$utils.isNotEmpty(this.field) &&
        this.$utils.isNotEmpty(this.field.field_options) &&
        this.$utils.isNotEmpty(this.field.field_options.ud_gutter) &&
        this.field.field_options.ud_gutter !== 0) {
        const _px = this.field.field_options.ud_gutter / 2
        return `padding-bottom: ${_px}px;padding-top: ${_px}px;`
      } else {
        return ''
      }
    },
    // 获取高度间隔配置
    getHeightInterval() {
      if (this.$utils.isNotEmpty(this.field) &&
        this.$utils.isNotEmpty(this.field.field_options) &&
        this.$utils.isNotEmpty(this.field.field_options.height_interval)) {
        return `margin-bottom: ${this.field.field_options.height_interval}px;`
      } else {
        return ''
      }
    },
    // 获取边距配置
    getPadding(control) {
      let _margin = {}
      if (this.$utils.isNotEmpty(this.field) &&
        this.$utils.isNotEmpty(this.field.field_options) &&
        this.field.field_options.is_margin) {
        _margin = {
          top: this.field.field_options.top_margin,
          bottom: this.field.field_options.bottom_margin,
          left: this.field.field_options.left_margin,
          right: this.field.field_options.right_margin
        }
      } else if (control !== 'grid' && this.$utils.isNotEmpty(this.params) &&
        this.$utils.isNotEmpty(this.params.formAttrs) &&
        this.params.formAttrs.is_margin) {
        _margin = {
          top: this.params.formAttrs.top_margin,
          bottom: this.params.formAttrs.bottom_margin,
          left: this.params.formAttrs.left_margin,
          right: this.params.formAttrs.right_margin
        }
      } else {
        return ''
      }
      let _style = ''
      for (const key in _margin) {
        if (_margin.hasOwnProperty(key) && this.$utils.isNotEmpty(_margin[key])) {
          _style += `margin-${key}: ${_margin[key]}px;`
        }
      }
      return _style
    },
    // 获取规则配置中的样式
    getRuleStyle() {
      if (this.$utils.isEmpty(this.field) ||
        this.$utils.isEmpty(this.field.field_options)) {return ''}
      let _style = Styles.getBgColorByName(this.field.field_options, 'rule_background_color')
      _style += Styles.getColorByName(this.field.field_options, 'rule_color')
      return _style
    },
    isNestedField(fieldType) {
      return nestedFieldTypes.includes(fieldType)
    }
  }
}

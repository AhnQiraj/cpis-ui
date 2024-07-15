import Ids from 'ids'
import { isEqual } from 'element-ui/lib/utils/util'
import { nestedFieldTypes, needModelFieldTypes } from '@platform/business/platform/form/constants/fieldTypes'
// import { getDefaultActive } from '@platform/business/platform/form/formbuilder/utils/widgetAdd'
import { getFieldInWidgetAdd } from '@platform/business/platform/form/formbuilder/utils/widgetAdd'
export default {
  props: {
    element: Object,
    select: Object,
    index: Number,
    data: Object,
    code: String,
    isSub: {
      type: Boolean,
      default: false
    },
    params: Object
  },
  data() {
    return {
      selectWidget: this.select,
      field: this.element
    }
  },
  computed: {
    fields() {
      if (this.data.fields) { // 第一层
        return this.data.fields
      } else {
        return this.data.field_options.columns
      }
    },
    isTable() {
      return this.data.field_type === 'table'
    },
    descPosition() {
      return this.params.descPosition || 'inline'
    }
  },
  watch: {
    element: {
      handler(val) {
        this.field = val
      },
      deep: true
    },
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler(val, oldVal) {
        if (isEqual(val, oldVal)) {
          return
        }
        this.$emit('update:select', val)
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.selectWidget = null
    this.field = null
  },
  methods: {
    // 获取高度间隔配置
    getUDGutter() {
      if (this.$utils.isNotEmpty(this.element) &&
        this.$utils.isNotEmpty(this.element.field_options) &&
        this.$utils.isNotEmpty(this.element.field_options.ud_gutter) &&
        this.element.field_options.ud_gutter !== 0) {
        const _px = this.element.field_options.ud_gutter / 2
        return `padding-bottom: ${_px}px;padding-top: ${_px}px;`
      } else {
        return ''
      }
    },
    // 获取高度间隔配置
    getHeightInterval() {
      if (this.$utils.isNotEmpty(this.element) &&
        this.$utils.isNotEmpty(this.element.field_options) &&
        this.$utils.isNotEmpty(this.element.field_options.height_interval)) {
        return `margin-bottom: ${this.element.field_options.height_interval}px;`
      } else {
        return ''
      }
    },
    // 获取边距配置
    getPadding(control) {
      let _margin = {}
      if (this.$utils.isNotEmpty(this.element) &&
        this.$utils.isNotEmpty(this.element.field_options) &&
        this.element.field_options.is_margin) {
        _margin = {
          top: this.element.field_options.top_margin,
          bottom: this.element.field_options.bottom_margin,
          left: this.element.field_options.left_margin,
          right: this.element.field_options.right_margin
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
          _style += `margin-${key}: ${_margin[key]}px!important;`
        }
      }
      return _style
    },
    isNestedField(fieldType) {
      return nestedFieldTypes.includes(fieldType) || fieldType === 'table'
    },
    handleSelectWidget(index) {
      let code = this.code
      let isSub = this.isSub
      if (this.isTable) {
        code = this.data.name
        isSub = true
      }
      this.field.code = code
      this.field.isSub = isSub
      this.selectWidget = this.field
    },
    handleWidgetDelete(index) {
      let selectWidget = {}
      if (this.fields.length - 1 === index) {
        selectWidget = index === 0 ? {} : this.fields[index - 1]
      } else {
        selectWidget = this.fields[index + 1]
      }
      this.selectWidget = selectWidget
      this.$nextTick(() => {
        this.fields.splice(index, 1)
      })
    },
    handleWidgetClone(index) {
      const cloneData = {
        ...this.fields[index],
        field_options: { ...this.fields[index].field_options },
        id: new Ids([32, 36, 1]).next()
      }
      const fieldType = cloneData.field_type
      if (!needModelFieldTypes.includes(fieldType)) {
        cloneData.name = fieldType + '_' + new Ids([32, 36, 1]).next()
      }
      this.fields.splice(index, 0, JSON.parse(JSON.stringify(cloneData)))
      this.$nextTick(() => {
        this.selectWidget = this.fields[index + 1]
      })
    },
    handleWidgetCloneBasics(index) {
      const cloneData = {
        ...this.fields[index],
        field_options: { ...this.fields[index].field_options }
      }
      const _data = JSON.parse(JSON.stringify(cloneData))
      const fieldType = _data.field_type
      _data.name = fieldType + '_' + new Ids([32, 36, 1]).next()
      _data.id = new Ids([32, 36, 1]).next()
      _data.field_name = _data.name
      if (this.$utils.isNotEmpty(_data.field_options) &&
      this.$utils.isNotEmpty(_data.field_options.columns)) {
        const _temp = _data.field_options.columns
        for (let i = 0; i < _temp.length; i++) {
          _temp[i].fields = []
        }
      }
      this.fields.splice(index + 1, 0, _data)
      this.$nextTick(() => {
        this.selectWidget = this.fields[index + 1]
      })
    },
    handleWidgetData($event, row, colIndex) {
      const newIndex = $event.newIndex
      // const oldIndex = $event.oldIndex
      // const item = $event.item
      // 防止布局元素的嵌套拖拽
      // if (item.className.indexOf('data-grid') >= 0) {
      //   // 如果是列表中拖拽的元素需要还原到原来位置
      //   item.tagName === 'DIV' && this.data.fields.splice(oldIndex, 0, row.field_options.columns[colIndex].fields[newIndex])
      //   row.field_options.columns[colIndex].fields.splice(newIndex, 1)
      //   return false
      // }
      const id = new Ids([32, 36, 1]).next()
      const code = this.code
      const isSub = this.isSub
      const fieldType = row.field_options.columns[colIndex].fields[newIndex].field_type
      let temp = {
        ...row.field_options.columns[colIndex].fields[newIndex],
        field_options: {
          ...row.field_options.columns[colIndex].fields[newIndex].field_options
        },
        id,
        code,
        isSub
      }
      temp = getFieldInWidgetAdd(temp, fieldType)
      this.$set(row.field_options.columns[colIndex].fields, newIndex, temp)
      // if (fieldType === 'radio' || fieldType === 'checkbox' || fieldType === 'select') {
      //   this.$set(row.field_options.columns[colIndex].fields, newIndex, {
      //     ...row.field_options.columns[colIndex].fields[newIndex],
      //     field_options: {
      //       ...row.field_options.columns[colIndex].fields[newIndex].field_options,
      //       options: row.field_options.columns[colIndex].fields[newIndex].field_options.options.map(item => ({
      //         ...item
      //       }))
      //     }
      //   })
      //   //  嵌套布局
      // } else if (nestedFieldTypes.includes(fieldType)) {
      //   this.$set(row.field_options.columns[colIndex].fields, newIndex, {
      //     ...row.field_options.columns[colIndex].fields[newIndex],
      //     name: fieldType + '_' + new Ids([32, 36, 1]).next(),
      //     active: getDefaultActive(fieldType),
      //     field_options: {
      //       ...row.field_options.columns[colIndex].fields[newIndex].field_options,
      //       columns: row.field_options.columns[colIndex].fields[newIndex].field_options.columns.map(item => ({
      //         ...item
      //       }))
      //     }
      //   })
      //   // 子表单
      // } else if (fieldType === 'table') {
      //   this.$set(row.field_options.columns[colIndex].fields, newIndex, {
      //     ...row.field_options.columns[colIndex].fields[newIndex],
      //     field_options: {
      //       ...row.field_options.columns[colIndex].fields[newIndex].field_options,
      //       buttons: row.field_options.columns[colIndex].fields[newIndex].field_options.buttons.map(item => ({
      //         ...item
      //       })),
      //       columns: row.field_options.columns[colIndex].fields[newIndex].field_options.columns.map(item => ({
      //         ...item
      //       }))
      //     }
      //   })
      //   // 审批意见
      // } else if (fieldType === 'approval_opinion') {
      //   this.$set(row.field_options.columns[colIndex].fields, newIndex, {
      //     ...row.field_options.columns[colIndex].fields[newIndex],
      //     name: fieldType + '_' + new Ids([32, 36, 1]).next(),
      //     field_options: {
      //       ...row.field_options.columns[colIndex].fields[newIndex].field_options,
      //       options: row.field_options.columns[colIndex].fields[newIndex].field_options.options.map(item => ({
      //         ...item
      //       }))
      //     }
      //   })
      //   // 需要处理name的字段 审批历史、流程图、文本
      // } else if (!needModelFieldTypes.includes(fieldType)) {
      //   this.$set(row.field_options.columns[colIndex].fields, newIndex, {
      //     ...row.field_options.columns[colIndex].fields[newIndex],
      //     name: fieldType + '_' + new Ids([32, 36, 1]).next()
      //   })
      // }
      this.selectWidget = row.field_options.columns[colIndex].fields[newIndex]
    },
    /**
     * 嵌套布局添加字段
     */
    handleWidgetNestedAdd($event, row, colIndex) {
      this.handleWidgetData($event, row, colIndex)
    },
    /**
     * 嵌套布局移动字段
     */
    handleWidgetNestedMoveEnd($event, row, colIndex) {
      // this.handleWidgetData($event, row, colIndex)
    }
  }
}

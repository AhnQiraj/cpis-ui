import Ids from 'ids'
import { isEqual } from 'element-ui/lib/utils/util'
import { nestedFieldTypes, needModelFieldTypes } from '@platform/business/platform/form/constants/fieldTypes'
import { getFieldInWidgetAdd } from '@platform/business/platform/form/formbuilder/utils/widgetAdd'
export default {
  props: {
    element: Object,
    select: Object,
    index: Number,
    data: Object,
    params: Object
  },
  data() {
    return {
      selectWidget: this.select,
      field: this.element,
      tableData: [{ name: '' }],
      isSub: true
    }
  },
  computed: {
    code() {
      return this.element.name
    },
    fields() {
      if (this.data.fields) { // 第一层
        return this.data.fields
      } else {
        return this.data.field_options.columns
      }
    },
    columns: {
      get() {
        return this.element.field_options.columns || []
      },
      set(val) {
        this.$set(this.element.field_options, 'columns', val)
      }
    },
    mode() {
      return this.element.field_options.mode || 'inner'
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
    this.tableData = null
  },
  methods: {
    // 获取边距配置
    getPadding() {
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
      } else if (this.$utils.isNotEmpty(this.params) &&
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
          _style += `padding-${key}: ${_margin[key]}px;`
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
    // 处理子表
    handleTableSelectWidget(index, colIndex) {
      // this.data.fields[index].field_options.columns[colIndex].code = this.data
      this.$set(this.data.fields[index].field_options.columns[colIndex], 'code', this.data.fields[index].name)
      this.$set(this.data.fields[index].field_options.columns[colIndex], 'isSub', true)
      this.selectWidget = this.data.fields[index].field_options.columns[colIndex]
    },
    handleWidgetData($event, row) {
    // console.log('coladd', $event, row, colIndex)
      const newIndex = $event.newIndex
      const oldIndex = $event.oldIndex
      const item = $event.item
      const index = this.index
      if (this.mode === 'inner') { // 表单模式
        let flag = false
        for (let i = 0; i < nestedFieldTypes.length; i++) {
          const type = nestedFieldTypes[i]
          if (item.className.indexOf('data-' + type) > -1) {
            flag = true
            break
          }
        }
        // 防止布局元素的嵌套拖拽
        if (flag) {
        // 如果是列表中拖拽的元素需要还原到原来位置
          if (item.tagName === 'DIV') {
            this.data.fields.splice(oldIndex, 0, row.field_options.columns[index])
          }
          row.field_options.columns.splice(newIndex, 1)
          this.$message.warning('表内编辑模式不能嵌套' + item.innerText)
          return false
        }
      }
      const id = new Ids([32, 36, 1]).next()
      const code = row.name
      const isSub = this.isSub
      const fieldType = row.field_options.columns[newIndex].field_type
      let temp = {
        ...row.field_options.columns[newIndex],
        field_options: {
          ...row.field_options.columns[newIndex].field_options
        },
        id,
        code,
        isSub
      }
      temp = getFieldInWidgetAdd(temp, fieldType)
      this.$set(row.field_options.columns, newIndex, temp)
      this.selectWidget = row.field_options.columns[newIndex]
    },
    handleWidgetTableMoveEnd($event, row) {
    // this.handleWidgetData($event, row)
    },
    /**
   * 处理子表单
   */
    handleWidgetTableAdd($event, row) {
      this.handleWidgetData($event, row)
    }
  }
}

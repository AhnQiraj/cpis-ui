<template>
  <!--其他-->
  <div
    class="widget-view"
    :class="{
      [`ibps-${fieldType}`]: true,
      active: selectWidget&&selectWidget.id == element.id}"
    :style="getPadding()"
    @click.stop="handleSelectWidget(index)"
  >
    <widget-form-other
      v-if="isOtherFieldType"
      :element="element"
      :index="index"
      :data="data"
      :code="code"
      :params="params"
    />
    <!--字段-->
    <el-form-item
      v-else
      :label-width="labelWidth"
      :required="element.field_options.required"
      @click.native.stop="handleSelectWidget(index)"
    >
      <template v-if="$utils.isNotEmpty(label)" slot="label">
        <span :style="getStyleByName('labelTypeface', 'labelFontSize', 'labelBold', 'labelColor')">{{ label+labelSuffix }}</span>
        <ibps-help v-if="element && element.desc && descPosition==='lableIcon'" :content="$utils.formatText(element.desc)" />
      </template>
      <widget-form-field
        :element="element"
        :params="params"
        @click.native.stop="handleSelectWidget(index)"
      />
      <template v-if="element && element.desc && descPosition==='inline' ">
        <div
          class="ibps-help-block"
          v-html="$utils.formatText(element.desc)"
        />
      </template>
    </el-form-item>
    <div v-if="selectWidget&&selectWidget.id == element.id" class="widget-view-action">
      <i class="ibps-icon-clone" @click.stop="handleWidgetClone(index)" />
      <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
    </div>
    <div v-if="selectWidget&&selectWidget.id == element.id" class="widget-view-drag">
      <i class="ibps-icon-arrows drag-widget" />
    </div>
  </div>
</template>
<script>
import Ids from 'ids'
import { isEqual } from 'element-ui/lib/utils/util'
import WidgetFormOther from './widget-form-other'
import WidgetFormField from './widget-form-field'
import { otherFieldTypes, needModelFieldTypes } from '@platform/business/platform/form/constants/fieldTypes'
import Styles from '@platform/business/platform/form/utils/global-style'
export default {
  components: {
    WidgetFormField,
    WidgetFormOther
  },
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
      selectWidget: this.select
    }
  },
  computed: {
    fields() {
      if (this.isTable) {
        return this.data.field_options.columns
      } else {
        return this.data.fields
      }
    },
    fieldType() {
      return this.element.field_type
    },
    isTable() {
      return this.data.field_type === 'table'
    },
    isOtherFieldType() {
      return otherFieldTypes.includes(this.element.field_type)
    },
    descPosition() {
      return this.params.descPosition || 'inline'
    },
    labelWidth() {
      if (this.element.field_options.hide_label) {
        return '0'
      }
      return this.element.field_options.is_label_width ? this.element.field_options.label_width + (this.element.field_options.label_width_unit || 'px') : null
    },
    label() {
      if (this.element.field_options.hide_label) {
        return null
      }
      return this.element.label +
        (this.element.field_options && this.element.field_options.units && (this.$utils.isEmpty(this.element.field_options.position) || this.element.field_options.position === 'label')
          ? '(' + this.element.field_options.units + ')'
          : '')
    },
    labelSuffix() {
      return this.params.labelSuffix
    }
  },
  watch: {
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
    getStyleByName(tfName, fsName, bName, cName, aName) { // 通过name获取样式(字体、字号、加粗、颜色、对齐方式)
      if (this.$utils.isEmpty(this.params) ||
      this.$utils.isEmpty(this.params.formAttrs) ||
      this.$utils.isEmpty(this.params.formAttrs.styles)) {return ''}
      return Styles.getStyleByName(this.params.formAttrs.styles, tfName, fsName, bName, cName, aName)
    },
    handleSelectWidget(index) {
      let code = this.code
      let isSub = this.isSub
      if (this.isTable) {
        code = this.data.name
        isSub = true
      }
      this.fields[index].code = code
      this.fields[index].isSub = isSub
      this.selectWidget = this.fields[index]
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
      const id = new Ids([32, 36, 1]).next()
      const cloneData = {
        ...this.fields[index],
        field_options: { ...this.fields[index].field_options },
        id: id
      }
      const fieldType = cloneData.field_type
      if (!needModelFieldTypes.includes(fieldType)) {
        cloneData.name = fieldType + '_' + new Ids([32, 36, 1]).next()
      }
      this.fields.splice(index, 0, JSON.parse(JSON.stringify(cloneData)))
      this.$nextTick(() => {
        this.selectWidget = this.fields[index + 1]
      })
    }
  }
}
</script>

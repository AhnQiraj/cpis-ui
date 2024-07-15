<template>
  <div v-if="field && field.id">
    <el-table
      :data="tableData"
    >
      <el-table-column width="200px">
        <template #header>
          <span :class="{ 'is_req': required}">
            {{ field.label }}
            <ibps-help v-if="element && element.desc && descPosition==='lableIcon'" :content="$utils.formatText(element.desc)" /></span>
        </template>
        <widget-form-field
          :element="field"
          :params="params"
        />
      </el-table-column>
    </el-table>
    <div v-if="selectWidget && selectWidget.id === field.id" class="widget-view-action">
      <i class="ibps-icon-clone" @click.stop="handleWidgetClone(index)" />
      <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
    </div>
    <div v-if="selectWidget && selectWidget.id == field.id" class="widget-view-drag">
      <i class="ibps-icon-arrows drag-widget" />
    </div>
  </div>
</template>
<script>
import Ids from 'ids'
import { isEqual } from 'element-ui/lib/utils/util'
import WidgetFormField from './widget-form-field'
import { needModelFieldTypes } from '@platform/business/platform/form/constants/fieldTypes'
export default {
  components: {
    WidgetFormField
  },
  props: {
    element: Object,
    select: Object,
    index: Number,
    data: Object,
    code: String,
    isSub: {
      type: Boolean,
      default: true
    },
    params: Object
  },
  data() {
    return {
      selectWidget: this.select,
      field: this.element,
      tableData: [{ name: '' }]
    }
  },
  computed: {
    fields() {
      return this.data.field_options.columns
    },
    required() {
      return this.field && this.field.field_options ? this.field.field_options.required : false
    },
    descPosition() {
      return this.params.descPosition || 'inline'
    }
  },
  watch: {
    element: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.field = val
        }
      },
      deep: true,
      immediate: true
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
    handleSelectWidget(index) {
      this.fields[index].code = this.code
      this.fields[index].isSub = this.isSub
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
      const cloneData = {
        ...this.fields[index],
        field_options: { ...this.fields[index].field_options },
        id: this.$utils.guid()
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

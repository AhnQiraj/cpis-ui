<template>
  <el-card
    v-show="ruleDisplay !== 'hidden'"
    :shadow="field.field_options.shadow"
    class="ibps-mb-5"
    :class="field.field_options.custom_class"
    :style="getRuleStyle()+getPadding()"
  >
    <div v-if="!$utils.toBoolean(field.field_options.hide_label,false)" slot="header" class="clearfix">
      <span>{{ field.label }}</span>
    </div>
    <div v-for="(col, colIndex) in field.field_options.columns" :key="col.id?col.id:'_'+colIndex">
      <template v-for="item in col.fields">
        <!--嵌套布局-->
        <component
          :is="'ibps-dynamic-form-'+item.field_type"
          v-if="isNestedField(item.field_type)"
          :ref="'formItem'+item.name"
          :key="item.name"
          :models="models"
          :rights="rights"
          :field="item"
          :row="row"
          :code="code"
          :main-code="mainCode"
          :form-data="formData"
          :params="params"
          :table-params="tableParams"
          v-on="$listeners"
        />
        <!--其他类型-->
        <ibps-dynamic-form-item
          v-else
          :ref="'formItem'+item.name"
          :key="item.name"
          :models="models"
          :rights="rights"
          :field="item"
          :row="row"
          :code="code"
          :main-code="mainCode"
          :params="params"
          :table-params="tableParams"
          v-on="$listeners"
        />
      </template>
    </div>
  </el-card>
</template>
<script>
import NestedMixin from './mixins/nested'
export default {
  mixins: [NestedMixin],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data() {
    const columns = this.field.field_options.columns || []
    const activeNames = []
    columns.forEach(column => {
      if (column.checked) {
        activeNames.push(column.name)
      }
    })
    return {
      activeNames: activeNames
    }
  },
  beforeDestroy() {
    this.activeNames = null
  }
}
</script>

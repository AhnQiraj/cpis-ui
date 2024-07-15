<template>
  <fieldset
    v-show="ruleDisplay !== 'hidden'"
    class="ibps-fieldset"
    :class=" [
      field.field_options.border_style ? 'ibps-fieldset--' + field.field_options.border_style : '',
      field.field_options.custom_class
    ]"
    :style="getRuleStyle()+getPadding()"
  >
    <legend
      :class="[
        'ibps-fieldset--'+field.field_options.type,
        'ibps-fieldset--'+field.field_options.position,
      ]"
    >{{ field.label }}
      <ibps-help v-if="field && field.desc && descPosition==='lableIcon'" type="tooltip" :content="$utils.formatText(field.desc)" />
    </legend>
    <div v-if="field && field.desc && descPosition==='inline'" class="ibps-fieldset--desc" v-html="$utils.formatText( field.desc )" />
    <div
      v-if="field&&field.field_options&&field.field_options.split_line"
      class="ibps-divider"
      :class="'ibps-'+field.field_options.line_style||'dashed'"
    />
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
  </fieldset>
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

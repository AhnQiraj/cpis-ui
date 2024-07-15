<template>
  <!--嵌套布局-->
  <component
    :is="'ibps-dynamic-form-'+field.field_type"
    v-if=" isNestedField(field.field_type)"
    :ref="'formItem'+field.name"
    :models="models"
    :rights="rights"
    :field="field"
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
    :ref="'formItem'+field.name"
    :models="models"
    :rights="rights"
    :field="field"
    :row="row"
    :code="code"
    :main-code="mainCode"
    :form-data="formData"
    :params="params"
    :table-params="tableParams"
    v-on="$listeners"
  />
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
  }
}
</script>

<template>
  <el-form v-bind="$attrs" v-on="$listeners">
    <!-- 基本属性 -->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      :bo-data="boData"
      :fields="fields"
      types="switchFieldType,label,name,desc,display"
    />
    <!-- 参数设置 -->
    <editor-field-selector
      :field-item="fieldItem"
      :field-type="fieldType"
      types="store"
    />
    <!-- 字段权限 -->
    <editor-rights
      :field-item="fieldItem"
      types="hide"
    />
    <!-- 布局设置 -->
    <editor-layout
      :form-type="formType"
      :field-item="fieldItem"
      types="hideLabel,labelWidth,width,customClass,mobile"
    />
  </el-form>
</template>
<script>
import typeMixin from '../mixins/type'
import { selectorTypeOptions } from '@platform/business/platform/form/constants/fieldOptions'
export default {
  name: 'IbpsFieldCurrentOrg',
  mixins: [typeMixin],
  data() {
    return {
      selectorTypeOptions: selectorTypeOptions
    }
  },
  beforeDestroy() {
    this.selectorTypeOptions = null
  }
}
</script>

<template>
  <el-form
    v-bind="$attrs"
    v-on="$listeners"
  >
    <!-- 基本属性 -->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      :bo-data="boData"
      :fields="fields"
      types="label,key"
    />
    <!-- 流程关联设置 -->
    <editor-field-bpm-link
      :field-item="fieldItem"
      types="name"
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
      types="hideLabel,labelWidth,customClass,mobile"
    />
  </el-form>
</template>
<script>
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldBpmLink',
  mixins: [typeMixin]
}
</script>

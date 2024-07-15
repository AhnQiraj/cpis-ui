<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      :bo-data="boData"
      types="label,key,combination,desc"
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
      types="customClass,mobile"
    />
  </el-form>
</template>
<script>
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldDesc',
  mixins: [typeMixin]
}
</script>

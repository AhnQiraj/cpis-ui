<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      :bo-data="boData"
      :fields="fields"
      types="label,key,defaultValue,desc,tag"
      default-value-types="fixed,dynamic,formula"
    />
    <!-- 基本属性 -->
    <editor-field-tag
      :bo-data="boData"
      :field-item="fieldItem"
    />
    <!-- 字段权限 -->
    <editor-rights
      :field-item="fieldItem"
      :types="'hide'"
    />
    <!-- 布局设置 -->
    <editor-layout
      :form-type="formType"
      :field-item="fieldItem"
      types="hiddenLayout"
    />
  </el-form>
</template>
<script>
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldTag',
  mixins: [typeMixin]
}
</script>

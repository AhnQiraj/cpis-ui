<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      :bo-data="boData"
      :fields="fields"
      types="label,customLabel,name,desc,table"
    />
    <!-- 表单字段和按钮 -->
    <editor-field-table
      :field-item="fieldItem"
      :fields="fields"
      :bo-data="boData"
      :form-type="formType"
      @select="handleSelect"
    />
    <!-- 列表分组 -->
    <editor-grouping
      v-if="$utils.isNotEmpty(fieldItem.field_options.mode) && (fieldItem.field_options.mode === 'inner' || fieldItem.field_options.mode === 'dialog')"
      :field-item="fieldItem"
      :bo-data="boData"
      :fields="fields"
      :form-type="formType"
    />
    <!-- 校验规则 -->
    <editor-rules
      v-if="formType==='form'"
      :field-item="fieldItem"
      types="required"
    />
    <!-- 字段权限 -->
    <editor-rights
      :field-item="fieldItem"
      :types="formType==='form'?'hide,read':'hide'"
    />
    <!-- 布局设置 ,pageable-->
    <editor-layout
      :field-item="fieldItem"
      :form-type="formType"
      types="mode,labelWidth,index,displayField,manage,summary,summaryMethod,customClass,pageable"
    />
  </el-form>
</template>
<script>
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldTable',
  mixins: [typeMixin]
}
</script>

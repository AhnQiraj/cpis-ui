<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      :bo-data="boData"
      :fields="fields"
      default-value-types="fixed,dynamic,formula"
    >
      <template slot="fixedValue">
        <ibps-ueditor
          v-model="fieldOptions.default_value"
        />
      </template>
    </editor-base>
    <!-- 校验规则 -->
    <editor-rules
      v-if="formType==='form'"
      :field-item="fieldItem"
      types="required,length"
    />
    <!-- 字段权限 -->
    <editor-rights
      :field-item="fieldItem"
      :types="formType==='form'?'hide,read':'hide'"
    />
    <!-- 布局设置 -->
    <editor-layout
      :form-type="formType"
      :field-item="fieldItem"
      types="hideLabel,labelWidth,width,height,customClass,mobile"
    />
    <!-- 工具栏设置 -->
    <editor-field-editor
      :field-item="fieldItem"
    />
  </el-form>
</template>
<script>
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldEditor',
  mixins: [typeMixin]
}
</script>

<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      :bo-data="boData"
      types="switchFieldType,label,name,desc,display"
    />
    <editor-field-control
      :field-item="fieldItem"
    />
    <!-- 参数设置 -->
    <editor-param-setting
      :field-item="fieldItem"
      :bo-data="boData"
    />
    <!-- 校验规则 -->
    <editor-rules
      :field-item="fieldItem"
      types="required"
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
      types="hideLabel,labelWidth,width,customClass,mobile"
    />
  </el-form>
</template>
<script>
import EditorFieldControl from '../editors/editor-field-control'
import EditorParamSetting from '../editors/editor-param-setting'
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldControl',
  components: {
    EditorFieldControl,
    EditorParamSetting
  },
  mixins: [typeMixin]
}
</script>

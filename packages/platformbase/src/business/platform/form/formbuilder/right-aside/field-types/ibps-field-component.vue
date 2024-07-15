<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      types="switchFieldType,label,key,desc,display"
    />
    <editor-field-component
      :field-item="fieldItem"
    />
    <!-- 参数设置 -->
    <editor-param-setting
      :field-item="fieldItem"
      :bo-data="boData"
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
    <!-- 级联设置 -->
    <editor-cascade-setting
      :field-item="fieldItem"
      :bo-data="boData"
      :fields="fields"
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
import EditorFieldComponent from '../editors/editor-field-component'
import EditorParamSetting from '../editors/editor-param-setting'
import EditorCascadeSetting from '../editors/editor-cascade-setting'
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldComponent',
  components: {
    EditorFieldComponent,
    EditorParamSetting,
    EditorCascadeSetting
  },
  mixins: [typeMixin]
}
</script>

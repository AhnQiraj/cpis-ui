<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-field-form
      :bo-data="boData"
      :field-item="fieldItem"
      :form-type="formType"
      control-type="detail"
    />
    <!-- 主键设置 -->
    <editor-primary-key
      :field-item="fieldItem"
      :bo-data="boData"
      :form-type="formType"
    />
    <!-- 参数设置 -->
    <editor-param-setting
      :bo-data="boData"
      :field-item="fieldItem"
      :form-type="formType"
    />
    <!-- 级联设置 -->
    <editor-cascade-setting
      :field-item="fieldItem"
      :bo-data="boData"
      :fields="fields"
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
      types="hiddenLayout"
    />
  </el-form>
</template>
<script>
import EditorFieldForm from '../editors/editor-field-form'
import EditorPrimaryKey from '../editors/editor-primary-key'
import EditorParamSetting from '../editors/editor-param-setting'
import EditorCascadeSetting from '../editors/editor-cascade-setting'
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldDetailForm',
  components: {
    EditorFieldForm,
    EditorPrimaryKey,
    EditorParamSetting,
    EditorCascadeSetting
  },
  mixins: [typeMixin]
}
</script>

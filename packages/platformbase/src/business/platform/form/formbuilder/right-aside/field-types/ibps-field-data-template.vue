<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-field-data-template
      :fields="fields"
      :bo-data="boData"
      :field-item="fieldItem"
      :form-type="formType"
    />
    <!-- 参数设置 -->
    <editor-param-setting
      :bo-data="boData"
      :field-item="fieldItem"
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
import EditorFieldDataTemplate from '../editors/editor-field-data-template'
import EditorParamSetting from '../editors/editor-param-setting'
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldDataTemplate',
  components: {
    EditorFieldDataTemplate,
    EditorParamSetting
  },
  mixins: [typeMixin]
}
</script>

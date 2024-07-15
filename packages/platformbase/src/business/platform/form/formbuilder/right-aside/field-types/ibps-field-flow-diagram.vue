<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      types="label,key,desc"
    />
    <el-alert
      title="使用该控件，需工作流绑定该表单，才有流程审批流程图展示！"
      type="warning"
      :closable="false"
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
      types="hideLabel,labelWidth,customClass,mobile"
    />
  </el-form>
</template>
<script>
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldFlowDiagram',
  mixins: [typeMixin]
}
</script>

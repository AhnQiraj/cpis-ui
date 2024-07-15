<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-field-tabs
      :field-item="fieldItem"
    />
    <!-- 字段权限 -->
    <!-- <editor-rights
      :field-item="fieldItem"
      :types="'hide'"
    /> -->
    <!-- 布局设置 -->
    <editor-layout
      :form-type="formType"
      :field-item="fieldItem"
      types="customClass"
    />
  </el-form>
</template>
<script>
import EditorFieldTabs from '../editors/editor-field-tabs'
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldTabs',
  components: {
    EditorFieldTabs
  },
  mixins: [typeMixin]
}
</script>

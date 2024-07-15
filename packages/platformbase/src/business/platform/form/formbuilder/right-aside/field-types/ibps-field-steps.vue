<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-field-steps
      :field-item="fieldItem"
    />
    <!-- 字段权限 -->
    <!-- <editor-rights
      :field-item="fieldItem"
      :types="'hide'"
    /> -->
    <!-- 布局设置 -->
    <editor-layout
      :field-item="fieldItem"
      types="customClass"
    />
  </el-form>
</template>
<script>
import EditorFieldSteps from '../editors/editor-field-steps'
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldSteps',
  components: {
    EditorFieldSteps
  },
  mixins: [typeMixin]
}
</script>

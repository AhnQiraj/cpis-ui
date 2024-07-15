<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-field-collapse
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
import EditorFieldCollapse from '../editors/editor-field-collapse'
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldCollapse',
  components: {
    EditorFieldCollapse
  },
  mixins: [typeMixin]
}
</script>

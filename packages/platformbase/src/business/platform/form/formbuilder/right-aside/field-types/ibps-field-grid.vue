<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-field-grid
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
      types="customClass,overspread"
    />
  </el-form>
</template>
<script>
import EditorFieldGrid from '../editors/editor-field-grid'
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldGrid',
  components: {
    EditorFieldGrid
  },
  mixins: [typeMixin]
}
</script>

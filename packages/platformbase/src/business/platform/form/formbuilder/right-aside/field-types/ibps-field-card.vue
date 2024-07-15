<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-field-card
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
      types="hideLabel,customClass"
    />
  </el-form>
</template>
<script>
import EditorFieldCard from '../editors/editor-field-card'
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldCard',
  components: {
    EditorFieldCard
  },
  mixins: [typeMixin]
}
</script>

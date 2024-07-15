<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-form-header :field-item="fieldItem" />
  </el-form>
</template>
<script>
import EditorFormHeader from '../editors/editor-form-header'
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldFormHeader',
  components: { EditorFormHeader },
  mixins: [typeMixin],
  props: {
    fieldItem: {
      type: Object,
      required: true
    }
  }
}
</script>

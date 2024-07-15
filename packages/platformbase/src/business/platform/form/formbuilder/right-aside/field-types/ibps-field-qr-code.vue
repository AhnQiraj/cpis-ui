<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        types="label"
      />
      <!-- 二维码属性 -->
      <editor-field-qr-code
        :field-item="fieldItem"
        :bo-data="boData"
        :fields="fields"
      />
      <!-- 字段权限 -->
      <editor-rights
        :field-item="fieldItem"
      />
      <!-- 布局设置 -->
      <editor-layout
        :field-item="fieldItem"
        types="labelWidth,width,customClass,mobile"
      />
    </el-form>
  </div>
</template>
<script>
import typeMixin from '../mixins/type'
export default {
  mixins: [typeMixin],
  created() {
  }
}
</script>

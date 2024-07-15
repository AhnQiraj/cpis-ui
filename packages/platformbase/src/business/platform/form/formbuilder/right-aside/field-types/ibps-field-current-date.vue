<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      :bo-data="boData"
      :fields="fields"
      types="switchFieldType,label,name,datefmt,desc,display"
    />
    <!-- 校验规则 -->
    <!-- <editor-rules
      v-if="formType==='form'"
        :field-item="fieldItem"
        types="required"
      /> -->
    <!-- 字段权限 -->
    <editor-rights
      :field-item="fieldItem"
      types="hide"
    />
    <!-- 布局设置 -->
    <editor-layout
      :form-type="formType"
      :field-item="fieldItem"
      types="hideLabel,labelWidth,width,customClass,mobile"
    />
  </el-form>
</template>
<script>
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldDatepicker',
  mixins: [typeMixin],
  computed: {
    datePckerType() {
      return 'date'
    }
  }
}
</script>

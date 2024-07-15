<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      :bo-data="boData"
      :fields="fields"
      default-value-types="fixed,dynamic,formula"
    >
      <ibps-custom-dialog
        slot="fixedValue"
        v-model="fieldOptions.default_value"
        :is-run-script="false"
        :template-key="fieldOptions.dialog"
        :dynamic-params="dynamicParams"
        :multiple="fieldOptions.multiple === 'Y'"
        :placeholder="fieldOptions.placeholder"
        :store="fieldOptions.store"
        :icon="fieldOptions.icon?'ibps-icon-'+fieldOptions.icon:''"
        :type="fieldOptions.dialog_type"
      />
    </editor-base>
    <!-- 参数设置 -->
    <editor-field-custom-dialog
      :field-item="fieldItem"
      :fields="fields"
    />
    <!-- 校验规则 -->
    <editor-rules
      v-if="formType==='form'"
      :field-item="fieldItem"
    />
    <!-- 字段权限 -->
    <editor-rights
      :field-item="fieldItem"
      :types="formType==='form'?'hide,read':'hide'"
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
import FormUtils from '@platform/business/platform/form/utils/formUtil'
import IbpsCustomDialog from '@platform/business/platform/data/templaterender/custom-dialog'
export default {
  name: 'IbpsFieldCustomDialog',
  components: {
    IbpsCustomDialog
  },
  mixins: [typeMixin],
  computed: {
    dynamicParams() {
      return FormUtils.getLinkDynamicParams(this.fieldOptions)
    }
  }
}
</script>

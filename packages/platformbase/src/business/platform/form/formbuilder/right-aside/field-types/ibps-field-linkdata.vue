<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      :bo-data="boData"
      :fields="fields"
    >
      <template slot="fixedValue">
        <ibps-link-data
          v-model="fieldOptions.default_value"
          :template-key="fieldOptions.linkdata"
          :placeholder="fieldOptions.placeholder||'请选择'"
          :multiple="fieldOptions.multiple === 'Y'"
          :dynamic-params="dynamicParams"
          :structure="structure"
          :value-key="valueKey"
          :label-type="labelType"
          :label-key="labelKey"
          :config="linkConfig"
        />
      </template>
    </editor-base>
    <!-- 参数设置 -->
    <editor-field-linkdata
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
import IbpsLinkData from '@platform/business/platform/data/templaterender/link-data'
export default {
  name: 'IbpsFieldLinkdata',
  components: {
    IbpsLinkData
  },
  mixins: [typeMixin],
  computed: {
    dynamicParams() {
      return FormUtils.getLinkDynamicParams(this.fieldOptions)
    },
    valueKey() {
      return FormUtils.getLinkValueKey(this.fieldOptions)
    },
    labelType() {
      return FormUtils.getLinkLabelType(this.fieldOptions)
    },
    labelKey() {
      return FormUtils.getLinkLabelKey(this.fieldOptions)
    },
    structure() {
      return FormUtils.getLinkStructure(this.fieldOptions)
    },
    linkConfig() {
      return FormUtils.getLinkConfig(this.fieldOptions)
    }
  }
}
</script>

<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      :bo-data="boData"
      :fields="fields"
      types="switchFieldType,label,name,defaultValue,desc,display"
      default-value-types="fixed,dynamic,formula"
    >
      <template slot="fixedValue">
        <el-input
          v-model="fieldOptions.default_value"
          clearable
          placeholder="请输入默认值"
        />
      </template>
    </editor-base>
    <el-alert
      title="使用该控件，需设置默认值或者通过其他值计算才能生效"
      type="warning"
      :closable="false"
    />
    <!-- 条形码设置 -->
    <editor-field-barcode
      :field-item="fieldItem"
    />
    <!-- 字段权限 -->
    <editor-rights
      :field-item="fieldItem"
      :types="formType==='form'?'hide,read':'hide'"
    />
    <editor-layout
      :form-type="formType"
      :field-item="fieldItem"
      types="hideLabel,labelWidth,width,customClass,mobile"
    />
  </el-form>
</template>
<script>
import typeMixin from '../mixins/type'
import EditorFieldBarcode from '../editors/editor-field-barcode'
export default {
  name: 'IbpsFieldBarcode',
  components: {
    EditorFieldBarcode
  },
  mixins: [typeMixin]
}
</script>

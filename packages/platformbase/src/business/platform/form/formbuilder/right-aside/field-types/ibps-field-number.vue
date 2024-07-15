<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性  numberFormat-->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      :bo-data="boData"
      :fields="fields"
      types="switchFieldType,label,name,defaultValue,units,placeholder,desc,display"
    >
      <template slot="fixedValue">
        <!-- <el-input
            v-model.number="fieldOptions.default_value"
            type="number"
            clearable
            placeholder="请输入默认值"
          /> -->
        <ibps-number
          v-model.number="fieldOptions.default_value"
          placeholder="请输入默认值"
          :precision="fieldOptions.decimal_places"
          :decimal-scale="fieldOptions.decimal_scale"
          :keep-decimals="fieldOptions.keep_decimals"
          :number-format="fieldOptions.number_format"
          :thousands="fieldOptions.thousands"
          :max="fieldOptions.max"
          :min="fieldOptions.min"
          :step="fieldOptions.step"
          :controls="fieldOptions.controls"
          :position="fieldOptions.position"
        />
      </template>
    </editor-base>
    <!-- 格式设置 -->
    <editor-field-number
      :field-item="fieldItem"
    />
    <!-- 校验规则 -->
    <editor-rules
      v-if="formType==='form'"
      :field-item="fieldItem"
      types="required,number,minMax"
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
      types="hideLabel,labelWidth,width,clearable,customClass,mobile"
    />
  </el-form>
</template>
<script>
import typeMixin from '../mixins/type'
import IbpsNumber from '@platform/components/ibps-number'
export default {
  name: 'IbpsFieldNumber',
  components: { IbpsNumber },
  mixins: [typeMixin]
}
</script>

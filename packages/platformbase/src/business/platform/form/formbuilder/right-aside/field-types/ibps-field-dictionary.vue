<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      :bo-data="boData"
      :fields="fields"
    >
      <div slot="fixedValue">
        <ibps-dictionary
          v-model="fieldOptions.default_value"
          :type-key="fieldOptions.dictionary"
          :multiple="fieldOptions.multiple"
          :select-mode="fieldOptions.select_mode"
          :display-mode="fieldOptions.display_mode"
          :separator="fieldOptions.split"
          :empty-text="$utils.isEmpty(fieldOptions.dictionary)?'请先绑定的数据字典':'暂无数据'"
          clearable
        />
      </div>
    </editor-base>
    <!-- 参数设置 -->
    <editor-field-dictionary
      :field-item="fieldItem"
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
      types="hideLabel,labelWidth,width,clearable,customClass,mobile"
    />
  </el-form>
</template>
<script>
import typeMixin from '../mixins/type'
import IbpsDictionary from '@platform/business/platform/cat/dictionary/select'
export default {
  name: 'IbpsFieldDictionary',
  components: {
    IbpsDictionary
  },
  mixins: [typeMixin]
}
</script>

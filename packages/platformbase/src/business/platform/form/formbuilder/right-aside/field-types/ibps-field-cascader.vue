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
        <el-cascader
          v-model="fieldOptions.default_value"
          :options="dataOptions"
          :placeholder="fieldOptions.placeholder"
          :show-all-levels="fieldOptions.display_mode==='path'"
          :separator="fieldOptions.split"
          :props="{
            multiple:fieldOptions.multiple,
            expandTrigger:fieldOptions.expand_trigger,
            checkStrictly: fieldOptions.select_mode==='any',
            value:'val',
            emitPath:false
          }"
          :style="{width:'100%'}"
        />
      </div>
    </editor-base>
    <!-- 级联选项 -->
    <editor-options
      :field-item="fieldItem"
      :bo-data="boData"
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
      types="hideLabel,labelWidth,width,clearable,customClass,mobile"
    />
  </el-form>
</template>
<script>
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldCascader',
  mixins: [typeMixin],
  data() {
    return {
      ajaxOptions: []
    }
  },
  computed: {
  /**
     * 单选、多选、下拉等选项
     */
    dataOptions() {
      return this.fieldOptions['options'] || this.ajaxOptions
    }
  }
}
</script>

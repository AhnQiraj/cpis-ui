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
      <template slot="fixedValue">
        <template v-if="$utils.isNotEmpty(topval)">
          <ibps-address
            v-model="fieldOptions.default_value"
            :top-val="topval||'0'"
            :top="fieldOptions.top || 'country'"
            :level="fieldOptions.level||'district'"
            data-type="code"
            clearable
          />
        </template>
        <span v-else class="red">
          请先设置最大区域值再设置默认值
        </span>
      </template>
    </editor-base>
    <!-- 参数设置 -->
    <editor-field-address
      :field-item="fieldItem"
    />
    <!-- 校验规则 -->
    <editor-rules
      v-if="formType==='form'"
      :field-item="fieldItem"
    />
    <!-- 操作属性 -->
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
import IbpsAddress from '@platform/components/ibps-address/cascader'
export default {
  name: 'IbpsFieldAddress',
  components: {
    IbpsAddress
  },
  mixins: [typeMixin],
  computed: {
    topval() {
      if (this.fieldOptions.top === 'country') {
        return '0'
      }
      if (this.$utils.isNotEmpty(this.fieldOptions.topval) && this.fieldOptions.topval.length > 0) {
        return this.fieldOptions.topval[this.fieldOptions.topval.length - 1]
      } else {
        return ''
      }
    }
  }
}
</script>

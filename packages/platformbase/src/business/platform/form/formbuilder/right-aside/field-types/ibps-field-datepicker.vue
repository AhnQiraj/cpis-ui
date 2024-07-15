<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      :bo-data="boData"
      :fields="fields"
      types="switchFieldType,label,name,datefmt,defaultValue,placeholder,desc,display"
      default-value-types="fixed,today,dynamic,linkage,formula"
    >
      <template slot="fixedValue">
        <el-date-picker
          v-if="datePckerType=== 'datePicker'"
          v-model="fieldOptions.default_value"
          :type="dateType"
          :value-format="datefmt"
          :format="datefmt"
          style="width:100%;"
        />
        <el-time-picker
          v-else-if="datePckerType=== 'timePicker'"
          v-model="fieldOptions.default_value"
          :value-format="datefmt"
          :format="datefmt"
        />
      </template>
    </editor-base>
    <!-- 校验规则 -->
    <editor-rules
      v-if="formType==='form'"
      :field-item="fieldItem"
      :date-params="dateParams"
      :fields="fields"
      types="required,date"
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
import FormOptions from '@platform/business/platform/form/constants/formOptions'
import DateFormatUtil from '@platform/business/platform/form/utils/dateFormatUtil'
export default {
  name: 'IbpsFieldDatepicker',
  mixins: [typeMixin],
  computed: {
    dateParams() {
      return {
        datefmt: this.datefmt,
        dateType: this.dateType
      }
    },
    // 日期格式
    datefmt() {
      if (this.fieldOptions['datefmt_type'] && this.fieldOptions['datefmt_type'] !== 'custom') {
        if (this.fieldType === 'currentDate') {
          return FormOptions.t.DATE_FORMATS['date']
        } else if (this.fieldType === 'currentTime') {
          return FormOptions.t.DATE_FORMATS['time']
        } else {
          return FormOptions.t.DATE_FORMATS[this.fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date']
        }
      } else {
        return this.fieldOptions['datefmt'] || FormOptions.t.DATE_FORMATS['date']
      }
    },
    dateDealFmt() {
      return DateFormatUtil.dealFmt(this.datefmt)
    },
    // 日期控件类型
    datePckerType() {
      return this.dateDealFmt.datePckerType
    },
    dateType() {
      // year/month/date/week/ datetime/datetimerange/daterange
      // TODO: 根据自定义日期格式的配置
      return this.dateDealFmt.dateType || 'datetime'
    }
  }
}
</script>

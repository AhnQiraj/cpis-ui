<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      :bo-data="boData"
      :fields="fields"
      types="switchFieldType,label,name,defaultValue,desc,display"
    >
      <template slot="fixedValue">
        <el-switch
          v-model="fieldOptions.default_value"
          :width="fieldOptions.width"
          :active-value="fieldOptions.active_value"
          :inactive-value="fieldOptions.inactive_value"
          :active-text="$utils.toBoolean(fieldOptions.show_text, true)?fieldOptions.active_text:''"
          :inactive-text="$utils.toBoolean(fieldOptions.show_text, true)?fieldOptions.inactive_text:''"
          :active-color="fieldOptions.active_color"
          :inactive-color="fieldOptions.inactive_color"
        />
      </template>
    </editor-base>
    <!-- 开关设置 -->
    <editor-field-switch
      :field-item="fieldItem"
    />
    <!-- 字段权限 -->
    <editor-rights
      v-if="formType==='form'"
      :field-item="fieldItem"
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
import EditorFieldSwitch from '../editors/editor-field-switch'
export default {
  name: 'IbpsFieldSwitch',
  components: {
    EditorFieldSwitch
  },
  mixins: [typeMixin]
}
</script>

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
        <el-row>
          <el-col :span="24">
            <el-rate
              v-model="fieldOptions.default_value"
              :max="fieldOptions.max"
              :allow-half="fieldOptions.allow_half"
              :show-text="fieldOptions.show_text"
              :show-score="fieldOptions.show_score"
            />
          </el-col>
          <el-col :span="24">
            <el-button
              type="text"
              class="ibps-rate__clear"
              @click="fieldOptions.default_value=0"
            >清空</el-button>
          </el-col>
        </el-row>
      </template>
    </editor-base>
    <!-- 评分设置 -->
    <editor-field-rate
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
import EditorFieldRate from '../editors/editor-field-rate'
export default {
  name: 'IbpsFieldRate',
  components: {
    EditorFieldRate
  },
  mixins: [typeMixin]
}
</script>

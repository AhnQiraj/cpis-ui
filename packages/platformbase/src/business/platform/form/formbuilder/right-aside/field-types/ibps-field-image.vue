<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性 -->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      :bo-data="boData"
      :fields="fields"
      default-value-types="fixed"
    >
      <template slot="fixedValue">
        <ibps-image
          v-model="fieldOptions.default_value"
          :width="fieldOptions.width"
          :height="fieldOptions.height"
          :limit="fieldOptions.limit"
          :accept="imagesAccept"
          :media="fieldOptions.media"
          :tip="fieldOptions.tip"
          :size="fieldOptions.size"
          :upload-type="fieldOptions.uploadType"
        />
      </template>
    </editor-base>
    <!-- 参数设置 -->
    <editor-field-image
      :field-item="fieldItem"
    />
    <!-- 校验规则 -->
    <editor-rules
      v-if="formType==='form'"
      :field-item="fieldItem"
      types="required"
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
      types="hideLabel,labelWidth,customClass,mobile"
    />
  </el-form>
</template>
<script>
import { accept as ACCEPT } from '@platform/business/platform/file/constants/fileTypes'
import IbpsImage from '@platform/business/platform/file/image'
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldImage',
  components: {
    IbpsImage
  },
  mixins: [typeMixin],
  computed: {
    imagesAccept() {
      const accept = this.fieldOptions.accept
      if (this.$utils.isEmpty(accept)) {return ACCEPT['images']}
      if (accept === 'custom') {
        return this.fieldOptions.media
      }
      return accept
    }
  }
}
</script>

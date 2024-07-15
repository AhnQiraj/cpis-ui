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
        <ibps-attachment
          v-model="fieldOptions.default_value"
          :placeholder="fieldOptions.placeholder"
          :download="fieldOptions.download"
          :limit="fileQuantity"
          :file-size="maxFileSize"
          :accept="fileAccept"
          :file-ext="fileFormates"
          :multiple="multiple"
          :upload-type="fieldOptions.uploadType"
          :store="fieldOptions.store"
          :media-type="fieldOptions.media_type"
          :media="fieldOptions.media"
          setting="setting"
          clearable
        />
      </template>
    </editor-base>
    <!-- 参数设置 -->
    <editor-field-attachment
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
      types="hideLabel,labelWidth,width,customClass,mobile"
    />
  </el-form>
</template>
<script>
import IbpsAttachment from '@platform/business/platform/file/attachment/selector'
import { fileTypes as FILE_TYPES, accept as ACCEPT } from '@platform/business/platform/file/constants/fileTypes'
import typeMixin from '../mixins/type'
export default {
  name: 'IbpsFieldAttachment',
  components: {
    IbpsAttachment
  },
  mixins: [typeMixin],
  computed: {
    /**
     * 最大文件上传
     */
    maxFileSize() {
      return this.$utils.isNotEmpty(this.fieldOptions.max_file_size) ? this.fieldOptions.max_file_size * 1024 * 1024 : null
    },
    /**
     * 最大文件个数
     */
    fileQuantity() {
      if (this.$utils.isNotEmpty(this.fieldOptions.max_file_quantity) && (this.fieldOptions.max_file_quantity !== '-1' || this.fieldOptions.max_file_quantity !== -1)) {
        return parseInt(this.fieldOptions.max_file_quantity, 10)
      } else {
        return null
      }
    },
    // 格式类型
    fileAccept() {
      const mediaType = this.fieldOptions.media_type
      if (this.$utils.isEmpty(mediaType)) {return '*'}
      return ACCEPT[mediaType] || '*'
    },
    imagesAccept() {
      const accept = this.fieldOptions.accept
      if (this.$utils.isEmpty(accept)) {return ACCEPT['images']}
      if (accept === 'custom') {
        return this.fieldOptions.media
      }
      return accept
    },
    fileFormates() {
      const mediaType = this.fieldOptions.media_type
      if (this.$utils.isEmpty(mediaType)) {return []}
      const x = FILE_TYPES[mediaType]
      if ((x)) {
        return x.map((v) => {
          return '.' + v
        })
      } else {
        return (this.fieldOptions.media || '').split(',')
      }
    },
    /**
     * 是否多选
     */
    multiple() {
      return this.$utils.toBoolean(this.fieldOptions['multiple'], true)
    }
  }
}
</script>

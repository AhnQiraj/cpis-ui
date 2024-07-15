<template>
  <div class="ibps-image">
    <!--展示-->
    <ul class="ibps-p-0">
      <li
        v-for="(item, index) in fileList"
        :key="index"
        class="image-reader-item"
        :style="{
          backgroundImage: 'url(' + getImageUrl(item.id) + ')',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          width: `${$utils.isEmpty(width) ? 100 : width}px`,
          height: `${$utils.isEmpty(height) ? 100 : height}px`
        }"
        @click="clickHandler(item, index)"
        @mouseover="showTips(item, index)"
        @mouseout="hideTips(item, index)"
      >
        <el-tag v-if="!(disabled || readonly)" class="image-reader-item-tag" @click.stop="onDeleteImage(index)">
          <i class="el-icon-delete" />
        </el-tag>
        <el-tag v-if="!disabled" class="image-reader-item-tag" @click.stop="onDownloadImage(index)">
          <i class="el-icon-download" />
        </el-tag>
        <div :class="{ 'image-tip-visible': item.uid !== uid, 'image-tip': item.uid === uid }" v-text="tip" />
      </li>
    </ul>
    <template v-if="!disabled && (fileList.length < limit || !limit)">
      <!--ibps 附件上传方式-->
      <el-upload v-if="uploadType === 'attachment'" :style="uploadStyle" :action="fileUploadAction" :file-list="fileList" disabled list-type="picture-card" @click.native="clickAttachmentUpload">
        <i class="el-icon-plus" />
      </el-upload>
      <!--默认附件上传方式-->
      <el-upload v-else :style="uploadStyle" :action="fileUploadAction" list-type="picture-card" :http-request="httpRequest" :file-list="fileList" :multiple="multiple" :accept="fileAccept" :limit="flieLimit" :disabled="disabled" :on-exceed="handlePicAmount" :before-upload="beforeUpload">
        <i class="el-icon-plus" />
      </el-upload>
    </template>
    <!--图片预览-->
    <ibps-image-viewer v-if="showViewer" :z-index="zIndex" :initial-index="initialIndex" :on-close="closeViewer" :url-list="previewSrcList" />
    <ibps-file-uploader :visible="uploaderSelectorVisible" :value="selectorValue" :multiple="multiple" :accept="accept" :file-size="size" @close="visible => (uploaderSelectorVisible = visible)" @action-event="handleUpload" />
  </div>
</template>
<script>
import setting from '@platform/setting.js'
import { imageAccept } from '@platform/utils/fileTypes'
import { downloadFile } from '@platform/utils/file'
import { isEqual } from 'element-ui/lib/utils/util'
import emitter from 'element-ui/lib/mixins/emitter'
import { remoteRequest, remoteTransRequest } from '@platform/utils/remote'
import PopupManager from '@platform/utils/popup'
import IbpsFileUploader from '@platform/components/ibps-file-uploader/index.vue'
import IbpsImageViewer from '@platform/components/ibps-file-viewer/image'
import { TRANSFER_DATA } from '@platform/constant'
export default {
  name: 'IbpsImage',
  components: {
    IbpsFileUploader,
    IbpsImageViewer
  },
  mixins: [emitter],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    value: {
      type: [String, Number, Array, Object]
    },
    size: [Number, String], // 限制大小
    accept: String, // 限制图片类型
    tip: String, // 提示消息
    limit: [Number, String], // 上传数量
    // quality: Number, // 压缩质量
    width: {
      // 宽
      type: String,
      default: '150'
    },
    height: {
      // 高
      type: String,
      default: '150'
    },
    disabled: {
      // 是否禁用
      type: Boolean,
      default: false
    },
    readonly: {
      // 是否只读
      type: Boolean,
      default: false
    },
    multiple: {
      // 是否支持选择多张
      type: Boolean,
      default: true
    },
    uploadType: {
      // 上传方式 （ default:直接打开上传，attachment：ibps上传附件打开上传 ）
      type: String,
      default: 'attachment'
    },
    store: {
      type: String,
      default: 'json',
      validator: function (value) {
        return ['id', 'json', 'array', 'arrayId', 'bind'].indexOf(value) !== -1
      }
    },
    labelKey: {
      // 展示的值
      type: String,
      default: 'fileName'
    },
    valueKey: {
      // 存储唯一值
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      fileUploadAction: setting.fileUploadAction,
      fileList: [],
      realFileList: [],
      selectorValue: this.multiple ? [] : {},
      cacheData: {}, // 缓存数据
      initialIndex: 0,
      showViewer: false,
      zIndex: 2000,
      uploaderSelectorVisible: false,
      isActive: false,
      uid: ''
    }
  },
  computed: {
    flieLimit() {
      return this.$utils.isNotEmpty(this.limit) ? parseInt(this.limit) : null
    },
    fileAccept() {
      if (this.$utils.isEmpty(this.accept) || this.accept === '*') {
        return 'image/*'
      }
      return this.converImageAccept(this.accept)
    },
    previewSrcList() {
      const list = []
      this.fileList.forEach(file => {
        list.push(window.apiList['file/attachment'].getImage(file.id))
      })
      return list
    },
    uploadStyle() {
      const { width, height } = this
      return {
        width: `${this.$utils.isEmpty(width) ? 100 : width}px`,
        height: `${this.$utils.isEmpty(height) ? 100 : height}px`,
        lineHeight: `${this.$utils.isEmpty(height) ? 100 : height}px`,
        display: 'inline'
      }
    }
  },
  watch: {
    value(val, oldVal) {
      this.setValue()
      if (!isEqual(val, oldVal)) {
        this.dispatch('ElFormItem', 'el.form.change', val)
      }
    },
    fileList: {
      handler(val, oldVal) {
        this.$emit('input', this.getValue())
      },
      deep: true
    }
  },
  mounted() {
    this.setValue()
  },
  beforeDestroy() {
    this.fileList = null
    this.realFileList = null
    this.selectorValue = null
    this.cacheData = null
  },
  methods: {
    /**
     * zxh 修复zindex 不是最高的被遮住
     */
    fixZIndex() {
      return PopupManager.getZIndex()
    },
    converImageAccept(accept) {
      const accepts = accept.split(',')
      const fileAccept = []
      accepts.forEach(item => {
        let type = item
        if (item.substr(0, 1) === '.') {
          type = item.substr(1)
        }
        fileAccept.push('.' + type)
      })
      return fileAccept.join(',')
    },
    converFileAccept(accept) {
      const accepts = accept.split(',')
      const fileAccept = []
      accepts.forEach(item => {
        let type = item
        if (item.substr(0, 1) === '.') {
          type = item.substr(1)
        }
        fileAccept.push(imageAccept[type])
      })
      return fileAccept
    },
    setValue() {
      if (this.$utils.isEmpty(this.value)) {
        this.fileList = []
        return
      }
      this.fileList = this.getArrayValue(this.value)
      this.initRealFileList()
    },
    initRealFileList() {
      this.realFileList = []
      this.fileList.forEach(v => {
        const id = v[this.valueKey]
        if (this.cacheData[id]) {
          this.setRealFileList(id)
        } else {
          this.getDataInfo(id)
        }
      })
    },
    setCacheData(v) {
      this.cacheData[v[this.valueKey]] = v
    },
    setRealFileList(v) {
      this.realFileList.push(this.cacheData[v])
    },
    /**
     * 通过ID获取数据
     */
    getDataInfo(id) {
      if (TRANSFER_DATA === 'transfer') {
        this.getTransferData(id)
      } else {
        this.getRemoteData(id)
      }
    },
    getTransferData(id) {
      remoteTransRequest('attachment', id).then(idset => {
        const ids = Array.from(idset)
        remoteRequest('attachmentIds', ids, () => {
          return this.getRemoteTransFunc(ids)
        })
          .then(response => {
            const responseData = response.data
            const data = responseData[id]
            this.setRemoteData(data)
          })
          .catch(() => {})
      })
    },
    getRemoteTransFunc(ids) {
      return new Promise((resolve, reject) => {
        window.apiList['file/attachment']
          .transfer({
            ids: ids
          })
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getRemoteData(id) {
      remoteRequest('attachment' + this.valueKey, id, () => {
        return this.getRemoteByIdFunc(id)
      })
        .then(response => {
          const data = response.data
          this.setRemoteData(data)
        })
        .catch(() => {})
    },
    getRemoteByIdFunc(id) {
      return new Promise((resolve, reject) => {
        window.apiList['file/attachment']
          .get({
            attachmentId: id
          })
          .then(response => {
            resolve(response)
          })
          .catch(() => {})
      })
    },
    setRemoteData(data) {
      if (this.$utils.isNotEmpty(data)) {
        this.cacheData[data[this.valueKey]] = data
        this.setSelectorValue(data[this.valueKey])
      }
    },
    /**
     * 获得数组数据
     */
    getArrayValue(value) {
      if (this.$utils.isEmpty(value)) {
        return []
      }
      if (this.store === 'json') {
        // json
        try {
          return this.$utils.parseData(value)
        } catch (error) {
          console.error(error)
          return []
        }
      } else if (this.store === 'id') {
        // id
        return this.$utils.isString(value) ? value.split(this.storeSeparator) : []
      } else {
        // array
        return value.map(d => {
          return d[this.valueKey]
        })
      }
    },
    getStoreValue(value) {
      const res = []
      if (this.store === 'json') {
        // json
        if (this.$utils.isEmpty(value)) {
          return ''
        }
        value.forEach(v => {
          const o = {}
          o[this.valueKey] = v[this.valueKey]
          o[this.labelKey] = v[this.labelKey]
          res.push(o)
        })
        return JSON.stringify(res)
      } else if (this.store === 'id') {
        // id
        if (this.$utils.isEmpty(value)) {
          return ''
        }
        value.forEach(v => {
          res.push(v[this.valueKey])
        })
        return res.join(this.storeSeparator)
      } else {
        // 数组 array
        return value || []
      }
    },
    getValue() {
      return this.getStoreValue(this.fileList)
    },
    showTips(item, index) {
      this.uid = item.uid
      // item.isActive = true
    },
    hideTips(item, index) {
      this.uid = ''
    },
    /**
     * 文件上传
     */
    httpRequest(options) {
      return window.apiList['file/attachment'].uploadFile(options.file, {}).then(response => {
        const data = response.data
        this.setCacheData(data)
        this.fileList.push(data)
      })
    },
    /**
     * 上传方式为ibps附件上传时
     */
    clickAttachmentUpload() {
      if (this.disabled || this.readonly) {
        return
      }
      this.uploaderSelectorVisible = true
    },
    handleSuccess(response, file, fileList) {
      if (this.disabled || this.readonly) {
        return
      }
      this.fileList = fileList.map(item => {
        item.isActive = false
        return item
      })
    },
    // handleChange(file, fileList) {
    //   this.fileList = fileList
    // },
    // handleRemove(file, fileList) {
    //   this.fileList = fileList
    // },
    // 预览
    clickHandler(file, index) {
      this.zIndex = this.fixZIndex()
      this.initialIndex = index
      this.showViewer = true
    },
    closeViewer() {
      this.showViewer = false
    },
    /**
     *  删除图片
     */
    onDeleteImage(index) {
      // if (this.uploadType === 'default') {
      // TODD:删除同时删除数据库的
      // } else {
      this.fileList.splice(index, 1)
      // }
    },
    // 下载
    onDownloadImage(index) {
      this.setRealFileList(this.fileList[index][this.valueKey])
      this.$nextTick(() => {
        downloadFile(this.realFileList[index])
      })
    },
    // 图片上传数量限制
    handlePicAmount(files, fileList) {
      if (this.multiple && this.limit) {
        this.$message.closeAll()
        this.$message({
          message: `图片上传上限${this.limit}张`,
          type: 'warning'
        })
      }
    },
    // 格式、大小限制
    beforeUpload(file) {
      let isType = true
      if (this.$utils.isNotEmpty(this.accept) && this.accept !== '*') {
        const acceptType = this.converFileAccept(this.accept)
        isType = this.accept ? acceptType.includes(file.type) : true
        if (!isType) {
          this.$message.closeAll()
          this.$message.error(`上传图片的格式必须为【${this.accept}】`)
          return false
        }
      }
      const isLimitSize = this.size ? file.size / 1024 / 1024 < this.size : true
      if (!isLimitSize) {
        this.$message.closeAll()
        this.$message.error(`上传图片的大小不能超过 ${this.size}M!`)
        return false
      }
      return isLimitSize && isType
    },
    handleUpload(buttonKey, data) {
      console.log('-----------附件上传handleUpload-----------', data)
      const limit = parseInt(this.limit)
      if (this.$utils.isNotEmpty(this.limit) && data.length > limit) {
        this.$message.closeAll()
        this.$message.error(`图片上传上限${this.limit}张`)
        return
      }
      if (this.$utils.isNotEmpty(this.fileList) && (this.fileList.length >= limit || this.fileList.length + data.length > limit)) {
        this.$message.closeAll()
        this.$message.error(`图片数量上限为${this.limit}张`)
        return
      }
      if (data.constructor === Object) {
        this.setCacheData(data)
        this.fileList.push(data)
      } else {
        data.forEach(d => {
          this.setCacheData(d)
          this.fileList.push(d)
        })
      }
      this.uploaderSelectorVisible = false
    },
    getImageUrl(id) {
      return window.apiList['file/attachment'].getImage(id)
    }
  }
}
</script>
<style lang="scss" scoped>
.ibps-image {
  .el-upload-list--picture-card {
    display: none;
  }
  .el-upload--picture-card {
    width: inherit;
    height: inherit;
    line-height: inherit;
  }
  .image-reader-item {
    position: relative;
    float: left;
    width: 23.5%;
    margin-bottom: 2%;
    margin-right: 2%;
    background: #fff;
    box-shadow: 0 5px 20px rgba(197, 202, 213, 0.25);
    box-sizing: border-box;
    list-style: none;
    border-radius: 4px;
    background-size: cover;
    overflow: hidden;
    .image-reader-item-tag {
      background: #111a34;
      color: #fff;
      float: right;
      border-radius: 0;
      padding: 0 10px;
      border: 0;
    }
    .image-tip-visible {
      display: none;
    }
    .image-tip {
      position: absolute;
      bottom: 0;
      color: #fff;
      background: #111a34;
      font-size: 12px;
      width: 100%;
    }
  }
}
</style>

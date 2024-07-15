<template>
  <div>
    <el-upload id="uploadControl" ref="uploadControl" :limit="limit" :multiple="limit > 1 ? true : false" style="max-width: 300px; display: block" :class="isView ? 'view' : ''" :disabled="disabled" action="#" :before-upload="beforeUpload" :on-success="handSuccess" :before-remove="beforeRemove" :on-remove="handleRemove" :on-preview="handlePreview" :file-list="fileList">
      <el-button v-if="!isView" size="small" type="primary" :disabled="disabled">{{ $t('baseCommon.buttons.clickUpload') }}</el-button>
      <div v-if="!isView" slot="tip" class="el-upload__tip">{{ tip }}</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" :append-to-body="true" :title="$t('baseCommon.component.pictureView')" class="yj-dialog">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <vxe-modal v-model="dialogVisiblePPT" show-zoom resize width="70%" height="90%" :title="$t('baseCommon.message.fileView')">
      <el-row id="pptRow" style="overflow: hidden; width: 100%; height: calc(100% - 40px)">
        <iframe id="frameForm" ref="frameForm" :src="src" frameborder="0" style="overflow-y: auto; width: 100%; height: 98%" @load="imgStyle" />
      </el-row>
      <el-row style="display: flex; justify-content: center; height: 40px">
        <el-button type="primary" @click="downFile">{{ $t('baseCommon.buttons.downOrigFile') }}</el-button>
      </el-row>
    </vxe-modal>
  </div>
</template>
<script>
import $ from 'jquery'
import * as fileUtil from '@cupu/utils/file'
export default {
  name: 'InputUploadFile',
  props: {
    disabled: { type: Boolean, default: false },
    isView: {
      type: Boolean,
      default: true
    },
    attachType: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 1000
    },
    // 默认无提示
    tip: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogVisiblePPT: false,
      dialogImageUrl: '',
      fileListEmit: [],
      fileNames: '',
      // 上传的文件列表
      fileList: [],
      src: '',
      fileObj: {}
    }
  },
  methods: {
    /**
     * 上传的地址
     * @author mbb
     */
    uploadUrl() {
      return window.config.VUE_APP_BASE_API + '/platform/v3/file/upload'
    },
    /**
     * 上传文件之前的钩子
     * @author mbb
     */
    beforeUpload(file) {
      // 图片限制
      if (file.type.indexOf('image') === 0 && file.size > 20480000) {
        this.$message.error(this.$t('baseCommon.message.singleImgNotExc'))
        return false
      }
      // 名称长度限制
      if (file.name != undefined && file.name.length > 120) {
        this.$message.error(this.$t('baseCommon.message.fileNameLenNotExc'))
        return false
      }
      // this.getImgLocation(file)
      window.apiList['file/attachment'].uploadFile(file).then(response => {
        if (response.state === 200) {
          let data = {
            id: response.data.id,
            name: response.data.fileName,
            ext: response.data.ext,
            fileType: file.type,
            size: file.size,
            attachType: this.attachType
          }
          this.fileListEmit.push(data)
          this.fileList.push(data)
          this.$emit('edit', this.fileListEmit, this.attachType)
        }
      })
    },
    /**
     * 文件上传成功时的钩子
     * @author mbb
     */
    handSuccess(response, file, fileList) {},
    /**
     * 删除文件之前的钩子
     * @author mbb
     */
    beforeRemove() {},
    /**
     * 文件列表移除文件时的钩子
     * @author mbb
     */
    handleRemove(file) {
      let id = file.id || file.response.data.id
      this.fileListEmit.forEach((item, index) => {
        if (item.id == id) {
          this.fileListEmit.splice(index, 1)
          return false
        }
      })
      this.fileList.forEach((item, index) => {
        if (item.id == id) {
          this.fileList.splice(index, 1)
          return false
        }
      })
      this.$emit('edit', this.fileListEmit, this.attachType)
    },
    // 预览新版本开始
    handlePreview(file) {
      this.fileObj = file
      if (file.response && file.response.data && file.response.data.id) {
        this.getImage(file.response.data.id)
      } else if (file.id) {
        this.getImage(file.id)
      } else {
        this.$message(this.$t('baseCommon.message.fileNotPreview'))
      }
    },
    getImage(id) {
      this.dialogVisiblePPT = true
      this.dialogImageUrl = window.config.VUE_APP_BASE_API + '/platform/v3/file/preview?attachmentId=' + id
      this.$nextTick(() => {
        $('#frameForm').attr('src', this.dialogImageUrl)
        //this.imgStyle()
      })
    },
    imgStyle() {
      let iframeBox = document.getElementById('frameForm')
      let doc = iframeBox.contentWindow.document
      let _body = doc.getElementsByTagName('body')[0]
      let _box = doc.getElementsByTagName('img')[0]
      _body.style.textAlign = 'center'
      _box.style.width = 'auto'
      _box.style.maxWidth = '100%'
      _box.style.height = 'auto'
      _box.style.maxHeight = '100%'
    },
    downFile() {
      fileUtil.downloadFile(this.fileObj)
    },
    downLoadFile(id, fileType, name) {
      let newName = ''
      if (fileType.split('/')[1] === 'pdf') {
        newName = name + '.pdf'
      } else {
        newName = name
      }
      // 执行下载
      window.apiList['file/attachment'].download({ attachmentId: id }).then(res => {
        let a = document.createElement('a')
        let blob = new Blob([res], { type: fileType })
        let objectUrl = URL.createObjectURL(blob)
        a.setAttribute('href', objectUrl)
        a.setAttribute('download', newName)
        a.click()
      })
    },
    clear() {
      this.fileListEmit = []
      this.fileList = []
      this.$refs.uploadControl.clearFiles()
    },
    /**
     * 设置文件
     * @author mbb
     */
    setVal(files) {
      if (files) {
        try {
          if (files.indexOf('[{') === 0) {
            this.fileList = JSON.parse(files)
            this.fileListEmit = JSON.parse(files)
          } else {
            this.$emit('edit', '')
          }
        } catch {
          this.$emit('edit', '')
          this.fileList = []
          this.fileListEmit = []
        }
      }
    }
  }
}
</script>
<style>
#uploadControl .el-upload {
  display: block !important;
  text-align: left;
}
#uploadControl.view .el-upload-list__item-status-label {
  display: none !important;
}
#uploadControl.view .el-icon-circle-check:before {
  content: '\e6db' !important;
}
#uploadControl.view .el-icon-close {
  display: none !important;
}
.el-form-item__content {
  height: auto !important;
}
</style>
<style lang="scss" scoped>
::v-deep .el-button {
  background-size: 18px;
}
::v-deep .el-dialog {
  height: 72vh !important;
}
</style>
<style lang="scss" scoped>
::v-deep .el-button {
  background-size: 18px;
}
::v-deep .el-dialog {
  height: 72vh !important;
}
::v-deep .el-upload-dragger {
  width: 210px;
  height: 80px;
  padding: 5px;
}
::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: 88px;
  height: 88px;
}
.el-upload-dragger .el-icon-upload {
  float: left;
  margin: 8px 0;
}
.el-upload-dragger .el-upload__text {
  padding-top: 8px;
}
.el-upload-list--picture .el-upload-list__item {
  height: 80px;
}
::v-deep .el-upload-list--picture .el-upload-list__item {
  margin-top: 4px;
  margin-right: 10px;
  height: 80px;
}
::v-deep .el-upload-list__item-name {
  margin-right: 20px;
}
::v-deep .el-upload-list__item {
  position: inherit;
}
::v-deep .el-upload-list__item-status-label {
  position: inherit;
}
::v-deep .el-upload-list__item.is-success .el-upload-list__item-status-label {
  display: none;
}
::v-deep .el-upload-list--picture .el-upload-list__item-thumbnail {
  width: 60px;
  height: 60px;
}
::v-deep .el-upload-list--picture .el-upload-list__item.is-success .el-upload-list__item-name {
  line-height: 60px;
}
::v-deep {
}
.ibps-uplpad {
  overflow-y: auto;
  .header {
    height: 45px;
    border-bottom: 1px solid #dadada;
    margin: 0;
    padding: 0;
    line-height: 45px;
    vertical-align: middle;
    position: relative;
  }
  .btns {
    position: absolute;
    top: 7px;
    right: 0;
    line-height: 30px;
  }
  .uploader {
    list-style: none;
    margin: 0;
    padding-top: 5px;
  }
  .el-upload--picture-card {
    border: 0;
  }
  .el-upload-dragger {
    width: 148px;
    height: 148px;
  }
  .el-upload-list--picture-card .el-upload-list__item-name {
    display: block;
    position: absolute;
    top: 0px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    margin: 0;
    width: 100%;
  }
}
</style>

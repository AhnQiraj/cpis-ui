<template>
  <div id="cpis-upload-list">
    <el-upload
      ref="uploadFileset"
      :limit="limit"
      :multiple="limit > 1"
      action="#"
      :class="[disabled ? 'is-disabled' : '']"
      :disabled="disabled"
      :fileList="fileList"
      list-type="picture-card"
      :before-upload="beforeUpload"
      :http-request="handleUpload"
    >
      <div
        slot="file"
        slot-scope="{ file }"
        :class="[
          ['jpg', 'png', 'jpeg'].includes(file.ext) ? '' : 'other-placeholder'
        ]"
      >
        <template v-if="['jpg', 'png', 'jpeg'].includes(file.ext)">
          <img :src="getPath(file.id)" alt="" />
        </template>
        <template v-else>
          <div class="el-icon-document" />
          <span class="file-name">{{ file.name }}</span>
        </template>
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="downlodFile(file)">
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
      <template slot="default">
        <el-tooltip
          placement="bottom-end"
          :content="tooltip"
          :enterable="false"
        >
          <div style="width: 100%; height: 100%">
            <i class="el-icon-plus" />
          </div>
        </el-tooltip>
      </template>
    </el-upload>
    <el-dialog
      :visible.sync="previewDialogVisible"
      height="90%"
      :title="getImage.title"
    >
      <el-link
        v-if="fileList != null && fileList.length > 1"
        class="arrow l-arrow"
        icon="el-icon-arrow-left"
        :underline="false"
        @click="preFile"
      ></el-link>
      <el-link
        v-if="fileList != null && fileList.length > 1"
        class="arrow r-arrow"
        icon="el-icon-arrow-right"
        :underline="false"
        @click="nextFile"
      ></el-link>
      <el-row
        id="pptRow"
        style="overflow: hidden; width: 100%; height: calc(100% - 40px)"
      >
        <img
          v-if="getImage.type === 'image'"
          :src="getImage.url"
          alt=""
          style="width: 100%; height: 100%; object-fit: contain"
        />
        <iframe
          v-else
          id="frameForm"
          ref="frameForm"
          :src="getImage.url"
          frameborder="0"
          style="overflow-y: auto; width: 100%; height: 98%"
        />
      </el-row>
      <el-row style="display: flex; justify-content: center; height: 40px">
        <el-button type="primary" @click="downFile">下载原文件</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import * as fileUtil from '@cupu/utils/file'
import { getLoginInfo } from '@cupu/utils/index'

export default {
  name: 'CpisUploadList',
  props: {
    value: {
      type: String,
      default: ''
    },
    tip: {
      type: String,
      default:
        '单个文件不能超过{sizeLimit}MB,在线打开支持 Word、Excel、PDF、MP4、JPG'
    },
    sizeLimit: {
      type: Number,
      default: 20 * 1024 * 1024
    },
    params: {
      type: Object,
      default: {},
      comment:
        '上传文件的参数businessCode, subBusinessCode, businessDataCode,  projectId'
    },
    limit: {
      type: Number,
      default: 100
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      handler: function (val) {
        if (val) {
          this.collectionId = val
          this.init(val)
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      // 上传的文件列表
      fileList: [],
      curIndex: 0,
      title: '',
      collectionId: null,
      previewDialogVisible: false
    }
  },
  computed: {
    getImage() {
      const file = this.fileList?.[this.curIndex]
      if (!file) return {}
      return {
        title:
          '文件预览（部分格式文件预览乱码或预览失败，请下载原文件查看）' +
          file.name,
        url: this.getPath(file.id),
        type: ['jpg', 'png', 'jpeg'].includes(file.ext) ? 'image' : 'other'
      }
    },
    tooltip() {
      return this.tip.replace('{sizeLimit}', this.sizeLimit / 1024 / 1024 + '')
    }
  },
  methods: {
    guid(limit) {
      let num = '' // 定义用户编号
      limit = limit || 4
      limit = limit > 6 ? 6 : limit
      for (let i = 0; i < limit; i++) {
        // 4位随机数，用以加在时间戳后面。
        num += Math.floor(Math.random() * 10)
      }
      num = new Date().getTime() + num // 时间戳，用来生成用户编号。
      return num
    },
    /**
     * 上传文件之前的钩子
     * @author mbb
     */
    beforeUpload(file) {
      // 图片限制
      if (file.size > this.sizeLimit) {
        this.$message.error('文件或者不能超过20M')
        return false
      }
      // 名称长度限制
      if (file?.name?.length > 120) {
        this.$message.error('文件名称长度不能超过120个字符')
        return false
      }
      return true
    },
    handleUpload(data) {
      const { file } = data
      const info = getLoginInfo()
      let userName = info.user.name
      if (!this.collectionId) {
        this.collectionId = this.guid()
      }
      const { businessCode, subBusinessCode, businessDataCode } =
        this.params || {}
      window.apiList['file/attachment']
        .uploadFileset(
          file,
          this.collectionId,
          businessCode,
          subBusinessCode,
          businessDataCode,
          this.fileList.length + 1,
          userName
        )
        .then(response => {
          if (response.state === 200) {
            let data = {
              id: response.data.attachmentExtendPo.id,
              name: response.data.attachmentExtendPo.fileName,
              ext: response.data.attachmentExtendPo.ext,
              fileType: file.type,
              size: file.size
            }
            this.fileList.push(data)
            this.collectionId = response.data.collectionId
            this.$emit('edit', this.collectionId)
            this.$emit('input', this.collectionId)
          }
        })
    },
    /**
     * 文件列表移除文件时的钩子
     * @author mbb
     */
    handleRemove(file) {
      let id = file.id || file.response.data.id
      window.apiList['file/attachment']
        .deleteCollByFileId(id, this.collectionId)
        .then(res => {
          if (res.state == 200) {
            this.fileList.forEach((item, index) => {
              if (item.id == id) {
                this.fileList.splice(index, 1)
                return false
              }
            })
          }
        })
    },
    // 预览新版本开始
    handlePreview(file) {
      this.curIndex = this.fileList.findIndex(i => i.id === file.id)
      this.previewDialogVisible = true
    },
    getPath(id) {
      return (
        window.config.VUE_APP_BASE_API +
        '/platform/v3/file/preview?attachmentId=' +
        id
      )
    },
    // 下载文件
    downFile() {
      const file = this.fileList?.[this.curIndex]
      fileUtil.downloadFile(file)
    },
    imgStyle() {
      let iframeBox = document.getElementById('frameForm')
      let doc = iframeBox.contentWindow.document
      let _body = doc.getElementsByTagName('body')[0]
      let _box = doc.getElementsByTagName('img')[0]
      _body.style.textAlign = 'center'
      if (_box) {
        _box.style.width = 'auto'
        _box.style.maxWidth = '100%'
        _box.style.height = 'auto'
        _box.style.maxHeight = '100%'
      }
    },
    downlodFile(file) {
      fileUtil.downloadFile(file)
    },

    init(collectionId) {
      window.apiList['file/attachment']
        .getFileByCollId(collectionId)
        .then(response => {
          const files = []
          if (response.state === 200) {
            response.data.forEach((item, index) => {
              let data = {
                id: item.fileId,
                name: item.fileName,
                ext: item.ext,
                fileType: item.fileType,
                size: item.fileSize
              }
              files.push(data)
            })
            this.fileList = files
          }
        })
    },

    preFile() {
      this.curIndex =
        this.curIndex === 0 ? this.fileList.length - 1 : this.curIndex - 1
    },
    nextFile() {
      this.curIndex =
        this.curIndex === this.fileList.length - 1 ? 0 : this.curIndex + 1
    }
  }
}
</script>

<style lang="scss" scoped>
#cpis-upload-list {
  ::v-deep .el-dialog {
    height: 72vh !important;
  }

  .arrow {
    position: absolute;
    left: 10px;
    top: 50%;
    margin-top: -30px;
    width: 60px;
    height: 60px;
    border-radius: 100%;
    background: rgba(0, 0, 0, 0.24);
    display: block;
    text-align: center;
    line-height: 60px;
    font-size: 32px;
    color: #fff;
    transition: all 0.3s;
    cursor: pointer;
    z-index: 1000;
  }

  .arrow.r-arrow {
    left: auto;
    right: 10px;
  }

  .arrow:hover {
    background: #4b9ff0;
    color: #fff !important;
  }

  .other {
    text-align: center;
    color: white;
  }

  .other-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .el-icon-document {
    font-size: 32px;
  }

  .file-name {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 80px;
    white-space: nowrap;
    margin-top: 2px;
  }

  & ::v-deep {
    .is-disabled {
      .el-upload,
      .el-upload__tip {
        display: none !important;
      }
    }

    .el-upload-list--picture-card .el-upload-list__item-actions span + span {
      margin-left: 10px;
    }

    .el-upload-list .el-upload-list__item {
      margin: 2px;
    }

    .el-upload-list {
      float: unset;
      display: inline;
    }

    .el-upload-list__item,
    .el-upload--picture-card,
    img {
      width: 92px;
      height: 92px;
    }

    .el-upload--picture-card {
      margin-top: 2px;
      margin-left: 2px;
      line-height: 92px;
    }
  }


  img {
    object-fit: cover;
  }
}
</style>

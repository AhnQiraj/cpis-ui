<template>
  <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" :title="title" :top="marginTop" append-to-body custom-class="ibps-uploader-dialog" @close="closeDialog">
    <el-tabs v-model="activeName" class="uploader-tab" @tab-click="onTabClick">
      <el-tab-pane :label="$t('common.title.uploadAtt')" name="upload">
        <upload ref="upload" :multiple="multiple" :file-size="size" :accept="acceptRule" :height="height" :init="dialogVisible" :limit="limit" @callback="uploadCallback" />
      </el-tab-pane>
      <el-tab-pane :label="$t('common.title.uploadedAtt')" name="online">
        <online ref="online" :multiple="multiple" :file-size="size" :height="height" :accept="acceptRule" :limit="limit" :load="onlineLoad" @format="onFormat" @callback="onlineCallback" />
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
    </div>
  </el-dialog>
</template>
<script>
import { fileTypes, allFileTypes, accept as acceptTypes } from '@platform/utils/fileTypes'
import upload from './upload'
import online from './online'
export default {
  name: 'IbpsFileUploader',
  components: {
    upload,
    online
  },
  props: {
    value: {
      type: [String, Number, Array, Object]
    },
    multiple: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      // default: '文件上传'
      default: function () {
        this.$t('common.title.fileUpload')
      }
    },
    marginTop: {
      type: String,
      default: '5vh'
    },
    height: {
      type: String,
      default: '400px'
    },
    fileSize: [Number, String],
    limit: {
      type: Number
    },
    accept: {
      type: String,
      default: ''
    },
    fileExt: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      activeName: 'upload',
      buttonKey: 'confirm',
      onlineLoad: false,
      format: true,
      fileTypes: fileTypes,
      allFileTypes: allFileTypes,
      acceptTypes: acceptTypes,
      size: null,
      targetExt: false,
      acceptRule: '',
      uploadFileList: [],
      onlineFileList: [],
      fileList: this.multiple ? [] : {},
      toolbars: [{ key: 'confirm' }, { key: 'cancel' }]
    }
  },
  watch: {
    visible: {
      handler: function (val, oldVal) {
        this.dialogVisible = this.visible
        this.activeName = 'upload'
        this.uploadFileList = []
      },
      immediate: true
    },
    accept: {
      handler: function (val, oldVal) {
        if (val === '*' && this.fileExt.length !== 0) {
          const str = '.' + this.fileExt.join(',').replace(/,/g, ',.')
          this.acceptRule = str
        } else {
          this.acceptRule = val
        }
      },
      immediate: true
    },
    fileSize: {
      handler: function (val, oldVal) {
        if (this.$utils.isNotEmpty(val)) {
          this.size = typeof val === 'number' ? val * 1024 * 1024 : parseFloat(val) * 1024 * 1024
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.fileTypes = null
    this.allFileTypes = null
    this.acceptTypes = null
    this.uploadFileList = null
    this.onlineFileList = null
    this.fileList = null
    this.toolbars = null
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    uploadCallback(data) {
      this.uploadFileList = data
      if (this.multiple) {
        this.fileList = this.$utils.isNotEmpty(this.value) ? [...this.value, ...this.uploadFileList] : this.uploadFileList
      } else {
        this.onlineFileList = []
        this.fileList = this.uploadFileList
      }
    },
    onlineCallback(data) {
      this.onlineFileList = data
      if (this.multiple) {
        this.fileList = this.$utils.isNotEmpty(this.value) ? [...this.uploadFileList, ...data, ...this.value] : data
      } else {
        this.uploadFileList = []
        this.fileList = data
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.uploadFileList = []
      this.onlineFileList = []
      this.$emit('close', false)
    },
    onTabClick(tab) {
      if (tab.name === 'online') {
        this.onlineLoad = !this.onlineLoad
      }
    },
    onFormat(format) {
      this.format = format
    },
    /**
     * 文件类型的限制
     */
    fileExtType() {
      const accept = this.accept
      const acceptTypes = this.acceptTypes
      const fileTypes = this.fileTypes
      let type = ''
      let targetFileTypes = []
      this.targetExt = false
      for (const i in acceptTypes) {
        if (acceptTypes[i] === accept) {
          type = i
          targetFileTypes = fileTypes[i]
        } else {
          if (accept === '*') {
            // 不限制
            targetFileTypes = '*'
          } else {
            // 自定义
            targetFileTypes = accept.split(',')
          }
        }
      }
      const fileList = this.multiple ? this.fileList : [this.fileList]
      if (targetFileTypes !== '*') {
        this.targetExt = fileList.every(i => {
          // console.log(targetFileTypes, `.${i.ext}`) // 控件类型集，过滤文件得后缀
          if (type === 'compress') {
            return targetFileTypes.includes(`${i.ext}`)
          } else {
            return targetFileTypes.includes(`.${i.ext}`)
          }
        })
      } else {
        this.targetExt = true
      }
      // console.log(fileList, this.targetExt, 'lll') // 已上传文件，过滤结果
      return this.targetExt
    },
    handleConfirm() {
      const arr = []
      if (!this.multiple) {
        if (this.$utils.isNotEmpty(this.uploadFileList)) {
          arr.push(this.uploadFileList)
          this.fileList = this.uploadFileList
        }
        if (this.$utils.isNotEmpty(this.onlineFileList)) {
          arr.push(this.onlineFileList)
          this.fileList = this.onlineFileList
        }
      }
      // console.log(this.fileList, 'fileList')
      if (this.$utils.isNotEmpty(arr) && arr.length > 1) {
        this.$message.closeAll()
        this.$message({
          message: '附件上传设置为单选，选择文件数量只能为1个',
          type: 'warning'
        })
        return
      }
      if (this.$utils.isNotEmpty(this.limit) && this.limit < this.fileList.length) {
        this.$message.closeAll()
        this.$message({
          message: '超过设置最大上传数量限制' + this.limit,
          type: 'warning'
        })
        return
      }
      if (!this.fileExtType()) {
        this.$message.closeAll()
        this.$message({
          message: '选择的附件中存在不符合规定类型的文件，请重新选择！',
          type: 'warning'
        })
        return
      }
      if (!this.format) {
        this.$message.closeAll()
        this.$message.error('选择文件格式不允许！')
      } else {
        if (this.$utils.isEmpty(this.fileList)) {
          this.$message.closeAll()
          this.$message({
            message: '请上传或选择文件，或待文件上传成功后在继续操作！',
            type: 'warning'
          })
          return
        }
        this.$emit('action-event', this.buttonKey, this.fileList)
      }
    }
  }
}
</script>

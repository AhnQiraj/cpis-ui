<template>
  <div>
    <image-viewer
      v-show="fileType==='image'"
      :z-index="zIndex"
      :url-list="[url]"
      :on-close="closeDialog"
    />
    <template v-if="fileType!=='image' && $utils.isNotEmpty(fileType)">
      <el-dialog
        :visible.sync="dialogVisible"
        :title="title"
        fullscreen
        append-to-body
        custom-class="ibps-file-preview-dialog"
        @close="closeDialog"
      >
        <pdf-viewer
          v-if="fileType==='pdf'"
          ref="viewer"
        />
        <!-- <audio-viewer
          v-else-if="fileType==='audio'"
          ref="viewer"
          :title="title"
          :url="url"
        /> -->
        <!-- <video-viewer
          v-else-if="fileType==='video'"
          ref="viewer"
          :ext="fileExt"
          :url="url"
        /> -->
        <txt-viewer
          v-else-if="fileType==='txt'"
          class="file-type-txt"
          :src="url"
        />
        <div v-else class="lc-fixed-navbar">不支持预览的类型</div>
      </el-dialog>
    </template>
  </div>
</template>
<script>
/**
      * 文件预览
      * 1、'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'  类型支持
      * 2、图片支持缩放
      * 3、音频，语音支持
      * ==================
      * 下一版本支持
      * 1、pdf支持缩放
      * 2、音频，语音多格式支持
      * 3、压缩包支持
      *
      */
import ImageViewer from './image'
// import AudioViewer from './audio' //xianyifan
// import VideoViewer from './video' //xianyifan
import TxtViewer from './txt'
import { officeType, pdfType, txtType, imageType, audioType, videoType } from './constants'
import PopupManager from '@platform/utils/popup'
export default {
  name: 'IbpsFileViewer',
  components: {
    'pdf-viewer': () => import('./pdf/index.vue'),
    ImageViewer,
    // AudioViewer,
    // VideoViewer,
    TxtViewer
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    fileExt: {
      type: String
    },
    url: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      fileType: '',
      zIndex: 2000,
      openedLoaded: false,
      fileUrl: '',
      timer: null
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = val
        if (this.dialogVisible) {
          this.openedLoaded = false
          this.loadViewer()
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.fileType = ''
    this.openedLoaded = false
  },
  methods: {
    /**
      * zxh 修复zindex 不是最高的被遮住
      */
    fixZIndex() {
      return PopupManager.getZIndex()
    },
    loadViewer() {
      if (imageType.includes(this.fileExt)) {
        this.dialogVisible = false
        this.zIndex = this.fixZIndex()
        this.fileUrl = this.url
        this.fileType = 'image'
      } else if (officeType.includes(this.fileExt) || pdfType.includes(this.fileExt)) {
        this.fileType = 'pdf'
        this.openDialog()
      } else if (audioType.includes(this.fileExt)) {
        this.fileType = 'audio'
      } else if (videoType.includes(this.fileExt)) {
        this.fileType = 'video'
      } else if (txtType.includes(this.fileExt)) {
        this.fileType = 'txt'
      } else {
        this.fileType = ''
      }
    },
    openDialog() {
      if (this.fileType === 'pdf') {
        this.$nextTick(() => {
          this.timer = setInterval(() => {
            if (this.openedLoaded) {
              clearInterval(this.timer)
            } else {
              if (this.$refs.viewer) {
                this.$refs.viewer.load(this.url)
                this.openedLoaded = true
              }
            }
          }, 50)
        })
      }
    },
    closeDialog() {
      this.fileType = ''
      this.openedLoaded = false
      this.$emit('close', false)
    }
  }
}
</script>
<style lang="scss">
  .ibps-file-preview-dialog{
    .el-dialog__body{
     padding:0;
    }
    .file-type-txt{
      height:  calc(88vh)!important;
    }
  }
</style>

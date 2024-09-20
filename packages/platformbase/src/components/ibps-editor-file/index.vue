<template>
  <div>
    <div>
      <!-- 富文本 -->
      <div>
        <editor v-model="content" :init="init" :disabled="disabled"></editor>
      </div>
    </div>
    <!-- 编辑弹窗 -->
    <editor-dialog :visible="dialogVisible" :title="title" :data="content" :watermark="watermark" @confirm="confirmDialog" @close="closeDialog"></editor-dialog>
  </div>
</template>
<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/code'
import 'tinymce/plugins/link'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/template'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/autoresize'
// 扩展插件
// import "../assets/tinymce/plugins/lineheight/plugin";
import EditorDialog from './editorDialog.vue'
import { EXTEND_URL, PLATFORM_URL, SYSTEM_URL } from '@platform/api/baseUrl'
import * as utils from '@platform/utils/index'
import * as imageConversion from 'image-conversion'
export default {
  name: 'IbpsEditorFile',
  components: {
    Editor,
    EditorDialog
  },
  props: {
    title: {
      type: String,
      default: '编辑'
    },
    bizRelId: {
      type: String,
      default: ''
    },
    bizRelData: {
      type: Object,
      default() {
        return {}
      }
    },
    fileName: {
      type: String,
      default: ''
    },
    businessCode: {
      type: String,
      default: ''
    },
    subBusinessCode: {
      type: String,
      default: ''
    },
    businessDataCode: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: true
    },
    minHeight: {
      type: Number,
      default: 400
    },
    maxHeight: {
      type: [String, Number],
      default: '100%'
    },
    emptyPrompt: {
      type: String,
      default: '请输入内容'
    },
    data: {
      type: String,
      default: ''
    },
    watermark: {
      type: Boolean,
      default: true
    }
  },
  data() {
    let self = this
    return {
      collectionId: '',
      dialogVisible: false,
      userInfo: {},
      fileId: '',
      content: '',
      // 初始化配置
      init: {
        placeholder: this.emptyPrompt,
        menubar: true,
        statusbar: false,
        language_url: '/static/tinymce/langs/zh_CN.js', // 中文语言包路径
        language: 'zh_CN',
        skin_url: '/static/tinymce/skins/ui/oxide',
        min_height: this.minHeight,
        max_height: this.maxHeight,
        toolbar_mode: 'sliding',
        plugins: 'paste preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr nonbreaking insertdatetime advlist lists wordcount imagetools textpattern autosave autoresize',
        toolbar: 'cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link codesample | alignleft aligncenter alignright alignjustify outdent indent formatpainter | \ styleselect formatselect fontselect fontsizeselect | bullist numlist | \ table image media charmap hr pagebreak insertdatetime | fullscreen preview | code undo redo restoredraft | blockquote subscript superscript removeformat',
        content_style: 'p {margin: 5px 0;} body {overflow-y: auto !important;}',
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
        branding: false,
        file_picker_types: 'file image media',
        // 自定义文件选择器的回调内容
        file_picker_callback: (callback, value, meta) => {
          // 文件分类
          let filetype = '.pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4'
          // 为不同插件指定文件类型
          switch (meta.filetype) {
            case 'image':
              filetype = '.jpg, .jpeg, .png, .gif'
              break
            case 'media':
              filetype = '.mp3, .mp4'
              break
            case 'file':
            default:
          }
          // 模拟出一个input用于添加本地文件
          let input = document.createElement('input')
          input.setAttribute('type', 'file')
          input.setAttribute('accept', filetype)
          input.click()
          input.onchange = function () {
            let originalFile = this.files[0]
            console.log('压缩前文件：', originalFile)
            // 图片压缩
            self.beforeUpload(originalFile).then(file => {
              console.log('压缩后文件：', file)
              let xhr, formData
              xhr = new XMLHttpRequest()
              xhr.withCredentials = false
              if (this.watermark) {
                xhr.open('POST', window.config.VUE_APP_BASE_API + '/' + EXTEND_URL() + '/file/uploadExtend')
              } else {
                xhr.open('POST', window.config.VUE_APP_BASE_API + '/' + SYSTEM_URL() + '/file/upload')
              }
              xhr.onload = function () {
                let json
                if (xhr.status !== 200) {
                  callback('HTTP Error: ' + xhr.status)
                  return
                }
                json = JSON.parse(xhr.responseText)
                if (!json || json.state !== 200) {
                  callback('Invalid JSON: ' + json.message)
                  return
                }
                callback(window.config.VUE_APP_BASE_API + '/' + PLATFORM_URL() + '/file/preview?attachmentId=' + json.data.id, { text: json.data.fileName, title: json.data.fileName })
              }
              formData = new FormData()
              formData.append('file', file, file.name)
              xhr.send(formData)
            })
          }
        },
        paste_data_images: true,  // 允许从剪贴板粘贴图片
        paste_postprocess: (plugin, args) => {
          const images = args.node.getElementsByTagName('img');
          for (let i = 0; i < images.length; i++) {
            const img = images[i];
            const src = img.src;
            // 替换外链
            if (!src.includes('ibps')) {
              img.src = '';
            }
          }
        },
      }
    }
  },
  watch: {
    disabled: {
      handler(value) {
        if (value) {
          this.init.menubar = false
          this.init.toolbar = false
          this.init.readonly = true
        }
      },
      immediate: true
    },
    bizRelId: {
      handler(value) {
        this.collectionId = value
      },
      immediate: true
    },
    content: {
      handler(value) {
        this.$emit('change', value)
      },
      immediate: true
    }
  },
  created() {
    this.userInfo = utils.getLoginInfo()
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      this.content = ''
      if (this.data) {
        this.content = this.data
      } else {
        if (this.collectionId) {
          await window.apiList['file/attachment'].getFileByCollId(this.collectionId).then(async res => {
            if (res.data && res.data.length > 0) {
              this.fileId = res.data[0].fileId
              await window.apiList['file/attachment'].download({ attachmentId: this.fileId }, false).then(res => {
                this.content = new TextDecoder().decode(new Uint8Array(res.data))
              })
            }
          })
        } else {
          await window.apiList['file/attachment'].getCollectionId().then(res => {
            this.collectionId = res.data
            this.$emit('getCollectionId', res.data, this.bizRelData)
          })
        }
      }
      window.tinymce.init({}) // 这里传个空对象就可以了
    },
    closeDialog() {
      this.dialogVisible = false
    },
    confirmDialog(data) {
      if (this.fileId) {
        // 删除原文件
        window.apiList['file/attachment'].deleteCollByFileId(this.fileId, this.collectionId).then(res => {
          if (res.state === 200) {
            this.handleFile(data)
          }
        })
      } else {
        this.handleFile(data)
      }
      // 重新赋值
      this.content = data
      // 关闭弹窗
      this.dialogVisible = false
    },
    handleFile(data) {
      // 生成文件
      let blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
      let fileName = this.fileName ? this.fileName + '.html' : new Date().getTime() + '.html'
      // let textContain = this.transBlobToFile(blob, fileName, 'text/plain')
      // // 上传文件
      // textContain.then(res => {
      //   window.apiList['file/attachment'].uploadFileset(res, this.collectionId, this.businessCode, this.subBusinessCode, this.businessDataCode, 1, this.userInfo.user.name).then(ret => {
      //     this.initData()
      //   })
      // })
      let file = this.transBlobToFile(blob, fileName, 'text/plain')
      window.apiList['file/attachment'].uploadFileset(file, this.collectionId, this.businessCode, this.subBusinessCode, this.businessDataCode, 1, this.userInfo.user.name).then(ret => {
          this.initData()
        })
    },
    beforeUpload(file) {
      return new Promise((resolve) => {
        const isImg = file.type === 'image/jpeg' || file.type === 'image/png'
        const isRt3M = (file.size / 1024 / 1024) > 3
        if (isImg && isRt3M) {
          // 压缩到1M
          // imageConversion.compressAccurately(file, 1024).then(res => {
          // 压缩到90%
          imageConversion.compress(file, 0.9).then(res => {
            let newFile = this.transBlobToFile(res, file.name, file.type)
            resolve(newFile)
          });
        } else {
          resolve(file)
        }
      })
    },
    transBlobToFile(blob, fileName, fileType) {
      return new window.File([blob], fileName, { type: fileType })
    }
  }
}
</script>
<style lang="scss" scoped></style>

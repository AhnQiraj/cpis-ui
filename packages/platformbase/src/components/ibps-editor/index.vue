<template>
  <div>
    <editor v-model="content" :init="init" :disabled="disabled" @onChange="onChange"></editor>
  </div>
</template>
<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
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
import { EXTEND_URL, PLATFORM_URL } from '@platform/api/baseUrl'
export default {
  name: 'IbpsEditor',
  components: {
    Editor
  },
  model: {
    prop: 'value', // 自定义prop属性
    event: 'change' // 自定义它的触发方法名
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
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
    menu: {
      type: Boolean,
      default: true
    },
    tool: {
      type: String,
      default: 'all'
    }
  },
  data() {
    return {
      content: '',
      // 初始化配置
      init: {
        placeholder: this.emptyPrompt,
        menubar: this.menu,
        statusbar: false,
        language_url: '/static/tinymce/langs/zh_CN.js', // 中文语言包路径
        language: 'zh_CN',
        skin_url: '/static/tinymce/skins/ui/oxide',
        min_height: this.minHeight,
        max_height: this.maxHeight,
        toolbar_mode: 'wrap',
        plugins: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr nonbreaking insertdatetime advlist lists wordcount imagetools textpattern autosave autoresize',
        toolbar: 'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link codesample | alignleft aligncenter alignright alignjustify outdent indent formatpainter | \ styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \ table image media charmap hr pagebreak insertdatetime | fullscreen preview',
        content_style: 'p {margin: 5px 0;}',
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
            let file = this.files[0]
            let xhr, formData
            xhr = new XMLHttpRequest()
            xhr.withCredentials = false
            xhr.open('POST', window.config.VUE_APP_BASE_API + '/' + EXTEND_URL() + '/file/uploadExtend')
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
          }
        }
      }
    }
  },
  watch: {
    value: {
      handler(value) {
        this.content = value
      },
      immediate: true
    },
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
    tool: {
      handler(value) {
        if (value == 'part') {
          this.init.toolbar = 'forecolor backcolor bold italic underline | fontselect fontsizeselect | bullist numlist | \ table image'
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      window.tinymce.init({})
    },
    onChange() {
      this.$emit('change', this.content)
    }
  }
}
</script>
<style lang="scss" scoped></style>

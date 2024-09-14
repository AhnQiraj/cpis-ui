<template>
  <div>
    <el-upload id="uploadFileset" ref="uploadFileset" :limit="limit" :multiple="limit > 1 ? true : false" style="min-width: auto; width: auto; float: left; display: block" :class="isView ? 'view' : ''" action="#" :before-upload="beforeUpload">
      <slot />
      <el-button v-if="!isView" size="small" type="primary">点击上传</el-button>
      <div v-if="!isView" slot="tip" class="el-upload__tip">{{ tip }}</div>
    </el-upload>
    <div v-for="(item, index) in fileList" :key="index" class="filelist">
      <i class="el-icon-document" />
      <el-button type="text" class="vfile" :title="item.name" @click="handlePreview(item)">{{ item.name }}</el-button>
      <i class="el-icon-success" />
      <el-button v-if="!isRemove" class="el-icon-circle-close dfile" title="移除" @click="handleRemove(item)" />
      <el-button v-if="!isFileHome" class="el-icon-receiving sfile" title="归档" @click="handleFileHome(item)" />
      <!-- <el-dropdown trigger="click" placement="bottom-start">
        <span class="el-icon-more" style="transform: rotate(90deg);" />
        <el-dropdown-menu slot="dropdown" class="filebtn">
          <el-dropdown-item @click.native="downlodFile(item)"><i class="el-icon-download" />下载</el-dropdown-item>
          <el-dropdown-item><i class="el-icon-edit" />重命名</el-dropdown-item>
          <el-dropdown-item><i class="el-icon-receiving" />归档</el-dropdown-item>
          <el-dropdown-item><i class="el-icon-key" />权限管理</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
    <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" :append-to-body="true" title="图片预览" class="yj-dialog">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <file-home ref="fileHome" :visible="fileHomeVisible" :project-id="projectId" :is-project="isProject" :dir-file="dirFile" :user-info="userInfo" @close="visible => (fileHomeVisible = visible)" />
    <!--  @success="successCallback" -->
    <vxe-modal v-model="dialogVisiblePPT" show-zoom resize width="70%" height="90%" :title="title" style="position: relative">
      <el-link v-if="fileList != null && fileList.length > 1" class="arrow l-arrow" icon="el-icon-arrow-left" :underline="false" @click="preFile"></el-link>
      <el-link v-if="fileList != null && fileList.length > 1" class="arrow r-arrow" icon="el-icon-arrow-right" :underline="false" @click="nextFile"></el-link>
      <el-row id="pptRow" style="overflow: hidden; width: 100%; height: calc(100% - 40px)">
        <iframe id="frameForm" ref="frameForm" :src="src" frameborder="0" style="overflow-y: auto; width: 100%; height: 98%" @load="imgStyle" />
      </el-row>
      <el-row style="display: flex; justify-content: center; height: 40px">
        <el-button type="primary" @click="downFile">下载原文件</el-button>
      </el-row>
    </vxe-modal>
  </div>
</template>
<script>
import * as fileUtil from '@cupu/utils/file'
import { getLoginInfo } from '@cupu/utils/index'
import FileHome from './fileHome.vue'
export default {
  name: 'InputUploadFileset',
  components: { FileHome },
  props: {
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
    },
    businessCode: {
      type: String,
      default: null
    },
    subBusinessCode: {
      type: String,
      default: null
    },
    businessDataCode: {
      type: String,
      default: null
    },
    isProject: {
      type: Boolean,
      default: false
    },
    projectId: {
      type: String,
      default: ''
    },
    isRemove: {
      type: Boolean,
      default: false
    },
    isFileHome: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      createId: '',
      dialogVisible: false,
      dialogVisiblePPT: false,
      fileHomeVisible: false,
      dirFile: {},
      dialogImageUrl: '',
      fileNames: '',
      // 上传的文件列表
      fileList: [],
      src: '',
      fileObj: {},
      fileCollId: null,
      fileSum: 0,
      userInfo: {
        user: {
          name: ''
        }
      },
      curIndex: 0,
      title: ''
    }
  },
  created() {
    this.userInfo = getLoginInfo()
    this.createId = this.guid()
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
    resetFileCollId() {
      window.apiList['file/attachment'].getCollectionId().then(res => {
        if (res.state == 200) {
          this.fileCollId = res.data
        }
      })
    },
    /**
     * 上传文件之前的钩子
     * @author mbb
     */
    beforeUpload(file) {
      this.fileSum = this.fileSum + 1
      // 图片限制
      if (file.type.indexOf('image') === 0 && file.size > 20480000) {
        this.$message.error('单张图片不能超过20M')
        return false
      }
      // 名称长度限制
      if (file.name != undefined && file.name.length > 120) {
        this.$message.error('文件名称长度不能超过120个字符')
        return false
      }
      if (this.$utils.isEmpty(this.fileCollId)) {
        this.fileCollId = this.createId
        this.upFile(file)
      } else {
        this.upFile(file)
      }
      return false
    },
    upFile(file) {
      if (this.$utils.isEmpty(this.fileCollId)) {
        return
      }
      let userName = this.userInfo.user.name
      window.apiList['file/attachment'].uploadFileset(file, this.fileCollId, this.businessCode, this.subBusinessCode, this.businessDataCode, this.fileSum, userName).then(response => {
        if (response.state === 200) {
          let data = {
            id: response.data.attachmentExtendPo.id,
            name: response.data.attachmentExtendPo.fileName,
            ext: response.data.attachmentExtendPo.ext,
            fileType: file.type,
            size: file.size,
            attachType: this.attachType
          }
          this.fileList.push(data)
          this.fileCollId = response.data.collectionId
          this.$emit('edit', this.fileCollId, this.attachType)
        }
      })
    },
    /**
     * 文件列表移除文件时的钩子
     * @author mbb
     */
    handleRemove(file) {
      let id = file.id || file.response.data.id
      window.apiList['file/attachment'].deleteCollByFileId(id, this.fileCollId).then(res => {
        if (res.state == 200) {
          this.fileList.forEach((item, index) => {
            if (item.id == id) {
              this.fileList.splice(index, 1)
              this.fileSum = this.fileSum - 1
              return false
            }
          })
        }
      })
    },
    /**
     * 归档-打开弹出框
     */
    handleFileHome(item) {
      this.dirFile = item
      this.$refs.fileHome.getFormData()
      this.fileHomeVisible = true
    },
    /**
     * 归档-确定回调事件
     */
    // successCallback(fileName) {
    //   let userName = this.userInfo.user.name
    //   updateFileName(this.dirFile.id, fileName, userName)
    // },
    // 预览新版本开始
    handlePreview(file) {
      this.fileObj = file
      if (file.response && file.response.data && file.response.data.id) {
        this.getImage(file.response.data.id, file.response.data.name)
      } else if (file.id) {
        this.getImage(file.id, file.name)
      } else {
        this.$message('该文件无法预览！')
      }
    },
    getImage(id, name) {
      this.dialogVisiblePPT = true
      this.title = '文件预览（部分格式文件预览乱码或预览失败，请下载原文件查看）' + name
      this.dialogImageUrl = window.config.VUE_APP_BASE_API + '/platform/v3/file/preview?attachmentId=' + id
      this.$nextTick(() => {
        this.src = this.dialogImageUrl
      })
      //获得上一页，下一页切换时的索引
      for (let i = 0; i < this.fileList.length; i++) {
        if (id == this.fileList[i].id) {
          this.curIndex = i
          break
        }
      }
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
    // 下载文件
    downFile() {
      fileUtil.downloadFile(this.fileObj)
    },
    downlodFile(file) {
      fileUtil.downloadFile(file)
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
    /**
     * 设置文件
     * @author mbb
     */
    setVal(fileCollId) {
      if (fileCollId !== '' && fileCollId !== null && fileCollId !== undefined) {
        this.fileCollId = fileCollId
        window.apiList['file/attachment'].getFileByCollId(fileCollId).then(response => {
          this.fileList = []
          if (response.state === 200) {
            response.data.forEach((item, index) => {
              let data = {
                id: item.fileId,
                name: item.fileName,
                ext: item.ext,
                fileType: item.fileType,
                size: item.fileSize,
                attachType: this.attachType
              }
              this.fileList.push(data)
              this.fileSum = this.fileSum + 1
            })
          }
        })
      } else {
        this.fileList = []
      }
    },
    /**
     * 保存业务信息
     */
    saveBusinessInfo(collectionId, businessId, subBusinessId) {
      window.apiList['file/attachment'].saveBusinessRelaInfo(collectionId, businessId, subBusinessId)
    },
    preFile() {
      if (this.curIndex != 0) {
        this.curIndex = this.curIndex - 1
        let file = this.fileList[this.curIndex]
        this.fileObj = file
        this.getImage(file.id, file.name)
      }
    },
    nextFile() {
      if (this.curIndex != this.fileList.length - 1) {
        this.curIndex = this.curIndex + 1
        let file = this.fileList[this.curIndex]
        this.fileObj = file
        this.getImage(file.id, file.name)
      }
    }
  }
}
</script>
<style>
#uploadFileset .el-upload {
  display: block !important;
  text-align: left;
}
#uploadFileset.view .el-upload-list__item-status-label {
  display: none !important;
}
#uploadFileset.view .el-icon-circle-check:before {
  content: '\e6db' !important;
}
#uploadFileset.view .el-icon-close {
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
.filelist {
  float: left;
  background: #fafafa;
  padding: 0 10px;
  position: relative;
  margin-left: 8px;
}
.filelist > .el-button {
  padding: 0;
  border: none;
}
.filelist > .el-button.dfile {
  border: none;
  width: 14px;
  height: 14px;
  padding: 0;
  color: #f56c6c;
  position: absolute;
  top: 9px;
  opacity: 0;
  transition: all 0.3s;
}
.filelist > i.el-icon-success {
  color: #67c23a;
  position: absolute;
  top: 9px;
  transition: all 0.3s;
}
.filelist .el-dropdown {
  margin-left: 30px;
  cursor: pointer;
  transition: all 0.3s;
}
.filelist:hover > .el-button.dfile {
  opacity: 1;
}
.filelist:hover > i.el-icon-success {
  opacity: 0;
}
.filelist > .el-button.sfile {
  color: #4b9ff0;
  margin-left: 30px;
  background: none;
}
.filelist > .el-button.vfile {
  padding: 0 16px 0 8px;
  text-decoration: underline;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  width: auto;
}
.filelist:hover > .el-button.vfile,
.filelist:hover > i.el-icon-document {
  color: #4b9ff0;
}
// .filelist .el-dropdown:hover,.filelist i.el-icon-document,.filelist > .el-button:first-of-type{ color:#4b9ff0;}
// .filebtn.el-dropdown-menu--small .el-dropdown-menu__item{line-height:32px;}
// .filebtn.el-dropdown-menu.el-dropdown-menu--small .el-dropdown-menu__item{ color: #666;border-radius: 4px;}
// .filebtn.el-dropdown-menu.el-dropdown-menu--small .el-dropdown-menu__item i{ color: #4b9ff0;margin-right: 16px;}
// .filebtn.el-dropdown-menu.el-dropdown-menu--small .el-dropdown-menu__item:hover{ background:rgb(22, 132, 252); color: #fff;}
// .filebtn.el-dropdown-menu.el-dropdown-menu--small .el-dropdown-menu__item:hover i{ color: #fff;}
// .filebtn.el-dropdown-menu.el-dropdown-menu--small .el-dropdown-menu__item i.el-icon-key{ transform: rotate(45deg);}
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
</style>

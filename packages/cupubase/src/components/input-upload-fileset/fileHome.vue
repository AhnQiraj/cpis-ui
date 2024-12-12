<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body top="25vh" class="dialog file-modify-name-dialog" @close="closeDialog">
    <ibps-tree ref="tree" :width="width" :height="height" :loading="loading" :options="dirTreeoptions" :contextmenus="dirTreeContextmenus" :toolbars="false" title="文件夹管理" :data="dirTreeData" @node-click="handleNodeClick" @expand-collapse="handleExpandCollapse">
      <div slot="searchForm" style="display: inline-flex; width: 100%; margin-left: -4px">
        <el-input v-model="filterText" :placeholder="$t('baseCommon.message.inputKeyWords')" clearable class="textInput" @keyup.enter.native="search" />
        <el-button type="primary" icon="el-icon-search" class="buttonSearch" @click="search" />
      </div>
    </ibps-tree>
    <div slot="footer" class="el-dialog--center" style="width: 100%;">
      <div style="width: 100%; float: left">
        <el-form>
          <el-form-item prop="fileName" label="归档文件名" style="display: block; width: 35%; padding-right: 40px; margin: 0; float: left; position: absolute">
            <!-- <el-input v-model="dirFile.name" style="width: 75%" /> -->
            <span :title="dirFile.name" style="float: left;display:block;width:100%;overflow: hidden;text-overflow: ellipsis; white-space: nowrap;">
              {{ dirFile.name }}
            </span>
          </el-form-item>
        </el-form>
        <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
      </div>
    </div>
  </el-dialog>
</template>
<script>
import TreeUtils from '@cupu/utils/tree'
import * as utils from '@cupu/utils/index'
export default {
  props: {
    isProject: {
      type: Boolean,
      default: false
    },
    projectId: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    userInfo: {
      type: Object
    },
    dirFile: {
      type: Object,
      default: () => {
        return {
          fileName: ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      filterText: '',
      formName: 'fileForm',
      title: '归档',
      dirId: '',
      dirName: '',
      dialogVisible: this.visible,
      dialogLoading: false,
      width: 920,
      height: 510,
      toolbars: [{ key: 'save' }, { key: 'cancel' }],
      dirTreeoptions: {
        showIcon: true,
        nodeKey: 'dirId',
        nodeIcon: 'folder',
        pidKey: 'parentDir',
        props: {
          children: 'children',
          label: 'dirName'
        }
      },
      dirTreeContextmenus: [
        { icon: 'add', label: '添加', key: 'add' },
        { icon: 'edit', label: '编辑', key: 'edit', rights: ['node'] },
        { icon: 'remove', label: '删除', key: 'remove', rights: ['node'] }
      ],
      dirTreeData: []
    }
  },
  computed: {},
  watch: {
    visible: {
      handler: function (val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  created() {
    // this.getFormData()
  },
  methods: {
    // 查询
    search() {
      this.getFormData()
    },
    async getFormData() {
      if (this.isProject) {
        if (this.projectId != '' && this.projectId != null) {
          await window.apiList['cpisDocument/dir/cpisDocumentDir'].findDirDataByProjectId({ projectId: this.projectId, filterText: this.filterText }).then(response => {
            this.dirTreeData = this.toTree(response.data)
          })
        }
      } else {
        if (this.filterText != '') {
          window.apiList['cpisDocument/dir/cpisDocumentDir'].getTreeDataAll({ filterText: this.filterText }).then(response => {
            let dirData = []
            if (response.data) {
              response.data.forEach(item => {
                this.dirTreeTempData.forEach(item2 => {
                  if (item.dirPath) {
                    if (item.dirPath.indexOf(item2.dirId) != -1) {
                      dirData.push(item2)
                    }
                  }
                  if (item2.dirPath) {
                    if (item2.dirPath.indexOf(item.dirPath) != -1) {
                      dirData.push(item2)
                    }
                  }
                })
              })
              let array = {}
              let listTemp = []
              dirData.forEach(item => {
                if (!array[item['id']]) {
                  array[item['id']] = listTemp.push(item)
                }
              })
              dirData = listTemp
            } else {
              dirData = this.dirTreeTempData.filter(item => item.dirId == '0')
            }
            this.dirTreeData = this.toTree(dirData)
          })
        } else {
          window.apiList['cpisDocument/dir/cpisDocumentDir'].getTreeDataAll({ filterText: this.filterText }).then(res => {
            this.dirTreeTempData = res.data
            this.dirTreeData = this.toTree(res.data)
          })
        }
      }
    },
    toTree(data) {
      let treeData = TreeUtils.transformToTreeFormat(data, {
        idKey: 'dirId',
        pIdKey: 'parentDir',
        childrenKey: 'children'
      })
      return treeData
    },
    handleExpandCollapse(isExpand) {
      this.width = 920
    },
    // 文件夹点击
    handleNodeClick(data) {
      if (data.dirId === 0 || data.dirId === '0') {
        return
      }
      this.dirId = data.dirId + ''
      this.dirName = data.dirName + ''
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 保存数据
    handleSave() {
      if (this.dirId == '') {
        this.$message({ message: '请选择文件夹', type: 'warning' })
        return
      }
      let fileFrom = {
        dirFileId: '',
        fileName: this.dirFile.name,
        ext: this.dirFile.ext,
        fileSize: this.dirFile.size,
        fileType: this.dirFile.fileType,
        seq: '',
        dirId: this.dirId,
        fileId: this.dirFile.id,
        createTime: utils.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        updateUser: '',
        updateTime: ''
      }
      if (this.userInfo) {
        fileFrom.createUser = this.userInfo.user.name
        fileFrom.createUserId = this.userInfo.user.id
      }
      window.apiList['cpisDocument/file/cpisDocumentDirFile'].save(fileFrom).then(res => {
        if (res.message == '文件已存在') {
          this.$message({ message: '请勿重复归档', type: 'warning' })
        } else if (res.message == '保存文件成功') {
          this.$message({ message: '归档成功', type: 'success' })
        }
        // this.$emit('success', fileFrom.fileName)
        this.$emit('close', false)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .file-modify-name-dialog {
  .el-dialog__body {
    height: calc(78vh - 110px) !important;
  }
}
::v-deep .el-dialog__wrapper .el-dialog .el-dialog__body {
  overflow-x: hidden !important;
}
::v-deep .el-form-item .el-form-item__content {
  color: #409eff !important;
  width:calc(100% - 100px);
  float:left;
}
::v-deep .ibps-tree .layout-header .layout-header-tools {
  display: none;
}
::v-deep .el-dialog .el-dialog__footer {
  padding: 16px 20px;
}
::v-deep .ibps-icon {
  color: #f3c007;
  padding-right: 5px;
}
::v-deep .ibps-tree {
  width: 100% !important;
}
::v-deep .el-tree-node {
  width: 100%;
}
</style>

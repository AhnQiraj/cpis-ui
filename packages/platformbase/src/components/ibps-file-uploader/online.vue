<template>
  <div
    :style="{
      height: height
    }"
  >
    <el-form :model="form" :inline="true" @keyup.enter.native="onSearch" @submit.native.prevent>
      <el-form-item :label="$t('cpisDocument.cpisDocumentColl.fileName')" prop="name">
        <el-input v-model="form.name" :placeholder="$t('cpisDocument.cpisDocumentColl.fileName')" @keyup.enter.native="onSearch" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">{{ $t('common.buttons.searchBtn') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="elTable" :data="listData" :row-key="getRowKey" height="340" border @row-click="handleRowClick" @selection-change="handleSelectionChange">
      <!--选择列 多选-->
      <el-table-column v-if="(selectionRow || selectionRow === '') && selectionType === 'checkbox'" v-bind="typeof selectionRow === 'Object' ? selectionRow : null" :label="handleAttribute(selectionRow.label, '')" :reserve-selection="true" type="selection" />
      <!--选择列 单选-->
      <el-table-column v-if="(selectionRow || selectionRow === '') && selectionType === 'radio'" :label="selectionRow.label || ''" :width="selectionRow.width || 55">
        <template slot-scope="scope">
          <div @click.stop>
            <el-radio v-model="selectionRadio" :label="scope.row[pkKey]" @change="changeRowRadio(scope.row)"><span>&nbsp;</span></el-radio>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('cpisDocument.cpisDocumentColl.fileName')" prop="fileName" />
      <el-table-column :label="$t('cpisDocument.cpisDocumentColl.extName')" prop="ext" />
    </el-table>
    <el-pagination :current-page="currentPage" :page-size="pageSize" :page-count="pagination[pageCountKey]" :total="pagination[totalKey]" @size-change="handlePaginationSizeChange" @current-change="handlePaginationCurrentChange" @prev-click="handlePaginationPrevClick" @next-click="handlePaginationNextClick" />
  </div>
</template>
<script>
import { fileTypes, allFileTypes, accept as acceptTypes } from '@platform/utils/fileTypes'
import ActionUtils from '@platform/utils/action'
export default {
  props: {
    height: String,
    load: Boolean,
    multiple: Boolean,
    fileSize: {
      // 上传尺寸
      type: Number
    },
    value: [Object, Array],
    limit: {
      type: Number
    },
    accept: String
  },
  data() {
    return {
      listData: [],
      pagination: {},
      sorts: {},
      selectionRadio: '',
      pkKey: 'id',
      currentPage: 0,
      pageSizes: [10, 20, 50, 100],
      pageSize: 20,
      totalKey: 'totalCount',
      pageKey: 'page',
      pageCountKey: 'totalPages',
      selectionRow: true,
      format: true,
      form: {
        name: ''
      },
      fileList: [],
      multipleSelection: [],
      targetExt: false,
      fileTypes: fileTypes,
      allFileTypes: allFileTypes,
      acceptTypes: acceptTypes
    }
  },
  computed: {
    selectionType() {
      return this.multiple ? 'checkbox' : 'radio'
    }
  },
  watch: {
    load: {
      handler() {
        this.loadData()
      },
      immediate: true
    },
    selectionRadio(val, oldVal) {
      if (this.$utils.isNotEmpty(val)) {
        this.$emit(
          'callback',
          this.listData.find(data => {
            if (data.id === val) {
              return data
            }
          })
        )
      }
    }
  },
  beforeDestroy() {
    this.listData = null
    this.pagination = null
    this.sorts = null
    this.form = null
    this.fileList = null
    this.multipleSelection = null
    this.fileTypes = null
    this.allFileTypes = null
    this.acceptTypes = null
  },
  methods: {
    getRowKey(row) {
      return row.id
    },
    handleSelectionChange(val) {
      if (this.limit && this.limit === 0) {
        this.$message({
          message: this.$t('common.dialog.numIsNotZero'),
          type: 'warning'
        })
        return
      }
      let pass = true
      val.forEach(i => {
        if (this.$utils.isNotEmpty(this.fileSize) && this.fileSize < i.totalBytes) {
          this.$message({
            message: this.$t('common.dialog.exceedsFileSize') + this.$utils.formatSize(this.fileSize),
            type: 'warning'
          })
          pass = false
          this.$refs.elTable.toggleRowSelection(i, pass)
        }
        if (this.$utils.isNotEmpty(this.accept) && this.accept && !this.fileExtType({ name: `${i.fileName}.${i.ext}` })) {
          this.$message.closeAll()
          this.$message({
            message: this.$t('common.dialog.notAllowedFileType'),
            type: 'warning'
          })
          pass = false
          this.$refs.elTable.toggleRowSelection(i, pass)
        }
      })
      if (!pass) {
        return
      }
      this.multipleSelection = val
      this.$emit('callback', val)
    },
    /**
     * @description 行点击时触发的事件
     */
    handleRowClick(row, event, column) {
      // 点击行，触发选中
      if (this.$utils.isNotEmpty(this.fileSize) && this.fileSize < row.totalBytes) {
        this.$message({
          message: this.$t('common.dialog.exceedsFileSize') + this.$utils.formatSize(this.fileSize),
          type: 'warning'
        })
        return
      }
      if (this.$utils.isNotEmpty(this.accept) && this.accept && !this.fileExtType({ name: `${row.fileName}.${row.ext}` })) {
        this.$message.closeAll()
        this.$message({
          message: this.$t('common.dialog.notAllowedFileType'),
          type: 'warning'
        })
        return false
      }
      if (this.selectionType === 'radio') {
        this.selectionRadio = row[this.pkKey]
      } else {
        this.$refs.elTable.toggleRowSelection(row)
      }
      this.format = true
      this.$emit('row-click', row, event, column)
      this.$emit('format', this.format)
    },
    /**
     * 文件类型的检测
     */
    fileExtType(file) {
      const accept = this.accept
      const acceptTypes = this.acceptTypes
      const fileTypes = this.fileTypes
      const arr = file.name.split('.')
      const result = arr[arr.length - 1]
      let type = ''
      this.targetExt = false
      for (const i in acceptTypes) {
        if (acceptTypes[i] === accept) {
          type = i
        }
      }
      if (type !== '' && this.accept !== '*') {
        // 现存的附件类型
        const targetFileTypes = fileTypes[type]
        this.targetExt = targetFileTypes.includes(result)
      } else {
        if (this.accept === '*') {
          // 不限制
          this.targetExt = true
        } else {
          // 自定义
          const targetFileTypes = this.accept.split(',')
          this.targetExt = targetFileTypes.includes('.' + result)
        }
      }
      return this.targetExt
    },
    /**
     * @description 单选点击时触发的事件[阻止冒泡后单选值补充]
     */
    changeRowRadio(row) {
      if (this.$utils.isNotEmpty(this.fileSize) && this.fileSize < row.totalBytes) {
        this.$message({
          message: this.$t('common.dialog.exceedsFileSize') + this.$utils.formatSize(this.fileSize),
          type: 'warning'
        })
        return
      }
      if (this.$utils.isNotEmpty(this.accept) && this.accept && !this.fileExtType({ name: `${row.fileName}.${row.ext}` })) {
        this.$message.closeAll()
        this.$message({
          message: this.$t('common.dialog.notAllowedFileType'),
          type: 'warning'
        })
        return
      }
      this.selectionRadio = row[this.pkKey]
    },
    toggleRowSelection(row, selected) {
      if (this.selectionType === 'radio') {
        this.selectionRadio = row ? row[this.pkKey] : ''
      } else {
        this.$refs.elTable.toggleRowSelection(row, selected)
      }
    },
    loadData() {
      this.loading = true
      window.apiList['file/attachment']
        .queryPageList(this.getSearcFormData())
        .then(response => {
          ActionUtils.handleListData(this, response.data)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getSearcFormData() {
      return ActionUtils.formatParams(
        {
          'Q^FILE_NAME_^SL': this.form.name
        },
        this.pagination,
        this.sorts
      )
    },
    onSearch() {
      this.loadData()
    },
    /**
     * @description 每页条数改变
     */
    handlePaginationSizeChange(pageSize) {
      this.handlePaginationChange({ pageSize: pageSize })
    },
    /**
     * @description 当前页码改变
     */
    handlePaginationCurrentChange(currentPage) {
      this.handlePaginationChange({ currentPage: currentPage })
    },
    /**
     * @description 上一页
     */
    handlePaginationPrevClick(currentPage) {
      this.handlePaginationChange({ currentPage: currentPage })
    },
    /**
     * @description 下一页
     */
    handlePaginationNextClick(currentPage) {
      this.handlePaginationChange({ currentPage: currentPage })
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange({ pageSize, currentPage }) {
      ActionUtils.setPagination(this.pagination, {
        limit: pageSize || this.pageSize,
        page: currentPage || this.currentPage
      })
      this.loadData()
    },
    /**
     * @description 组件属性默认值
     */
    handleAttribute(attribute, defaultValue) {
      if (attribute === false || attribute === 0 || attribute === '') {
        return attribute
      }
      return attribute || defaultValue
    }
  }
}
</script>

<template>
  <div class="ztable-content">
    <!--表格-->
    <d2-crud-x
      :id="tableId"
      ref="d2Crud"
      class="ztable"
      :data="tableData"
      :loading="loading"
      v-bind="_crudProps"
      @sort-change="onSortChange"
      @pagination-current-change="onPaginationCurrentChange"
      @pagination-size-change="onPaginationSizehange"
      @select-all="onSelectAll"
      @current-change="onCurrentChange"
      @selection-change="onSelectOne"
      @select="onSelectOne"
    >
      <div v-show="false" slot="header">
        <crud-toolbar
          :columns="crud.columns"
          @columns-filter-changed="handleColumnsFilterChanged"
        />
      </div>
      <!--表格列插槽-->
      <template
        v-for="columnName in slotColumns"
        :slot="columnName"
        slot-scope="scope"
      >
        <slot :slot-scope="scope" :name="columnName" />
      </template>
    </d2-crud-x>
  </div>
</template>
<script>
import Vue from 'vue'
import $ from 'jquery'
import { d2CrudPlus } from 'd2-crud-plus'
import { crudOptions } from './crud'
import { d2CrudX } from 'd2-crud-x'
Vue.use(d2CrudPlus)
export default {
  name: 'Z-Table',
  components: {
    d2CrudX
  },
  mixins: [d2CrudPlus.crud],
  props: {
    indexRow: {
      type: Object,
      default: undefined
    },
    slotColumns: {
      type: Array,
      default() {
        return []
      }
    },
    // 展示列
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    // 服务器数据源 接受 Promise
    dataSource: {
      type: Function,
      default: undefined
    },
    // 分页处理 返回分页参数
    paginationHandle: {
      type: Function,
      default: undefined
    },
    // 是否允许多选
    multipleSelect: {
      type: Boolean,
      default: true
    },
    // table 原生属性
    nativeProp: {
      type: Object,
      default() {
        return {}
      }
    },
    key_: {
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      // 表格数据
      tableData: [],
      // 表格搜索参数
      searchParams: {},
      tableId: 'z-table-' + Math.random(),
      loading: false
    }
  },
  mounted() {},
  methods: {
    pageRequest() {
      return new Promise(
        () => {},
        () => {}
      )
    },
    // 加载数据
    loadData() {
      if (this.dataSource) {
        const crudProps = this._crudProps
        const { paginationHandle, searchParams } = this
        let requestPage = {}
        if (paginationHandle) {
          requestPage = paginationHandle({
            pageNo: crudProps.pagination.currentPage,
            limit: crudProps.pagination.pageSize
          })
        }
        const requestParams = { ...searchParams, ...requestPage }
        this.loading = true
        // 加载数据
        this.dataSource(requestParams)
          .then(res => {
            if (res.hasOwnProperty('data')) {
              if (res.data.hasOwnProperty('dataResult')) {
                const { dataResult, pageResult } = res.data
                this.tableData = dataResult
                // 返回分页数据
                if (pageResult) {
                  crudProps.pagination.pageCount = pageResult.totalPages
                  crudProps.pagination.total = pageResult.totalCount
                }
              } else {
                if (res.data.hasOwnProperty('records')) {
                  this.tableData = res.data.records
                  crudProps.pagination.pageCount = res.data.pages
                  crudProps.pagination.total = res.data.total
                } else {
                  this.tableData = res.data
                  crudProps.pagination.pageCount = res.data.length
                  crudProps.pagination.total = res.data.length
                }
              }
            } else {
              if (res.result.records !== undefined) {
                this.tableData = res.result.records
                crudProps.pagination.pageCount = res.result.pages
                crudProps.pagination.total = res.result.total
              } else {
                this.tableData = res.result.result.records
                crudProps.pagination.pageCount = res.result.result.size
                crudProps.pagination.total = res.result.result.total
              }
            }
            // 数据加载完成
            this.$emit('tableLoadDone', res, this.tableData)
          })
          ['catch'](e => {
            console.error('数据加载失败', e)
          })
          ['finally'](() => {
            this.loading = false
          })
      }
    },
    // 重新加载表格数据
    reload(searchParams) {
      this.searchParams = searchParams
      this.paginationReset()
      this.loadData()
    },
    // 分页数据重置
    paginationReset() {
      this._crudProps.pagination.currentPage = 1
    },
    // 返回配置
    getCrudOptions() {
      return crudOptions(this)
    },
    // 页码改变改变
    onPaginationCurrentChange(currentPage) {
      this._crudProps.pagination.currentPage = currentPage
      this.$emit('pageChange', { ...this._crudProps.pagination })
      this.loadData()
    },
    // 每页条数改变
    onPaginationSizehange(size) {
      this._crudProps.pagination.pageSize = size
      this._crudProps.pagination.currentPage = 1
      this.$emit('pageSizeChange', { ...this._crudProps.pagination })
      this.loadData()
    },
    getSelectionData(columns) {
      const d2CrudTableData = this.getD2CrudTableData()
      return columns.map(r => {
        return {
          column: r,
          index: d2CrudTableData.findIndex(dt => dt === r)
        }
      })
    },
    /**
     * 单选:操作单项
     * @author mbb
     */
    onCurrentChange(row) {
      if (this.multipleSelect) {
        return
      }
      this.$emit('selectChange', this.getSelectionData([row]))
    },
    onSortChange(...args) {
      this.$emit('sort-change', ...args)
    },
    /**
     * 多选:操作单项
     * @author mbb
     */
    onSelectOne(columns, row) {
      if (this.multipleSelect) {
        this.$emit('selectOne', this.getSelectionData(columns), row)
      }
    },
    /**
     * 多选:操作所有
     * @author mbb
     */
    onSelectAll(columns) {
      if (this.multipleSelect) {
        this.$emit('selectAll', this.getSelectionData(columns))
      }
    },
    // 打开列设置
    openSetColumn() {
      $(`div[id='${this.tableId}']`)
        .find(
          `button[title='${this.$t('baseCommon.component.columnsSetBtn')}']`
        )
        .click()
    },
    // 根据索引选择列
    toggleSelectionWithIndex(indexArray) {
      for (const index of indexArray) {
        this.getD2CrudTable().toggleRowSelection(
          this.getD2CrudTableData()[index]
        )
      }
    },
    // 根据索引选择列
    toggleNewSelectionWithIndex(indexArray) {
      for (const index of indexArray) {
        this.getD2CrudTable().setCurrentRow(this.getD2CrudTableData()[index])
      }
    },
    clearSelection() {
      //取消所有列
      this.getD2CrudTable().clearSelection()
    },
    // 根据列对象选择列
    toggleSelection(columns) {
      if (columns instanceof Array) {
        for (const column of columns) {
          this.getD2CrudTable().toggleRowSelection(column)
        }
      } else {
        this.getD2CrudTable().toggleRowSelection(columns)
      }
    },
    setTableWidth(width) {},
    getTableWidth() {
      return $(`div[id='${this.tableId}']`).width() + 'px'
    },
    getCurrentTableData() {
      return this.tableData
    },
    getColumnsByIndex(index) {
      return this.getD2CrudTableData()[index]
    }
  }
}
</script>
<style lang="scss">
.d2-crud-x .d2-crud-body {
  padding: 0px !important;
  height: 100%;
}
.ztable-content {
  .el-loading-parent--relative {
    position: static !important;
  }
}
</style>
<style lang="scss" scoped>
.ztable-content {
  width: 100%;
  height: 100%;
}
.ztable {
  width: 100%;
  height: 100%;
}
</style>
<style>
.el-table .warning-row {
  background: #feeded;
}
.el-table .success-row {
  background: #f0f9eb;
}
</style>

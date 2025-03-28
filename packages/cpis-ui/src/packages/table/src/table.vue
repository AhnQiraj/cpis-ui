<template>
  <div class="cpis-table-container flex flex-col gap-2 bg-gray-2 h-full">
    <div v-if="search?.length > 0" class="bg-white p-3.5 cpis-table__search">
      <template>
        <CpisSearchBar
          ref="searchBar"
          :search="search"
          :paramater-mode="paramaterMode"
          @search="handleSearch"
          @reset="reset"
        />
      </template>
    </div>
    <div
      class="bg-white flex flex-1 flex-col gap-2 overflow-hidden cpis-table__main"
      :style="{ padding: `${mainPadding}px` }"
    >
      <template v-if="$slots.toolbar || toolbar?.length > 0">
        <div class="cpis-table__toolbar">
          <slot name="toolbar" class="ml-auto">
            <CpisToolbar :toolbar="toolbar" :identity="identity" @handleToolbarClick="handleToolbarClick" />
          </slot>
        </div>
      </template>
      <div class="w-full flex-1 cpis-table__body">
        <ELTable
          ref="table"
          class="cpis-table"
          :empty-text="emptyText"
          :data="dataSource"
          :row-key="rowKey"
          :cell-style="{ paddingTop: '8px', paddingBottom: '8px' }"
          v-loading="loading"
          :height="computedHeight"
          :header-cell-style="{
            backgroundColor: '#F5F5F5',
            color: '#434343',
            paddingBottom: '8px',
            paddingTop: '8px'
          }"
          v-bind="$attrs"
          :border="true"
          v-on="$listeners"
        >
          <template v-if="editable">
            <ELTableColumn prop="edit" width="50" align="center">
              <template #header>
                <span class="el-icon-plus cursor-pointer" @click="handleAddRow" />
              </template>
              <template slot-scope="scope">
                <span
                  class="el-icon-minus cursor-pointer"
                  @click="handleDeleteRow(scope.row, scope.column, scope.$index)"
                />
              </template>
            </ELTableColumn>
          </template>
          <ELTableColumn v-if="expandable" prop="expand" width="50" type="expand">
            <template slot-scope="props">
              <slot name="expand" v-bind="props" />
            </template>
          </ELTableColumn>
          <template v-for="column in computedColumns">
            <template v-if="column.valueType === 'selection'">
              <ELTableColumn type="selection" width="40" v-bind="column" />
            </template>
            <template v-else-if="column.valueType === 'index'">
              <ELTableColumn v-bind="column" type="index" width="50" align="center" min-width="50">
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </ELTableColumn>
            </template>
            <template v-else-if="column.valueType === 'action'">
              <ELTableColumn v-bind="column" :fixed="column.fixed || 'right'">
                <template slot-scope="scope">
                  <slot name="columns" :column="column" :row="scope.row" :$index="scope.$index">
                    {{ scope.row[column.prop] }}
                  </slot>
                </template>
              </ELTableColumn>
            </template>
            <template v-else>
              <template v-if="column.valueType === 'number'">
                <ELTableColumn
                  v-bind="column"
                  :key="column.prop"
                  :label-class-name="column.required ? 'is-required' : ''"
                  :align="column.align || 'right'"
                >
                  <template slot-scope="scope">
                    <slot name="columns" :column="column" :row="scope.row" :$index="scope.$index">
                      <template v-if="!isEditing(scope.row, column)">
                        {{ column?.formatter?.(scope.row, column, scope.$index) ?? scope.row[column.prop] }}
                      </template>
                      <template v-else>
                        <ELInput
                          v-bind="column.editItemProps"
                          v-model="scope.row[column.prop]"
                          type="number"
                          size="small"
                          @blur="handleBlur(scope.row, column.prop)"
                        />
                      </template>
                    </slot>
                  </template>
                </ELTableColumn>
              </template>
              <template v-else-if="column.valueType === 'radio'">
                <ELTableColumn
                  v-bind="column"
                  :key="column.prop"
                  :label-class-name="column.required ? 'is-required' : ''"
                  :align="column.align || 'right'"
                >
                  <template slot-scope="scope">
                    <slot name="columns" :column="column" :row="scope.row" :$index="scope.$index">
                      <template v-if="!isEditing(scope.row, column)">
                        {{ column?.formatter?.(scope.row, column, scope.$index) ?? scope.row[column.prop] }}
                      </template>
                      <template v-else>
                        <ELRadio
                          v-model="scope.row[column.prop]"
                          v-bind="column.editItemProps"
                          v-for="item in column.options"
                          :key="item.value"
                          :label="item.value"
                        >
                          {{ item.label }}
                        </ELRadio>
                      </template>
                    </slot>
                  </template>
                </ELTableColumn>
              </template>
              <template v-else-if="column.valueType === 'tag'">
                <Cpis-Tag-Column :key="column.prop" v-bind="column" />
              </template>

              <template v-else-if="column.valueType === 'link'">
                <CpisLinkColumn :key="column.prop" v-bind="column" />
              </template>
              <template v-else>
                <ELTableColumn
                  v-bind="column"
                  :key="column.prop"
                  :label-class-name="column.required ? 'is-required' : ''"
                >
                  <template slot-scope="scope">
                    <slot name="columns" :column="column" :row="scope.row" :$index="scope.$index">
                      <template v-if="isEditing(scope.row, column)">
                        <ELInput
                          v-bind="column.editItemProps"
                          v-model="scope.row[column.prop]"
                          size="small"
                          @blur="handleBlur(scope.row, column.prop)"
                        />
                      </template>
                      <template v-else>
                        {{
                          renderEmptyText(
                            column?.formatter?.(scope.row, column, scope.row[column.prop], scope.$index) ??
                              scope.row[column.prop]
                          )
                        }}
                        <template v-if="column.copyable && scope.row[column.prop]">
                          <CpisCopyable :text="scope.row[column.prop]" />
                        </template>
                      </template>
                    </slot>
                  </template>
                </ELTableColumn>
              </template>
            </template>
          </template>
        </ELTable>
      </div>
      <ELPagination
        class="cpis-table__pagination"
        v-if="paginationProps !== false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="pageNo"
        :page-size="limit"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { Table, TableColumn, Pagination, Input, Radio } from 'element-ui'
import CpisCopyable from '../../copyable/index'
import CpisSearchBar from '../../search-bar/index'
import CpisButton from '../../button/index'
import CpisToolbar from './toolbar.vue'
import CpisTagColumn from './column/tag.vue'
import CpisLinkColumn from './column/link.vue'
import fixHeight from '../../../mixins/fixHeight'

export default {
  name: 'CpisTable',
  mixins: [fixHeight],
  provide() {
    return {
      cpisTable: this
    }
  },
  components: {
    ELTable: Table,
    ELTableColumn: TableColumn,
    ELPagination: Pagination,
    CpisCopyable,
    ELInput: Input,
    ELRadio: Radio,
    CpisSearchBar: CpisSearchBar,
    CpisButton: CpisButton,
    CpisToolbar: CpisToolbar,
    CpisTagColumn: CpisTagColumn,
    CpisLinkColumn: CpisLinkColumn
  },
  props: {
    paramaterMode: {
      type: String,
      default: 'flat',
      validator: function (value) {
        return ['flat', 'structured'].indexOf(value) !== -1
      },
      default: 'flat',
      comments: 'flat扁平化参数模式， structured结构化参数模式'
    },
    identity: {
      type: String,
      comments: '表格唯一标识'
    },
    mainPadding: {
      type: [String, Number],
      default: '8',
      comments: '表格主体的padding'
    },
    search: {
      type: [Array, Boolean],
      default: false,
      comments:
        '这个参数有两种类型，一种是数组，一种是布尔值，当为对象时，表示搜索的配置，当为布尔值时，表示是否显示搜索。'
    },
    paginationProps: {
      type: [Boolean, Object],
      default: () => ({
        defaultLimit: 20,
        defaultPageNo: 1
      }),
      comments:
        '这个参数有两种类型，一种是布尔值，一种是对象，当为布尔值时，表示是否显示分页，当为对象时，表示分页的配置'
    },
    request: {
      type: Function,
      default: null,
      comments: '请求函数',
      validator: function (value) {
        return typeof value === 'function' || value === null || value === undefined
      }
    },
    selectable: {
      type: Boolean,
      default: false,
      comments: '是否开启选择'
    },
    expandable: {
      type: Boolean,
      default: false,
      comments: '是否开启行展开'
    },
    autoHeight: {
      type: Boolean,
      default: true,
      comments: '是否自动高度'
    },
    data: {
      type: Array,
      default: () => [],
      comments: '表格数据'
    },
    columns: {
      type: Array,
      default: () => [],
      comments: '表格列'
    },
    rowKey: {
      type: String,
      default: 'id',
      comments: '行键'
    },
    columnEmptyText: {
      type: String,
      default: '--',
      comments: '列无数据时显示的文本例如 - 或者暂无数据'
    },
    emptyText: {
      type: String,
      default: '暂无数据',
      comments: '表格无数据时显示的文本例如 - 或者暂无数据'
    },
    editable: {
      type: Boolean,
      default: false,
      comments: '是否开启单元格编辑'
    },
    toolbar: {
      type: Array,
      default: () => [],
      comments: '工具栏按钮'
    },
    height: {
      type: [String, Number],
      comments: '表格高度'
    }
  },
  computed: {
    computedColumns() {
      const newColumns = this.columns
        .filter(column => {
          if (typeof column.hideInTable === 'boolean') {
            return !column.hideInTable
          }
          if (typeof column.hideInTable === 'function') {
            return !column.hideInTable()
          }
          if (typeof column.hidden === 'boolean') {
            return !column.hidden
          }
          if (typeof column.hidden === 'function') {
            return !column.hidden()
          }
          return true
        })
        .map(column => {
          column.showOverflowTooltip = typeof column.tooltip === 'boolean' ? column.tooltip : true
          return column
        })
      if (this.selectable && !newColumns.find(column => column.valueType === 'selection')) {
        newColumns.unshift({
          prop: 'selection',
          valueType: 'selection'
        })
      }
      return newColumns
    },
    computedHeight() {
      if (this.autoHeight) {
        return this.height || this.tableHeight
      }
      return this.height
    }
  },
  watch: {
    limit(newVal) {
      if (newVal) {
        this.handleFetchData({
          requestPage: {
            limit: newVal,
            pageNo: this.pageNo
          }
        })
      }
    },
    pageNo(newVal) {
      if (newVal) {
        this.handleFetchData({
          requestPage: {
            limit: this.limit,
            pageNo: newVal
          }
        })
      }
    },
    data: {
      handler(newVal) {
        if (newVal && typeof this.request !== 'function') {
          this.dataSource = newVal
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      pageNo: 1,
      limit: 20,
      total: 0,
      dataSource: [],
      loading: false
    }
  },
  mounted() {
    this.handleFetchData({
      requestPage: {
        limit: this.limit,
        pageNo: this.pageNo
      }
    })
  },
  methods: {
    renderEmptyText(value) {
      if (value === undefined) {
        return this.columnEmptyText
      }
      return value
    },
    // 判断单元格是否处于编辑状态
    isEditing(row, prop) {
      // 获取 prop 级别的 editable
      const propEditable = prop.editable
      // 获取表格级别的 editable
      const tableEditable = this.$props.editable

      // 如果 prop.editable 是函数，则执行它并传入当前行数据
      if (typeof propEditable === 'function') {
        return propEditable(row)
      }

      // 如果 prop.editable 是布尔值，则直接返回
      if (typeof propEditable === 'boolean') {
        return propEditable
      }

      // 如果 prop.editable 未设置，检查表格级别的 editable
      // 如果表格级别的 editable 是函数，执行它
      if (typeof tableEditable === 'function') {
        return tableEditable(row)
      }

      // 否则直接返回表格级别的 editable（布尔值）
      return tableEditable
    },
    async handleFetchData(requestPage) {
      let requestParams = this.paginationProps ? { ...requestPage } : {}
      if (this.request && typeof this.request === 'function') {
        try {
          const searchParams = this.$refs?.searchBar?.getParams?.() ?? null
          if (this.paramaterMode === 'structured') {
            requestParams = {
              ...requestParams,
              ...(((searchParams?.length ?? 0) > 0) ? { parameters: this.searchParams } : {})
            }
          } else {
            requestParams = {
              ...requestParams,
              ...searchParams
            }
          }
          this.loading = true
          const res = await this.request(requestParams)
          if (!Array.isArray(res?.data)) return
          this.dataSource = res.data
          this.total = res.total
          this.$emit('data-loaded', { dataSource: this.dataSource, total: this.total })
        } catch (error) {
          console.error(error)
        } finally {
          this.$refs.table.doLayout()
          this.loading = false
        }
      }
    },
    handleSearch() {
      const params = {
        requestPage: {
          limit: this.limit,
          pageNo: this.pageNo
        }
      }
      this.handleFetchData(params)
      this.$emit('onSearch', params)
    },
    handleSizeChange(limit) {
      this.limit = limit
    },
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo
    },
    reset() {
      this.handleFetchData({
        requestPage: {
          limit: this.limit,
          pageNo: this.pageNo
        }
      })
    },
    reload() {
      this.handleFetchData({
        requestPage: {
          limit: this.limit,
          pageNo: this.pageNo
        }
      })
    },
    getTable() {
      return this.$refs.table
    },
    handleAddRow() {
      this.$emit('handle-add-row')
    },
    handleDeleteRow(row, column, index) {
      this.$emit('handle-delete-row', row, column, index)
    },
    handleBlur(row, column) {
      this.$emit('handle-blur', row, column)
    },
    /**
     * 工具栏点击事件
     * @param {Object} key 工具栏按钮
     */
    handleToolbarClick(...args) {
      this.$emit('handle-toolbar-click', ...args)
    },
    getSearchBar() {
      return this.$refs.searchBar
    },
    // element-ui table 的 api
    clearSelection() {
      this.$refs.table.clearSelection()
    },
    toggleRowSelection(...args) {
      this.$refs.table.toggleRowSelection(...args)
    },
    toggleRowSelectionByRowKey(id, selected) {
      const row = this.dataSource.find(item => item[this.rowKey] === id)
      if (row) {
        this.$refs.table.toggleRowSelection(row, selected)
      }
    },
    toggleAllSelection() {
      this.$refs.table.toggleAllSelection()
    },
    toggleRowExpansion(row, expanded) {
      this.$refs.table.toggleRowExpansion(row, expanded)
    },
    setCurrentRow(row) {
      this.$refs.table.setCurrentRow(row)
    },
    clearSort() {
      this.$refs.table.clearSort()
    }
  }
}
</script>
<style>
.cpis-table-container .cpis-table__toolbar {
  @apply flex flex-row items-center;
}

.cpis-table-container .cpis-table__toolbar .el-table__cell .el-dropdown {
  @apply text-primary-6;
}

.cpis-table.el-table--small {
  font-size: 14px;
}
/* element 用这种方式实现的下面和右侧的border */
.cpis-table.el-table--border:after,
.el-table--group:after,
.el-table:before {
  @apply bg-gray-3;
}

.cpis-table.el-table--border,
.cpis-table.el-table--border .el-table__cell,
.cpis-table.el-table td.el-table__cell,
.cpis-table.el-table th.el-table__cell {
  @apply border-gray-3;
}

.cpis-table.el-table {
  width: 100% !important;
}
.cpis-table.el-table .el-table__body {
  width: 100% !important;
}

/* 清楚编辑组件的border */
.cpis-table.el-table .el-table__body .el-table__cell .el-input__inner {
  border: none;
  padding: 0;
  background: transparent;
}

/* 分页 页码根据主题色 */
.cpis-table__pagination.el-pagination .el-pager .number.active,
.cpis-table__pagination.el-pagination .el-pager .number:hover {
  @apply !text-primary-6;
}
.cpis-table.el-table .cell.is-required::before {
  @apply text-error;
  content: '*';
  font-size: 14px;
  line-height: 1;
  display: inline-block;
  vertical-align: middle;
}
</style>

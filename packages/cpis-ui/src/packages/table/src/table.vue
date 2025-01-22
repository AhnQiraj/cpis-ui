<template>
  <div class="flex flex-col gap-2 bg-gray-2 h-full">
    <div v-if="search?.length > 0" class="bg-white p-3.5">
      <template>
        <CpisSearchBar
          :search="search"
          :paramater-mode="paramaterMode"
          @search="handleSearch"
          @reset="handleSearchReset"
        />
      </template>
    </div>
    <div class="bg-white flex flex-1 flex-col p-2 gap-2 overflow-hidden">
      <template v-if="$slots.toolbar || toolbar?.length > 0">
        <div class="cpis-table-toolbar">
          <slot name="toolbar" class="ml-auto">
            <CpisToolbar
              :toolbar="toolbar"
              :identity="identity"
              @handleToolbarClick="handleToolbarClick"
            />
          </slot>
        </div>
      </template>
      <div class="table-container flex-1">
        <ELTable
          ref="table"
          :empty-text="emptyText"
          :data="dataSource"
          :row-key="rowKey"
          :cell-style="{ paddingTop: '4px', paddingBottom: '4px' }"
          v-loading="loading"
          :height="height"
          :header-cell-style="{
            backgroundColor: '#F5F5F5',
            color: '#434343',
            paddingBottom: '8px',
            paddingTop: '8px'
          }"
          :border="true"
          v-on="$listeners"
        >
          <template v-if="editable">
            <ELTableColumn prop="edit" width="50" align="center">
              <template #header>
                <span
                  class="el-icon-plus cursor-pointer"
                  @click="handleAddRow"
                />
              </template>
              <template slot-scope="scope">
                <span
                  class="el-icon-minus cursor-pointer"
                  @click="
                    handleDeleteRow(scope.row, scope.column, scope.$index)
                  "
                />
              </template>
            </ELTableColumn>
          </template>
          <template v-for="column in computedColumns">
            <template v-if="column.valueType === 'selection'">
              <ELTableColumn type="selection" :width="column.width || '39'" />
            </template>
            <template v-else-if="column.valueType === 'index'">
              <ELTableColumn
                v-bind="column"
                type="index"
                width="50"
                align="center"
                min-width="50"
              >
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
                <template v-if="column.copyable"></template>
              </ELTableColumn>
            </template>
            <template v-else-if="column.valueType === 'action'">
              <ELTableColumn v-bind="column" :fixed="column.fixed || 'right'">
                <template slot-scope="scope">
                  <slot
                    name="columns"
                    :column="column"
                    :row="scope.row"
                    :$index="scope.$index"
                  >
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
                    <slot
                      name="columns"
                      :column="column"
                      :row="scope.row"
                      :$index="scope.$index"
                    >
                      <template v-if="!isEditing(scope.row, column)">
                        {{
                          column?.formatter?.(
                            scope.row,
                            column,
                            scope.$index
                          ) || scope.row[column.prop]
                        }}
                        <template
                          v-if="column.copyable && scope.row[column.prop]"
                        >
                          <CpisCopyable :text="scope.row[column.prop]" />
                        </template>
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
                    <slot
                      name="columns"
                      :column="column"
                      :row="scope.row"
                      :$index="scope.$index"
                    >
                      <template v-if="!isEditing(scope.row, column)">
                        {{
                          column?.formatter?.(
                            scope.row,
                            column,
                            scope.$index
                          ) || scope.row[column.prop]
                        }}
                        <template
                          v-if="column.copyable && scope.row[column.prop]"
                        >
                          <CpisCopyable :text="scope.row[column.prop]" />
                        </template>
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
              <template v-else>
                <ELTableColumn
                  v-bind="column"
                  :key="column.prop"
                  :label-class-name="column.required ? 'is-required' : ''"
                >
                  <template slot-scope="scope">
                    <slot
                      name="columns"
                      :column="column"
                      :row="scope.row"
                      :$index="scope.$index"
                    >
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
                          column?.formatter?.(
                            scope.row,
                            column,
                            scope.row[column.prop],
                            scope.$index
                          ) ||
                          scope.row[column.prop] ||
                          columnEmptyText
                        }}

                        <template
                          v-if="column.copyable && scope.row[column.prop]"
                        >
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
export default {
  name: 'CpisTable',
  components: {
    ELTable: Table,
    ELTableColumn: TableColumn,
    ELPagination: Pagination,
    CpisCopyable,
    ELInput: Input,
    ELRadio: Radio,
    CpisSearchBar: CpisSearchBar,
    CpisButton: CpisButton,
    CpisToolbar: CpisToolbar
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
        return (
          typeof value === 'function' || value === null || value === undefined
        )
      }
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
      default: '暂无数据',
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
      type: String,
      comments: '表格高度'
    }
  },
  computed: {
    computedColumns() {
      return this.columns
        .filter(column => {
          if (typeof column.hideInTable === 'boolean') {
            return !column.hideInTable
          }
          if (typeof column.hideInTable === 'function') {
            return !column.hideInTable()
          }
          return true
        })
        .map(column => {
          if (column.tooltip) {
            column.showOverflowTooltip = true
          }
          return column
        })
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
      searchParams: {},
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
    // 判断单元格是否处于编辑状态
    isEditing(row, prop) {
      return typeof prop.editable === 'boolean'
        ? prop.editable
        : this.$props.editable
    },
    async handleFetchData(params) {
      let requestParams = { ...params }
      if (this.request && typeof this.request === 'function') {
        try {
          if (this.paramaterMode === 'structured') {
            requestParams = {
              ...requestParams,
              ...(this.searchParams.length > 0
                ? { parameters: this.searchParams }
                : {})
            }
          } else {
            requestParams = {
              ...requestParams,
              ...this.searchParams
            }
          }
          this.loading = true
          const res = await this.request(requestParams)
          if (!res.success) return
          this.dataSource = res.data
          this.total = res.total
        } catch (error) {
        } finally {
          this.loading = false
        }
      }
    },
    handleSearch(searchParams) {
      const params = {
        requestPage: {
          limit: this.limit,
          pageNo: this.pageNo
        }
      }
      this.searchParams = searchParams
      this.handleFetchData(params)
      this.$emit('onSearch', params)
    },
    handleSearchReset() {
      this.searchParams = {}
      this.handleFetchData({
        requestPage: {
          limit: this.limit,
          pageNo: this.pageNo
        }
      })
    },
    handleSizeChange(limit) {
      this.limit = limit
    },
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo
    },
    reload() {
      const requestData = {
        requestPage: {
          limit: this.limit,
          pageNo: this.pageNo
        }
      }
      this.handleFetchData(requestData)
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
    }
  }
}
</script>
<style scoped>
/* 工具栏 */
.cpis-table-toolbar {
  @apply flex flex-row items-center;
}

::v-deep .cellClassName {
  background-color: #f5f5f5;
}
::v-deep .cell.is-required::before {
  @apply text-error;
  content: '*';
  font-size: 14px;
  line-height: 1;
  display: inline-block;
  vertical-align: middle;
}
/* 分页 页码根据主题色 */
::v-deep .el-pager .number.active,
::v-deep .el-pager .number:hover {
  @apply !text-primary-6;
}

::v-deep .el-table--border,
::v-deep .el-table--border .el-table__cell,
::v-deep .el-table td.el-table__cell,
::v-deep .el-table th.el-table__cell {
  @apply border-gray-3;
}

/* 解决宽度无限延长 start */
.table-container {
  width: 100%;
  overflow-x: auto;
}

::v-deep .el-table {
  width: 100% !important;
}

::v-deep .el-table__body {
  width: 100% !important;
}
/* 解决宽度无限延长 end */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.is-rotating {
  animation: rotate 1s linear 1;
}

/* 清楚编辑组件的border */
::v-deep .el-input__inner {
  border: none;
  padding: 0;
  background: transparent;
}
</style>

<template>
  <div class="flex flex-col gap-2 bg-gray-2">
    <div v-if="search?.length > 0" class="bg-white p-4">
      <template>
        <CpisSearchBar
          :search="search"
          @search="handleSearch"
          @reset="handleSearchReset"
        />
      </template>
    </div>
    <div class="bg-white p-2 flex flex-col gap-2">
      <div v-if="toolbar">
        <slot name="toolbar" />
      </div>
      <div class="flex-1">
        <ELTable
          ref="table"
          :empty-text="emptyText"
          :data="dataSource"
          :row-key="rowKey"
          v-loading="loading"
          :header-cell-style="{ backgroundColor: '#F5F5F5', color: '#434343' }"
          :border="true"
          size="small"
          v-on="$listeners"
        >
          <template v-for="column in computedColumns">
            <template v-if="column.valueType === 'selection'">
              <ELTableColumn type="selection" :width="column.width || '39'" />
            </template>
            <template v-else-if="column.valueType === 'index'">
              <ELTableColumn
                type="index"
                :label="column.label"
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
              <ELTableColumn
                :key="column.prop"
                :label="column.label"
                :prop="column.prop"
                :fixed="column.fixed || 'right'"
                :width="column.width"
                :min-width="column.minWidth"
              >
                <template slot-scope="scope">
                  <slot
                    name="columns"
                    :column="column"
                    :row="scope.row"
                    :$index="scope.$index"
                  >
                    {{
                      column?.formatter?.(scope.row, column, scope.$index) ||
                      scope.row[column.prop]
                    }}
                  </slot>
                </template>
              </ELTableColumn>
            </template>
            <template v-else>
              <template v-if="column.valueType === 'number'">
                <ELTableColumn
                  :key="column.prop"
                  :label-class-name="column.required ? 'is-required' : ''"
                  :label="column.label"
                  :prop="column.prop"
                  :align="column.align || 'right'"
                  :min-width="column.minWidth || '50'"
                >
                  <template slot-scope="scope">
                    <slot
                      name="columns"
                      :column="column"
                      :row="scope.row"
                      :$index="scope.$index"
                    >
                      {{
                        column?.formatter?.(scope.row, column, scope.$index) ||
                        scope.row[column.prop]
                      }}
                    </slot>
                    <template v-if="column.copyable && scope.row[column.prop]">
                      <CpisCopyable :text="scope.row[column.prop]" />
                    </template>
                  </template>
                </ELTableColumn>
              </template>
              <template v-else>
                <ELTableColumn
                  :key="column.prop"
                  :label="column.label"
                  :prop="column.prop"
                  :width="column.width"
                  :label-class-name="column.required ? 'is-required' : ''"
                  :min-width="column.minWidth || '50'"
                >
                  <template slot-scope="scope">
                    <slot
                      name="columns"
                      :column="column"
                      :row="scope.row"
                      :$index="scope.$index"
                    >
                      {{
                        column?.formatter?.(scope.row, column, scope.$index) ||
                        scope.row[column.prop] ||
                        columnEmptyText
                      }}
                      <template
                        v-if="column.copyable && scope.row[column.prop]"
                      >
                        <CpisCopyable :text="scope.row[column.prop]" />
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
import {
  Table,
  TableColumn,
  Pagination,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DatePicker
} from 'element-ui'
import CpisCopyable from '../../copyable/index'
import CpisSearchBar from '../../search-bar/index'
export default {
  name: 'CpisTable',
  components: {
    ELTable: Table,
    ELTableColumn: TableColumn,
    ELPagination: Pagination,
    ELDropdown: Dropdown,
    ELDropdownItem: DropdownItem,
    ELDropdownMenu: DropdownMenu,
    CpisCopyable,
    ElDatePicker: DatePicker,
    CpisSearchBar: CpisSearchBar
  },
  props: {
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
      default: () => {},
      comments: '请求函数'
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
    toolbar: {
      type: Boolean,
      default: true,
      comments: '是否显示工具栏'
    }
  },
  computed: {
    computedColumns() {
      return this.columns.filter(column => !column.hideInTable)
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
    async handleFetchData(params) {
      this.loading = true
      if (params?.searchParams) {
        if (Object.keys(params.searchParams).length === 0) {
          delete params.searchParams
        }
      }

      if (this.request && typeof this.request === 'function') {
        try {
          const res = await this.request(params)
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
        },
        parameters: searchParams
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
        },
        parameters: this.searchParams
      }
      this.handleFetchData(requestData)
    },
    getTable() {
      return this.$refs.table
    }
  }
}
</script>
<style scoped>
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
::v-deep .el-pager .number.active,
::v-deep .el-pager .number:hover {
  @apply !text-primary-6;
}
</style>

<template>
  <div class="p-3 flex flex-col gap-2 bg-gray-2">
    <div v-if="search && computedSearch.length > 0" class="bg-white">
      <template>
        <div class="flex gap-2 p-4">
          <template v-for="column in columns">
            <template v-if="column.search">
              <template v-if="column.valueType === 'select'">
                <CpisSearchSelect
                  :style="{ width: column.search.width || '120px' }"
                  :key="column.prop"
                  :label="column.search.label || column.label"
                  :placeholder="column.search.placeholder"
                  v-model="searchParams[column.search.prop || column.prop]"
                  :valueEnum="column.valueEnum"
                />
              </template>
              <template v-else>
                <CpisSearchInput
                  :style="{ width: column.search.width || '150px' }"
                  :key="column.prop"
                  :label="column.search.label || column.label"
                  :placeholder="column.search.placeholder"
                  v-model="searchParams[column.search.prop || column.prop]"
                />
              </template>
            </template>
          </template>
          <CpisButton type="primary" @click="handleSearch">{{
            search.searchText || '查询'
          }}</CpisButton>
          <CpisButton @click="handleSearchReset">{{
            search.resetText || '重置'
          }}</CpisButton>
        </div>
      </template>
    </div>
    <div class="bg-white p-2 flex flex-col gap-2">
      <div v-if="toolbar">
        <slot name="toolbar" />
      </div>
      <div class="flex-1">
        <ELTable
          :empty-text="emptyText"
          :data="dataSource"
          :row-key="rowKey"
          v-loading="loading"
          :header-cell-style="{ backgroundColor: '#F5F5F5', color: '#434343' }"
          :border="true"
          size="small"
        >
          <template v-for="column in computedColumns">
            <template v-if="column.valueType === 'index'">
                <ELTableColumn
                  type="index"
                  :label="column.label"
                  :width="column.width"
                  :align="column.align || 'center'"
                >
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                  <template v-if="column.copyable"></template>
                </ELTableColumn>
              </template>
              <template v-else-if="column.valueType === 'globalIndex'">
                <ELTableColumn
                  type="index"
                  :label="column.label"
                  :width="column.width"
                  :align="column.align || 'center'"
                >
                  <template slot-scope="scope">
                    {{
                      (pageNo === 0 ? 0 : pageNo - 1) * limit + scope.$index + 1
                    }}
                  </template>
                </ELTableColumn>
              </template>
              <template v-else-if="column.valueType === 'number'">
                <ELTableColumn
                  :key="column.prop"
                  :label="column.label"
                  :prop="column.prop"
                  :align="column.align || 'right'"
                >
                  <template slot-scope="scope">
                    {{ scope.row[column.prop] || columnEmptyText }}
                    <template v-if="column.copyable">
                      <CpisCopyable :text="scope.row[column.prop]" />
                    </template>
                  </template>
                </ELTableColumn>
              </template>
              <template v-else-if="column.valueType === 'date'">
                <ELTableColumn
                  :key="column.prop"
                  :label="column.label"
                  :prop="column.prop"
                />
              </template>
              <template v-else-if="column.valueType === 'action'">
                <ELTableColumn
                  :key="column.prop"
                  :label="column.label"
                  :prop="column.prop"
                  :fixed="column.fixed"
                  :width="column.width"
                >
                  <template slot-scope="scope">
                    <slot name="columns" :column="column" :row="scope.row" />
                  </template>
                </ELTableColumn>
              </template>
              <template v-else-if="column.valueType === 'slot'">
                <ELTableColumn
                  :key="column.prop"
                  :label="column.label"
                  :prop="column.prop"
                >
                  <template slot-scope="scope">
                    <slot :column="column" :scope="scope" />
                  </template>
                </ELTableColumn>
              </template>
              <template v-else>
                <ELTableColumn
                  :key="column.prop"
                  :label="column.label"
                  :prop="column.prop"
                >
                  <template slot-scope="scope">
                    {{ scope.row[column.prop] || columnEmptyText }}
                    <template v-if="column.copyable">
                      <CpisCopyable :text="scope.row[column.prop]" />
                    </template>
                  </template>
                </ELTableColumn>
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
  DropdownMenu
} from 'element-ui'
import CpisButton from '../../button/index'
import CpisSearchInput from '../../search-input/index'
import CpisCopyable from '../../copyable/index'
import CpisSearchSelect from '../../search-select/index'
export default {
  name: 'CpisTable',
  components: {
    ELTable: Table,
    ELTableColumn: TableColumn,
    ELPagination: Pagination,
    ELDropdown: Dropdown,
    ELDropdownItem: DropdownItem,
    ELDropdownMenu: DropdownMenu,
    CpisButton,
    CpisSearchInput,
    CpisCopyable,
    CpisSearchSelect
  },
  props: {
    key: {
      type: String,
      required: true,
      comments: '表格唯一标识'
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
    },
    search: {
      type: [Object, Boolean],
      default: () => ({
        searchText: '查询',
        resetText: '重置'
      }),
      comments:
        '这个参数有两种类型，一种是对象，一种是布尔值，当为对象时，表示搜索的配置，当为布尔值时，表示是否显示搜索。'
    }
  },
  computed: {
    computedColumns() {
      return this.columns.filter(column => !column.hideInTable)
    },
    computedSearch() {
      return this.columns.filter(column => !!column.search)
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
    handleSearch() {
      this.handleFetchData({
        requestPage: {
          limit: this.limit,
          pageNo: this.pageNo
        },
        parameters: this.searchParams
      })
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
    }
  }
}
</script>
<style scoped>
::v-deep .cellClassName {
  background-color: #f5f5f5;
}
::v-deep .el-pager .number.active,
::v-deep .el-pager .number:hover {
  @apply !text-primary-6;
}
</style>

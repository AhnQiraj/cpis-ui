<template>
  <div class="p-3 flex flex-col gap-2 bg-gray-2">
    <div v-if="search" class="bg-white">
      <template>
        <div class="flex gap-2 p-4">
            <template v-for="column in columns">
                <template v-if="column.search">
                    <CpisSearchInput :key="column.prop" :label="column.search.label || column.label" :placeholder="column.search.placeholder" />
                </template>
            </template>
            <CpisButton type="primary">{{ search.searchText }}</CpisButton>
            <CpisButton>{{ search.resetText }}</CpisButton>
        </div>
      </template>
    </div>
    <div class="bg-white p-2 flex flex-col gap-2">
    <div v-if="toolbar">
      <slot name="toolbar" />
    </div>
    <div class="flex-1">
        <ELTable
      :data="data"
      :row-key="rowKey"
      v-loading="loading"
      :header-cell-style="{ backgroundColor: '#F5F5F5', color: '#434343' }"
      :border="true"
      size="small"
    >
      <template v-for="column in columns">
        <template v-if="column.type === 'index'">
          <ELTableColumn
            type="index"
            :label="column.label"
            :width="column.width"
          >
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </ELTableColumn>
        </template>
        <template v-else-if="column.type === 'number'">
            <ELTableColumn
            :key="column.prop"
            :label="column.label"
            :prop="column.prop"
            :align="column.align || 'right'"
          />
        </template>
        <template v-else>
          <ELTableColumn
            :key="column.prop"
            :label="column.label"
            :prop="column.prop"
          />
        </template>
      </template>
    </ELTable>
    </div>
    <ELPagination
      v-if="paginationProps !== false"
      v-bind="{
        pageSize: 20,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        ...paginationProps
        }"
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
    CpisSearchInput
  },
  props: {
    paginationProps: {
      type: [Boolean, Object],
      default: () => ({
        pageSize: 20,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSizeKey: 'pageSize',
        currentPageKey: 'currentPage'
      }),
      comments:
        '这个参数有两种类型，一种是布尔值，一种是对象，当为布尔值时，表示是否显示分页，当为对象时，表示分页的配置'
    },
    data: {
      type: Array,
      default: () => [],
      comments: '表格数据'
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
        '这个参数有两种类型，一种是对象，一种是布尔值，当为对象时，表示搜索的配置，当为布尔值时，表示是否显示搜索'
    }
  },
  mounted() {
    console.log('paginationProps', this.paginationProps)

    this.handleSearch({
      requestPage: {
        [this.paginationProps.pageSizeKey || 'limit']:
          this.paginationProps.pageSize,
        [this.paginationProps.currentPageKey || 'pageNo']: 1
      }
    })
  },
  methods: {
    handleSearch(params) {
      this.request(params)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .cellClassName {
    background-color: #F5F5F5;
}
</style>

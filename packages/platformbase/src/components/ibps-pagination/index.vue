<template>
  <el-pagination
    :current-page="currentPage"
    :page-size="pageSize"
    :page-count="pagination[pageCountKey]"
    :total="pagination[totalKey]"
    v-bind="paginationOptions"
    @size-change="handlePaginationSizeChange"
    @current-change="handlePaginationCurrentChange"
    @prev-click="handlePaginationPrevClick"
    @next-click="handlePaginationNextClick"
  >
    <span class="el-pagination__total">{{ pageInfo }}</span>
  </el-pagination>
</template>
<script>
export default {
  props: {
    paginationOptions: {
      type: Object,
      default: () => {
        return {
          pagerCount: 5,
          pageSizes: [10, 20, 50, 100],
          layout: 'prev, pager, next, jumper,sizes, ->,slot'
        }
      }
    },
    totalKey: { // 总记录
      type: String,
      default: 'totalCount'
    },
    pageKey: { // 当前页数
      type: String,
      default: 'page'
    },
    pageSizeKey: { // 分页大小
      type: String,
      default: 'limit'
    },
    pageCountKey: { // 总页数
      type: String,
      default: 'totalPages'
    },
    /**
     * @description 表格分页数据
     */
    pagination: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    currentPage() {
      return this.pagination[this.pageKey] || 1
    },
    pageSize() {
      return this.pagination[this.pageSizeKey] || 20
    },
    /**
     * 分页信息
     */
    pageInfo() {
      const total = this.pagination[this.totalKey]
      if (total && total > 0) {
        const start = ((this.currentPage - 1) * this.pageSize) + 1
        let end = this.currentPage * this.pageSize
        if (total <= end) {end = total}
        // `第${start}到第${end}条 共${total}条`
        return this.$t('components.crud.pagination.pageInfo', {
          start: start,
          end: end,
          total: total
        })
      } else {
        return !total ? this.$t('components.crud.pagination.noData') : '' // '暂无数据'
      }
    }
  },
  methods: {
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
    handlePaginationChange({ pageSize, currentPage }) {
      this.$emit('pagination-change', {
        limit: pageSize || this.pageSize,
        page: currentPage || this.currentPage
      })
    }
  }
}
</script>

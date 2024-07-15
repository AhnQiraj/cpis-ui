export default {
  methods: {
    getSearcFormData(resetPage) {
      let params = {}
      // 是否重置分页
      if (resetPage) {this.pagination.page = 1}
      if (this.searchFormData[this.searchForm.prop]) {
        params[this.searchForm.prop] = this.searchFormData[this.searchForm.prop]
      }
      return params
    },
    resetSearch() {
      this.$refs['searchForm'].resetSearchForm()
    }
  }
}

export default {
  computed: {
    searchFormSlot() {
      return this.getSearchFormSlot()
    }
  },
  methods: {
    handleSearch() {
      this.handleActionEvent({ key: 'search' }, 'toolbar')
    },
    getSearchFormSlot() {
      let slot = []
      if (this.searchForm && this.searchForm.forms) {
        slot = this.searchForm.forms.filter(form => {
          if (form.fieldType === 'slot') {
            return form
          }
        })
      }
      return slot
    },
    getSearcFormData(resetPage) {
      const params = {}
      // 是否重置分页
      if (resetPage) {
        this.pagination.page = 1
      }
      if (!this.$refs['searchForm']) {
        return params
      }
      this.$refs['searchForm'].getParams((error, formParams) => {
        if (!error) {
          return Object.assign(params, formParams)
        }
      })
      return params
    },
    resetSearch() {
      if (!this.$refs['searchForm']) {
        return
      }
      this.$refs['searchForm'].resetSearchForm()
    }
  }
}

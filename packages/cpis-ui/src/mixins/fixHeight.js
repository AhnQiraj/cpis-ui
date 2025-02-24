export default {
  data() {
    return {
      tableHeight: null,
      resizeObserver: null
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.calculateTableHeight()
      this.initResizeObserver()
    })
  },

  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
  },

  methods: {
    calculateTableHeight() {
      const container = this.$el
      if (!container) return
      // Get container height
      const containerHeight = container.getBoundingClientRect().height

      // Calculate other elements' heights
      const searchBarHeight = container.querySelector('.cpis-table__search')?.offsetHeight || 0
      const toolbarHeight = container.querySelector('.cpis-table__toolbar')?.offsetHeight || 0
      const paginationHeight = container.querySelector('.cpis-table__pagination')?.offsetHeight || 0
      const padding = 16 // Account for container padding
      const gap = (searchBarHeight > 0 ? 8 : 0) + (toolbarHeight > 0 ? 8 : 0) + (paginationHeight > 0 ? 8 : 0)
      // Calculate table height
      this.tableHeight = containerHeight - searchBarHeight - toolbarHeight - paginationHeight - padding - gap
    },

    initResizeObserver() {
      // Create ResizeObserver to watch container size changes
      this.resizeObserver = new ResizeObserver(() => {
        this.calculateTableHeight()
      })

      // Start observing the container
      this.resizeObserver.observe(this.$el)
    }
  }
}

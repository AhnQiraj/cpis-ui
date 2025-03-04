export default {
  inject: ['cpisTable'],
  methods: {
    getListeners(item) {
      const listeners = {}
      // 如果item中有events配置，则应用对应的事件处理器
      if (this.fieldEvents) {
        Object.entries(this.fieldEvents).forEach(([event, handler]) => {
          listeners[event] = (...args) => {
            handler(...args, { ...item }) // todo 有一个prop 问题
          }
        })
      }
      return listeners
    }
  },
  data() {
    return {
      editItemProps: {
        type: [Object, Function],
        default: () => ({})
      },
      editItemEvents: {
        type: Object,
        default: () => ({})
      },
      fieldProps: {
        type: [Object, Function],
        default: () => ({})
      },
      fieldEvents: {
        type: Object,
        default: () => ({})
      }
    }
  }
}

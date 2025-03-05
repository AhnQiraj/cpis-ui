export default {
  methods: {
    propsToListeners(events) {
      const listeners = {}
      if (events) {
        Object.entries(events).forEach(([event, handler]) => {
          listeners[event] = (...args) => {
            handler(...args)
          }
        })
      }
      return listeners
    }
  }
}

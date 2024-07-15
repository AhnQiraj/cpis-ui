export default {
  methods: {
    /**
     * @description 组件属性默认值
     */
    handleAttribute(attribute, defaultValue) {
      if (attribute === false || attribute === 0 || attribute === '') {
        return attribute
      }
      return attribute || defaultValue
    },
    /**
     * @description 处理组件属性【选项值类型】默认值
     * @param {*} options
     * @param {*} key
     * @param {*} defaultValue
     */
    handleOptionsAttribute(options, key, defaultValue) {
      return options ? this.handleAttribute(options[key], defaultValue) : defaultValue
    }
  }
}

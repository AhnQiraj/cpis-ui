<script>
export default {
  name: 'RenderCustomComponent',
  props: {
    /**
     * @description v-model双向绑定的值
     */
    value: {
      type: String,
      required: true
    },
    /**
     * @description 传入的组件名
     */
    componentName: {
      type: String,
      required: true
    }
  },
  render(h) {
    const self = this
    return h(this.componentName, {
      props: {
        value: self.value
      },
      on: {
        input: function(event) {
          self.$emit('input', event)
        }
      }
    })
  }
}
</script>

import Util from '@platform/utils/util'
export default {
  props: {
    to: {
      type: [Object, String]
    },
    replace: {
      type: Boolean,
      default: false
    },
    target: {
      type: String,
      validator(value) {
        return Util.oneOf(value, ['_blank', '_self', '_parent', '_top'])
      },
      default: '_self'
    }
  },
  computed: {
    linkUrl() {
      const type = typeof this.to
      return type === 'string' ? this.to : null
    }
  },
  methods: {
    handleClick(newWwindow = false) {
      if (newWwindow) {
        window.open(this.to)
      } else {
        const isRoute = this.$router
        if (isRoute) {
          this.replace ? this.$router.replace(this.to) : this.$router.push(this.to)
        } else {
          window.location.href = this.to
        }
      }
    },
    handleCheckClick(event, new_window = false) {
      if (this.to) {
        if (this.target === '_blank') {
          return false
        } else {
          event.preventDefault()
          this.handleClick(new_window)
        }
      }
    }
  }
}

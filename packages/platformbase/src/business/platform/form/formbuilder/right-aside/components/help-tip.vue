<template>
  <ibps-help
    v-if="show"
    :title="showTitle"
    :content="showContent"
    :width="width"
  />
</template>
<script>
import HelpTip from '../../constants/helpTip'
export default {
  props: {
    prop: {
      type: String
    },
    title: String,
    content: String,
    width: {
      type: [Number, String],
      default: 250
    }
  },
  computed: {
    showTitle() {
      if (this.title) {return this.title}
      return this.tip ? this.tip.title || '' : ''
    },
    showContent() {
      if (this.content) {return this.content}
      return this.tip ? this.tip.content || '' : ''
    },
    tip() {
      return HelpTip[this.prop]
    },
    show() {
      return this.$utils.isNotEmpty(this.showTitle) && this.$utils.isNotEmpty(this.showContent)
    }
  }
}
</script>

<script>
import { cutTextByFullLength, getTextFullLength } from './utils'
export default {
  name: 'IbpsEllipsis',
  props: {
    prefixCls: {
      type: String,
      default: 'ibps-ellipsis'
    },
    tooltip: {
      type: Boolean,
      default: true
    },
    length: {
      type: Number
    },
    lines: {
      type: Number,
      default: 1
    },
    fill: {
      type: String,
      default: '...'
    },
    fullWidthRecognition: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getStrDom(str, fullLength) {
      return (
        <span>{ cutTextByFullLength(str, this.length) + (fullLength > this.length ? this.fill : '') }</span>
      )
    },
    getTooltip(fullStr, fullLength) {
      return (
        <el-tooltip>
          <template slot='content'>{ fullStr }</template>
          { this.getStrDom(fullStr, fullLength) }
        </el-tooltip>
      )
    }
  },
  render() {
    const { tooltip, length } = this.$props
    const text = this.$slots.default.map(vNode => vNode.text).join('')
    const fullLength = getTextFullLength(text)
    return (
      tooltip && fullLength > length ? this.getTooltip(text, fullLength) : this.getStrDom(text, fullLength)
    )
  }
}
</script>

// 组件
import ibpsContainerFull from "./components/ibps-container-full.vue"
import ibpsContainerFullBs from "./components/ibps-container-full-bs.vue"
import ibpsContainerGhost from "./components/ibps-container-ghost.vue"
import ibpsContainerGhostBs from "./components/ibps-container-ghost-bs.vue"
import ibpsContainerCard from "./components/ibps-container-card.vue"
import ibpsContainerCardBs from "./components/ibps-container-card-bs.vue"
export default {
  name: "IbpsContainer",
  props: {
    // 容器样式
    type: {
      type: String,
      required: false,
      default: "full"
    },
    // 滚动优化
    betterScroll: {
      type: Boolean,
      required: false,
      default: false
    },
    marginLeft: {
      type: String
    },
    marginRight: {
      type: String
    }
  },
  computed: {
    // 始终返回渲染组件
    component() {
      if (this.type === "card" && !this.betterScroll) {
        return ibpsContainerCard
      }
      if (this.type === "card" && this.betterScroll) {
        return ibpsContainerCardBs
      }
      if (this.type === "ghost" && !this.betterScroll) {
        return ibpsContainerGhost
      }
      if (this.type === "ghost" && this.betterScroll) {
        return ibpsContainerGhostBs
      }
      if (this.type === "full" && !this.betterScroll) {
        return ibpsContainerFull
      }
      if (this.type === "full" && this.betterScroll) {
        return ibpsContainerFullBs
      } else {
        return "div"
      }
    }
  },
  render(h) {
    const slots = [this.$slots["default"], this.$slots.header ? <template slot="header">{this.$slots.header}</template> : null, this.$slots.footer ? <template slot="footer">{this.$slots.footer}</template> : null]
    // 增加左右布局
    const style = {
      marginRight: this.marginRight,
      marginLeft: this.marginLeft
    }
    return (
      <div ref="container" class="container-component" style={style}>
        <this.component ref="component" {...{ attrs: this.$attrs }} onScroll={e => this.$emit("scroll", e)}>
          {slots}
        </this.component>
      </div>
    )
  },
  methods: {
    // 返回顶部
    scrollToTop() {
      this.$refs.component.scrollToTop()
      // 如果开启了 better scroll 还需要手动触发一遍 scroll 事件
      const bs = this.$refs.component.BS
      if (bs) {
        this.$refs.component.scroll()
      }
    },
    // 用法同原生方法 scrollBy
    scrollBy(x = 0, y = 0, time = 300) {
      if (this.betterScroll) {
        const bs = this.$refs.component.BS
        if (bs) {
          bs.scrollBy(-x, -y, time)
          // 手动触发一遍 scroll 事件
          this.$refs.component.scroll()
        }
      } else {
        this.$refs.component.$refs.body.scrollBy(x, y)
      }
    },
    // 用法同原生方法 scrollTo
    scrollTo(x = 0, y = 0, time = 300) {
      if (this.betterScroll) {
        const bs = this.$refs.component.BS
        if (bs) {
          bs.scrollTo(-x, -y, time)
          // 手动触发一遍 scroll 事件
          this.$refs.component.scroll()
        }
      } else {
        this.$refs.component.$refs.body.scrollTo(x, y)
      }
    },
    // 用法同原生方法 scrollTop
    scrollTop(top = 0, time = 300) {
      if (this.betterScroll) {
        const bs = this.$refs.component.BS
        if (bs) {
          bs.scrollTo(bs.x, -top, time)
          // 手动触发一遍 scroll 事件
          this.$refs.component.scroll()
        }
      } else {
        this.$refs.component.$refs.body.scrollTop = top
      }
    }
  }
}

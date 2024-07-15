<script>
import StepNav from './step-nav'
export default {
  name: 'IbpsSteps',
  components: {
    StepNav
  },
  provide() {
    return {
      rootSteps: this
    }
  },
  props: {
    value: Number,
    active: Number,
    space: [Number, String],
    direction: {
      type: String,
      default: 'horizontal'
    },
    alignCenter: Boolean,
    simple: Boolean,
    finishStatus: {
      type: String,
      default: 'finish'
    },
    processStatus: {
      type: String,
      default: 'process'
    },
    disabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentActive: this.active,
      panes: []
    }
  },
  watch: {
    active(val, oldVal) {
      if (val !== oldVal) {
        this.setCurrentActive(val)
      }
    },
    value(val, oldVal) {
      if (val !== oldVal) {
        this.setCurrentActive(val)
      }
    },
    currentActive(value) {
      // if (this.$refs.nav) {
      //   this.$nextTick(() => {
      //     this.$refs.nav.$nextTick(_ => {
      //       this.$refs.nav.scrollToActiveStep()
      //     })
      //   })
      // }
    }
  },
  created() {
    this.setCurrentActive(0)
    this.$on('step-nav-update', this.calcPaneInstances.bind(null, true))
  },
  beforeDestroy() {
    this.$off('step-nav-update', this.calcPaneInstances.bind(null, true))
    this.panes = null
  },
  mounted() {
    this.calcPaneInstances()
  },
  updated() {
    this.calcPaneInstances()
  },
  methods: {
    calcPaneInstances(isForceUpdate = false) {
      if (this.$slots.default) {
        const paneSlots = this.$slots.default.filter(vnode => {
          return vnode.tag && vnode.componentOptions && (vnode.componentOptions.Ctor.options.name === 'ibps-step-pane' || vnode.componentOptions.Ctor.options.name === 'IbpsStepPane')
        })
        // update indeed
        const panes = paneSlots.map(({ componentInstance }) => componentInstance)
        const panesChanged = !(panes.length === this.panes.length && panes.every((pane, index) => pane === this.panes[index]))
        if (isForceUpdate || panesChanged) {
          this.panes = panes
        }
      } else if (this.panes.length !== 0) {
        this.panes = []
      }
    },
    handleStepClick(step, stepIndex, event) {
      this.$emit('step-click', stepIndex, step, event)
      if (this.disabled || step.disabled) {
        return
      }
      this.setCurrentActive(stepIndex)
    },
    setCurrentActive(value) {
      const changeCurrentActive = () => {
        this.currentActive = value
        this.$emit('input', value)
      }
      if (this.currentActive !== value && this.beforeLeave) {
        const before = this.beforeLeave(value, this.currentActive)
        if (before && before.then) {
          before.then(
            () => {
              changeCurrentActive()
              this.$refs.nav && this.$refs.nav.removeFocus()
            },
            () => {}
          )
        } else if (before !== false) {
          changeCurrentActive()
        }
      } else {
        changeCurrentActive()
      }
    }
  },
  render(h) {
    const { handleStepClick, panes, space, currentActive, direction, alignCenter, simple, finishStatus, processStatus } = this
    const stepData = {
      props: {
        onStepClick: handleStepClick,
        panes,
        space,
        active: currentActive,
        direction,
        alignCenter,
        simple,
        finishStatus,
        processStatus
      },
      ref: 'nav'
    }
    const header = <step-nav {...stepData}></step-nav>
    const panels = <div class="el-steps__content">{this.$slots.default}</div>
    return (
      <div>
        {header}
        {panels}
      </div>
    )
  }
}
</script>

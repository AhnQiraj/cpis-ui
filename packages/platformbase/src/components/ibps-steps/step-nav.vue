<script>
import Step from './step'
import Migrating from 'element-ui/lib/mixins/migrating'
function noop() {}
export default {
  name: 'IbpsStepNav',
  components: {
    Step
  },
  mixins: [Migrating],
  props: {
    panes: Array,
    onStepClick: {
      type: Function,
      default: noop
    },
    space: [Number, String],
    active: Number,
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
    }
  },
  data() {
    return {
      steps: [],
      stepOffset: 0
    }
  },
  watch: {
    active(newVal, oldVal) {
      this.$emit('change', newVal, oldVal)
    },
    steps(steps) {
      steps.forEach((child, index) => {
        child.index = index
      })
    }
  },
  methods: {
    getMigratingConfig() {
      return {
        props: {
          center: 'center is removed.'
        }
      }
    }
  },
  render(h) {
    const { onStepClick, panes, direction, simple } = this
    const steps = this._l(panes, (pane, index) => {
      pane.index = `${index}`
      const title = pane.title
      const status = pane.status
      return (
        <step
          title={title}
          index={index}
          status={status}
          onClick={ev => {
            onStepClick(pane, index, ev)
          }}
        ></step>
      )
    })
    return (
      <div
        class={{
          'el-steps': true,
          [`el-steps--${direction}`]: !simple,
          'el-steps--simple': simple
        }}
      >
        {steps}
      </div>
    )
  }
}
</script>

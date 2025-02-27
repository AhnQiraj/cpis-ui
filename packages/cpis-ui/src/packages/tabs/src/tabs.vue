<script lang="jsx">
import TabNav from './tab-nav.vue'

export default {
  name: 'CpisTabs',

  components: {
    TabNav
  },

  props: {
    type: String,
    activeName: String,
    closable: Boolean,
    addable: Boolean,
    value: {},
    editable: Boolean,
    tabPosition: {
      type: String,
      default: 'top'
    },
    beforeLeave: Function,
    stretch: Boolean
  },

  provide() {
    return {
      rootTabs: this
    }
  },

  data() {
    return {
      currentName: this.value || this.activeName,
      panes: []
    }
  },

  watch: {
    activeName(value) {
      this.setCurrentName(value)
    },
    value(value) {
      this.setCurrentName(value)
    },
    currentName(value) {
      if (this.$refs.nav) {
        this.$nextTick(() => {
          this.$refs.nav.$nextTick(_ => {
            this.$refs.nav.scrollToActiveTab()
          })
        })
      }
    }
  },

  methods: {
    calcPaneInstances(isForceUpdate = false) {
      if (this.$slots.default) {
        const paneSlots = this.$slots.default.filter(
          vnode => vnode.tag && ['CpisTabPane', 'ElTabPane'].includes(vnode.componentOptions.Ctor.options.name)
        )
        // update indeed
        const panes = paneSlots.map(({ componentInstance }) => componentInstance)
        const panesChanged = !(
          panes.length === this.panes.length && panes.every((pane, index) => pane === this.panes[index])
        )
        if (isForceUpdate || panesChanged) {
          this.panes = panes
        }
      } else if (this.panes.length !== 0) {
        this.panes = []
      }
    },
    handleTabClick(tab, tabName, event) {
      if (tab.disabled) return
      this.setCurrentName(tabName)
      this.$emit('tab-click', tab, event)
    },
    handleTabRemove(pane, ev) {
      if (pane.disabled) return
      ev.stopPropagation()
      this.$emit('edit', pane.name, 'remove')
      this.$emit('tab-remove', pane.name)
    },
    handleTabAdd() {
      this.$emit('edit', null, 'add')
      this.$emit('tab-add')
    },
    setCurrentName(value) {
      const changeCurrentName = () => {
        this.currentName = value
        this.$emit('input', value)
      }
      if (this.currentName !== value && this.beforeLeave) {
        const before = this.beforeLeave(value, this.currentName)
        if (before && before.then) {
          before.then(
            () => {
              changeCurrentName()
              this.$refs.nav && this.$refs.nav.removeFocus()
            },
            () => {
              // https://github.com/ElemeFE/element/pull/14816
              // ignore promise rejection in `before-leave` hook
            }
          )
        } else if (before !== false) {
          changeCurrentName()
        }
      } else {
        changeCurrentName()
      }
    }
  },

  render(h) {
    let {
      type,
      handleTabClick,
      handleTabRemove,
      handleTabAdd,
      currentName,
      panes,
      editable,
      addable,
      tabPosition,
      stretch
    } = this

    const newButton =
      editable || addable
        ? h(
            'span',
            {
              class: 'el-tabs__new-tab',
              on: {
                click: handleTabAdd,
                keydown: ev => {
                  if (ev.keyCode === 13) {
                    handleTabAdd()
                  }
                }
              },
              attrs: {
                tabindex: '0'
              }
            },
            [h('i', { class: 'el-icon-plus' })]
          )
        : null

    const navData = {
      props: {
        currentName,
        onTabClick: handleTabClick,
        onTabRemove: handleTabRemove,
        editable,
        type,
        panes,
        stretch
      },
      ref: 'nav'
    }

    const header = h(
      'div',
      {
        class: ['el-tabs__header', `is-${tabPosition}`]
      },
      [newButton, h('tab-nav', navData)]
    )

    const panels = h(
      'div',
      {
        class: 'el-tabs__content flex-1 overflow-y-auto'
      },
      this.$slots.default
    )

    return h(
      'div',
      {
        class: {
          'size-full': true,
          flex: true,
          'flex-col': true,
          'el-tabs': true,
          'cpis-tabs': true,
          'el-tabs--card': type === 'card',
          [`el-tabs--${tabPosition}`]: true,
          'el-tabs--border-card': type === 'border-card'
        }
      },
      tabPosition !== 'bottom' ? [header, panels] : [panels, header]
    )
  },

  created() {
    if (!this.currentName) {
      this.setCurrentName('0')
    }

    this.$on('tab-nav-update', this.calcPaneInstances.bind(null, true))
  },

  mounted() {
    console.log('this.$el', this.$el.parentElement.offsetHeight)
    this.calcPaneInstances()
  },

  updated() {
    this.calcPaneInstances()
  }
}
</script>

<style lang="scss">
.cpis-tabs.cpis-tabs {
  & .el-tabs__nav-wrap {
    @apply px-4;
  }
  & .el-tabs__header {
    @apply mb-2;
  }
  & .el-tabs__nav .el-tabs__item {
    height: 44px;
    line-height: 44px;
    font-weight: bold;
    &.is-active {
      @apply text-primary-6;
    }
    &:hover {
      @apply text-primary-6 cursor-pointer;
    }
  }
  & .el-tabs__nav .el-tabs__active-bar {
    @apply bg-primary-6;
  }
}
</style>

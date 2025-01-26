<template>
  <div class="cpis-tree">
    <ElTree
      ref="elTree"
      class="text-sm"
      v-bind="$attrs"
      v-on="$listeners"
      @node-contextmenu="handleContextMenu"
    >
      <!-- 透传所有具名插槽 -->
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>

      <!-- 默认插槽 -->
      <template #default="{ node, data }">
        <slot :node="node" :data="data">
          <span>{{ node.label }}</span>
        </slot>
      </template>
    </ElTree>
  </div>
</template>

<script>
import { Tree } from 'element-ui'

export default {
  name: 'CpisTree',
  components: {
    ElTree: Tree
  },
  inheritAttrs: false,
  provide() {
    return {
      // 提供tree实例给子组件使用
      elTree: this
    }
  },
  methods: {
    handleContextMenu(...args) {
      this.$emit('node-contextmenu', ...args)
      this.$emit('right-click', ...args)
    },
    // 代理 ElTree 的所有方法
    filter(...args) {
      return this.$refs.elTree.filter(...args)
    },
    updateKeyChildren(...args) {
      return this.$refs.elTree.updateKeyChildren(...args)
    },
    getCheckedNodes(...args) {
      return this.$refs.elTree.getCheckedNodes(...args)
    },
    setCheckedNodes(...args) {
      return this.$refs.elTree.setCheckedNodes(...args)
    },
    getCheckedKeys(...args) {
      return this.$refs.elTree.getCheckedKeys(...args)
    },
    setCheckedKeys(...args) {
      return this.$refs.elTree.setCheckedKeys(...args)
    },
    setChecked(...args) {
      return this.$refs.elTree.setChecked(...args)
    },
    getHalfCheckedNodes(...args) {
      return this.$refs.elTree.getHalfCheckedNodes(...args)
    },
    getHalfCheckedKeys(...args) {
      return this.$refs.elTree.getHalfCheckedKeys(...args)
    },
    getCurrentKey(...args) {
      return this.$refs.elTree.getCurrentKey(...args)
    },
    getCurrentNode(...args) {
      return this.$refs.elTree.getCurrentNode(...args)
    },
    setCurrentKey(...args) {
      return this.$refs.elTree.setCurrentKey(...args)
    },
    setCurrentNode(...args) {
      return this.$refs.elTree.setCurrentNode(...args)
    },
    getNode(...args) {
      return this.$refs.elTree.getNode(...args)
    },
    remove(...args) {
      return this.$refs.elTree.remove(...args)
    },
    append(...args) {
      return this.$refs.elTree.append(...args)
    },
    insertBefore(...args) {
      return this.$refs.elTree.insertBefore(...args)
    },
    insertAfter(...args) {
      return this.$refs.elTree.insertAfter(...args)
    },
    expandAll() {
      const nodes = this.$refs.elTree.$el.querySelectorAll(
        '.el-tree-node__expand-icon'
      )
      nodes.forEach(icon => {
        icon.click()
      })
    },
    collapseAll() {
      const nodes = this.$refs.elTree.$el.querySelectorAll(
        '.el-tree-node__expand-icon.expanded'
      )
      nodes.forEach(icon => {
        icon.click()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.cpis-tree {
  width: 100%;
}
::v-deep
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  @apply text-primary-6;
  @apply bg-primary-1;
}
</style>

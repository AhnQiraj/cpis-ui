<template>
  <CpisDialog
    :visible.sync="visible"
    :size="size"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <CpisTreeContainer :tree-props="treeProps">
      <CpisTable v-bind="tableProps" />
    </CpisTreeContainer>
    <template #footer>
      <slot name="footer">
        <CpisButton type="primary" @click="handleOk">确定</CpisButton>
        <CpisButton @click="visible = false">取消</CpisButton>
      </slot>
    </template>
  </CpisDialog>
</template>
<script>
import CpisDialog from './dialog.vue'
import CpisTreeContainer from '../../tree-container/index'
export default {
  name: 'CpisDialogTable',
  components: {
    CpisDialog,
    CpisTreeContainer
  },
  methods: {
    handleOk() {
      this.$emit('ok')
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'large',
      validator(value) {
        // 40 60 80
        return ['small', 'medium', 'large'].includes(value)
      }
    },
    treeProps: {
      type: Object,
      default: () => ({})
    },
    tableProps: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

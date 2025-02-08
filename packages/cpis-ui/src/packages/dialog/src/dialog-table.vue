<template>
  <CpisDialog v-bind="$attrs" v-on="$listeners">
    <CpisTreeContainer :tree-props="treeProps">
      <CpisTable v-bind="tableProps" />
    </CpisTreeContainer>
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
  props: {
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

<template>
  <div id="app" class="main">
    <div @click="click">库项目的主页</div>
    <!-- <ibps-org-selector value-key="alias" :visible="true" placeholder="请选择指定组织" /> -->
  </div>
</template>
<script>
// import IbpsOrgSelector from '@platform/components/ibps-org-selector/index.vue'
export default {
  components: {
    // IbpsOrgSelector
  },
  methods: {
    click() {}
  }
}
</script>
<style>
.main {
  height: 100%;
  width: 100%;
}
</style>

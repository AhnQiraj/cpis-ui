<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>
<script>
export default {
  name: 'App',
  mounted() {
    // 如果是从qiankun loadMicroApp进来的 需要用abstract路由跳转
    if (window.routePathFromQianKun) {
      this.$router.push({ path: window.routePathFromQianKun, query: window.queryFromQianKun || {} })
    }
  }
}
</script>
<style lang="scss">
#app {
  margin-top: 0px;
  height: 100%;
  width: 100%;
}
html,
body {
  margin: 0;
  padding: 0;
  border: 0;
  height: 100%;
  width: 100%;
}
</style>

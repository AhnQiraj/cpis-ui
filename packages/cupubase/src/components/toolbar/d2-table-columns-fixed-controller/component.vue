<template>
  <el-button-group class="d2-table-columns-fixed-controller">
    <d2-button v-for="option of options" :key="option.icon" :type="value === option.value ? 'primary' : 'default'" :icon="option.icon" @click="submit(option.value)" />
  </el-button-group>
</template>
<script>
import d2Button from "../d2-button/component"
export default {
  name: "d2-table-columns-fixed-controller",
  components: {
    d2Button
  },
  props: {
    value: {
      default: false
    }
  },
  data() {
    return {
      options: [
        {
          value: "left",
          icon: "el-icon-arrow-left"
        },
        {
          value: false,
          icon: "el-icon-close"
        },
        {
          value: "right",
          icon: "el-icon-arrow-right"
        }
      ]
    }
  },
  methods: {
    submit(value) {
      this.$emit("input", value)
      this.$emit("change", value)
    }
  }
}
</script>
<style lang="scss" scoped>
.d2-table-columns-fixed-controller {
  .d2-button {
    padding: 2px;
    font-size: 10px;
  }
}
</style>

<template>
  <el-button-group>
    <el-button v-if="title" size="mini" @click="$open(link)">{{ title }}</el-button>
    <el-button size="mini" @click="$open(link)">
      <ibps-icon :name="icon" />
      {{ link }}
    </el-button>
  </el-button-group>
</template>
<script>
export default {
  name: 'IbpsLinkBtn',
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    icon: {
      type: String,
      required: false,
      default: 'link'
    },
    link: {
      type: String
    }
  }
}
</script>

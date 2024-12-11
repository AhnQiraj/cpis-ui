<template>
  <span v-if="!isCopied" class="el-icon-copy-document" @click="handleCopy"></span>
  <span class="el-icon-check text-green" v-else></span>
</template>

<script>
export default {
  name: 'CpisCopyable',
  props: {
    text: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isCopied: false
    }
  },
  methods: {
    handleCopy() {
      navigator.clipboard.writeText(this.text).then(() => {
        this.isCopied = true
        setTimeout(() => {
          this.isCopied = false
        }, 1000)
      })
    }
  }
}
</script>

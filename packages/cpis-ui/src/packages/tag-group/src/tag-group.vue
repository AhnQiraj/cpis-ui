<template>
  <div class="cpis-tag-group flex gap-1">
    <cpis-tag
      v-for="item in data"
      :key="item.id"
      size="small"
      :closable="closable"
      @close="handleClose(item)"
    >
      {{ item.name }}
    </cpis-tag>
  </div>
</template>

<script>
import CpisTag from '../../tag/index'
export default {
  name: 'CpisTagGroup',
  components: {
    CpisTag
  },
  props: {
    closable: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleClose(item) {
      this.$emit(
        'update:data',
        this.data.filter(tag => tag.id !== item.id)
      )
    }
  }
}
</script>

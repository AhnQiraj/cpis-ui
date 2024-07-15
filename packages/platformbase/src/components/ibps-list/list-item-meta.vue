<template>
  <div class="ibps-list-item-meta">
    <div
      v-if="avatar || $slots.avatar"
      class="ibps-list-item-meta-avatar"
    >
      <slot name="avatar">
        <el-avatar :src="avatar" />
      </slot>
    </div>
    <div class="ibps-list-item-meta-content">
      <div
        v-if="title || $slots.title"
        class="ibps-list-item-meta-title"
      >
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="description || $slots.description" class="ibps-list-item-meta-description">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'IbpsListItemMeta',
  props: {
    avatar: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  }
}
</script>

<template>
  <div v-if="item" class="ibps-desc">
    <div class="title">{{ item.label }}</div>
    <div
      v-if="item.field_options&&item.field_options.split_line"
      :class="'ibps-'+item.field_options.line_style||'dashed'"
      class="divider"
    />
    <div
      v-if="item&&item.desc"
      class="desc"
      v-html="$utils.formatText(item.desc )"
    />
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

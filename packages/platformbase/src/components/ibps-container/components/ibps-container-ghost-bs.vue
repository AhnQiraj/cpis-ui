<template>
  <div class="ibps-container-ghost-bs">
    <div v-if="$slots.header" ref="header" class="ibps-container-ghost-bs__header">
      <slot name="header" />
    </div>
    <div ref="wrapper" class="ibps-container-ghost-bs__body">
      <div>
        <slot />
      </div>
    </div>
    <div v-if="$slots.footer" ref="footer" class="ibps-container-ghost-bs__footer">
      <slot name="footer" />
    </div>
  </div>
</template>
<script>
import bs from "./mixins/bs"
export default {
  name: "IbpsContainerCardBs",
  mixins: [bs]
}
</script>

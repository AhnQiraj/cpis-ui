<template>
  <div class="ibps-container-card-bs">
    <div v-if="$slots.header" ref="header" class="ibps-container-card-bs__header">
      <slot name="header" />
    </div>
    <div ref="wrapper" class="ibps-container-card-bs__body">
      <div class="ibps-container-card-bs__body-wrapper-inner">
        <div class="ibps-container-card-bs__body-card">
          <slot />
        </div>
      </div>
    </div>
    <div v-if="$slots.footer" ref="footer" class="ibps-container-card-bs__footer">
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

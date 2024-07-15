<template>
  <div class="ibps-skeleton-loading">
    <div class="skeleton-bac-animation" />
    <div class="skeleton-bac-content">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'IbpsSkeleton'
}
</script>

<template>
  <header class="bg-white">
    <template v-if="$slots.default">
      <slot />
    </template>
    <div v-else class="px-4 flex flex-row items-center h-[52px]">
      <div class="bg-primary-6 w-1 h-[18px] line-height-none" />
      <div class="text-lg font-bold ml-2">{{ title }}</div>
      <div v-if="$slots.right" class="ml-auto text-sm">
        <slot name="right" />
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'CpisContainerHeader',

  componentName: 'CpisContainerHeader',

  props: {
    title: {
      type: String
    }
  }
}
</script>

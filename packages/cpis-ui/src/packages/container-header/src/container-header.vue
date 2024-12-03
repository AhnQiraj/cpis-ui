<template>
  <header class="bg-white px-4 flex flex-row items-center">
    <div class="bg-blue-6 w-1 h-[18px] line-height-none"></div>
    <div class="text-lg font-bold ml-2">{{ title }}</div>
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

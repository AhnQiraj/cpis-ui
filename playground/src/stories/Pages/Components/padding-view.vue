<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">内间距</h1>
    <section class="mb-8 flex flex-col gap-4">
      <div class="bg-blue-1 p-4 border border-1">
        p-4 (16px)</div>
      <div class="bg-blue-1 p-6 border border-1">p-6 (24px)</div>
      <div class="bg-blue-1 p-8 border border-1">p-8 (32px)</div>
      <div class="bg-blue-1 pl-8 border border-1">
        pl-8 (32px) 左内边距
      </div>
      <div class="bg-blue-1 pr-8 border border-1 text-right">
        pr-8 (32px) 右内边距
      </div>
      <div class="bg-blue-1 px-8 border border-1">
        px-8 (32px) 水平内边距
      </div>
      <div class="bg-blue-1 py-8 border border-1">
        py-8 (32px) 垂直内边距
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'PaddingView'
}
</script>
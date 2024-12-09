<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">外间距（Margin）</h1>
    
    <!-- 说明部分 -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold mb-4">基础说明</h2>
      <div class="bg-blue-50 p-4 rounded-lg mb-4">
        <p class="text-gray-700">
          间距的单位为 rem，在本项目中 1rem = 16px。为保持一致性，我们使用 4 的倍数作为间距值：
        </p>
        <ul class="list-disc list-inside mt-2 space-y-1">
          <li>m-1 = 0.25rem = 4px</li>
          <li>m-2 = 0.5rem = 8px</li>
          <li>m-4 = 1rem = 16px</li>
          <li>m-6 = 1.5rem = 24px</li>
          <li>m-8 = 2rem = 32px</li>
        </ul> 
      </div>
    </section>

    <!-- 示例部分 -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold mb-4">基础示例</h2>
      <div class="bg-gray-2 p-8 relative mb-4">
        <h3>m-4 (16px)</h3>
        <div class="demo-item">
          <div class="bg-blue-5 m-4 h-[64px] w-[64px]"></div>
          <copyable-code code='m-4'>m-4 (16px) </copyable-code>
        </div>

        <h3>mx-4 (16px) 水平/垂直 外间距</h3>
        <div class="demo-item mt-8">
          <div class="bg-blue-5 mx-4 h-[64px] w-[64px]"></div>
          <copyable-code code='mx-4'>mx-4 (水平16px) </copyable-code>
        </div>

        <!-- 垂直外间距 -->
        <div class="demo-item ml-8">
          <div class="bg-blue-5 my-4  h-[64px] w-[64px]"></div>
          <copyable-code code='my-4'>my-4 (垂直16px) </copyable-code>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import CopyableCode from './copyable-code.vue';
export default {
  name: 'MarginView',
  components: {
    CopyableCode: CopyableCode
  }
}
</script>

<style scoped>
.demo-item {
  position: relative;
  display: inline-block;
  background: #fff;
  border: 1px dashed #e5e7eb;
}
</style>
